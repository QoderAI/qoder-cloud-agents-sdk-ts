// Anthropic shared-semantics conformance baseline for qca-sdk (TypeScript).
//
// Provenance (fixed, offline -- do NOT bump without a new task + re-review):
//   upstream repo  : anthropics/anthropic-sdk-typescript
//   upstream tag   : sdk-v0.127.0
//   upstream commit: 3c5d9c0c15bb847a628f3f2876ac09719abe3012
//   adopted areas  : request building & header merge, JSON/query encoding,
//                    APIPromise response access, terminal pagination,
//                    fetch middleware, SSE framing, upload conversion,
//                    caller-signal listener cleanup.
//
// Scope: assert ONLY generic SDK semantics QCA and the pinned Anthropic baseline
// ALREADY share. This is a regression floor, NOT an API-parity layer.
//
// Deliberate QCA differences NOT asserted here (owned elsewhere / by design):
//   - ForwardClient/ManagedClient topology, QCA resources & URLs
//   - PAT + Qoder fingerprint headers, resumable stream, x-qoder-* wire headers
//   - qca-sdk package/module/version naming
//   - QCA safe-retry policy, response-body timeout lifetime, QoderError hierarchy
//   - Anthropic public APIs absent from QCA (each raised as its own task)
//
// No @anthropic-ai/sdk import; no network; no PAT; injected fetch + in-memory only.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getEventListeners } from 'node:events';
import { sdk, testClient, response } from './helpers.mjs';
import { decodeSSE } from '../dist/core/streaming.js';

const MODES = ['forward', 'managed'];
const writeResource = (c, mode) => (mode === 'forward' ? c.templates : c.agents);

function byteChunks(text, size = 1) {
  const bytes = new TextEncoder().encode(text);
  let offset = 0;
  return new ReadableStream({ pull(controller) {
    if (offset >= bytes.length) return controller.close();
    controller.enqueue(bytes.slice(offset, offset += size));
  } });
}

for (const mode of MODES) {
  // (1) method normalization + baseURL/path join; default header kept;
  //     null header deletes; undefined header preserves default; request header adds.
  test(`[shared] ${mode}: request building normalizes method/path and merges headers`, async () => {
    let seen;
    const c = testClient(mode, req => { seen = req; return response({ data: [] }); },
      { defaultHeaders: { 'x-keep': 'default', 'x-drop': 'default' } });
    if (mode === 'forward') await c.models.list({ headers: { 'x-drop': null, 'x-add': 'req', 'x-skip': undefined } });
    else await c.models.list({}, { headers: { 'x-drop': null, 'x-add': 'req', 'x-skip': undefined } });
    const url = new URL(seen.url);
    assert.equal(seen.method, 'GET');
    assert.equal(url.pathname, `/api/v1/${mode === 'forward' ? 'forward' : 'cloud'}/models`);
    assert.equal(seen.headers.get('x-keep'), 'default');
    assert.equal(seen.headers.get('x-drop'), null);
    assert.equal(seen.headers.get('x-add'), 'req');
  });

  // (2a) JSON body: undefined omitted; null/false/""/[] retained.
  test(`[shared] ${mode}: JSON omits undefined and retains null/false/empty`, async () => {
    const body = { keep_null: null, keep_false: false, keep_empty: '', keep_arr: [], drop: undefined };
    let jsonSeen;
    const c = testClient(mode, async req => { jsonSeen = await req.json(); return response({ id: 'one' }); });
    await writeResource(c, mode).update('one', body);
    assert.deepEqual(jsonSeen, { keep_null: null, keep_false: false, keep_empty: '', keep_arr: [] });
  });

  // (3) APIPromise: await -> data; asResponse() -> raw Response (unparsed);
  //     withResponse() -> { data, response, request_id }.
  test(`[shared] ${mode}: APIPromise exposes data, raw response and request id`, async () => {
    const payload = { id: 'one', description: null, future_flag: { nested: true } };
    const c = testClient(mode, () => response(payload));
    const promise = mode === 'forward' ? c.templates.retrieve('one') : c.agents.retrieve('one', {});
    const { data, response: raw, request_id } = await promise.withResponse();
    assert.deepEqual(data, payload);
    assert.ok(raw instanceof Response);
    assert.equal(request_id, 'req_contract');
    const raw2 = await (mode === 'forward' ? c.templates.retrieve('one') : c.agents.retrieve('one', {})).asResponse();
    assert.ok(raw2 instanceof Response);
    assert.deepEqual(await raw2.json(), payload);
    assert.deepEqual(await (mode === 'forward' ? c.templates.retrieve('one') : c.agents.retrieve('one', {})), payload);
  });

  // (4) terminal pagination: page.data items + hasNextPage() false on a terminal page.
  test(`[shared] ${mode}: terminal page reports items and hasNextPage()===false`, async () => {
    const c = testClient(mode, () => response({ data: [{ id: 'only' }], has_more: false, next_page: null }));
    const page = await writeResource(c, mode).list({ limit: 1 });
    assert.deepEqual(page.data.map(x => x.id), ['only']);
    assert.equal(page.hasNextPage(), false);
  });

  // (4b) async iteration walks every page, then stops on the terminal flag.
  test(`[shared] ${mode}: async iteration walks all pages then stops`, async () => {
    let calls = 0;
    const c = testClient(mode, () => {
      calls++;
      if (calls === 1) return response({ data: [{ id: 'a' }], has_more: true, last_id: 'a', next_page: 'p2' });
      return response({ data: [{ id: 'b' }], has_more: false, last_id: 'b', next_page: null });
    });
    const ids = [];
    for await (const item of writeResource(c, mode).list({ limit: 1 })) ids.push(item.id);
    assert.deepEqual(ids, ['a', 'b']);
    assert.equal(calls, 2);
  });

  // (5) fetch middleware: outer-then-inner order, header injection, and short-circuit
  //     (a middleware may return a Response without calling next -> fetch untouched).
  test(`[shared] ${mode}: middleware runs in order and can short-circuit`, async () => {
    const order = [];
    let fetchCalls = 0;
    const c = testClient(mode, () => { fetchCalls++; return response({ data: [] }); }, {
      middleware: [
        async (req, next) => { order.push('outer-in'); const r = await next(req); order.push('outer-out'); return r; },
        async (req) => { order.push('inner-short'); return response({ data: [{ id: 'short' }] }); },
      ],
    });
    const page = await writeResource(c, mode).list({});
    assert.deepEqual(page.data.map(x => x.id), ['short']);
    assert.deepEqual(order, ['outer-in', 'inner-short', 'outer-out']);
    assert.equal(fetchCalls, 0);
  });

  // (8) caller AbortSignal: no leftover 'abort' listener after a successful request.
  test(`[shared] ${mode}: successful request leaves no abort listener on caller signal`, async () => {
    const controller = new AbortController();
    const c = testClient(mode, () => response({ data: [] }));
    if (mode === 'forward') await c.templates.list({}, { signal: controller.signal });
    else await c.agents.list({}, { signal: controller.signal });
    assert.equal(getEventListeners(controller.signal, 'abort').length, 0);
  });
}

