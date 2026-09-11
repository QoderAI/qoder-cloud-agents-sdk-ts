// Server-sent event stream decoding and the streaming wire protocol.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { sdk, testClient, response } from './helpers.mjs';
import { decodeSSE } from '../dist/core/streaming.js';

function chunks(text, size = 1) {
  const bytes = new TextEncoder().encode(text);
  let offset = 0;
  return new ReadableStream({ pull(controller) {
    if (offset >= bytes.length) return controller.close();
    controller.enqueue(bytes.slice(offset, offset += size));
  } });
}

test('SSE framing: BOM, split CRLF, multiline data, retry, null and empty IDs', async () => {
  const input = '\ufeff:heartbeat\r\nid: first\r\nevent: delta\r\nretry: 1200\r\ndata: {\r\ndata: "text":"hello"}\r\n\r\nid: bad\x00id\ndata: {}\n\nid:\ndata: {}\n\n';
  const events = [];
  for await (const event of decodeSSE(chunks(input))) events.push(event);
  assert.deepEqual(events.map(e => ({ id: e.id, event: e.event, data: e.data, retry: e.retry ?? 0 })), [
    { id: 'first', event: 'delta', data: '{\n"text":"hello"}', retry: 1200 },
    { id: 'first', event: 'message', data: '{}', retry: 0 },
    { id: '', event: 'message', data: '{}', retry: 0 },
  ]);
});
for (const mode of ['forward', 'managed']) test(`${mode}: SSE preserves deltas, repeated IDs, unknown events and resume header`, async () => {
  const events = [
    { id: 'evt_one', type: 'event_start', event: { id: 'evt_one', type: 'agent.message' } },
    { id: 'evt_one', type: 'event_delta', event_id: 'evt_one', delta: { type: 'content_delta', content: { type: 'text', text: '你好🌍' } } },
    { id: 'evt_two', type: 'future.event', new_field: { value: 1 } },
  ];
  const wire = events.map(e => `id: ${e.id}\nevent: ${e.type}\ndata: ${JSON.stringify(e)}\n\n`).join('');
  const c = testClient(mode, req => {
    assert.deepEqual(new URL(req.url).searchParams.getAll('event_deltas[]'), ['agent.message','agent.thinking']);
    assert.equal(req.headers.get('last-event-id'), 'evt_previous');
    return new Response(chunks(wire), { headers: { 'content-type': 'text/event-stream' } });
  });
  const stream = await c.sessions.events.streamEvents('sess_one', mode === 'forward' ? { 'event_deltas[]': ['agent.message','agent.thinking'], last_event_id: 'evt_previous' } : { 'event_deltas[]': ['agent.message','agent.thinking'] }, { headers: { 'last-event-id': 'evt_previous' } });
  const actual = []; for await (const event of stream) actual.push(event);
  assert.deepEqual(actual, events); assert.equal(stream.lastEventID, 'evt_two');
});
for (const terminal of ['data: [DONE]\n\n', 'data: {broken\n\n', 'event: error\ndata: {"request_id":"req","error":{"type":"api_error","message":"failed"}}\n\n']) test(`SSE terminal never resumes: ${terminal.trim()}`, async () => {
  let canceled = 0;
  const body = new ReadableStream({ start(controller) {
    controller.enqueue(new TextEncoder().encode('event: ping\ndata: {}\n\nid: one\ndata: {"text":"hello"}\n\n' + terminal + 'data: {"text":"must not resume"}\n\n'));
  }, cancel() { canceled++; } });
  const stream = sdk.Stream.fromSSEResponse(new Response(body));
  const iterator = stream[Symbol.asyncIterator]();
  assert.deepEqual((await iterator.next()).value, { text: 'hello' });
  assert.equal(stream.lastEventID, 'one');
  if (terminal.includes('[DONE]')) assert.equal((await iterator.next()).done, true);
  else await assert.rejects(() => iterator.next(), terminal.includes('event: error') ? e => e instanceof sdk.APIError && e.request_id === 'req' : SyntaxError);
  assert.equal((await iterator.next()).done, true);
  await stream.close(); await stream.close(); assert.equal(canceled, 1);
});
test('SSE read failure preserves original cause', async () => {
  const cause = Error('connection interrupted');
  const stream = sdk.Stream.fromSSEResponse(new Response(new ReadableStream({ pull(controller) { controller.error(cause); } })));
  await assert.rejects(async () => { for await (const event of stream) void event; }, e => e === cause || e.cause === cause);
});
test('SSE close is idempotent before consumption', async () => {
  let cancels = 0;
  const stream = sdk.Stream.fromSSEResponse(new Response(new ReadableStream({ cancel() { cancels++; } })));
  await stream.close(); await stream.close();
  const items = []; for await (const item of stream) items.push(item);
  assert.deepEqual(items, []); assert.equal(cancels, 1);
});
test('SSE cancellation terminates a pending read promptly', async () => {
  const controller = new AbortController();
  const c = testClient('forward', req => new Response(new ReadableStream({ start(s) {
    s.enqueue(new TextEncoder().encode('data: {"id":"evt_one","type":"agent.message"}\n\n'));
    req.signal.addEventListener('abort', () => s.error(req.signal.reason), { once: true });
  } }), { headers: { 'content-type': 'text/event-stream' } }));
  const stream = await c.sessions.events.streamEvents('sess_one', {}, { signal: controller.signal });
  const iterator = stream[Symbol.asyncIterator]();
  assert.equal((await iterator.next()).value.id, 'evt_one');
  const started = Date.now(); controller.abort();
  await assert.rejects(() => iterator.next(), /abort|cancel/i);
  assert.ok(Date.now() - started < 1000); await stream.close();
});

test('SSE request timeout remains APIConnectionTimeoutError', async () => {
  const c = testClient('forward', req => new Response(new ReadableStream({ start(controller) {
    req.signal.addEventListener('abort', () => controller.error(req.signal.reason), { once: true });
  } }), { headers: { 'content-type': 'text/event-stream' } }), { timeout: 15 });
  const stream = await c.sessions.events.streamEvents('one', {});
  await assert.rejects(async () => { for await (const event of stream) void event; }, sdk.APIConnectionTimeoutError);
});
test('SSE oversized line is rejected even when newline occurs in the same chunk', async () => {
  const stream = sdk.Stream.fromSSEResponse(new Response(`data: ${'x'.repeat(32 * 1024 * 1024 + 1)}\n\n`));
  await assert.rejects(async () => { for await (const event of stream) void event; }, /32 MiB|exceeds/i);
});
