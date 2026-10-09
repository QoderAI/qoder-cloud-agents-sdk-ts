import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { testClient, response, resource } from './helpers.mjs';

// Expectations frozen from api-doc master, rather than generated from SDK code.
const { operations } = JSON.parse(readFileSync(new URL('./fixtures/api-expansion.json', import.meta.url)));
const segment = 'id /?%#';
for (const op of operations) {
  test(`${op.mode}.${op.entry}.${op.method}: documented API expansion`, async () => {
    const client = testClient(op.mode, async req => {
      const url = new URL(req.url);
      assert.equal(req.method, op.http);
      assert.equal(url.pathname, `/api/v1/${op.mode === 'forward' ? 'forward' : 'cloud'}${op.path.replace(/\{\w+\}/g, encodeURIComponent(segment))}`);
      assert.equal(req.headers.get('x-qoder-beta'), null);
      for (const [key, value] of Object.entries(op.query)) {
        assert.deepEqual(url.searchParams.getAll(key), (Array.isArray(value) ? value : [value]).map(String));
      }
      assert.equal(url.searchParams.has('identity_ids[]'), false);
      assert.equal(url.searchParams.has('template_ids[]'), false);
      if (op.body) assert.deepEqual(await req.json(), op.body);
      return response(op.response, op.method === 'create' ? 201 : op.entry === 'sessions' ? 202 : 200);
    });
    let args = [...op.path.matchAll(/\{\w+\}/g)].map(() => segment);
    if (op.paramsType) args.push({ ...op.body, ...op.query });
    if (op.entry === 'deployments.runs') {
      args.shift();
      args[args.length - 1].deployment_id = segment;
    }
    const result = await resource(client, op.entry)[op.method](...args);
    assert.deepEqual(JSON.parse(JSON.stringify(result)), op.response);
  });
}

for (const method of ['listIdentities', 'listTemplates']) {
  for (const backward of [false, true]) test(`Forward Usage ${method}: ${backward ? 'backward' : 'forward'} pagination retains the hourly window and filters`, async () => {
    let calls = 0;
    const op = operations.find(o => o.method === method);
    const params = { ...op.query, ...(backward ? { before_id: 'initial' } : {}) };
    const client = testClient('forward', req => {
      const url = new URL(req.url);
      assert.equal(url.searchParams.get('start_at'), params.start_at);
      assert.equal(url.searchParams.get('end_at'), params.end_at);
      assert.deepEqual(url.searchParams.getAll('identity_ids'), params.identity_ids);
      assert.deepEqual(url.searchParams.getAll('template_ids'), params.template_ids);
      assert.equal(url.searchParams.has('start_time'), false);
      assert.equal(url.searchParams.has('end_time'), false);
      if (calls++) assert.equal(url.searchParams.get(backward ? 'before_id' : 'after_id'), backward ? 'first' : 'last');
      return response({ ...op.response, data: [op.response.data[0]], first_id: 'first', last_id: 'last', has_more: calls === 1 });
    });
    const page = await client.usage[method](params);
    assert.equal(typeof page.data[0].active_seconds, 'number');
    assert.equal(page.data[0].active_seconds, op.response.data[0].active_seconds);
    assert.equal(page.start_at, params.start_at);
    await page.getNextPage();
    assert.equal(calls, 2);
    assert.deepEqual(params, { ...op.query, ...(backward ? { before_id: 'initial' } : {}) });
  });
}

test('Scoped deployment runs replay the opaque cursor and stay scoped', async () => {
  let calls = 0;
  const op = operations.find(o => o.entry === 'deployments.runs' && o.method === 'list');
  const client = testClient('managed', req => {
    const url = new URL(req.url);
    assert.equal(url.pathname, '/api/v1/cloud/deployments/dep_one/runs');
    assert.equal(url.searchParams.get('triggered_after'), '2026-06-01T00:00:00Z');
    assert.equal(req.headers.get('qoder-workspace-id'), 'workspace_one');
    if (calls++) assert.equal(url.searchParams.get('page'), 'opaque +/=?');
    return response({ ...op.response, has_more: calls === 1, next_page: calls === 1 ? 'opaque +/=?' : null });
  });
  const runs = [];
  for await (const run of client.deployments.runs.list({ deployment_id: 'dep_one', triggered_after: '2026-06-01T00:00:00Z', workspace_id: 'workspace_one' })) runs.push(run);
  assert.equal(runs.length, 2);
  assert.equal(calls, 2);
});

for (const status of [200, 202]) test(`Managed cancel accepts HTTP ${status} lightweight acknowledgement`, async () => {
  const client = testClient('managed', () => response({ id: 'sess_one', type: 'session', status: 'canceling' }, status));
  assert.equal((await client.sessions.cancel('sess_one')).status, 'canceling');
});

for (const failure of [429, 503, 'network']) test(`Credential rotation never retries ${failure}`, async () => {
  let calls = 0;
  const client = testClient('forward', () => {
    calls++;
    if (failure === 'network') throw new Error('connection failed');
    return response({ error: { type: 'api_error', message: 'rotation uncertain' } }, failure, { 'retry-after-ms': '1', 'x-should-retry': 'true' });
  }, { maxRetries: 3 });
  await assert.rejects(() => client.vaults.credentials.update('vault_one', 'cred_one', { auth: { type: 'static_bearer', token: 'new-test-secret' }, metadata: null }, { maxRetries: 3, idempotencyKey: 'caller-key' }));
  assert.equal(calls, 1);
});

test('Credential rotation keeps query ownership separate and preserves null merge patches', async () => {
  const client = testClient('forward', async req => {
    assert.equal(new URL(req.url).searchParams.get('identity_id'), 'idn_one');
    assert.deepEqual(await req.json(), { auth: { type: 'mcp_oauth', expires_at: null, refresh: { scope: null, refresh_token: 'test-refresh' } }, metadata: { remove: null } });
    return response(operations.find(o => o.entry === 'vaults.credentials').response);
  });
  await client.vaults.credentials.update('vault_one', 'cred_one', { identity_id: 'idn_one', auth: { type: 'mcp_oauth', expires_at: null, refresh: { scope: null, refresh_token: 'test-refresh' } }, metadata: { remove: null } });
});

test('Usage accepts comma-separated filters without converting to bracketed query keys', async () => {
  const client = testClient('forward', req => {
    const query = new URL(req.url).searchParams;
    assert.deepEqual(query.getAll('identity_ids'), ['idn_one,idn_two']);
    assert.deepEqual(query.getAll('template_ids'), ['tmpl_one,tmpl_two']);
    return response({ data: [], has_more: false });
  });
  await client.usage.listIdentities({ start_at: '2026-09-14T09:00:00', end_at: '2026-09-14T12:00:00', identity_ids: 'idn_one,idn_two', template_ids: 'tmpl_one,tmpl_two' });
});
