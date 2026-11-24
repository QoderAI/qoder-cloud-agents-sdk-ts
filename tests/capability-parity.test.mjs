import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import test from 'node:test';
import ts from 'typescript';
import { capabilityFixture, pathSegment, response, testClient } from './helpers.mjs';
import { VERSION } from '../dist/version.js';

// Wire expectations checked against Forward session/create, templatea2a/config,
// A2A a2a-go/v2 v2.7.0, and CAS agent/helpers and mcp/validate.
const skill = { id: 'summary', name: 'Summary', description: 'Summarize text', tags: ['summary'], examples: ['Summarize this'] };
const publication = { enabled: true, description: 'Published capabilities', skills: [skill] };
const roster = { type: 'coordinator', agents: ['tpl_child', { type: 'agent', template_id: 'tpl_second' }, { type: 'agent', id: 'agent_child' }, { type: 'self' }, { type: 'advisor', model: 'ultimate' }] };
for (const name of ['ImageGen', 'ImageSearch', 'VideoGen', 'DeliverArtifacts']) {
  test(`Managed sparse ${name} configuration remains sparse in responses`, async () => {
    const configs = [{ name }, { name, enabled: null, permission_policy: null }];
    const client = testClient('managed', async () => response({ id: 'agent', tools: [{ type: 'agent_toolset_20260401', configs }] }));
    const saved = await client.agents.retrieve('agent');
    assert.deepEqual(saved.tools[0].configs, configs);
    assert.equal(Object.hasOwn(saved.tools[0].configs[0], 'permission_policy'), false);
  });
}
for (const operation of ['create', 'update', 'retrieve']) {
  test(`Managed Agent ${operation} preserves explicit null media config types`, async () => {
    const configs = [
      { name: 'ImageGen', type: null }, { name: 'ImageSearch', type: null },
      { name: 'VideoGen', type: null }, { name: 'DeliverArtifacts', type: null },
    ];
    const tools = [{ type: 'agent_toolset_20260401', configs }];
    const body = { name: 'nullable-media', model: 'auto', tools };
    let calls = 0;
    const client = testClient('managed', async request => {
      calls++;
      assert.equal(request.method, operation === 'retrieve' ? 'GET' : 'POST');
      assert.equal(new URL(request.url).pathname, `/api/v1/cloud/agents${operation === 'create' ? '' : '/agent'}`);
      if (operation === 'retrieve') assert.equal(await request.text(), '');
      else assert.deepEqual(await request.json(), body);
      return response({ id: 'agent', tools: [{ type: 'agent_toolset_20260401', configs, default_config: { enabled: true, permission_policy: { type: 'always_allow' } } }] });
    });
    const saved = await (operation === 'create' ? client.agents.create(body) : operation === 'update' ? client.agents.update('agent', body) : client.agents.retrieve('agent'));
    assert.deepEqual(saved.tools[0].configs, configs);
    for (const config of saved.tools[0].configs) {
      assert.equal(Object.hasOwn(config, 'type'), true);
      assert.equal(config.type, null);
    }
    assert.equal(calls, 1);
  });
}
for (const a2a of [{}, { description: 'public metadata' }]) {
  test(`Forward sparse A2A ${JSON.stringify(a2a)} preserves omitted enabled`, async () => {
    const client = testClient('forward', async () => response({ id: 'tpl', a2a }));
    const saved = await client.templates.retrieve('tpl');
    assert.deepEqual(saved.a2a, a2a);
    assert.equal(Object.hasOwn(saved.a2a, 'enabled'), false);
  });
}
test('Managed MCP default deny is sent at the toolset level without per-tool configs', async () => {
  const tools = [{ type: 'mcp_toolset', mcp_server_name: 'test', permission_policy: { type: 'always_deny' } }];
  const client = testClient('managed', async request => {
    const body = await request.json();
    assert.deepEqual(body.tools, tools);
    assert.equal(Object.hasOwn(body.tools[0], 'default_config'), false);
    assert.equal(Object.hasOwn(body.tools[0], 'configs'), false);
    return response({ id: 'agent', tools });
  });
  const saved = await client.agents.create({ name: 'deny', model: 'auto', tools });
  assert.equal(saved.tools[0].permission_policy.type, 'always_deny');
});
const beta = 'browser-use-2026-07-14';
const ossBeta = 'oss-bucket-2026-09-23';
const allToolNames = ['Bash', 'Edit', 'Read', 'Write', 'Glob', 'Grep', 'WebFetch', 'WebSearch', 'ImageGen', 'ImageSearch', 'VideoGen', 'DeliverArtifacts'];

