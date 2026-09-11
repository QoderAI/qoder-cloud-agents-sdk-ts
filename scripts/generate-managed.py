#!/usr/bin/env python3
"""Generate Managed resources from the Go SDK's AST, never from an OpenAPI superset.

Usage: python3 scripts/generate-managed.py [../qoder-cloud-agents-sdk-go]
The checked-in Go API contracts are also used to preserve observed nullable fields.
"""
import collections
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
GO = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else ROOT.parent / 'qoder-cloud-agents-sdk-go'
OUT = ROOT / 'src/managed'
env = dict(os.environ, GO111MODULE='off', GOCACHE='/tmp/qoder-ts-gocache')
schema = json.loads(subprocess.check_output(['go', 'run', str(ROOT / 'scripts/generate-managed-schema.go'), str(GO / 'managed')], env=env))
types = {t['name']: t for t in schema['types']}
methods = schema['methods']
enums = schema['enums']
variants = schema['variants']
constants = dict(re.findall(r'type (\w+) string\s*// Always ("[^"]*")', (GO / 'convention/constant/constants.go').read_text()))
contracts = json.loads((GO / 'managed/testdata/api-contracts.json').read_text())
contracts_by_method = {(c['service'], c['name']): c for c in contracts}
assert len(methods) == len(contracts) == 95

def snake(name):
    return re.sub(r'([a-z0-9])([A-Z])', r'\1_\2', re.sub(r'([A-Z]+)([A-Z][a-z])', r'\1_\2', name)).lower()

def camel(name):
    if name == 'MCPOAuthValidate':
        return 'mcpOAuthValidate'
    return name[0].lower() + name[1:]

def method_name(name):
    return {'New': 'create', 'Get': 'retrieve'}.get(name, camel(name))

def wire(f):
    tags = f['tags']
    for loc in ['path', 'query', 'json']:
        key = tags.get(loc, '').split(',')[0]
        if key and key != '-':
            return key
    return snake(f['name'])

def location(f):
    return next((loc for loc in ['path', 'query', 'header'] if loc in f['tags']), 'body')

def visible_fields(t):
    for f in t.get('fields', []):
        if f['name'] == 'JSON':
            continue
        if not f['tags'] and f['type'] in types:
            yield from visible_fields(types[f['type']])
        elif f['tags'].get('json') != '-' or any(k in f['tags'] for k in ['path', 'query', 'header']):
            yield f

def unwrap(t):
    t = t.lstrip('*')
    if t.startswith('param.Opt['):
        return t[10:-1]
    return t

# Infer nullability from the Go SDK's authoritative response fixtures, preserving
# distinctions such as archived_at=null even where Go uses a zero-valued time.Time.
nullable = set()
def observe(t, value, depth=0):
    if depth > 80 or value is None:
        return
    t = unwrap(t)
    if t.startswith('[]') and isinstance(value, list):
        for item in value:
            observe(t[2:], item, depth + 1)
        return
    if t not in types:
        return
    if t in variants:
        for variant in variants[t]:
            vt = types.get(variant, {})
            discriminator = next((f for f in visible_fields(vt) if wire(f) == 'type'), None)
            allowed = enums.get(discriminator['type'], []) if discriminator else []
            if isinstance(value, dict) and allowed and json.dumps(value.get('type')) not in allowed:
                continue
            observe(variant, value, depth + 1)
        return
    if isinstance(value, dict):
        for f in visible_fields(types[t]):
            key = wire(f)
            if key in value:
                if value[key] is None:
                    nullable.add((t, key))
                else:
                    observe(f['type'], value[key], depth + 1)
    elif isinstance(value, list):
        for f in visible_fields(types[t]):
            if 'inline' in f['tags'].get('json', ''):
                observe(f['type'], value, depth + 1)

for m in methods:
    result = m['result'].lstrip('*')
    response = contracts_by_method[(m['service'], m['name'])].get('response')
    if result.startswith('pagination.'):
        result = result[result.index('[') + 1:-1]
        for item in (response or {}).get('data', []):
            observe(result, item)
    else:
        observe(result, response)