// (2b) query encoding is transport-shared; assert scalar + undefined omission once per
//      mode using each mode's documented list params.
test('[shared] managed: query encodes scalars (0/false) and omits undefined', async () => {
  let q;
  const c = testClient('managed', req => { q = new URL(req.url).searchParams; return response({ data: [], next_page: null }); });
  await c.sessions.list({ agent_version: 0, include_archived: false, order: undefined, workspace_id: 'workspace' });
  assert.equal(q.get('agent_version'), '0');
  assert.equal(q.get('include_archived'), 'false');
  assert.equal(q.has('order'), false);
});
test('[shared] forward: query forwards documented scalars and omits undefined', async () => {
  let q;
  const c = testClient('forward', req => { q = new URL(req.url).searchParams; return response({ data: [], has_more: false }); });
  await c.templates.list({ limit: 1, status: 'active', before_id: undefined });
  assert.equal(q.get('limit'), '1');
  assert.equal(q.get('status'), 'active');
  assert.equal(q.has('before_id'), false);
});

// (6) SSE framing (transport-agnostic decoder): BOM/comment skipped, split CRLF,
//     multiline data joined, retry parsed, UTF-8 across 1-byte chunks, empty id.
test('[shared] SSE framing: multiline data, CRLF split, retry and UTF-8 across chunks', async () => {
  const input = '\ufeff:heartbeat\r\nid: first\r\nevent: delta\r\nretry: 1200\r\ndata: {\r\ndata: "text":"\u4f60\u597d\ud83c\udf0d"}\r\n\r\nid:\ndata: {}\n\n';
  const events = [];
  for await (const event of decodeSSE(byteChunks(input))) events.push(event);
  assert.deepEqual(events.map(e => ({ id: e.id, event: e.event, data: e.data, retry: e.retry ?? 0 })), [
    { id: 'first', event: 'delta', data: '{\n"text":"\u4f60\u597d\ud83c\udf0d"}', retry: 1200 },
    { id: '', event: 'message', data: '{}', retry: 0 },
  ]);
});

// (7) upload conversion: bytes / Blob / async-iterable -> File with name, type and content.
test('[shared] toFile converts bytes, Blob and async-iterable preserving name/type/content', async () => {
  const fromBytes = await sdk.toFile(new Uint8Array([104, 105]), 'a.txt', { type: 'text/plain' });
  assert.equal(fromBytes.name, 'a.txt');
  assert.equal(fromBytes.type, 'text/plain');
  assert.equal(await fromBytes.text(), 'hi');
  const fromBlob = await sdk.toFile(new Blob(['blob']), 'b.txt');
  assert.equal(fromBlob.name, 'b.txt');
  assert.equal(await fromBlob.text(), 'blob');
  async function* gen() { yield new TextEncoder().encode('str'); yield new TextEncoder().encode('eam'); }
  const fromIter = await sdk.toFile(gen(), 'c.txt', { type: 'application/octet-stream' });
  assert.equal(fromIter.name, 'c.txt');
  assert.equal(fromIter.type, 'application/octet-stream');
  assert.equal(await fromIter.text(), 'stream');
});