for (const [label, patch, expected] of [
  ['omitted', {}, roster],
  ['null', { multiagent: null }, null],
  ['roster', { multiagent: roster }, roster],
]) {
  test(`Forward Session multiagent update ${label} round-trips without restoring inheritance`, async () => {
    const client = testClient('forward', async request => {
      assert.equal(request.method, 'POST');
      assert.equal(new URL(request.url).pathname, `/api/v1/forward/sessions/${encodeURIComponent(pathSegment)}`);
      assert.deepEqual(await request.json(), { config: patch });
      assert.equal(request.headers.get('idempotency-key'), 'roster-patch');
      return response({ id: 'sess', config: { environment_variables: {}, multiagent: expected }, future: true });
    });
    const saved = await client.sessions.update(pathSegment, { config: patch, idempotency_key: 'roster-patch' });
    assert.deepEqual(saved.config.multiagent, expected);
    assert.equal(saved.future, true);
  });
}

test('Forward Session rejects an empty multiagent roster', async () => {
  const client = testClient('forward', async request => {
    assert.deepEqual(await request.json(), { config: { multiagent: { type: 'coordinator', agents: [] } } });
    return response({ error: { type: 'invalid_request', message: 'multiagent.agents must be a non-empty array' } }, 400);
  });
  await assert.rejects(client.sessions.update('sess', { config: { multiagent: { type: 'coordinator', agents: [] } } }), error => error.status === 400);
});

test('Forward Session auto_title is create-only and leaves title absent', async () => {
  let calls = 0;
  const client = testClient('forward', async request => {
    calls++;
    const body = await request.json();
    assert.equal(request.method, 'POST');
    assert.equal(new URL(request.url).pathname, '/api/v1/forward/sessions');
    assert.deepEqual(body, {
      identity_id: 'idn', template_id: 'tpl', auto_title: true,
      metadata: { __qca_sdk_created: 'true', __qca_sdk_language: 'js', __qca_sdk_version: VERSION },
    });
    assert.equal(Object.hasOwn(body, 'title'), false);
    assert.equal(Object.hasOwn(body, 'config'), false);
    return response({ id: 'sess', title: '', config: { environment_variables: {} } });
  });
  const saved = await client.sessions.create({ identity_id: 'idn', template_id: 'tpl', auto_title: true });
  assert.equal(saved.title, '');
  assert.equal(Object.hasOwn(saved, 'auto_title'), false);
  assert.equal(calls, 1);
});

for (const title of ['', null, 'manual']) {
  test(`Forward auto_title/title ${JSON.stringify(title)} conflict reaches service validation`, async () => {
    let calls = 0;
    const client = testClient('forward', async request => {
      calls++;
      const body = await request.json();
      assert.equal(body.auto_title, true);
      assert.equal(Object.hasOwn(body, 'title'), true);
      assert.equal(body.title, title);
      return response({ error: { type: 'invalid_request', message: 'title must not be supplied when auto_title is enabled' } }, 400);
    });
    await assert.rejects(client.sessions.create({ identity_id: 'idn', template_id: 'tpl', auto_title: true, title }), error => error.status === 400);
    assert.equal(calls, 1);
  });
}

test('Forward Template create returns A2A publication independent of multiagent', async () => {
  const body = { name: 'template', model: 'auto', environment_id: 'env', a2a: publication, multiagent: roster };
  const client = testClient('forward', async request => {
    assert.equal(request.method, 'POST');
    assert.equal(new URL(request.url).pathname, '/api/v1/forward/templates');
    assert.deepEqual(await request.json(), body);
    return response({ id: 'tpl', ...body, a2a: { ...publication, future: true } });
  });
  const saved = await client.templates.create(body);
  assert.deepEqual(saved.multiagent, roster);
  assert.deepEqual(saved.a2a.skills, [skill]);
  assert.equal(saved.a2a.future, true);
});

for (const [label, patch, expected] of [
  ['omitted', {}, publication],
  ['empty object', { a2a: {} }, publication],
  ['null', { a2a: null }, null],
  ['empty skills', { a2a: { skills: [] } }, { ...publication, skills: [] }],
  ['disabled', { a2a: { enabled: false } }, { ...publication, enabled: false }],
]) {
  test(`Forward Template A2A ${label} patch preserves exact wire and response`, async () => {
    const client = testClient('forward', async request => {
      assert.equal(request.method, 'POST');
      assert.equal(new URL(request.url).pathname, '/api/v1/forward/templates/tpl');
      assert.deepEqual(await request.json(), patch);
      return response({ id: 'tpl', a2a: expected, multiagent: roster });
    });
    const saved = await client.templates.update('tpl', patch);
    assert.deepEqual(saved.a2a, expected);
    assert.deepEqual(saved.multiagent, roster);
  });
}

