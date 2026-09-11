#!/usr/bin/env python3
"""Generate the Forward SDK from the checked-out Go SDK, with its contract oracle.

Usage: python3 scripts/generate-forward.py [path/to/qoder-cloud-agents-sdk-go]
The generator intentionally rejects methods, paths, or types it cannot understand.
The Go method bodies, signatures and struct tags are authoritative; the operation
fixtures provide an independent HTTP/path check and stable operation identifiers.
"""
from __future__ import annotations

import json
import pathlib
import re
import shutil
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
GO = pathlib.Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else ROOT.parent / 'qoder-cloud-agents-sdk-go'
SOURCE = GO / 'forward'
OUT = ROOT / 'src' / 'forward'
contracts = json.loads((SOURCE / 'testdata/api-contracts.json').read_text())
cases = {c['operation_id']: c for c in json.loads((SOURCE / 'testdata/api-operation-cases.json').read_text())['cases']}
sources = {p.name: p.read_text() for p in sorted(SOURCE.glob('*.go')) if not p.name.endswith('_test.go')}


def lower_camel(value: str) -> str:
    return re.sub(r'^[A-Z]+(?=[A-Z][a-z]|$)', lambda m: m[0].lower(), value) if re.match(r'^[A-Z]{2}', value) else value[0].lower() + value[1:]


def snake(value: str) -> str:
    return re.sub(r'([a-z0-9])([A-Z])', r'\1_\2', re.sub(r'([A-Z]+)([A-Z][a-z])', r'\1_\2', value)).lower()


def ts_method(value: str) -> str:
    return {'New': 'create', 'Get': 'retrieve'}.get(value, lower_camel(value))


def quoted(value: str) -> str:
    return value if re.fullmatch(r'[a-zA-Z_$][a-zA-Z0-9_$]*', value) else json.dumps(value, ensure_ascii=False)


def comment(lines: list[str], indent: str = '') -> list[str]:
    if not lines:
        return []
    return [indent + '/**', *[(indent + ' * ' + line.replace('*/', '* /')).rstrip() for line in lines], indent + ' */']


structs = {}
for filename, source in sources.items():
    for match in re.finditer(r'^type (\w+) struct {\n(.*?)^}', source, re.M | re.S):
        name, body = match.groups()
        if name.endswith('Service') or name == 'Client':
            continue
        fields = []
        docs = []
        for line in body.splitlines():
            if line.startswith('\t//'):
                docs.append(line.removeprefix('\t//').lstrip())
                continue
            field = re.fullmatch(r'\t(\w+)\s+([^`]+?)\s+`([^`]+)`', line)
            if not field:
                docs = []
                continue
            go_name, go_type, tags_str = field.groups()
            tags = dict(re.findall(r'(\w+):"([^"]*)"', tags_str))
            location = 'body'
            wire = tags.get('json', '-').split(',')[0]
            if 'query' in tags:
                wire, location = tags['query'].split(',')[0], 'query'
            elif 'header' in tags:
                wire, location = tags['header'].split(',')[0], 'header'
            if wire == '-' or (not wire and 'inline' not in tags.get('json', '')):
                docs = []
                continue
            property_name = snake(wire.replace('-', '_')) if location == 'header' else wire
            fields.append({'goName': go_name, 'goType': go_type.strip(), 'name': property_name, 'wireName': wire,
                           'location': location, 'required': 'required' in tags.get('api', ''), 'nullable': 'nullable' in tags.get('api', ''),
                           'optional': 'omitzero' in tags.get('json', '') or go_type.startswith('param.Opt[') or location in ('query', 'header'),
                           'docs': docs})
            docs = []
        structs[name] = {'fields': fields, 'param': '\tparamObj' in body or '\tparamUnion' in body,
                         'union': '\tparamUnion' in body, 'file': filename}


