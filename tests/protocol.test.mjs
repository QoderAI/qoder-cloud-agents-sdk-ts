// Request configuration, credentials, wire protocol, pagination and Managed request contracts.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { sdk, fixture, methods, argumentsFor, invoke, response, testClient } from './helpers.mjs';

for (const mode of ['forward', 'managed']) {
  test(`${mode}: explicit options override environment and request headers override defaults`, async () => {
    const baseVariable = mode === 'forward' ? 'QODER_FORWARD_BASE_URL' : 'QODER_BASE_URL';
    const previousToken = process.env.QODER_ACCESS_TOKEN, previousBase = process.env[baseVariable];
    process.env.QODER_ACCESS_TOKEN = 'environment-token';
    process.env[baseVariable] = `https://env.test/${mode}`;
    try {
      for (const explicit of [false, true]) {
        const Client = mode === 'forward' ? sdk.ForwardClient : sdk.ManagedClient;
        const c = new Client({ maxRetries: 0, defaultHeaders: { 'x-test': 'client' }, ...(explicit ? { accessToken: 'explicit-token', baseURL: `https://explicit.test/${mode}` } : {}), fetch: async (input, init) => {
          const req = new Request(input, init);
          assert.equal(new URL(req.url).host, explicit ? 'explicit.test' : 'env.test');
          assert.equal(req.headers.get('authorization'), `Bearer ${explicit ? 'explicit-token' : 'environment-token'}`);
          assert.equal(req.headers.get('x-test'), 'request');
          return response({ data: [] });
        } });
        if (mode === 'forward') await c.models.list({ headers: { 'x-test': 'request' } });
        else await c.models.list({}, { headers: { 'x-test': 'request' } });
      }
    } finally {
      if (previousToken === undefined) delete process.env.QODER_ACCESS_TOKEN; else process.env.QODER_ACCESS_TOKEN = previousToken;
      if (previousBase === undefined) delete process.env[baseVariable]; else process.env[baseVariable] = previousBase;
    }
  });
  for (const tc of [
    { name: 'GET 503', write: false, status: 503, want: 3 },
    { name: 'POST 503 unsafe', write: true, status: 503, want: 1 },
    { name: 'keyed POST 503', write: true, key: true, status: 503, want: 3 },
    { name: 'POST 429', write: true, status: 429, want: 3 },
    { name: 'keyed POST 409', write: true, key: true, status: 409, want: 1 },
    { name: 'server opt-out', write: false, status: 503, shouldRetry: 'false', want: 1 },
    { name: 'unsafe server opt-in', write: true, status: 503, shouldRetry: 'true', want: 1 },
    { name: 'conflict server opt-in', write: true, key: true, status: 409, shouldRetry: 'true', want: 1 },
  ]) test(`${mode}: retry safety ${tc.name}`, async () => {
    let calls = 0; const sent = [];
    const c = testClient(mode, async req => {
      assert.equal(req.headers.get('x-qoder-retry-count'), String(calls));
      calls++;
      if (tc.write) sent.push(await req.text());
      return response({ error: { type: 'api_error', message: 'temporary' } }, tc.status, { 'retry-after-ms': '0', ...(tc.shouldRetry ? { 'x-should-retry': tc.shouldRetry } : {}) });
    }, { maxRetries: 2 });
    const resource = mode === 'forward' ? c.templates : c.agents;
    const params = mode === 'forward' ? { name: 'test', environment_id: 'env', model: 'model' } : { name: 'test', model: 'model' };
    await assert.rejects(() => tc.write ? resource.create(params, { headers: tc.key ? { 'idempotency-key': 'key' } : {} }) : resource.list({}));
    assert.equal(calls, tc.want);
    if (tc.write) assert.deepEqual(sent, Array(calls).fill(JSON.stringify(params)));
  });
  test(`${mode}: cancel during retry backoff`, async () => {
    let calls = 0; const controller = new AbortController();
    const c = testClient(mode, () => {
      calls++; setTimeout(() => controller.abort(), 10);
      return response({}, 429, { 'retry-after': '60' });
    }, { maxRetries: 2 });
    const started = Date.now();
    const r = mode === 'forward' ? c.templates : c.agents;
    await assert.rejects(() => r.list({}, { signal: controller.signal }), /abort|cancel/i);
    assert.equal(calls, 1);
    assert.ok(Date.now() - started < 1000);
  });
  test(`${mode}: request timeout aborts fetch`, async () => {
    const c = testClient(mode, req => new Promise((resolve, reject) => {
      req.signal.addEventListener('abort', () => reject(req.signal.reason), { once: true });
    }), { timeout: 10 });
    const r = mode === 'forward' ? c.templates : c.agents;
    await assert.rejects(() => r.list({}), /timeout|timed out/i);
  });
  test(`${mode}: APIPromise response access and unknown fields`, async () => {
    const c = testClient(mode, () => response({ id: 'one', description: null, future_flag: { nested: true } }));
    const promise = mode === 'forward' ? c.templates.retrieve('one') : c.agents.retrieve('one', {});
    const { data, response: raw, request_id } = await promise.withResponse();
    assert.deepEqual(data, { id: 'one', description: null, future_flag: { nested: true } });
    assert.equal(request_id, 'req_contract');
    assert.ok(raw instanceof Response);
    assert.deepEqual(await promise, data);
  });
  test(`${mode}: file download isolates private API headers`, async () => {
    let calls = 0;
    const c = testClient(mode, req => {
      calls++;
      if (new URL(req.url).host === 'qoder.test') {
        assert.equal(req.headers.get('x-private'), 'api-only');
        assert.equal(req.headers.get('authorization'), 'Bearer secret-pat');
        return response({ url: 'https://storage.test/object?signature=signed' });
      }
      assert.equal(new URL(req.url).search, '?signature=signed');
      assert.equal(req.headers.get('authorization'), null);
      assert.equal(req.headers.get('x-private'), null);
      return response('actual file');
    }, { defaultHeaders: { 'x-private': 'api-only' } });
    const res = mode === 'forward' ? await c.files.download('file') : await c.files.download('file', {});
    assert.equal(await res.text(), 'actual file'); assert.equal(calls, 2);
  });
  test(`${mode}: client fingerprint identifies the SDK but never reaches storage`, async () => {
    const seen = [];
    const c = testClient(mode, req => {
      seen.push(req.headers);
      if (new URL(req.url).host === 'qoder.test') return response({ url: 'https://storage.test/object?signature=signed' });
      return response('actual file');
    }, { timeout: 30_000 });
    const res = mode === 'forward' ? await c.files.download('file') : await c.files.download('file', {});
    assert.equal(await res.text(), 'actual file');
    const [api, storage] = seen;
    assert.equal(api.get('user-agent'), `qca-js/${sdk.VERSION}`);
    assert.equal(api.get('x-qoder-lang'), 'js');
    assert.equal(api.get('x-qoder-package-version'), sdk.VERSION);
    assert.equal(api.get('x-qoder-runtime'), 'node');
    assert.equal(api.get('x-qoder-runtime-version'), process.version.replace(/^v/, ''));
    // Normalized rather than raw process.platform/arch, so the same machine lands
    // in the same server-side bucket as the Go and Python SDKs.
    assert.ok(['MacOS', 'Windows', 'Linux', 'iOS', 'Android', 'FreeBSD', 'OpenBSD'].includes(api.get('x-qoder-os')));
    assert.ok(['x32', 'x64', 'arm', 'arm64'].includes(api.get('x-qoder-arch')));
    assert.equal(api.get('x-qoder-timeout'), '30');
    for (const name of ['user-agent', 'x-qoder-lang', 'x-qoder-package-version', 'x-qoder-os', 'x-qoder-arch', 'x-qoder-runtime', 'x-qoder-timeout']) {
      assert.equal(storage.get(name), null, name);
    }
  });
  test(`${mode}: client fingerprint yields to caller headers and omits an absent deadline`, async () => {
    const seen = [];
    const c = testClient(mode, req => { seen.push(req.headers); return response({ data: [] }); }, {
      timeout: 0,
      defaultHeaders: { 'User-Agent': 'caller/1.0', 'X-Qoder-Lang': 'cli' },
    });
    const r = mode === 'forward' ? c.templates : c.agents;
    await r.list({});
    assert.equal(seen[0].get('user-agent'), 'caller/1.0');
    assert.equal(seen[0].get('x-qoder-lang'), 'cli');
    assert.equal(seen[0].get('x-qoder-timeout'), null);
  });
  test(`${mode}: multipart files retain relative names and metadata`, async () => {
    let calls = 0;
    const c = testClient(mode, async req => {
      calls++;
      const body = await req.text();
      assert.match(req.headers.get('content-type'), /^multipart\/form-data; boundary=/);
      assert.ok(body.includes('filename="skill/SKILL.md"'));
      assert.ok(body.includes('filename="skill/scripts/run.sh"'));
      assert.ok(body.includes('# Skill'));
      assert.ok(body.includes('echo test'));
      assert.ok(body.includes('{"team":"sdk"}'));
      return response({ id: 'skill_one', latest_version: '123', latest_version_id: '123' }, 201);
    });
    const res = await c.skills.create({ files: [await sdk.toFile(Buffer.from('# Skill'), 'skill/SKILL.md'), await sdk.toFile(Buffer.from('echo test'), 'skill/scripts/run.sh')], metadata: { team: 'sdk' } });
    assert.equal(res.id, 'skill_one'); assert.equal(calls, 1);
  });
  test(`${mode}: JSON null, empty arrays, zero and dynamic keys survive HTTP serialization`, async () => {
    const body = { name: '', description: undefined, system: null, tools: [], model: { id: 'ultimate', effort: 'high', context_window: 400000 }, multiagent: null, environment_variables: { CUSTOM_VAR: 'value', REMOVE: null }, metadata: { remove: null, empty: '', keep: 'value' }, 'future.flag': false };
    const c = testClient(mode, async req => {
      assert.deepEqual(await req.json(), JSON.parse(JSON.stringify(body)));
      return response({ id: 'one' });
    });
    await (mode === 'forward' ? c.templates : c.agents).update('one', body);
  });
}