def ts_type(t):
    t = unwrap(t)
    if t.startswith('[]'):
        return 'Array<' + ts_type(t[2:]) + '>'
    if t.startswith('map[string]'):
        return 'Record<string, ' + ts_type(t[11:]) + '>'
    if t.startswith('constant.'):
        return constants[t[9:]]
    if t in ['string', 'time.Time']:
        return 'string'
    if t in ['bool']:
        return 'boolean'
    if t in ['int', 'int32', 'int64', 'float32', 'float64', 'uint64']:
        return 'number'
    if t in ['any', 'interface{}', 'json.RawMessage']:
        return 'unknown'
    if t == 'io.Reader':
        return 'Uploadable'
    if t.startswith('struct'):
        raise ValueError('Unexpected anonymous wire struct: ' + t)
    if t not in types:
        raise ValueError('Unknown Go type: ' + t)
    return t

def comment(doc, indent=''):
    # Drop Go-only accessor instructions, retaining API semantics and examples.
    doc = re.split(r'\n(?:Use the |Only one field|The propert|For type safety)', doc)[0].strip()
    doc = re.sub(r'\[([^\]]+)\](?!\()', r'`\1`', doc)
    if not doc or doc.startswith('Only one field') or 'implicit subunion' in doc or 'contains all possible properties' in doc:
        return ''
    return indent + '/**\n' + '\n'.join((indent + ' * ' + line.replace('*/', '* /')).rstrip() for line in doc.splitlines()) + '\n' + indent + ' */\n'

def is_request(name):
    return 'Params' in name or 'Param' in name

def field_decl(name, f):
    key = wire(f)
    tags = f['tags']
    required = 'required' in tags.get('api', '') or location(f) == 'path'
    optional = '' if required else '?'
    t = ts_type(f['type'])
    accepts_null = 'nullable' in tags.get('api', '') or (name, key) in nullable
    if is_request(name) and location(f) == 'body' and not required:
        accepts_null = True
        if 'Cannot be cleared' in f['doc'] or 'cannot be cleared' in f['doc']:
            accepts_null = False
    if accepts_null and t != 'unknown':
        t += ' | null'
    prop = key if re.fullmatch(r'[a-zA-Z_$][\w$]*', key) else json.dumps(key)
    return comment(f['doc'], '  ') + f'  {prop}{optional}: {t};\n'

# Public data types include scalar enums and native discriminated unions. Go-only
# JSON wrappers, accessors and param.Opt wrappers are intentionally not exposed.
type_lines = ["// Generated from qoder-cloud-agents-sdk-go/managed. Run scripts/generate-managed.py.\n", "import type { Uploadable } from '../core/uploads.js';\n"]
compact_types = {'ManagedAgentsModelConfig', 'ManagedAgentsModelConfigParams', 'SkillSource', 'ManagedAgentsModelConfigEffortUnion'}
for name, t in types.items():
    if not name[0].isupper() or name in ['Client', 'Error'] or name.endswith('Service'):
        continue
    doc = comment(t['doc'])
    if name in variants:
        choices = list(dict.fromkeys(variants[name]))
        if name == 'ManagedAgentsModelConfigEffortUnion':
            choices += ['"low"', '"medium"', '"high"', '"xhigh"', '"max"']
        type_lines.append(f'{doc}export type {name} = ' + ' | '.join(choices) + ';\n')
    elif t['type'] == 'struct':
        fields = list(visible_fields(t))
        inline = [f for f in fields if 'inline' in f['tags'].get('json', '')]
        ordinary = [f for f in fields if f not in inline]
        if inline and not ordinary:
            choices = list(dict.fromkeys(ts_type(f['type']) for f in inline))
            type_lines.append(f'{doc}export type {name} = ' + ' | '.join(choices) + ';\n')
        elif inline:
            choices = list(dict.fromkeys(ts_type(f['type']) for f in inline))
            type_lines.append(f'{doc}export type {name} = ' + ' | '.join(choices) + ' | {\n' + ''.join(field_decl(name, f) for f in ordinary) + '};\n')
        elif name in compact_types:
            type_lines.append(f'{doc}export type {name} = string | {{\n' + ''.join(field_decl(name, f) for f in fields) + '};\n')
        else:
            extras = '  /** Additional JSON Schema keywords are sent at the schema root. */\n  [key: string]: unknown;\n' if name == 'ManagedAgentsCustomToolInputSchemaParam' else ''
            type_lines.append(f'{doc}export interface {name} {{\n' + ''.join(field_decl(name, f) for f in ordinary) + extras + '}\n')
    else:
        choices = list(dict.fromkeys(enums.get(name, [])))
        if choices:
            alias = ' | '.join(choices)
            # Model identifiers grow independently of SDK releases.
            if name == 'ManagedAgentsModel':
                alias += ' | (string & {})'
        else:
            alias = ts_type(t['type'])
        type_lines.append(f'{doc}export type {name} = {alias};\n')