def ts_type(go_type: str) -> str:
    if go_type.startswith('param.Opt['):
        return ts_type(go_type[10:-1])
    if go_type.startswith('*'):
        return ts_type(go_type[1:])
    if go_type.startswith('[]'):
        return 'Array<' + ts_type(go_type[2:]) + '>'
    if go_type.startswith('map[string]'):
        return 'Record<string, ' + ts_type(go_type[11:]) + '>'
    primitives = {'string': 'string', 'bool': 'boolean', 'int64': 'number', 'float64': 'number', 'any': 'unknown',
                  'time.Time': 'string', 'json.RawMessage': 'unknown', 'io.Reader': 'Uploadable'}
    if go_type in primitives:
        return primitives[go_type]
    assert go_type in structs, f'Unknown Go type: {go_type}'
    return go_type


for model in structs.values():
    for field in model['fields']:
        nullable = field['nullable'] or (model['param'] and field['optional'] and not field['required'])
        field['type'] = ts_type(field['goType']) + (' | null' if nullable else '')

methods = {}
for filename, source in sources.items():
    for match in re.finditer(r'^func \(r \*(\w+Service)\) (\w+)\(([^\n]+)\) ([^\n{]+)\{\n(.*?)^}', source, re.M | re.S):
        service, name, signature, result, body = match.groups()
        if name == 'ListAutoPaging':
            continue
        path_literal = re.search(r'path := "([^"]+)"', body)
        path_format = re.search(r'path := fmt.Sprintf\("([^"]+)"([^\n]+)\)', body)
        assert path_literal or path_format, (service, name, 'missing path')
        path = path_literal[1] if path_literal else path_format[1]
        path_params = []
        params_type = None
        for pair in signature.split(', '):
            arg_name, arg_type = pair.split(' ', 1)
            if arg_name in ('ctx', 'opts'):
                continue
            if arg_name == 'params':
                params_type = arg_type
            else:
                assert arg_type == 'string', (service, name, pair)
                path_params.append({'name': arg_name, 'type': 'string', 'location': 'path'})
        verb = re.search(r'http.Method(\w+)', body)
        assert verb or 'convention.DownloadFile' in body, (service, name, 'missing verb')
        http_method = verb[1].upper() if verb else 'GET'
        page = re.search(r'pagination.(Page(?:Cursor)?)\[(\w+)\]', result)
        stream = re.search(r'ssestream.Stream\[(\w+)\]', result)
        res = re.search(r'res \*([\w.]+)', result)
        response_type = 'page' if page else 'stream' if stream else 'void' if not res else 'response' if res[1] == 'http.Response' else 'json'
        item_type = page[2] if page else stream[1] if stream else res[1] if res else 'void'
        if response_type == 'response':
            item_type = 'Response'
        elif response_type not in ('void',):
            assert item_type in structs, (service, name, item_type)
        is_multipart = bool(params_type and re.search(r'func \(r ' + params_type + r'\) MarshalMultipart\(', source))
        has_payload = bool(re.search(r'(?:ExecuteNewRequest|NewRequestConfig)\(ctx, http.Method\w+, path, params,', body))
        params_location = 'multipart' if is_multipart else ('query' if http_method in ('GET', 'DELETE') else 'body') if has_payload else 'none'
        preceding = source[:match.start()].rstrip().splitlines()
        docs = []
        for line in reversed(preceding):
            if not line.startswith('//'):
                break
            docs.insert(0, line.removeprefix('//').lstrip())
        methods[(service, name)] = {'source': filename, 'path': path, 'pathArgs': re.findall(r'url.PathEscape\((\w+)\)', path_format[2]) if path_format else [],
                                  'parameters': path_params, 'httpMethod': http_method, 'paramsType': params_type, 'paramsLocation': params_location,
                                  'responseType': response_type, 'itemType': item_type, 'pagination': 'page' if page and page[1] == 'PageCursor' else 'cursor',
                                  'download': 'convention.DownloadFile' in body, 'docs': docs}