test('shared rotating credential is evaluated for every request in both modes', async () => {
  let token = 'first', failure, calls = 0;
  const credential = { async getToken() { if (failure) throw failure; return token; } };
  const fetch = async (input, init) => { calls++; assert.equal(new Request(input, init).headers.get('authorization'), `Bearer ${token}`); return response({ data: [] }); };
  const f = new sdk.ForwardClient({ credential, fetch, maxRetries: 0 });
  const m = new sdk.ManagedClient({ credential, fetch, maxRetries: 0 });
  for (token of ['first', 'rotated']) { await f.templates.list({}); await m.agents.list({}); }
  failure = Error('token unavailable');
  await assert.rejects(() => f.templates.list({}), e => e === failure || e.cause === failure);
  await assert.rejects(() => m.agents.list({}), e => e === failure || e.cause === failure);
  assert.equal(calls, 4);
});

for (const direction of ['after_id', 'before_id']) test(`Forward cursor pagination ${direction} preserves filters`, async () => {
  let calls = 0;
  const c = testClient('forward', req => {
    calls++; const q = new URL(req.url).searchParams;
    assert.equal(q.get('limit'), '1'); assert.equal(q.get('status'), 'active');
    if (calls === 1) return response({ data: [{ id: 'one' }], first_id: 'one', last_id: 'one', has_more: true });
    assert.equal(q.get(direction), 'one');
    return response({ data: [{ id: 'two' }], has_more: false });
  });
  const ids = [];
  for await (const value of c.templates.list({ limit: 1, status: 'active', ...(direction === 'before_id' ? { before_id: 'start' } : {}) })) ids.push(value.id);
  assert.deepEqual(ids, ['one', 'two']); assert.equal(calls, 2);
});
for (const mode of ['forward', 'managed']) {
  test(`${mode}: opaque pagination advances through empty page and clears legacy cursors`, async () => {
    let calls = 0;
    const c = testClient(mode, req => {
      calls++; const q = new URL(req.url).searchParams;
      if (calls === 1) return response({ data: [], next_page: 'opaque+/=', has_more: true });
      assert.equal(q.get('page'), 'opaque+/='); assert.equal(q.has('after_id'), false); assert.equal(q.has('before_id'), false); assert.equal(q.get('limit'), '1');
      return response({ data: [{ id: 'env_one' }], next_page: null, has_more: false });
    });
    const ids = [];
    for await (const env of c.environments.list({ limit: 1, after_id: 'legacy' })) ids.push(env.id);
    assert.deepEqual(ids, ['env_one']); assert.equal(calls, 2);
  });
  for (const status of [200, 503]) test(`${mode}: pagination rejects ${status === 200 ? 'stagnant cursor' : 'next-page API error'}`, async () => {
    let calls = 0;
    const c = testClient(mode, () => {
      calls++; assert.ok(calls <= 2, 'pagination did not stop');
      if (status === 503 && calls === 2) return response({ error: { message: 'retry later' } }, 503);
      return response({ data: [{ id: 'one' }], first_id: 'one', last_id: 'one', next_page: 'one', has_more: true });
    });
    await assert.rejects(async () => { for await (const item of (mode === 'forward' ? c.templates : c.agents).list({})) void item; }, status === 200 ? /did not advance|repeated/i : /retry later/i);
    assert.equal(calls, 2);
  });
}

