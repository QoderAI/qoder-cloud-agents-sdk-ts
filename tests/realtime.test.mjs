import assert from 'node:assert/strict';
import { test } from 'node:test';
import http from 'node:http';
import net from 'node:net';
import { once } from 'node:events';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { WebSocketServer } from 'ws';
import * as sdk from '../dist/index.js';
import { ForwardClient } from '../dist/forward/index.js';
const fixture = JSON.parse(readFileSync(new URL('./fixtures/forward/realtime.json', import.meta.url), 'utf8'));
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function server(t, behavior, { rejectHTTP } = {}) {
  const requests = [];
  const messages = [];
  const httpServer = http.createServer((_req, response) => response.end());
  const wsServer = new WebSocketServer({ noServer: true });
  httpServer.on('upgrade', (request, socket, head) => {
    requests.push({ url: request.url, headers: request.headers });
    if (rejectHTTP) {
      socket.end(`HTTP/1.1 ${rejectHTTP.status} Failed\r\nx-request-id: req_upgrade_error\r\n${rejectHTTP.location ? `Location: ${rejectHTTP.location}\r\n` : ''}Content-Length: ${Buffer.byteLength(rejectHTTP.body)}\r\nConnection: close\r\n\r\n${rejectHTTP.body}`);
      return;
    }
    wsServer.handleUpgrade(request, socket, head, ws => {
      let sequence = 0;
      const emit = (type, payload = {}, extra = {}) => ws.send(JSON.stringify({ version: 'voice.realtime.v1', type, event_id: `evt_${++sequence}`, sequence, conversation_id: new URL(request.url, 'http://local').searchParams.get('conversation_id'), timestamp: '2026-10-13T00:00:00.123456789Z', payload, ...extra }));
      ws.on('message', (data, binary) => messages.push({ value: JSON.parse(data.toString()), binary }));
      ws.on('error', () => {});
      behavior(ws, emit, request);
    });
  });
  wsServer.on('headers', headers => headers.push('X-Request-Id: req_upgrade'));
  httpServer.listen(0, '127.0.0.1'); await once(httpServer, 'listening');
  t.after(async () => { for (const ws of wsServer.clients) ws.terminate(); await new Promise(resolve => wsServer.close(resolve)); await new Promise(resolve => httpServer.close(resolve)); });
  const baseURL = `http://127.0.0.1:${httpServer.address().port}/deployment/api/v1/forward`;
  return { client: new ForwardClient({ pat: 'secret-pat', baseURL, timeout: 1 }), requests, messages, baseURL };
}
const ready = (ws, emit) => emit('voice.ready', fixture.ready);
const connect = client => client.realtime.connect({ conversationId: 'conv_test', handshakeTimeout: 1000, readyTimeout: 1000 });
async function consumeReady(connection) { assert.equal((await connection.receive()).value.type, 'voice.ready'); }
async function stalledHandshakeServer(t) {
  const httpServer = http.createServer();
  const sockets = new Set();
  // Handshake timeouts can fire before the upgrade event reaches the server.
  httpServer.on('connection', socket => {
    sockets.add(socket);
    socket.once('close', () => sockets.delete(socket));
  });
  httpServer.on('upgrade', () => {});
  httpServer.listen(0, '127.0.0.1'); await once(httpServer, 'listening');
  let closing;
  const close = () => closing ??= new Promise((resolve, reject) => {
    httpServer.close(error => error ? reject(error) : resolve());
    for (const socket of sockets) socket.destroy();
  });
  t.after(close);
  return { httpServer, close, baseURL: `http://127.0.0.1:${httpServer.address().port}/api/v1/forward` };
}