assert len(methods) == len(contracts) == len(cases), (len(methods), len(contracts), len(cases))
service_entries = {c['service']: c['entry'] for c in contracts}
def plural(value: str) -> str:
    if value.endswith('y'):
        return value[:-1] + 'ies'
    if value.endswith(('s', 'x', 'z', 'ch', 'sh')):
        return value + 'es'
    return value + 's'


service_classes = {service: plural(service.removesuffix('Service')) for service in service_entries}
service_files = {service: snake(service.removesuffix('Service')).replace('_', '-') + '.ts' for service in service_entries}

for contract in contracts:
    key = (contract['service'], contract['name'])
    assert key in methods, key
    method = methods[key]
    case = cases[contract['operation_id']]
    assert method['httpMethod'] == case['http_method'], (key, 'HTTP method mismatch')
    expected_format = case['path'].lstrip('/')
    wire_path_args = re.findall(r'{([^}]+)}', expected_format)
    assert re.sub(r'{[^}]+}', '%s', expected_format) == method['path'], (key, 'path mismatch')
    assert len(wire_path_args) == len(method['pathArgs']) == len(method['parameters']), (key, 'path parameters mismatch')
    arg_wire = dict(zip(method['pathArgs'], wire_path_args))
    for parameter in method['parameters']:
        parameter['wireName'] = arg_wire[parameter['name']]
    method.update({'operationId': contract['operation_id'], 'entry': '.'.join(map(lower_camel, contract['entry'].split('.'))),
                   'method': ts_method(contract['name']), 'goService': contract['service'], 'goMethod': contract['name'], 'wirePath': case['path']})
    method['parameterFields'] = structs[method['paramsType']]['fields'] if method['paramsType'] else []
    method['paramsOptional'] = not any(f['required'] for f in method['parameterFields'])

OUT.mkdir(parents=True, exist_ok=True)
for legacy in ('apis', 'models'):
    if (OUT / legacy).exists():
        shutil.rmtree(OUT / legacy)
for legacy in ('credentials.ts', 'errors.ts', 'files.ts', 'pagination.ts', 'retry.ts', 'runtime.ts', 'sse.ts'):
    (OUT / legacy).unlink(missing_ok=True)

types = ['// Generated wire types, verified against the API contracts.',
         "// Wire names and required/nullable fields follow the API's JSON, query and header contracts.",
         "import type { Uploadable } from '../core/uploads.js';", '']
for name, model in structs.items():
    if model['union']:
        types += ['export type ' + name + ' = ' + ' | '.join(field['type'] for field in model['fields']) + ';', '']
        continue
    if name == 'ModelConfig':
        types += ['export type ModelConfig = string | ModelConfigObject;', '', 'export interface ModelConfigObject {']
    else:
        types += [f'export interface {name} {{']
    for field in model['fields']:
        types += comment(field['docs'], '  ')
        optional = model['param'] and not field['required'] and field['optional']
        types += [f'  {quoted(field["name"])}{"?" if optional else ""}: {field["type"]};']
    types += ['  /** Additional fields are preserved verbatim by the SDK. */', '  [key: string]: unknown;', '}', '']

aliases = {}
for method in methods.values():
    name = method['paramsType']
    if name and method['goMethod'] in ('New', 'Get'):
        alias = name.replace('NewParams', 'CreateParams').replace('GetParams', 'RetrieveParams')
        if alias != name:
            aliases[name] = alias
            types += [f'export type {alias} = {name};', '']
(OUT / 'types.ts').write_text('\n'.join(types))

helpers = '''// Shared transport details for the Forward resources.
import type { RequestOptions } from '../core/client.js';

/** Validate before invoking fetch, then escape the value as one path segment. */
export function pathParam(value: string, name: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`missing required ${name} parameter`);
  }
  return encodeURIComponent(value);
}

/** Per-request headers take precedence over typed header parameters. */
export function requestHeaders(base: Record<string, string | null | undefined>, extra: RequestOptions['headers']): Record<string, string | null | undefined> {
  const headers: Record<string, string | null | undefined> = {};
  for (const [key, value] of Object.entries(base)) {
    // Absent and explicitly null header params are both omitted.
    if (value !== undefined && value !== null) headers[key.toLowerCase()] = value;
  }
  if (extra instanceof Headers) {
    extra.forEach((value, key) => { headers[key.toLowerCase()] = value; });
  } else if (Array.isArray(extra)) {
    for (const [key, value] of extra) headers[key.toLowerCase()] = value;
  } else if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      if (value !== undefined) headers[key.toLowerCase()] = value;
    }
  }
  return headers;
}
'''
(OUT / '_utils.ts').write_text(helpers)