const agentCardContract = capabilityFixture.operations.find(op => op.id === 'templates.getAgentCard');
for (const [version, card] of [['0.3', agentCardContract.legacy_response], ['1.0', agentCardContract.response]]) {
  for (const authMode of ['pat', 'sa']) {
    test(`Forward Agent Card ${version} ${authMode} escapes paths, splits query/header and decodes wire`, async () => {
      let calls = 0;
      const client = testClient('forward', async request => {
        calls++;
        const url = new URL(request.url);
        assert.equal(request.method, 'GET');
        assert.equal(url.pathname, `/api/v1/forward/templates/${encodeURIComponent(pathSegment)}/a2a/agent-card.json`);
        assert.equal(url.searchParams.has('a2a_version'), false);
        assert.equal(url.searchParams.get('identity_id'), authMode === 'pat' ? 'idn /?+' : null);
        assert.equal(request.headers.get('a2a-version'), version);
        assert.equal(request.headers.get('authorization'), `Bearer ${authMode === 'pat' ? 'secret-pat' : 'test-sat'}`);
        assert.equal(await request.text(), '');
        return response(card, 200, { 'cache-control': 'no-store' });
      }, authMode === 'sa' ? { pat: undefined, authMode: 'sa', accessToken: 'test-sat' } : {});
      const decoded = await client.templates.getAgentCard(pathSegment, { a2a_version: version, ...(authMode === 'pat' ? { identity_id: 'idn /?+' } : {}) });
      assert.deepEqual(decoded, card);
      assert.equal(decoded.skills[0].future, 'skill');
      if (version === '1.0') assert.equal(decoded.supportedInterfaces[0].protocolBinding, 'JSONRPC');
      assert.equal(calls, 1, 'Discovery must not follow an external invocation endpoint');
    });
  }
}

for (const headers of [
  { 'a2a-VERSION': '1.0', 'X-Trace': 'trace' },
  new Headers({ 'A2A-Version': '1.0', 'X-Trace': 'trace' }),
  [['a2a-version', '1.0'], ['X-Trace', 'trace']],
]) {
  test(`Agent Card request overrides win with ${headers.constructor.name} headers`, async () => {
    const client = testClient('forward', async request => {
      const url = new URL(request.url);
      assert.equal(url.searchParams.get('identity_id'), 'override');
      assert.equal(url.searchParams.get('extra'), 'preserved');
      assert.equal(url.searchParams.has('a2a_version'), false);
      assert.equal(request.headers.get('a2a-version'), '1.0');
      assert.equal(request.headers.get('x-trace'), 'trace');
      assert.equal(await request.text(), '');
      return response({ name: 'overridden' });
    });
    assert.equal((await client.templates.getAgentCard('tpl', { identity_id: 'typed', a2a_version: '0.3' }, { query: { identity_id: 'override', extra: 'preserved' }, headers })).name, 'overridden');
  });
}

test('Agent Card omitted version, null header override, escaped-path validation and HTTP errors', async () => {
  let calls = 0;
  const client = testClient('forward', async request => {
    calls++;
    assert.equal(request.headers.get('a2a-version'), null);
    assert.equal(new URL(request.url).search, '');
    assert.equal(await request.text(), '');
    return response(agentCardContract.http_error.body, agentCardContract.http_error.status);
  });
  const expectError = error => {
    assert.equal(error.status, agentCardContract.http_error.status);
    assert.equal(error.type, agentCardContract.http_error.body.error.type);
    assert.ok(error.message.includes(agentCardContract.http_error.body.error.message));
    return true;
  };
  assert.throws(() => client.templates.getAgentCard(''), /missing required template_id/);
  assert.equal(calls, 0);
  await assert.rejects(client.templates.getAgentCard('tpl'), expectError);
  await assert.rejects(client.templates.getAgentCard('tpl', { a2a_version: '0.3' }, { headers: { 'A2A-Version': null } }), expectError);
  assert.equal(calls, 2);
});