def params_alias(m, original):
    alias = original
    if m['name'] == 'New':
        alias = original.replace('NewParams', 'CreateParams')
    elif m['name'] == 'Get':
        alias = original.replace('GetParams', 'RetrieveParams')
    if alias != original:
        type_lines.append(f'export type {alias} = {original};\n')
    return alias

services = {t['name']: t for t in types.values() if t['name'].endswith('Service')}
entries = {}
classes = {}
def resource_tree(t, prefix=''):
    for f in t.get('fields', []):
        if f['type'] in services:
            entry = prefix + camel(f['name'])
            entries[f['type']] = entry
            classes[f['type']] = ''.join(part[0].upper() + part[1:] for part in entry.split('.'))
            resource_tree(services[f['type']], entry + '.')
resource_tree(types['Client'])
files = {s: snake(s.removesuffix('Service')).replace('_', '-') for s in services}
grouped = collections.defaultdict(list)
inventory = []
for m in methods:
    s = m['service']
    contract = contracts_by_method[(s, m['name'])]
    name = method_name(m['name'])
    args = [p for p in m['params'] if p['name'] not in ['ctx', 'opts']]
    param_arg = next(p for p in args if p['type'] in types)
    param_type = param_arg['type']
    fields = list(visible_fields(types[param_type]))
    alias = params_alias(m, param_type)
    required = any('required' in f['tags'].get('api', '') or location(f) == 'path' for f in fields)
    signature = []
    inv_args = []
    for p in args:
        if p is param_arg:
            signature.append(f'params: Types.{alias}' + ('' if required else ' | null | undefined = {}'))
            inv_args.append({'name': 'params', 'type': alias, 'goType': param_type, 'location': 'params', 'required': required,
                'fields': [{'name': wire(f), 'goName': f['name'], 'type': ts_type(f['type']), 'location': location(f), 'wireName': f['tags'].get(location(f), wire(f)).split(',')[0], 'required': 'required' in f['tags'].get('api', '') or location(f) == 'path'} for f in fields]})
        else:
            signature.append(f'{p["name"]}: {ts_type(p["type"])}')
            inv_args.append({'name': p['name'], 'type': ts_type(p['type']), 'location': 'path', 'required': True})
    signature.append('options?: RequestOptions')
    path_expr = re.search(r'path := (.*)', m['body'])[1]
    if path_expr.startswith('fmt.Sprintf'):
        route = re.search(r'"([^"]+)"', path_expr)[1]
        refs = re.findall(r'url.PathEscape\(([^)]+)\)', path_expr)
        for ref in refs:
            if '.' in ref:
                go_field = ref.split('.')[1]
                field = next(f for f in fields if f['name'] == go_field)
                ref = f'params?.{wire(field)}'
                label = wire(field)
            else:
                label = snake(ref)
            route = route.replace('%s', '${pathParam(' + ref + ', ' + json.dumps(label) + ')}', 1)
        path_ts = '`/' + route + '`'
    else:
        path_ts = json.dumps('/' + json.loads(path_expr))
    result = m['result'].lstrip('*')
    paged = result.startswith('pagination.')
    streamed = result.startswith('ssestream.')
    binary = result == 'http.Response'
    if paged or streamed:
        result = result[result.index('[') + 1:-1]
    return_type = f'PagePromise<Types.{result}>' if paged else (f'APIPromise<Stream<Types.{result}>>' if streamed else ('APIPromise<Response>' if binary else f'APIPromise<Types.{result}>'))
    header_fields = {wire(f): f['tags']['header'].split(',')[0] for f in fields if location(f) == 'header'}
    excluded_fields = [wire(f) for f in fields if location(f) == 'path']
    body = [f'    const request = splitParams(params, options, {json.dumps(header_fields)}, {json.dumps(excluded_fields)});']
    if binary:
        body += ["    if (!request.headers.has('Accept')) request.headers.set('Accept', " + json.dumps('application/json' if s == 'FileService' else 'application/binary') + ');']
    if streamed:
        body += ["    if (!request.headers.has('Accept')) request.headers.set('Accept', 'text/event-stream');"]
    if paged:
        # Models use before/after cursor parameters, other Managed lists use page.
        pagination = "'cursor'" if result == 'ModelInfo' else "'page'"
        body += [f'    return this._client.getAPIList<Types.{result}>({path_ts}, request.values, request.options, {pagination});']
    elif binary and s == 'FileService':
        body += [f'    return this._client.downloadFile({path_ts}, request.options);']
    else:
        extra = []
        if contract['method'] == 'GET':
            if any(location(f) == 'query' for f in fields):
                extra.append('query: request.values')
        elif re.search(r'path, (params|body|query),', m['body']):
            multipart = any(f['tags'].get('format') == 'binary' for f in fields)
            extra.append('body: ' + ('managedMultipart(request.values)' if multipart else 'request.values'))
        if streamed or binary:
            extra.append("responseType: '" + ('stream' if streamed else 'response') + "'")
        rt = f'Stream<Types.{result}>' if streamed else ('Response' if binary else f'Types.{result}')
        body += [f'    return this._client.request<{rt}>({{ ...request.options, method: {json.dumps(contract["method"])}, path: {path_ts}' + (', ' + ', '.join(extra) if extra else '') + ' });']
    grouped[s].append(comment(m['doc'], '  ') + f'  {name}({", ".join(signature)}): {return_type} {{\n' + '\n'.join(body) + '\n  }\n')
    inventory.append({'entry': entries[s] + '.' + name, 'resource': entries[s], 'method': name, 'goService': s, 'goMethod': m['name'], 'httpMethod': contract['method'], 'path': contract['route'], 'params': inv_args, 'responseType': result, 'responseMode': 'page' if paged else ('stream' if streamed else ('response' if binary else 'json')), 'goFile': m['file']})