for service, entry in service_entries.items():
    resource_methods = [method for method in methods.values() if method['goService'] == service]
    type_names = {m['itemType'] for m in resource_methods if m['itemType'] not in ('Response', 'void')}
    type_names.update(aliases.get(m['paramsType'], m['paramsType']) for m in resource_methods if m['paramsType'])
    imports = ["import { APIResource } from '../core/resource.js';", "import type { RequestOptions } from '../core/client.js';",
               "import type { APIPromise } from '../core/api-promise.js';"]
    if any(m['responseType'] == 'page' for m in resource_methods):
        imports += ["import type { PagePromise } from '../core/pagination.js';"]
    if any(m['responseType'] == 'stream' for m in resource_methods):
        imports += ["import type { Stream } from '../core/streaming.js';"]
    if any(m['paramsLocation'] == 'multipart' for m in resource_methods):
        imports += ["import { toMultipartForm } from '../core/uploads.js';"]
    imports += ["import { pathParam, requestHeaders } from './_utils.js';", 'import type { ' + ', '.join(sorted(type_names)) + " } from './types.js';"]
    children = {child_service: child_entry for child_service, child_entry in service_entries.items() if child_entry.rpartition('.')[0] == entry}
    for child_service in children:
        imports += [f"import {{ {service_classes[child_service]} }} from './{service_files[child_service].removesuffix('.ts')}.js';"]
    code = ['// Generated code, verified against the API contracts.', *imports, '', f'export class {service_classes[service]} extends APIResource {{']
    for child_service, child_entry in children.items():
        code += [f'  readonly {lower_camel(child_entry.rpartition(".")[2])}: {service_classes[child_service]} = new {service_classes[child_service]}(this._client);']
    if children:
        code += ['']
    for method in resource_methods:
        docs = method['docs'] + ['', f'@operation {method["operationId"]}']
        code += comment(docs, '  ')
        arguments = [f'{p["name"]}: {p["type"]}' for p in method['parameters']]
        if method['paramsType']:
            params_type = aliases.get(method['paramsType'], method['paramsType'])
            arguments += [f'params: {params_type}' + (' = {}' if method['paramsOptional'] else '')]
        arguments += ['options?: RequestOptions']
        result_type = 'PagePromise<' + method['itemType'] + '>' if method['responseType'] == 'page' else 'APIPromise<' + ('Stream<' + method['itemType'] + '>' if method['responseType'] == 'stream' else method['itemType']) + '>'
        declaration = f'  {method["method"]}({", ".join(arguments)}): {result_type} {{'
        if len(declaration) > 110:
            code += [f'  {method["method"]}(', *['    ' + arg + ',' for arg in arguments], f'  ): {result_type} {{']
        else:
            code += [declaration]
        path = method['wirePath'].lstrip('/')
        if method['parameters']:
            for parameter in method['parameters']:
                path = path.replace('{' + parameter['wireName'] + '}', '${pathParam(' + parameter['name'] + ', ' + json.dumps(parameter['wireName']) + ')}')
            code += [f'    const path = `{path}`;']
        else:
            code += [f'    const path = {json.dumps(path)};']
        header_fields = [field for field in method['parameterFields'] if field['location'] == 'header']
        base_headers = []
        if method['responseType'] == 'stream':
            base_headers += ["'Accept': 'text/event-stream'"]
        for field in header_fields:
            base_headers += [json.dumps(field['wireName']) + ': ' + field['name']]
        headers = 'requestHeaders({ ' + ', '.join(base_headers) + ' }, options?.headers)'
        payload_var = 'params'
        if header_fields:
            payload_var = 'payload'
            code += ['    const { ' + ', '.join(field['name'] for field in header_fields) + ', ...payload } = params;']
        if method['download']:
            code += ['    return this._client.downloadFile(path, options);']
        elif method['responseType'] == 'page':
            code += [f'    return this._client.getAPIList<{method["itemType"]}>(path, {payload_var if method["paramsType"] else "undefined"}, options, {json.dumps(method["pagination"])});']
        else:
            opts = [f'method: {json.dumps(method["httpMethod"])}', 'path']
            if method['paramsLocation'] == 'query':
                opts += ['query: ' + payload_var]
            elif method['paramsLocation'] == 'body':
                opts += ['body: ' + payload_var]
            elif method['paramsLocation'] == 'multipart':
                opts += ['body: toMultipartForm(' + payload_var + ')']
            if method['responseType'] in ('stream', 'response', 'void'):
                opts += ['responseType: ' + json.dumps(method['responseType'])]
            opts += ['...options']
            if base_headers:
                opts += ['headers: ' + headers]
            generic = 'Stream<' + method['itemType'] + '>' if method['responseType'] == 'stream' else method['itemType']
            code += [f'    return this._client.request<{generic}>({{', *['      ' + opt + ',' for opt in opts], '    });']
        code += ['  }', '']
    code += ['}', '', 'export type { ' + ', '.join(sorted(type_names)) + " } from './types.js';", '']
    (OUT / service_files[service]).write_text('\n'.join(code))