test('HTTP create carries required stable idempotency header and preserves HTTP responses', async () => {
  let calls = 0;
  const client = new ForwardClient({ pat: 'pat', maxRetries: 1, fetch: async (input, init) => {
    calls++; const request = new Request(input, init);
    assert.equal(new URL(request.url).pathname, '/api/v1/forward/realtime/conversations');
    assert.equal(request.headers.get('idempotency-key'), 'stable-operation');
    assert.equal(request.headers.get('authorization'), 'Bearer pat');
    assert.deepEqual(await request.json(), { identity_id: 'idn_xxx', template_id: 'tmpl_xxx', metadata: null });
    return new Response(JSON.stringify(calls === 1 ? { error: { code: 'unavailable' } } : fixture.conversation), { status: calls === 1 ? 503 : 201, headers: { 'retry-after-ms': '1', 'x-request-id': 'req_create' } });
  } });
  const operation = client.realtime.conversations.create({ identity_id: 'idn_xxx', template_id: 'tmpl_xxx', metadata: null, idempotency_key: 'stable-operation' });
  assert.deepEqual(JSON.parse(JSON.stringify(await operation)), fixture.conversation);
  assert.equal((await operation.withResponse()).request_id, 'req_create');
  assert.equal(calls, 2);
});
for (const key of ['', ' key', 'key ', 'a\n', '汉'.repeat(86)]) test(`create rejects invalid idempotency key ${JSON.stringify(key.slice(0, 12))}`, () => {
  const client = new ForwardClient({ pat: 'pat', fetch: () => assert.fail('invalid key reached transport') });
  assert.throws(() => client.realtime.conversations.create({ identity_id: 'idn', template_id: 'tmpl', idempotency_key: key }), /Idempotency-Key/);
});
test('create honors request header priority and does not retry 409', async () => {
  let calls = 0;
  const client = new ForwardClient({ pat: 'pat', fetch: async (_input, init) => {
    calls++; assert.equal(new Headers(init.headers).get('idempotency-key'), 'override');
    return new Response(JSON.stringify({ error: { code: 'idempotency_key_in_progress' } }), { status: 409, headers: { 'retry-after': '2', 'x-request-id': 'req_conflict' } });
  } });
  await assert.rejects(client.realtime.conversations.create({ identity_id: 'idn', template_id: 'tmpl', idempotency_key: 'original' }, { headers: { 'Idempotency-Key': 'override' } }), e => e instanceof sdk.ConflictError && e.code === 'idempotency_key_in_progress' && e.request_id === 'req_conflict' && e.headers.get('retry-after') === '2');
  assert.equal(calls, 1);
});
test('history uses independent events/before paging, preserves extensions and nanosecond strings', async () => {
  const queries = [];
  const client = new ForwardClient({ pat: 'pat', fetch: async input => {
    const url = new URL(input); queries.push(url.searchParams);
    assert.equal(url.pathname, '/api/v1/forward/realtime/conversations/conv%20%2F%3F/history');
    const first = !url.searchParams.has('before');
    return new Response(JSON.stringify({ ...fixture.history, events: first ? fixture.history.events : [], page: { has_more: first, next_before: first ? 'older-cursor' : null }, extension: { future: true } }), { headers: { 'x-request-id': 'req_history' } });
  } });
  const first = await client.realtime.conversations.history('conv /?', { limit: 5, types: 'message,work' });
  assert.equal(first.hasNextPage(), true); assert.equal(first.extension.future, true); assert.equal(first._request_id, 'req_history');
  assert.equal(JSON.stringify(first).includes('"client"'), false);
  const events = []; for await (const event of first) events.push(event);
  assert.deepEqual(events, fixture.history.events);
  assert.equal(queries[1].get('before'), 'older-cursor'); assert.equal(queries[1].get('limit'), '5'); assert.equal(queries[1].get('types'), 'message,work');
  const last = await first.getNextPage(); assert.equal(last.hasNextPage(), false); assert.throws(() => last.getNextPage(), /No next history page/);
});
for (const params of [{ limit: 0 }, { limit: 101 }, { limit: 1.1 }, { before: '' }, { types: 'messages' }]) test(`history validates ${JSON.stringify(params)}`, () => {
  const client = new ForwardClient({ pat: 'pat', fetch: () => assert.fail('invalid history params reached transport') });
  assert.throws(() => client.realtime.conversations.history('conv', params));
});
test('history detects repeated cursor instead of looping', async () => {
  const client = new ForwardClient({ pat: 'pat', fetch: async () => new Response(JSON.stringify({ ...fixture.history, page: { has_more: true, next_before: 'repeat' } })) });
  const page = await client.realtime.conversations.history('conv');
  await assert.rejects(async () => { for await (const _event of page) { /* exhaust */ } }, /cursor did not advance/);
});
test('connect waits for validated ready, preserves pre-ready events, and ignores ordinary HTTP timeout', async t => {
  const host = await server(t, (ws, emit) => { emit('voice.state', { state: 'connecting' }); setTimeout(() => emit('voice.ready', fixture.ready), 30); });
  const connection = await connect(host.client); t.after(() => connection.close());
  assert.deepEqual(connection.ready, fixture.ready); assert.equal(connection.request_id, 'req_upgrade');
  assert.equal((await connection.receive()).value.type, 'voice.state');
  const event = (await connection.receive()).value; assert.equal(event.type, 'voice.ready'); assert.equal(event.timestamp, '2026-10-13T00:00:00.123456789Z');
  assert.equal(host.requests[0].url, '/deployment/api/v1/forward/realtime?conversation_id=conv_test');
  assert.equal(host.requests[0].headers.authorization, 'Bearer secret-pat'); assert.equal(host.requests[0].url.includes('secret'), false);
  await delay(40); await connection.ping();
});
const events = {
  'voice.state': { state: 'idle' }, 'transcript.delta': { role: 'assistant', text: '增量' }, 'transcript.final': { role: 'assistant', text: '文本' },
  'audio.delta': { audio: 'AQACAA==' }, 'audio.done': {}, 'playback.interrupt': { reason: 'user_interrupt' },
  'work.accepted': { status: 'accepted', objective: 'task' }, 'work.running': { status: 'running' },
  'work.progress': { kind: 'tool', detail: 'details', is_error: false }, 'work.milestone': { announcement_id: 'ann', milestone_type: 'progress', summary: 'summary' },
  'work.completed': { status: 'completed', result: 'result' }, 'work.failed': { status: 'failed', error: { code: 'task_failed' } },
  pong: {}, error: { code: 'work_busy', message: 'busy', retryable: true, retry_after_ms: 1000 },
  'connection.closed': { request_id: 'not_requested', outcome: 'saved' }, 'future.event': { unknown: { nested: true } },
};
test('all public server events and unknown extensions remain available without closing on work.failed', async t => {
  const host = await server(t, (ws, emit) => { ready(ws, emit); for (const [type, payload] of Object.entries(events)) emit(type, payload, { work_id: 'work_id', announcement_id: 'ann_id', extension: true }); });
  const connection = await connect(host.client); t.after(() => connection.close()); await consumeReady(connection);
  for (const [type, payload] of Object.entries(events)) {
    const event = (await connection.receive()).value;
    assert.equal(event.type, type); assert.deepEqual(event.payload, payload); assert.equal(event.work_id, 'work_id'); assert.equal(event.extension, true);
    if (type === 'audio.delta') assert.deepEqual(sdk.decodeRealtimeAudio(event), Uint8Array.from([1, 0, 2, 0]));
  }
  await connection.ping();
});
test('client helpers use JSON text frames and original playback IDs; sends stay in call order', async t => {
  const host = await server(t, ready); const connection = await connect(host.client); t.after(() => connection.close());
  await Promise.all([connection.sendText('你好'), connection.appendAudio(Uint8Array.from([1, 0, 2, 0])), connection.interrupt(), connection.playbackStarted({ work_id: 'work', announcement_id: 'ann' }), connection.playbackEnded({ work_id: 'work', announcement_id: 'ann' }), connection.playbackCancelled({ work_id: 'work', announcement_id: 'ann' }), connection.ping(), connection.sendEvent({ version: 'voice.realtime.v1', type: 'future.client', payload: { extension: true } })]);
  await delay(10);
  assert.deepEqual(host.messages.map(item => item.value.type), ['text.message', 'audio.append', 'interrupt', 'playback.started', 'playback.ended', 'playback.cancelled', 'ping', 'future.client']);
  assert.ok(host.messages.every(item => item.binary === false && item.value.version === 'voice.realtime.v1'));
  assert.deepEqual(host.messages[1].value.payload, { audio: 'AQACAA==' }); assert.deepEqual(host.messages[3].value.payload, { work_id: 'work', announcement_id: 'ann' });
});
test('UTF-8 text and final Base64 JSON sizes are enforced before sending', async t => {
  const host = await server(t, ready); const connection = await connect(host.client); t.after(() => connection.close());
  for (const text of ['', ' ', '汉'.repeat(5462)]) assert.throws(() => connection.sendText(text), /16 KiB/);
  for (const pcm of [new Uint8Array(), new Uint8Array(1), new Uint8Array(196608)]) assert.throws(() => connection.appendAudio(pcm));
  assert.throws(() => connection.sendEvent({ version: 'voice.realtime.v1', type: 'future', payload: { huge: '汉'.repeat(100000) } }), /256 KiB/);
  assert.throws(() => connection.playbackStarted({ work_id: '' }));
  await connection.sendText('汉'.repeat(5461));
});
for (const malformed of ['{broken', JSON.stringify({ version: 'bad' }), JSON.stringify({ version: 'voice.realtime.v1', type: 'voice.ready', payload: {} })]) test('malformed ready/envelope is a protocol error', async t => {
  const host = await server(t, ws => ws.send(malformed));
  await assert.rejects(connect(host.client), sdk.RealtimeProtocolError);
});
test('binary frames are rejected', async t => {
  const host = await server(t, ws => ws.send(Buffer.from('{}'))); await assert.rejects(connect(host.client), sdk.RealtimeProtocolError);
});
test('ready timeout releases socket', async t => {
  const host = await server(t, () => {});
  await assert.rejects(host.client.realtime.connect({ conversationId: 'conv_test', readyTimeout: 15 }), sdk.APIConnectionTimeoutError);
  await delay(10); assert.equal(host.requests.length, 1);
});
test('initial server error preserves code/retry instructions', async t => {
  const host = await server(t, (ws, emit) => emit('error', { code: 'provider_unavailable', message: 'unavailable', retryable: true, retry_after_ms: 2000 }));
  await assert.rejects(connect(host.client), e => e instanceof sdk.RealtimeServerError && e.code === 'provider_unavailable' && e.retry_after_ms === 2000);
});
test('abort during ready and after ready releases transport', async t => {
  const host = await server(t, () => {}); const controller = new AbortController();
  const pending = host.client.realtime.connect({ conversationId: 'conv_test', signal: controller.signal }); setTimeout(() => controller.abort(), 15);
  await assert.rejects(pending, sdk.APIUserAbortError);
  const second = await server(t, ready); const controller2 = new AbortController();
  const connection = await second.client.realtime.connect({ conversationId: 'conv_test', signal: controller2.signal }); await consumeReady(connection);
  controller2.abort(); await assert.rejects(connection.receive(), sdk.APIUserAbortError);
});
test('receive cancellation does not steal the next event and concurrent readers fail clearly', async t => {
  const host = await server(t, (ws, emit) => { ready(ws, emit); ws.on('message', () => emit('pong')); });
  const connection = await connect(host.client); t.after(() => connection.close()); await consumeReady(connection);
  const controller = new AbortController(); const reading = connection.receive({ signal: controller.signal });
  await assert.rejects(connection.receive(), /one Realtime event consumer/); controller.abort(); await assert.rejects(reading, sdk.APIUserAbortError);
  await connection.ping(); assert.equal((await connection.receive()).value.type, 'pong');
});
test('a completed receive cannot clear the next receive registered in the same message callback', async t => {
  const host = await server(t, (ws, emit) => {
    ready(ws, emit);
    ws.on('message', () => { emit('pong'); setTimeout(() => emit('voice.state', { state: 'idle' }), 10); });
  });
  const connection = await connect(host.client); t.after(() => connection.close()); await consumeReady(connection);
  const first = connection.receive({ timeout: 500 });
  let second;
  // Observe transport delivery to register the next public receive before the first promise settles.
  connection.socket.once('message', () => { second = connection.receive({ timeout: 500 }); });
  await connection.ping();
  assert.equal((await first).value.type, 'pong');
  assert.equal((await second).value.type, 'voice.state');
});
test('queue overflow and size budgets terminate instead of dropping events', { timeout: 5000 }, async t => {
  let observeClose;
  const closed = new Promise(resolve => { observeClose = resolve; });
  const host = await server(t, (ws, emit) => { ws.once('close', observeClose); ready(ws, emit); for (let i = 0; i < 5; i++) emit('pong'); });
  const connection = await host.client.realtime.connect({ conversationId: 'conv_test', maxQueuedEvents: 1 });
  await closed;
  await consumeReady(connection);
  await assert.rejects(connection.receive(), /queue capacity/);
  assert.throws(() => connection.ping(), /queue capacity/);
});
test('voice.replaced is delivered then rejects further reads and writes', async t => {
  const host = await server(t, (ws, emit) => { ready(ws, emit); ws.on('message', () => emit('voice.replaced', { reason: 'new connection' })); });
  const connection = await connect(host.client); t.after(() => connection.close()); await consumeReady(connection); await connection.ping();
  assert.equal((await connection.receive()).value.type, 'voice.replaced'); await assert.rejects(connection.receive(), /replaced/); assert.throws(() => connection.sendText('new input'), /replaced/);
});
test('graceful close requires matching request ID and valid persisted outcome; repeated call is shared', async t => {
  const host = await server(t, (ws, emit) => { ready(ws, emit); ws.on('message', data => {
    const event = JSON.parse(data); if (event.type === 'connection.close') { emit('connection.closed', { request_id: 'wrong', outcome: 'no_content' }); emit('transcript.final', { role: 'assistant', text: 'final' }); emit('connection.closed', { request_id: event.payload.request_id, outcome: 'saved_interrupted' }); ws.close(1000); }
  }); });
  const connection = await connect(host.client); await consumeReady(connection);
  const closing = connection.closeGracefully({ requestId: 'close_123' }); assert.equal(connection.closeGracefully(), closing);
  assert.deepEqual(await closing, { request_id: 'close_123', outcome: 'saved_interrupted' });
  assert.equal((await connection.receive()).value.payload.request_id, 'wrong'); assert.equal((await connection.receive()).value.type, 'transcript.final'); assert.equal((await connection.receive()).value.payload.request_id, 'close_123'); assert.equal((await connection.receive()).done, true);
  connection.close(); connection.close();
});
test('graceful close timeout cannot claim persistence', async t => {
  const host = await server(t, ready); const connection = await connect(host.client);
  await assert.rejects(connection.closeGracefully({ timeout: 15 }), sdk.APIConnectionTimeoutError);
});
test('persistence error aborts graceful close and retains the server error', async t => {
  const host = await server(t, (ws, emit) => { ready(ws, emit); ws.on('message', () => emit('error', { code: 'event_persistence_failed', message: 'save failed' })); });
  const connection = await connect(host.client); await assert.rejects(connection.closeGracefully(), e => e instanceof sdk.RealtimeServerError && e.code === 'event_persistence_failed');
});
test('abnormal remote close exposes code and reason', async t => {
  const host = await server(t, (ws, emit) => { ready(ws, emit); ws.on('message', () => ws.close(1011, 'service failed')); });
  const connection = await connect(host.client); await consumeReady(connection); await connection.ping();
  await assert.rejects(connection.receive(), e => e instanceof sdk.RealtimeConnectionClosedError && e.closeCode === 1011 && e.closeReason === 'service failed');
});
for (const response of [{ status: 401, body: '{"code":"TOKEN_INVALID","message":"invalid"}' }, { status: 503, body: 'gateway unavailable' }]) test(`HTTP ${response.status} handshake maps to APIError without retry`, async t => {
  const host = await server(t, ready, { rejectHTTP: response });
  await assert.rejects(connect(host.client), e => e instanceof sdk.APIError && e.status === response.status && e.request_id === 'req_upgrade_error' && (response.status !== 401 || e.code === 'TOKEN_INVALID'));
  assert.equal(host.requests.length, 1);
});
test('handshake redirect never forwards credential to target', async t => {
  const target = await server(t, ready);
  const host = await server(t, ready, { rejectHTTP: { status: 302, location: `${target.baseURL}/realtime`, body: '' } });
  await assert.rejects(connect(host.client), e => e instanceof sdk.APIError && e.status === 302);
  assert.equal(target.requests.length, 0);
});
test('PAT, static SAT, dynamic Credential use shared resolution and per-connection refresh', async t => {
  const host = await server(t, ready); let calls = 0;
  const client = new ForwardClient({ authMode: 'sa', credential: { getToken: async () => `sat_${++calls}` }, baseURL: host.baseURL });
  const first = await connect(client); first.close(); const second = await connect(client); second.close();
  assert.deepEqual(host.requests.map(request => request.headers.authorization), ['Bearer sat_1', 'Bearer sat_2']);
  const staticClient = new ForwardClient({ authMode: 'sa', accessToken: 'static-sat', baseURL: host.baseURL }); const third = await connect(staticClient); third.close();
  const extra = await client.realtime.connect({ conversationId: 'conv_test', headers: { Authorization: 'Bearer override' } }); extra.close();
  assert.equal(calls, 2); assert.equal(host.requests[2].headers.authorization, 'Bearer static-sat'); assert.equal(host.requests[3].headers.authorization, 'Bearer override');
});
test('Node-only check runs before auth and loading ws; existing HTTP browser import remains usable', () => {
  const execution = spawnSync(process.execPath, ['--input-type=module', '-e', `const realProcess = globalThis.process; globalThis.process = undefined; const sdk = await import('./dist/esm/index.js'); const client = new sdk.ForwardClient({ pat: 'pat', fetch: async () => new Response('{"data":[],"has_more":false}') }); await client.models.list(); try { await client.realtime.connect({conversationId:'conv'}); realProcess.exit(2); } catch (error) { if (!error.message.includes('requires Node.js')) realProcess.exit(3); }`], { cwd: new URL('..', import.meta.url), encoding: 'utf8' });
  assert.equal(execution.status, 0, execution.stderr);
});
test('Realtime exports in CJS and ESM and Forward subpath; Managed has no Realtime resource', async () => {
  const esm = await import('../dist/esm/index.js'); const forward = await import('../dist/esm/forward/index.js');
  for (const name of ['Realtime', 'RealtimeConnection', 'RealtimeConversations', 'RealtimeHistoryPage', 'decodeRealtimeAudio', 'REALTIME_VERSION']) { assert.ok(sdk[name]); assert.ok(esm[name]); assert.ok(forward[name]); }
  assert.equal('realtime' in new sdk.ManagedClient({ pat: 'pat' }), false);
});

