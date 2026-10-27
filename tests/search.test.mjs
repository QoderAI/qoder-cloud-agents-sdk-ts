import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { testClient, response, sdk } from './helpers.mjs';

const fixture = JSON.parse(readFileSync(new URL('./fixtures/search-contracts.json', import.meta.url)));
for (const c of fixture.cases) {
  test(`${c.mode}.${c.entry}.search: body filters, ownership and empty-page continuation`, async () => {
    const input = structuredClone(c.body), original = structuredClone(input);
    let calls = 0;
    const client = testClient(c.mode, async req => {
      const url = new URL(req.url), body = await req.json();
      assert.equal(req.method, 'POST');
      assert.ok(url.pathname.endsWith(c.path));
      assert.deepEqual(Object.fromEntries(url.searchParams), c.mode === 'forward' ? { identity_id: 'idn +/', trace: 'keep' } : { trace: 'keep' });
      assert.deepEqual(new Set(req.headers.get('x-qoder-beta').split(',')), new Set(['extra-beta', fixture.beta]));
      assert.equal(req.headers.get('x-search-test'), 'kept');
      assert.deepEqual(body, { ...c.body, page: [c.body.page, 'opaque +/=? one', 'opaque +/=? two'][calls] });
      calls++;
      return response({ ...c.response, data: calls === 2 ? [] : c.response.data, has_more: calls < 3, next_page: ['opaque +/=? one', 'opaque +/=? two', null][calls - 1] });
    }, { defaultHeaders: { 'x-qoder-beta': 'client-beta' } });
    if (c.mode === 'forward') input.identity_id = 'idn +/';
    const items = [];
    for await (const item of client[c.entry].search(input, { headers: { 'X-Qoder-Beta': 'extra-beta', 'x-search-test': 'kept' }, query: { trace: 'keep' } })) items.push(item);
    assert.equal(items.length, c.response.data.length * 2);
    assert.equal(calls, 3);
    assert.deepEqual(input, { ...original, ...(c.mode === 'forward' ? { identity_id: 'idn +/' } : {}) });
  });
  test(`${c.mode}.${c.entry}.search: no filters sends {} and retains default beta`, async () => {
    const client = testClient(c.mode, async req => {
      assert.equal(await req.text(), '{}');
      assert.equal(new URL(req.url).search, '');
      assert.equal(req.headers.get('x-qoder-beta'), `client-beta,${fixture.beta}`);
      return response({ data: [], has_more: false, next_page: null, total: null });
    }, { defaultHeaders: { 'x-qoder-beta': 'client-beta' } });
    const { data: page, response: raw } = await client[c.entry].search().withResponse();
    assert.equal(page.total, null);
    assert.equal(page.hasNextPage(), false);
    assert.equal(raw.headers.get('x-request-id'), 'req_contract');
  });
}
for (const status of [400, 403, 429, 503]) {
  test(`Search HTTP ${status} retains error details`, async () => {
    const client = testClient('forward', () => response({ error: { type: 'invalid_request_error', message: 'search failed' } }, status));
    await assert.rejects(client.files.search(), error => error instanceof sdk.APIError && error.status === status && error.request_id === 'req_contract');
  });
}
test('Search duplicate cursor stops without another request', async () => {
  let calls = 0;
  const client = testClient('managed', () => { calls++; return response({ data: [], has_more: true, next_page: 'same' }); });
  const page = await client.agents.search({ page: 'same' });
  await assert.rejects(page.getNextPage(), /did not advance/);
  assert.equal(calls, 1);
});
test('Search retry preserves body and beta; aborted request never reaches transport', async () => {
  let calls = 0;
  const client = testClient('forward', async req => {
    calls++;
    assert.deepEqual(await req.json(), { metadata: { team: 'core' } });
    assert.equal(req.headers.get('x-qoder-beta'), fixture.beta);
    return calls === 1 ? response({ error: { message: 'retry' } }, 429, { 'retry-after-ms': '0' }) : response({ data: [], has_more: false });
  }, { maxRetries: 1 });
  await client.files.search({ metadata: { team: 'core' } });
  assert.equal(calls, 2);
  const controller = new AbortController(); controller.abort();
  await assert.rejects(client.files.search({}, { signal: controller.signal }), /abort/i);
  assert.equal(calls, 2);
});

test('Search body override seeds the cursor but does not reset it on the next page', async () => {
  let calls = 0;
  const client = testClient('managed', async req => {
    assert.deepEqual(await req.json(), { metadata: { team: 'core' }, page: calls++ === 0 ? 'start' : 'next' });
    assert.equal(req.headers.get('x-qoder-beta'), fixture.beta);
    assert.equal(req.headers.get('qoder-workspace-id'), 'workspace');
    return response({ data: [], has_more: calls === 1, next_page: calls === 1 ? 'next' : null });
  });
  const page = await client.agents.search({ metadata: { team: 'core' }, betas: [fixture.beta], workspace_id: 'workspace' }, { body: { page: 'start' } });
  const next = await page.getNextPage();
  assert.equal(next.hasNextPage(), false);
  assert.equal(calls, 2);
});
