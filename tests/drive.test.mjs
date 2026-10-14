import assert from 'node:assert/strict';
import { test } from 'node:test';
import { testClient, response, sdk } from './helpers.mjs';

test('Drive preserves service order, canonical path encoding and opaque cursors', async () => {
  const cursor = 'opaque/+%=&';
  let calls = 0;
  const client = testClient('forward', request => {
    calls++;
    const url = new URL(request.url);
    assert.equal(request.headers.get('authorization'), 'Bearer test-sat');
    assert.equal(url.searchParams.get('identity_id'), 'idn_test');
    assert.equal(url.searchParams.get('path'), '目录/a b+~*');
    assert.ok(url.search.includes('path=%E7%9B%AE%E5%BD%95/a+b%2B~%2A'));
    assert.ok(url.search.includes('extra=a%2Fb'));
    if (calls === 1) return response({ entries: [{ path: 'a.txt', name: 'a.txt', type: 'file', size: 0 }, { path: 'a', name: 'a', type: 'directory' }], next_page_token: cursor });
    assert.equal(url.searchParams.get('page_token'), cursor);
    return response({ entries: [] });
  }, { authMode: 'sa', pat: undefined, accessToken: 'test-sat', defaultQuery: { path: 'replaced', extra: 'a/b' } });
  const first = await client.drives.listEntries({ identity_id: 'idn_test', path: 'replaced-again' }, { query: { path: '目录/a b+~*' } });
  assert.deepEqual(first.entries.map(row => row.path), ['a.txt', 'a']);
  assert.equal(first.entries[0].size, 0);
  assert.equal(first.entries[1].size, undefined);
  const last = await client.drives.listEntries({ identity_id: 'idn_test', path: '目录/a b+~*', page_token: first.next_page_token });
  assert.deepEqual(last.entries, []);
  assert.equal(last.next_page_token, undefined);
  assert.equal(calls, 2);
});

test('Drive separates query/body and retains signed headers and partial deletion errors', async () => {
  let calls = 0;
  const client = testClient('forward', async request => {
    calls++;
    const url = new URL(request.url);
    assert.deepEqual([...url.searchParams], [['identity_id', 'idn_test']]);
    if (url.pathname.endsWith('-url')) {
      assert.equal(request.method, 'POST');
      assert.equal(request.headers.get('idempotency-key'), 'retry-one');
      const upload = url.pathname.endsWith('upload-url');
      assert.deepEqual(await request.json(), upload ? { path: 'reports/readme.txt', content_type: 'text/plain' } : { path: 'reports/readme.txt' });
      return response({ url: 'https://storage.test/signed', method: upload ? 'PUT' : 'GET', headers: { 'Content-Type': 'text/plain' }, expires_at: '2026-10-14T02:15:00Z' });
    }
    assert.equal(request.method, 'DELETE');
    if (url.pathname.endsWith('/entries')) {
      assert.deepEqual(await request.json(), { path: 'reports', recursive: false });
      return response({ deleted_count: 0 });
    }
    assert.equal(await request.text(), '');
    return response({ request_id: 'req_partial', error: { code: 'drive_delete_partial', deleted_count: 7, message: 'partial' } }, 503);
  }, { maxRetries: 2 });
  const upload = await client.drives.createUploadUrl({ identity_id: 'idn_test', path: 'reports/readme.txt', content_type: 'text/plain' }, { idempotencyKey: 'retry-one' });
  assert.deepEqual(upload.headers, { 'Content-Type': 'text/plain' });
  const download = await client.drives.createDownloadUrl({ identity_id: 'idn_test', path: 'reports/readme.txt' }, { idempotencyKey: 'retry-one' });
  assert.equal(download.method, 'GET');
  assert.equal(download.size, undefined);
  assert.equal((await client.drives.deleteEntry({ identity_id: 'idn_test', path: 'reports', recursive: false })).deleted_count, 0);
  await assert.rejects(client.drives.clear({ identity_id: 'idn_test' }), error => {
    assert.ok(error instanceof sdk.InternalServerError);
    assert.equal(error.code, 'drive_delete_partial');
    assert.equal(error.request_id, 'req_partial');
    assert.equal(error.error.error.deleted_count, 7);
    return true;
  });
  assert.equal(calls, 4);
});

test('Template managed tools preserves omitted, null and empty configurations', async () => {
  const bodies = [];
  const client = testClient('forward', async request => {
    bodies.push(await request.json());
    return response({ managed_tool_config: { enabled_tools: ['drive', 'schedule'] } });
  });
  await client.templates.update('tmpl_test');
  await client.templates.update('tmpl_test', { managed_tool_config: null });
  await client.templates.update('tmpl_test', { managed_tool_config: { enabled_tools: [] } });
  const result = await client.templates.create({ name: 'drive', model: 'auto', environment_id: 'env_test', managed_tool_config: { enabled_tools: ['drive', 'schedule'] } });
  assert.deepEqual(bodies.slice(0, 3), [{}, { managed_tool_config: null }, { managed_tool_config: { enabled_tools: [] } }]);
  assert.deepEqual(bodies[3].managed_tool_config, { enabled_tools: ['drive', 'schedule'] });
  assert.deepEqual(result.managed_tool_config.enabled_tools, ['drive', 'schedule']);
});

test('Drive does not normalize rejected paths or clamp limits, and accepts an explicit root', async () => {
  let expected;
  const client = testClient('forward', async request => {
    const query = new URL(request.url).searchParams;
    assert.equal(query.get('path'), expected.path);
    assert.equal(query.get('limit'), String(expected.limit));
    assert.deepEqual(query.getAll('identity_id'), ['idn_test']);
    assert.equal(await request.text(), '');
    if (expected.path === '' && [1, 100].includes(expected.limit)) return response({ entries: [] });
    return response({ error: { code: 'invalid_argument', message: 'invalid Drive query' } }, 400);
  });
  for (const limit of [1, 100]) {
    expected = { path: '', limit };
    assert.deepEqual((await client.drives.listEntries({ identity_id: 'idn_test', ...expected })).entries, []);
  }
  for (const [path, limit] of [['/absolute', 20], ['../other', 20], ['a\\b', 20], ['a%2Fb', 20], [' a ', 20], ['', 0], ['', 101]]) {
    expected = { path, limit };
    await assert.rejects(client.drives.listEntries({ identity_id: 'idn_test', ...expected }), error => error instanceof sdk.BadRequestError && error.code === 'invalid_argument');
  }
});