test('ready graceful-close capability false is preserved and rejects business close', async t => {
  const host = await server(t, (ws, emit) => emit('voice.ready', { ...fixture.ready, capabilities: { graceful_close: false } }));
  const connection = await connect(host.client); t.after(() => connection.close());
  await assert.rejects(connection.closeGracefully(), /does not support/);
});
test('shared credential resolution can be canceled without disrupting another HTTP request', async t => {
  const host = await server(t, ready);
  let release; const shared = new Promise(resolve => { release = resolve; });
  const client = new ForwardClient({ credential: { getToken: () => shared }, baseURL: host.baseURL, fetch: async () => new Response('{"data":[],"has_more":false}') });
  const controller = new AbortController();
  const websocket = client.realtime.connect({ conversationId: 'conv_test', signal: controller.signal });
  const httpRequest = client.models.list();
  controller.abort(); await assert.rejects(websocket, sdk.APIUserAbortError);
  release('sat-after-refresh'); assert.deepEqual((await httpRequest).data, []);
  assert.equal(host.requests.length, 0);
});
test('handshake deadline includes slow credential resolution and does not make a late connection', async t => {
  const host = await server(t, ready);
  const client = new ForwardClient({ credential: { getToken: async () => { await delay(40); return 'late-token'; } }, baseURL: host.baseURL });
  await assert.rejects(client.realtime.connect({ conversationId: 'conv_test', handshakeTimeout: 10 }), sdk.APIConnectionTimeoutError);
  await delay(45); assert.equal(host.requests.length, 0);
});
test('socket handshake timeout is a timeout error and releases pending socket', async t => {
  const host = await stalledHandshakeServer(t);
  const client = new ForwardClient({ pat: 'pat', baseURL: host.baseURL });
  await assert.rejects(client.realtime.connect({ conversationId: 'conv', handshakeTimeout: 15 }), sdk.APIConnectionTimeoutError);
});
test('handshake test server cleanup closes TCP connections before upgrade', async t => {
  const host = await stalledHandshakeServer(t);
  let upgraded = false;
  host.httpServer.on('upgrade', () => { upgraded = true; });
  const accepted = once(host.httpServer, 'connection');
  const socket = net.connect({ host: '127.0.0.1', port: host.httpServer.address().port });
  let timer;
  try {
    await once(socket, 'connect'); await accepted;
    const closed = once(socket, 'close');
    await Promise.race([
      host.close(),
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('handshake test server cleanup stalled')), 1000); }),
    ]);
    await closed;
    assert.equal(upgraded, false);
    assert.equal(socket.destroyed, true);
  } finally {
    clearTimeout(timer);
    socket.destroy();
  }
});
test('receive frame size and byte queue budgets are bounded independently', async t => {
  const host = await server(t, (ws, emit) => { ready(ws, emit); ws.on('message', () => emit('future.large', { huge: 'x'.repeat(2000) })); });
  const connection = await host.client.realtime.connect({ conversationId: 'conv_test', maxReceiveBytes: 1024 }); await consumeReady(connection); await connection.ping();
  await assert.rejects(connection.receive(), sdk.APIConnectionError);
  const second = await server(t, ready);
  await assert.rejects(second.client.realtime.connect({ conversationId: 'conv_test', maxQueueBytes: 32 }), /queue capacity/);
});
test('duplicate connection-local sequence is rejected', async t => {
  const host = await server(t, (ws, emit) => { ready(ws, emit); ws.on('message', () => emit('pong', {}, { sequence: 1 })); });
  const connection = await connect(host.client); await consumeReady(connection); await connection.ping();
  await assert.rejects(connection.receive(), /sequence did not increase/);
});
test('bounded send queue rejects overflow before writing or dropping input', async t => {
  const host = await server(t, ready); const connection = await host.client.realtime.connect({ conversationId: 'conv_test', maxQueuedEvents: 1 }); t.after(() => connection.close()); await consumeReady(connection);
  const first = connection.sendText('first'); assert.throws(() => connection.sendText('second'), /send queue capacity/); await first;
  await delay(5); assert.deepEqual(host.messages.map(message => message.value.payload.text), ['first']);
});
test('breaking event iteration leaves the bidirectional connection open for graceful close', async t => {
  const host = await server(t, (ws, emit) => { ready(ws, emit); ws.on('message', data => {
    const event = JSON.parse(data); if (event.type === 'connection.close') emit('connection.closed', { request_id: event.payload.request_id, outcome: 'no_content' });
  }); });
  const connection = await connect(host.client); t.after(() => connection.close());
  for await (const event of connection) { assert.equal(event.type, 'voice.ready'); break; }
  await connection.ping(); assert.equal((await connection.closeGracefully()).outcome, 'no_content');
});