for (const c of fixture('managed', 'request-bodies.json')) test(`Managed documented request ${c.id} #${c.case}: ${c.doc}`, async () => {
  const m = methods.managed.find(m => m.id === c.id);
  let calls = 0;
  const client = testClient('managed', async req => { calls++; assert.deepEqual(await req.json(), c.body); return response({}); });
  await invoke(client, m, await argumentsFor('managed', m, undefined, c.body));
  assert.equal(calls, 1);
});

test('Managed query preserves zero, false, array filters and typed headers', async () => {
  const c = testClient('managed', req => {
    const q = new URL(req.url).searchParams;
    assert.deepEqual([...q.entries()].sort(), [['agent_id','agent /?'],['agent_version','0'],['include_archived','false'],['limit','100'],['page','page +/='],['created_at[gte]','2026-09-09T03:04:05Z'],['statuses[]','idle'],['statuses[]','running'],['order','asc']].sort());
    assert.deepEqual(req.headers.get('x-qoder-beta').split(',').map(x => x.trim()), ['first', 'second']);
    return response({ data: [], next_page: null });
  });
  await c.sessions.list({ agent_id: 'agent /?', agent_version: 0, include_archived: false, limit: 100, page: 'page +/=', 'created_at[gte]': '2026-09-09T03:04:05Z', 'statuses[]': ['idle','running'], order: 'asc', workspace_id: 'workspace', betas: ['first','second'] });
});