const bucket = { name: 'datasets', provider: 'aliyun-oss', region: 'cn-hangzhou', bucket: 'test-datasets', prefix: 'team/data/', access: 'read_write', accelerator_endpoint: 'test.oss-data-acc.aliyuncs.com' };
for (const credential of [
  { type: 'ram_role', role_arn: 'placeholder-role-arn' },
  { type: 'access_key', access_key_id: 'placeholder-access-key', access_key_secret: 'placeholder-access-secret' },
]) {
  test(`Forward OSS ${credential.type} writes credentials and decodes only service-redacted fields`, async () => {
    const masked = credential.type === 'ram_role' ? { type: 'ram_role' } : { type: 'access_key', access_key_id: 'plac****-key' };
    const config = { type: 'cloud', packages: { apt: ['curl'] }, storage: { buckets: [{ ...bucket, credential }] } };
    const savedConfig = { ...config, storage: { buckets: [{ ...bucket, credential: masked }] } };
    const client = testClient('forward', async request => {
      assert.equal(request.method, 'POST');
      assert.equal(new URL(request.url).pathname, '/api/v1/forward/environments');
      assert.deepEqual(await request.json(), { name: 'oss', config });
      assert.equal(request.headers.get('x-qoder-beta'), ossBeta);
      return response({ id: 'env', config: savedConfig });
    });
    const saved = await client.environments.create({ name: 'oss', config }, { headers: { 'X-Qoder-Beta': ossBeta } });
    assert.deepEqual(saved.config, savedConfig);
    assert.deepEqual(saved.config.storage.buckets[0].credential, masked);
    assert.equal(Object.hasOwn(saved.config.storage.buckets[0].credential, 'role_arn'), false);
    assert.equal(Object.hasOwn(saved.config.storage.buckets[0].credential, 'access_key_secret'), false);
  });
}

for (const buckets of [[bucket], []]) {
  test(`Forward OSS update ${buckets.length ? 'omits credential' : 'removes buckets'} without injecting config fields`, async () => {
    const config = { type: 'cloud', storage: { buckets } };
    const client = testClient('forward', async request => {
      assert.equal(request.method, 'POST');
      assert.equal(new URL(request.url).pathname, '/api/v1/forward/environments/env');
      assert.deepEqual(await request.json(), { config });
      assert.equal(request.headers.get('x-qoder-beta'), ossBeta);
      return response({ id: 'env', config: { ...config, storage: { buckets: buckets.map(item => ({ ...item, credential: { type: 'ram_role' } })) } } });
    });
    const saved = await client.environments.update('env', { config }, { headers: { 'x-qoder-beta': ossBeta } });
    assert.equal(saved.config.storage.buckets.length, buckets.length);
  });
}

for (const operation of ['create', 'update']) {
  test(`Managed Agent ${operation} round-trips all configs, default/MCP deny and Browser beta`, async () => {
    const configs = allToolNames.map(name => ({ name, enabled: true, permission_policy: { type: 'always_deny' } }));
    const tools = [
      { type: 'agent_toolset_20260401', configs, default_config: { enabled: true, permission_policy: { type: 'always_deny' } } },
      { type: 'mcp_toolset', mcp_server_name: 'test', permission_policy: { type: 'always_deny' }, configs: [{ name: 'remote', enabled: false, permission_policy: { type: 'always_deny' } }] },
      { type: 'browser_toolset_20260714' },
    ];
    const body = { name: 'capabilities', model: 'auto', tools };
    const client = testClient('managed', async request => {
      assert.equal(request.method, 'POST');
      assert.equal(new URL(request.url).pathname, `/api/v1/cloud/agents${operation === 'update' ? '/agent' : ''}`);
      assert.equal(request.headers.get('x-qoder-beta'), beta);
      assert.deepEqual(await request.json(), body);
      return response({ id: 'agent', ...body, version: 1 });
    });
    const params = { ...body, betas: [beta] };
    const saved = await (operation === 'create' ? client.agents.create(params) : client.agents.update('agent', params));
    assert.deepEqual(saved.tools, tools);
    assert.deepEqual(saved.tools[0].configs.map(config => config.name), allToolNames);
    assert.equal(saved.tools[1].permission_policy.type, 'always_deny');
    assert.deepEqual(saved.tools[2], { type: 'browser_toolset_20260714' });
  });
}

test('Managed Session snapshot update preserves Browser and configs without adding Browser options', async () => {
  const tools = [{ type: 'browser_toolset_20260714' }, { type: 'agent_toolset_20260401', configs: [{ name: 'ImageGen', permission_policy: { type: 'always_deny' } }] }];
  const client = testClient('managed', async request => {
    assert.equal(request.method, 'POST');
    assert.equal(new URL(request.url).pathname, '/api/v1/cloud/sessions/sess');
    assert.equal(request.headers.get('x-qoder-beta'), beta);
    assert.deepEqual(await request.json(), { agent: { tools } });
    return response({ id: 'sess', agent: { id: 'agent', version: 1, tools } });
  });
  const saved = await client.sessions.update('sess', { agent: { tools }, betas: [beta] });
  assert.deepEqual(saved.agent.tools, tools);
  assert.equal(saved.agent.version, 1);
});