test('explicit CN/Global Realtime runner rejects missing inputs before resource creation', async () => {
  const { validateRealtimeEnvironment } = await import('../scripts/run-realtime-live.mjs');
  const configured = { QODER_REALTIME_LIVE_ALLOW_WRITE: 'true', QODER_REALTIME_LIVE_ALLOW_EXECUTION: 'true', QODER_REALTIME_CN_SA_TEMPLATE_ID: 'cn_tmpl', QODER_REALTIME_GLOBAL_SA_TEMPLATE_ID: 'global_tmpl', QODER_SA_CN_KEY: 'cn_key', QODER_SA_GLOBAL_KEY: 'global_key' };
  assert.doesNotThrow(() => validateRealtimeEnvironment(configured, 'sa', 'basic'));
  assert.throws(() => validateRealtimeEnvironment({ ...configured, QODER_SA_GLOBAL_KEY: '' }, 'sa', 'basic'), /GLOBAL_SAT or QODER_SA_GLOBAL_KEY/);
  assert.doesNotThrow(() => validateRealtimeEnvironment({ ...configured, QODER_SA_CN_KEY: '', QODER_SA_GLOBAL_KEY: '', QODER_REALTIME_CN_SAT: 'cn_bound_sat', QODER_REALTIME_GLOBAL_SAT: 'global_bound_sat' }, 'sa', 'basic'));
  assert.throws(() => validateRealtimeEnvironment({ ...configured, QODER_REALTIME_LIVE_ALLOW_EXECUTION: 'false' }, 'sa', 'basic'), /ALLOW_EXECUTION/);
  assert.throws(() => validateRealtimeEnvironment(configured, 'sa', 'pcm'), /PCM_FILE/);
  assert.throws(() => validateRealtimeEnvironment(configured, 'sa', 'work'), /WORK_PROMPT/);
});
test('live diagnostics locate assertions without logging values, bodies or credentials', async () => {
  const { safeRealtimeFailure, safeRealtimeEvent } = await import('./realtime/diagnostics.mjs');
  let error;
  try { assert.equal('secret-token-actual', 'secret-token-expected'); } catch (caught) { error = caught; }
  const output = safeRealtimeFailure(error, 'history.filter.work');
  assert.equal(output.includes('secret-token'), false);
  assert.deepEqual(JSON.parse(output), { phase: 'history.filter.work', error_type: 'AssertionError', code: 'ERR_ASSERTION', assertion: { operator: 'strictEqual', expected_type: 'string', actual_type: 'string' } });
  try { assert.equal(false, true); } catch (caught) { error = caught; }
  assert.equal(JSON.parse(safeRealtimeFailure(error, 'history.unique_event_id')).assertion.expected, true);
  assert.deepEqual(safeRealtimeEvent({ type: 'voice.work.completed', id: 'event_123', work_id: 'work_123', payload: { access_token: 'secret-token' } }), { event_type: 'voice.work.completed', event_id: 'event_123', work_id: 'work_123', announcement_id: undefined });
});