for (const mode of ['forward', 'managed']) {
  test(`${mode}: GET retries recover after per-attempt timeout`, async () => {
    let calls = 0;
    const c = testClient(mode, req => {
      if (++calls === 2) return response({ data: [{ id: 'recovered' }], has_more: false });
      return new Promise((resolve, reject) => req.signal.addEventListener('abort', () => reject(req.signal.reason), { once: true }));
    }, { maxRetries: 1, timeout: 15 });
    const page = await (mode === 'forward' ? c.templates : c.agents).list({});
    assert.equal(page.data[0].id, 'recovered'); assert.equal(calls, 2);
  });
  test(`${mode}: middleware applies once to API grant and never to storage`, async () => {
    let calls = 0, middlewareCalls = 0;
    const c = testClient(mode, req => {
      calls++;
      if (new URL(req.url).host === 'qoder.test') {
        assert.equal(req.headers.get('x-private'), 'middleware-only');
        return response({ url: 'https://storage.test/file?signature=signed' });
      }
      assert.equal(req.headers.get('x-private'), null); assert.equal(req.headers.get('authorization'), null);
      return response('file');
    }, { middleware: [async (req, next) => { middlewareCalls++; req.headers.set('x-private', 'middleware-only'); return next(req); }] });
    assert.equal(await (await c.files.download('one', ...(mode === 'managed' ? [{}] : []))).text(), 'file');
    assert.equal(calls, 2); assert.equal(middlewareCalls, 1);
  });
}
test('Forward dynamic identity overrides preserve keyed names, null inheritance and false', async () => {
  const params = { identity_config: {
    tools: { Read: { enabled: false } }, skills: { skill_one: { enabled: false }, skill_inherit: null },
    mcp_servers: { crm: { enabled: true, url: 'https://crm.test/mcp' } },
    github_repositories: { custom_binding: { authorization_token: 'test_token', enabled: null } },
    environment_variables: { FOO: { op: 'set', value: 'value' }, BAR: { op: 'unset' } },
  } };
  const returned = { identity_config: { skills: { another: { enabled: false } }, environment_variables: { RUNTIME_KEY: { op: 'set', value: 'dynamic' } } }, metadata: { 'a.b': { nested: 1 } } };
  const c = testClient('forward', async req => { assert.deepEqual(await req.json(), params); return response(returned); });
  assert.deepEqual(await c.identities.configs.upsert('identity', 'template', params), returned);
});
test('single-use request stream is not retried even for 429 with idempotency key', async () => {
  let calls = 0;
  const c = testClient('forward', async req => { calls++; assert.equal(await req.text(), 'payload'); return response({}, 429, { 'retry-after-ms': '0' }); }, { maxRetries: 2 });
  await assert.rejects(() => c.request({ method: 'POST', path: '/raw', body: new ReadableStream({ start(s) { s.enqueue(new TextEncoder().encode('payload')); s.close(); } }), idempotencyKey: 'one' }));
  assert.equal(calls, 1);
});
test('invalid JSON success body rejects decoding without swallowing the error', async () => {
  const c = testClient('forward', () => response('{bad'));
  await assert.rejects(() => c.templates.retrieve('one'), SyntaxError);
});
test('invalid fetch response is reported as connection error', async () => {
  const c = testClient('forward', () => undefined);
  await assert.rejects(() => c.templates.list({}), sdk.APIConnectionError);
});