top_level = {service: entry for service, entry in service_entries.items() if '.' not in entry}
client = ['// Resource hierarchy mirrors the Forward API surface.',
          "import { APIClient, type ClientOptions } from '../core/client.js';"]
for service in top_level:
    client += [f"import {{ {service_classes[service]} }} from './{service_files[service].removesuffix('.ts')}.js';"]
client += ['', 'export type ForwardClientOptions = ClientOptions;', '', 'export class ForwardClient extends APIClient {']
for service, entry in top_level.items():
    client += [f'  readonly {lower_camel(entry)}: {service_classes[service]} = new {service_classes[service]}(this);']
client += ['', '  constructor(options: ForwardClientOptions = {}) {', "    super(options, 'forward');", '  }', '}', '', 'export default ForwardClient;', '']
(OUT / 'forwardClient.ts').write_text('\n'.join(client))
index = ["export { ForwardClient, ForwardClient as default } from './forwardClient.js';", "export type { ForwardClientOptions } from './forwardClient.js';", "export * from './types.js';"]
for service in service_entries:
    index += [f"export {{ {service_classes[service]} }} from './{service_files[service].removesuffix('.ts')}.js';"]
index += ["export type { RequestOptions, ClientOptions } from '../core/client.js';", "export { APIPromise } from '../core/api-promise.js';", "export { Page, PagePromise } from '../core/pagination.js';", "export { Stream } from '../core/streaming.js';", "export { toFile } from '../core/uploads.js';", "export type { Uploadable } from '../core/uploads.js';", "export { PATCredential } from '../core/credentials.js';", "export type { Credential } from '../core/credentials.js';", "export * from '../core/error.js';", '']
(OUT / 'index.ts').write_text('\n'.join(index))
inventory = [{key: method[key] for key in ('operationId', 'entry', 'method', 'httpMethod', 'parameters', 'paramsType', 'paramsOptional', 'paramsLocation', 'responseType', 'pagination', 'itemType')} |
             {'path': method['wirePath'], 'parameterFields': [{key: field[key] for key in ('name', 'wireName', 'location', 'required', 'type')} for field in method['parameterFields']]} for method in methods.values()]
(OUT / 'api-inventory.json').write_text(json.dumps(inventory, indent=2, ensure_ascii=False) + '\n')
print(f'Generated {len(methods)} Forward API methods, {len(service_entries)} resources, and {len(structs)} types.')