test('Managed snake aliases and legacy optional type are sent verbatim, never substituted for name', async () => {
  const configs = ['image_gen', 'image_search', 'video_gen', 'deliver_artifacts'].map(name => ({ name, type: name, permission_policy: { type: 'always_deny' } }));
  const client = testClient('managed', async request => {
    assert.deepEqual(await request.json(), { name: 'aliases', model: 'auto', tools: [{ type: 'agent_toolset_20260401', configs }] });
    return response({ tools: [{ type: 'agent_toolset_20260401', configs: allToolNames.slice(-4).map(name => ({ name, enabled: true, permission_policy: { type: 'always_deny' } })) }] });
  });
  const saved = await client.agents.create({ name: 'aliases', model: 'auto', tools: [{ type: 'agent_toolset_20260401', configs }] });
  assert.deepEqual(saved.tools[0].configs.map(config => config.name), allToolNames.slice(-4));
});

test('All README TypeScript snippets compile against public entry points without generating project files', () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');
  const snippets = [...readme.matchAll(/^```ts\s*\n([\s\S]*?)^```\s*$/gm)].map(match => match[1]);
  assert.ok(snippets.length >= 3, 'Capability examples must remain present');
  // Same illustrative globals as docs-check; locally declared clients remain fully typed.
  const virtualFiles = new Map([[path.join(root, 'tests', '__readme-globals.d.ts'), `
    declare const ForwardClient: typeof import('qca-sdk').ForwardClient;
    declare const ManagedClient: typeof import('qca-sdk').ManagedClient;
    declare const client: any;
    declare const forward: any;
    declare const managed: any;
    declare const session: any;
    declare const stream: any;
    declare const previousEventID: any;
    declare const uploaded: any;
    declare const params: any;
    declare const process: any;
    declare const fs: any;
    declare module 'node:fs';
  `]]);
  snippets.forEach((snippet, i) => virtualFiles.set(path.join(root, 'tests', `__readme-snippet-${i}.mts`), snippet));
  const options = {
    noEmit: true, strict: true, target: ts.ScriptTarget.ES2022,
    lib: ['lib.es2022.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
    module: ts.ModuleKind.Node16, moduleResolution: ts.ModuleResolutionKind.Node16,
    skipLibCheck: true, types: [], baseUrl: root,
    paths: { 'qca-sdk': ['src/index.ts'], 'qca-sdk/forward': ['src/forward/index.ts'], 'qca-sdk/managed': ['src/managed/index.ts'] },
  };
  const host = ts.createCompilerHost(options);
  const readFile = host.readFile.bind(host);
  const fileExists = host.fileExists.bind(host);
  const getSourceFile = host.getSourceFile.bind(host);
  host.readFile = name => virtualFiles.get(name) ?? readFile(name);
  host.fileExists = name => virtualFiles.has(name) || fileExists(name);
  host.getSourceFile = (name, version, onError, shouldCreateNewSourceFile) => virtualFiles.has(name)
    ? ts.createSourceFile(name, virtualFiles.get(name), version, true)
    : getSourceFile(name, version, onError, shouldCreateNewSourceFile);
  const diagnostics = ts.getPreEmitDiagnostics(ts.createProgram([...virtualFiles.keys()], options, host));
  assert.equal(diagnostics.length, 0, ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: name => name, getCurrentDirectory: () => root, getNewLine: () => '\n',
  }));
});

test('Forward unsupported create/update/response fields are not advertised by explicit declarations', () => {
  const source = ts.createSourceFile('forward-types.ts', readFileSync(new URL('../src/forward/types.ts', import.meta.url), 'utf8'), ts.ScriptTarget.Latest, true);
  const interfaces = new Map(source.statements.filter(ts.isInterfaceDeclaration).map(node => [node.name.text, node]));
  for (const [name, unsupported] of [
    ['SessionNewParamsConfigParam', 'multiagent'], ['SessionUpdateParams', 'auto_title'], ['Session', 'auto_title'],
  ]) {
    assert.equal(interfaces.get(name).members.some(member => member.name?.getText(source) === unsupported), false, `${name} must not declare ${unsupported}`);
  }
});