OUT.mkdir(parents=True, exist_ok=True)
# Remove obsolete generated APIs/models and standalone duplicated HTTP runtimes.
for child in OUT.iterdir():
    if child.is_dir():
        shutil.rmtree(child)
    else:
        child.unlink()
(OUT / 'resources').mkdir()
(OUT / 'types.ts').write_text('\n'.join(type_lines))
(OUT / 'api-inventory.json').write_text(json.dumps(inventory, indent=2) + '\n')
exports = []
for s, chunks in grouped.items():
    nested = [f for f in services[s].get('fields', []) if f['type'] in services]
    imports = ["import { APIResource } from '../../core/resource.js';", "import type { RequestOptions } from '../../core/client.js';", "import type { APIPromise } from '../../core/api-promise.js';", "import type { PagePromise } from '../../core/pagination.js';", "import type { Stream } from '../../core/streaming.js';", "import type * as Types from '../types.js';", "import { splitParams, pathParam, managedMultipart } from '../internal.js';"]
    for f in nested:
        imports.append(f'import {{ {classes[f["type"]]} }} from "./{files[f["type"]]}.js";')
    content = '// Generated from qoder-cloud-agents-sdk-go/managed.\n' + '\n'.join(imports) + '\n\n'
    content += f'export class {classes[s]} extends APIResource {{\n'
    for f in nested:
        content += f'  readonly {camel(f["name"])} = new {classes[f["type"]]}(this._client);\n'
    content += '\n' + '\n'.join(chunks) + '}\n'
    content += f'\nexport default {classes[s]};\n'
    resource_types = [t['name'] for t in types.values() if t['file'] == methods[next(i for i, m in enumerate(methods) if m['service'] == s)]['file'] and t['name'][0].isupper() and not t['name'].endswith('Service')]
    content += "export type { " + ', '.join(resource_types) + " } from '../types.js';\n"
    (OUT / 'resources' / (files[s] + '.ts')).write_text(content)
    exports.append(f'export {{ {classes[s]} }} from "./{files[s]}.js";')