test('Managed worker identity uses Worker-ID and Qoder beta headers', async () => {
  const c = testClient('managed', req => {
    assert.equal(new URL(req.url).pathname, '/api/v1/cloud/environments/env/work/poll');
    assert.equal(req.headers.get('worker-id'), 'worker-01');
    assert.equal(req.headers.get('x-qoder-beta'), 'preview');
    assert.deepEqual([...req.headers.keys()].filter(k => k.includes('worker')), ['worker-id']);
    return response({ data: [] });
  });
  await c.environments.work.poll('env', { qoder_worker_id: 'worker-01', betas: ['preview'] });
});
test('Managed pagination preserves request options through an empty page and honors explicit terminal flag', async () => {
  let calls = 0;
  const c = testClient('managed', req => {
    calls++; const q = new URL(req.url).searchParams;
    assert.equal(req.headers.get('x-test'), 'request'); assert.equal(q.get('limit'), '2');
    if (calls === 1) { assert.equal(q.get('after_id'), 'legacy'); return response({ data: [{ id: 'a' }], has_more: true, next_page: 'opaque+/=?' }); }
    if (calls === 2) { assert.equal(q.get('page'), 'opaque+/=?'); assert.equal(q.has('after_id'), false); return response({ data: [], has_more: true, next_page: 'last' }); }
    assert.equal(calls, 3); assert.equal(q.get('page'), 'last');
    return response({ data: [{ id: 'b' }], has_more: false, next_page: 'must-not-follow' });
  }, { defaultHeaders: { 'x-test': 'client' } });
  const ids = [];
  for await (const item of c.agents.list({ limit: 2 }, { query: { after_id: 'legacy' }, headers: { 'x-test': 'request' } })) ids.push(item.id);
  assert.deepEqual(ids, ['a','b']); assert.equal(calls, 3);
});
test('Managed next_page without has_more keeps using the custom transport', async () => {
  let calls = 0;
  const c = testClient('managed', () => ++calls === 1 ? response({ data: [{ id: 'a' }], next_page: 'next' }) : response({ data: [{ id: 'b' }] }));
  const ids = []; for await (const item of c.agents.list({})) ids.push(item.id);
  assert.deepEqual(ids, ['a','b']); assert.equal(calls, 2);
});