for (const invalid of [
  { type: 'pong', payload: {}, extra: { timestamp: 'bad' } },
  { type: 'pong', payload: {}, extra: { timestamp: '2026-02-30T00:00:00Z' } },
  { type: 'work.progress', payload: { kind: 'tool', detail: 'detail', is_error: 'false' } },
  { type: 'error', payload: { code: 'work_busy', message: 'busy', retryable: 'true' } },
  { type: 'error', payload: { code: 'work_busy', message: 'busy', retry_after_ms: 1.5 } },
  { type: 'transcript.delta', payload: { role: 'assistant', text: 'text', item_id: 123 } },
  { type: 'audio.delta', payload: { audio: '' } },
  { type: 'audio.delta', payload: { audio: 'AQ==' } },
  { type: 'work.completed', payload: { status: 'failed', result: 'text' } },
]) test(`known event rejects invalid typed field: ${JSON.stringify(invalid)}`, async t => {
  const host = await server(t, (ws, emit) => { ready(ws, emit); ws.on('message', () => emit(invalid.type, invalid.payload, invalid.extra)); });
  const connection = await connect(host.client); await consumeReady(connection); await connection.ping();
  await assert.rejects(connection.receive(), sdk.RealtimeProtocolError);
});
test('audio decode rejects empty/odd samples and SendText trims server-style whitespace', async t => {
  assert.throws(() => sdk.decodeRealtimeAudio({ type: 'audio.delta', payload: { audio: '' } }));
  assert.throws(() => sdk.decodeRealtimeAudio({ type: 'audio.delta', payload: { audio: 'AQ==' } }));
  const host = await server(t, ready); const connection = await connect(host.client); t.after(() => connection.close());
  await connection.sendText('  trim me  '); await delay(5); assert.equal(host.messages[0].value.payload.text, 'trim me');
});