(OUT / 'resources/index.ts').write_text('\n'.join(exports) + '\n')
client = ["import { APIClient, type ClientOptions } from '../core/client.js';"]
for f in types['Client']['fields']:
    if f['type'] in services:
        client.append(f'import {{ {classes[f["type"]]} }} from "./resources/{files[f["type"]]}.js";')
client += ["\n/** Qoder Managed Mode API client. */", 'export class ManagedClient extends APIClient {', "  constructor(options: ClientOptions = {}) { super(options, 'managed'); }"]
for f in types['Client']['fields']:
    if f['type'] in services:
        client.append(f'  readonly {camel(f["name"])} = new {classes[f["type"]]}(this);')
client += ['}', '', 'export default ManagedClient;', 'export type { ClientOptions } from "../core/client.js";']
(OUT / 'client.ts').write_text('\n'.join(client) + '\n')
(OUT / 'managedClient.ts').write_text("export { ManagedClient, ManagedClient as default } from './client.js';\nexport type { ClientOptions } from './client.js';\n")
(OUT / 'index.ts').write_text("export { ManagedClient, ManagedClient as default } from './client.js';\nexport type { ClientOptions, ClientOptions as ManagedClientOptions } from './client.js';\nexport * from './types.js';\nexport * from './resources/index.js';\nexport * from '../core/credentials.js';\nexport * from '../core/error.js';\nexport { APIPromise } from '../core/api-promise.js';\nexport { Page, PagePromise } from '../core/pagination.js';\nexport { Stream } from '../core/streaming.js';\nexport { toFile, type Uploadable } from '../core/uploads.js';\nexport type { RequestOptions } from '../core/client.js';\n")
(OUT / 'internal.ts').write_text('''import { mergeHeaders, type RequestOptions } from '../core/client.js';
import { toFile, type Uploadable } from '../core/uploads.js';

/** Extract header and parent-path parameters without mutating the caller's input. */
export function splitParams(
  params: object | null | undefined,
  options: RequestOptions | undefined,
  headerFields: Record<string, string>,
  pathFields: string[],
): { values: Record<string, unknown>; headers: Headers; options: RequestOptions } {
  const values = { ...params } as Record<string, unknown>;
  let headers = new Headers();
  for (const [field, header] of Object.entries(headerFields)) {
    const value = values[field];
    delete values[field];
    if (value != null) headers.set(header, Array.isArray(value) ? value.join(',') : String(value));
  }
  for (const field of pathFields) delete values[field];
  // Per-request options override typed headers, as they do in the Go SDK.
  headers = mergeHeaders(headers, options?.headers);
  const removedHeaders = Object.entries(options?.headers ?? {}).filter(([, value]) => value === null);
  return {
    values,
    headers,
    // Preserve deletion markers until the core merges client-wide defaults.
    get options() {
      return { ...options, headers: { ...Object.fromEntries(headers), ...Object.fromEntries(removedHeaders) } };
    },
  };
}

export function pathParam(value: string | undefined | null, name: string): string {
  if (typeof value !== 'string' || value.length === 0) throw new Error(`Missing required ${name} parameter`);
  return encodeURIComponent(value);
}

/** Qoder multipart uses repeated files parts and JSON-encoded metadata. */
export async function managedMultipart(values: Record<string, unknown>): Promise<FormData> {
  const form = new FormData();
  for (const [name, value] of Object.entries(values)) {
    if (value === undefined || value === null) continue;
    if (name === 'file' || name === 'files') {
      for (const upload of Array.isArray(value) ? value : [value]) {
        const file = await toFile(upload as Uploadable);
        form.append(name, file, file.name);
      }
    } else if (typeof value === 'object') {
      form.append(name, JSON.stringify(value));
    } else {
      form.append(name, String(value));
    }
  }
  return form;
}
''')
print(f'Generated {len(methods)} Managed APIs and {sum(1 for t in types if t[0].isupper())} Go wire types.')
