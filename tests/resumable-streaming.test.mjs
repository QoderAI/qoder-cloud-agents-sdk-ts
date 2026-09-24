import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { test } from 'node:test';
import { sdk, testClient, response } from './helpers.mjs';
import {
  isResumableStreamRetryable,
  resumableStreamRetryDelay,
} from '../dist/core/resumable-session-event-stream.js';

const encoder = new TextEncoder();
const frame = (cursor, event) => `id: ${cursor}\nevent: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`;
const openBody = text => new ReadableStream({ start(controller) { controller.enqueue(encoder.encode(text)); } });

async function advanceRetry(t) {
  await new Promise(resolve => setImmediate(resolve));
  t.mock.timers.tick(500);
}

async function closeServer(server, sockets) {
  const closed = new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  for (const socket of sockets) socket.destroy();
  await closed;
}

for (const mode of ['forward', 'managed']) {
  test(`${mode}: public resumable stream reconnects after a truncated real HTTP response`, async () => {
    const requests = [];
    const sockets = new Set();
    const events = [
      { id: 'evt-1', type: 'session.status_running' },
      { id: 'evt-2', type: 'session.deleted' },
    ];
    const firstFrame = frame('evt-1', events[0]);
    const server = createServer((req, res) => {
      requests.push({ lastEventID: req.headers['last-event-id'] });
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        Connection: 'close',
        ...(requests.length === 1 ? { 'Content-Length': Buffer.byteLength(firstFrame) + 128 } : {}),
      });
      if (requests.length === 1) {
        res.write(firstFrame, () => res.end());
        return;
      }
      res.end(frame('evt-2', events[1]));
    });
    server.on('connection', socket => {
      sockets.add(socket);
      socket.on('close', () => sockets.delete(socket));
    });

    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', () => {
        server.off('error', reject);
        resolve();
      });
    });

    try {
      const address = server.address();
      assert(address && typeof address === 'object');
      const Client = mode === 'forward' ? sdk.ForwardClient : sdk.ManagedClient;
      const client = new Client({
        pat: 'secret-pat',
        baseURL: `http://127.0.0.1:${address.port}`,
        maxRetries: 0,
        timeout: 5_000,
      });
      const stream = client.sessions.events.resumableStream('sess-one');
      const received = [];
      for await (const event of stream) received.push(event);

      assert.equal(requests.length, 2);
      assert.equal(requests[1].lastEventID, 'evt-1');
      assert.deepEqual(received, events);
      assert.deepEqual(received.map(event => event.id), ['evt-1', 'evt-2']);
      assert.equal(new Set(received.map(event => event.id)).size, 2);
      assert.equal(stream.lastEventID, 'evt-2');
    } finally {
      await closeServer(server, sockets);
    }
  });
}

for (const mode of ['forward', 'managed']) {
  test(`${mode}: resumable stream advances the cursor and preserves stream params and RequestOptions`, async t => {
    t.mock.timers.enable({ apis: ['setTimeout'] });
    const requests = [];
    const events = [
      { id: 'payload-one', type: 'event_delta', delta: { text: 'one' } },
      { id: 'payload-two', type: 'event_delta', delta: { text: 'two' } },
    ];
    const client = testClient(mode, req => {
      requests.push(req);
      const body = requests.length === 1
        ? frame('cursor-one', events[0])
        : openBody(frame('cursor-two', events[1]));
      return new Response(body, { headers: { 'content-type': 'text/event-stream' } });
    }, { defaultHeaders: { 'x-removed-option': 'default' } });
    const params = mode === 'forward'
      ? { 'event_deltas[]': ['agent.message', 'agent.thinking'], include_tool_calls: true, include_thinking: false, last_event_id: 'cursor-zero' }
      : { event_deltas: ['agent.message', 'agent.thinking'], workspace_id: 'workspace-one', betas: ['beta-one'], last_event_id: 'cursor-zero' };
    const stream = client.sessions.events.resumableStream('sess-one', params, {
      headers: { 'x-request-option': 'preserved', 'x-removed-option': null },
      timeout: 4321,
      maxRetries: 0,
    });
    const iterator = stream[Symbol.asyncIterator]();

    assert.deepEqual((await iterator.next()).value, events[0]);
    assert.equal(stream.lastEventID, 'cursor-one');
    const resumed = iterator.next();
    await advanceRetry(t);
    assert.deepEqual((await resumed).value, events[1]);
    assert.equal(stream.lastEventID, 'cursor-two');

    assert.equal(requests.length, 2);
    assert.deepEqual(requests.map(req => req.headers.get('last-event-id')), ['cursor-zero', 'cursor-one']);
    for (const req of requests) {
      const url = new URL(req.url);
      assert.deepEqual(url.searchParams.getAll('event_deltas[]'), ['agent.message', 'agent.thinking']);
      assert.equal(req.headers.get('x-request-option'), 'preserved');
      assert.equal(req.headers.get('x-removed-option'), null);
      assert.equal(req.headers.get('x-qoder-timeout'), '4');
      if (mode === 'forward') {
        assert.equal(url.searchParams.get('include_tool_calls'), 'true');
        assert.equal(url.searchParams.get('include_thinking'), 'false');
      } else {
        assert.equal(req.headers.get('qoder-workspace-id'), 'workspace-one');
        assert.equal(req.headers.get('x-qoder-beta'), 'beta-one');
      }
    }
    await stream.close();
    assert.equal((await iterator.next()).done, true);
  });
}

for (const mode of ['forward', 'managed']) {
  test(`${mode}: initial cursor exactly matches direct header precedence`, async () => {
    const cases = [
      { defaultHeaders: undefined, params: {}, options: {}, expected: undefined },
      { defaultHeaders: { 'Last-Event-ID': 'cursor-default' }, params: {}, options: {}, expected: 'cursor-default' },
      { defaultHeaders: { 'Last-Event-ID': '' }, params: {}, options: {}, expected: '' },
      { defaultHeaders: { 'Last-Event-ID': 'cursor-default' }, params: { last_event_id: null }, options: {}, expected: 'cursor-default' },
      { defaultHeaders: { 'Last-Event-ID': 'cursor-default' }, params: { last_event_id: '' }, options: {}, expected: '' },
      { defaultHeaders: { 'Last-Event-ID': 'cursor-default' }, params: { last_event_id: 'cursor-param' }, options: {}, expected: 'cursor-param' },
      { defaultHeaders: { 'Last-Event-ID': 'cursor-default' }, params: { last_event_id: 'cursor-param' }, options: { headers: { 'last-event-id': '' } }, expected: '' },
      { defaultHeaders: { 'Last-Event-ID': 'cursor-default' }, params: { last_event_id: 'cursor-param' }, options: { headers: { 'last-event-id': 'cursor-request' } }, expected: 'cursor-request' },
      { defaultHeaders: { 'Last-Event-ID': 'cursor-default' }, params: { last_event_id: 'cursor-param' }, options: { headers: { 'Last-Event-ID': null } }, expected: undefined },
    ];
    for (const item of cases) {
      const directRequests = [];
      const directClient = testClient(mode, req => {
        directRequests.push(req);
        return new Response('data: [DONE]\n\n');
      }, { defaultHeaders: item.defaultHeaders });
      const directStream = await directClient.sessions.events.streamEvents('sess-one', item.params, item.options);
      assert.equal((await directStream[Symbol.asyncIterator]().next()).done, true);

      const resumableRequests = [];
      const resumableClient = testClient(mode, req => {
        resumableRequests.push(req);
        return new Response('data: [DONE]\n\n');
      }, { defaultHeaders: item.defaultHeaders });
      const stream = resumableClient.sessions.events.resumableStream('sess-one', item.params, item.options);
      assert.equal(stream.lastEventID, item.expected);
      assert.equal((await stream[Symbol.asyncIterator]().next()).done, true);

      assert.equal(directRequests.length, 1);
      assert.equal(resumableRequests.length, 1);
      assert.equal(resumableRequests[0].headers.has('last-event-id'), directRequests[0].headers.has('last-event-id'));
      assert.equal(resumableRequests[0].headers.get('last-event-id'), directRequests[0].headers.get('last-event-id'));
      assert.equal(resumableRequests[0].headers.has('last-event-id'), item.expected !== undefined);
      assert.equal(resumableRequests[0].headers.get('last-event-id'), item.expected ?? null);
    }
  });
}

test('post-checkpoint retry overrides configured cursors with the latest complete cursor', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const cursors = [];
  const client = testClient('forward', req => {
    cursors.push(req.headers.get('last-event-id'));
    return new Response(cursors.length === 1
      ? frame('cursor-latest', { id: 'one', type: 'event_delta' })
      : 'data: [DONE]\n\n');
  }, { defaultHeaders: { 'Last-Event-ID': 'cursor-default' } });
  const stream = client.sessions.events.resumableStream(
    'sess-one',
    { last_event_id: 'cursor-param' },
    { headers: { 'Last-Event-ID': 'cursor-request' } },
  );
  const iterator = stream[Symbol.asyncIterator]();
  assert.equal((await iterator.next()).value.id, 'one');
  const done = iterator.next();
  await advanceRetry(t);
  assert.equal((await done).done, true);
  assert.deepEqual(cursors, ['cursor-request', 'cursor-latest']);
});

test('post-checkpoint empty cursor remains present and overrides configured cursors', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const cursors = [];
  const client = testClient('forward', req => {
    cursors.push({ has: req.headers.has('last-event-id'), value: req.headers.get('last-event-id') });
    return new Response(cursors.length === 1
      ? frame('', { id: 'one', type: 'event_delta' })
      : 'data: [DONE]\n\n');
  }, { defaultHeaders: { 'Last-Event-ID': 'cursor-default' } });
  const stream = client.sessions.events.resumableStream(
    'sess-one',
    { last_event_id: 'cursor-param' },
    { headers: { 'Last-Event-ID': 'cursor-request' } },
  );
  const iterator = stream[Symbol.asyncIterator]();
  assert.equal((await iterator.next()).value.id, 'one');
  assert.equal(stream.lastEventID, '');
  const done = iterator.next();
  await advanceRetry(t);
  assert.equal((await done).done, true);
  assert.deepEqual(cursors, [
    { has: true, value: 'cursor-request' },
    { has: true, value: '' },
  ]);
});

test('ID-less events retain the previous cursor across reconnects', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const cursors = [];
  const client = testClient('forward', req => {
    cursors.push(req.headers.get('last-event-id'));
    return new Response(cursors.length === 1
      ? 'event: event_delta\ndata: {"id":"one","type":"event_delta"}\n\n'
      : 'data: [DONE]\n\n');
  });
  const stream = client.sessions.events.resumableStream('sess-one', { last_event_id: 'cursor-initial' });
  const iterator = stream[Symbol.asyncIterator]();
  assert.equal((await iterator.next()).value.id, 'one');
  assert.equal(stream.lastEventID, 'cursor-initial');
  const done = iterator.next();
  await advanceRetry(t);
  assert.equal((await done).done, true);
  assert.deepEqual(cursors, ['cursor-initial', 'cursor-initial']);
});

test('cursor-bearing control frames advance the cursor before reconnecting', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const cursors = [];
  const client = testClient('forward', req => {
    cursors.push(req.headers.get('last-event-id'));
    if (cursors.length > 1) return new Response('data: [DONE]\n\n');
    let pulled = false;
    return new Response(new ReadableStream({
      pull(controller) {
        if (!pulled) {
          pulled = true;
          controller.enqueue(encoder.encode('id: cursor-control\n\n'));
        } else controller.error(new Error('connection interrupted'));
      },
    }));
  });
  const stream = client.sessions.events.resumableStream('sess-one', { last_event_id: 'cursor-initial' });
  const done = stream[Symbol.asyncIterator]().next();
  await advanceRetry(t);
  assert.equal((await done).done, true);
  assert.equal(stream.lastEventID, 'cursor-control');
  assert.deepEqual(cursors, ['cursor-initial', 'cursor-control']);
});

test('resumable stream keeps repeated-ID deltas', async () => {
  const events = [
    { id: 'evt-one', type: 'event_delta', delta: { text: 'a' } },
    { id: 'evt-one', type: 'event_delta', delta: { text: 'b' } },
  ];
  const client = testClient('forward', () => new Response(openBody(events.map(event => frame('evt-one', event)).join(''))));
  const stream = client.sessions.events.resumableStream('sess-one');
  const iterator = stream[Symbol.asyncIterator]();
  assert.deepEqual((await iterator.next()).value, events[0]);
  assert.deepEqual((await iterator.next()).value, events[1]);
  assert.equal(stream.lastEventID, 'evt-one');
  await stream.close();
});

for (const mode of ['forward', 'managed']) {
  test(`${mode}: an event after session.status_idle is delivered`, async () => {
    let calls = 0;
    const idle = { id: 'idle', type: 'session.status_idle' };
    const afterIdle = { id: 'after-idle', type: 'agent.message' };
    const deleted = { id: 'deleted', type: 'session.deleted' };
    const client = testClient(mode, () => {
      calls++;
      return new Response([
        frame('idle-cursor', idle),
        frame('after-idle-cursor', afterIdle),
        frame('deleted-cursor', deleted),
      ].join(''));
    });
    const stream = client.sessions.events.resumableStream('sess-one');
    const iterator = stream[Symbol.asyncIterator]();
    assert.deepEqual((await iterator.next()).value, idle);
    assert.deepEqual((await iterator.next()).value, afterIdle);
    assert.deepEqual((await iterator.next()).value, deleted);
    assert.equal((await iterator.next()).done, true);
    assert.equal(stream.lastEventID, 'deleted-cursor');
    assert.equal(calls, 1);
  });

  for (const type of ['session.status_terminated', 'session.deleted']) {
    test(`${mode}: ${type} ends a resumable stream without reconnecting`, async () => {
      let calls = 0;
      const event = { id: 'terminal', type };
      const client = testClient(mode, () => {
        calls++;
        return new Response(frame('terminal-cursor', event));
      });
      const stream = client.sessions.events.resumableStream('sess-one');
      const iterator = stream[Symbol.asyncIterator]();
      assert.deepEqual((await iterator.next()).value, event);
      assert.equal((await iterator.next()).done, true);
      assert.equal(stream.lastEventID, 'terminal-cursor');
      assert.equal(calls, 1);
    });
  }
}

test('explicit SSE completion ends a resumable stream without reconnecting', async () => {
  let calls = 0;
  const client = testClient('forward', () => {
    calls++;
    return new Response('data: [DONE]\n\n');
  });
  const stream = client.sessions.events.resumableStream('sess-one');
  assert.equal((await stream[Symbol.asyncIterator]().next()).done, true);
  assert.equal(calls, 1);
});

test('partial frame does not advance the cursor and transport failure resumes from the last complete frame', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const cursors = [];
  let calls = 0;
  const client = testClient('forward', req => {
    cursors.push(req.headers.get('last-event-id'));
    calls++;
    if (calls === 1) {
      let pulled = false;
      return new Response(new ReadableStream({
        pull(controller) {
          if (!pulled) {
            pulled = true;
            controller.enqueue(encoder.encode(`${frame('cursor-complete', { id: 'one', type: 'event_delta' })}id: cursor-partial\ndata: {"id":"partial"`));
          } else controller.error(new Error('connection interrupted'));
        },
      }));
    }
    return new Response(openBody(frame('cursor-recovered', { id: 'two', type: 'agent.message' })));
  });
  const stream = client.sessions.events.resumableStream('sess-one', { last_event_id: 'cursor-initial' });
  const iterator = stream[Symbol.asyncIterator]();
  assert.equal((await iterator.next()).value.id, 'one');
  assert.equal(stream.lastEventID, 'cursor-complete');
  const recovered = iterator.next();
  await advanceRetry(t);
  assert.equal((await recovered).value.id, 'two');
  assert.deepEqual(cursors, ['cursor-initial', 'cursor-complete']);
  await stream.close();
});

test('unexpected clean EOF reconnects', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let calls = 0;
  const client = testClient('managed', () => {
    calls++;
    return new Response(calls === 1 ? '' : openBody(frame('after-eof', { id: 'after-eof', type: 'session.status_idle' })));
  });
  const stream = client.sessions.events.resumableStream('sess-one');
  const next = stream[Symbol.asyncIterator]().next();
  await advanceRetry(t);
  assert.equal((await next).value.id, 'after-eof');
  assert.equal(calls, 2);
  await stream.close();
});

test('incomplete frame at clean EOF reconnects from the last complete cursor', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const cursors = [];
  const client = testClient('forward', req => {
    cursors.push(req.headers.get('last-event-id'));
    if (cursors.length === 1) {
      return new Response(`${frame('cursor-complete', { id: 'one', type: 'event_delta' })}id: cursor-partial\ndata: {"id":"partial"}`);
    }
    return new Response(frame('cursor-final', { id: 'two', type: 'session.status_terminated' }));
  });
  const stream = client.sessions.events.resumableStream('sess-one', { last_event_id: 'cursor-initial' });
  const iterator = stream[Symbol.asyncIterator]();
  assert.equal((await iterator.next()).value.id, 'one');
  const recovered = iterator.next();
  await advanceRetry(t);
  assert.equal((await recovered).value.id, 'two');
  assert.deepEqual(cursors, ['cursor-initial', 'cursor-complete']);
  assert.equal((await iterator.next()).done, true);
});

test('complete malformed JSON is fatal and does not reconnect', async () => {
  let calls = 0;
  const client = testClient('managed', () => {
    calls++;
    return new Response('id: malformed\ndata: {broken\n\n');
  });
  const stream = client.sessions.events.resumableStream('sess-one');
  await assert.rejects(() => stream[Symbol.asyncIterator]().next(), SyntaxError);
  assert.equal(calls, 1);
});

test('low-level Stream remains one-shot and discards an incomplete EOF frame', async () => {
  const stream = sdk.Stream.fromSSEResponse(new Response(
    `${frame('cursor-complete', { id: 'one', type: 'event_delta' })}id: cursor-partial\ndata: {"id":"partial"}`,
  ));
  const iterator = stream[Symbol.asyncIterator]();
  assert.equal((await iterator.next()).value.id, 'one');
  assert.equal((await iterator.next()).done, true);
  assert.equal(stream.lastEventID, 'cursor-complete');
});

for (const ErrorClass of [sdk.APIConnectionError, sdk.APIConnectionTimeoutError]) test(`${ErrorClass.name} reconnects with the existing cursor`, async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const cursors = [];
  const stream = new sdk.ResumableSessionEventStream(async cursor => {
    cursors.push(cursor);
    if (cursors.length === 1) throw new ErrorClass('connection failed');
    return sdk.Stream.fromSSEResponse(new Response(openBody(frame('after-timeout', { id: 'after-timeout' }))));
  }, 'cursor-before-timeout');
  const next = stream[Symbol.asyncIterator]().next();
  await advanceRetry(t);
  assert.equal((await next).value.id, 'after-timeout');
  assert.deepEqual(cursors, ['cursor-before-timeout', 'cursor-before-timeout']);
  await stream.close();
});

test('resumable retry classification matches the QCA transport policy', () => {
  const apiError = (status, headers = {}) => sdk.APIError.generate(status, {}, undefined, new Headers(headers));
  for (const status of [408, 429, 500, 503]) assert.equal(isResumableStreamRetryable(apiError(status)), true, String(status));
  for (const status of [400, 401, 403, 404, 409, 422]) assert.equal(isResumableStreamRetryable(apiError(status)), false, String(status));
  assert.equal(isResumableStreamRetryable(apiError(400, { 'x-should-retry': 'true' })), true);
  assert.equal(isResumableStreamRetryable(apiError(503, { 'x-should-retry': 'false' })), false);
  assert.equal(isResumableStreamRetryable(apiError(409, { 'x-should-retry': 'true' })), false);
  assert.equal(isResumableStreamRetryable(new sdk.APIConnectionError('transport')), true);
  assert.equal(isResumableStreamRetryable(new sdk.APIConnectionTimeoutError('timeout')), true);
  assert.equal(isResumableStreamRetryable(new sdk.APIUserAbortError('abort')), false);
  assert.equal(isResumableStreamRetryable(new sdk.APIError(undefined, undefined, 'no response')), false);
  assert.equal(resumableStreamRetryDelay(0, () => 0), 250);
  assert.equal(resumableStreamRetryDelay(20, () => 1), 10_000);
});

test('409 stops without reconnecting', async () => {
  let calls = 0;
  const client = testClient('forward', () => { calls++; return response({ error: { message: 'conflict' } }, 409); });
  const stream = client.sessions.events.resumableStream('sess-one');
  await assert.rejects(() => stream[Symbol.asyncIterator]().next(), error => error instanceof sdk.ConflictError);
  assert.equal(calls, 1);
});

test('caller abort interrupts retry backoff', async () => {
  const caller = new AbortController();
  let calls = 0;
  const client = testClient('forward', () => { calls++; return new Response(''); });
  const stream = client.sessions.events.resumableStream('sess-one', {}, { signal: caller.signal });
  const pending = stream[Symbol.asyncIterator]().next();
  await new Promise(resolve => setImmediate(resolve));
  caller.abort('stop');
  await assert.rejects(() => pending, error => error instanceof sdk.APIUserAbortError);
  assert.equal(calls, 1);
});

test('close aborts the active child stream and is idempotent', async () => {
  let requestSignal;
  const client = testClient('managed', req => {
    requestSignal = req.signal;
    return new Response(openBody(frame('cursor-one', { id: 'one', type: 'session.status_running' })));
  });
  const stream = client.sessions.events.resumableStream('sess-one');
  const iterator = stream[Symbol.asyncIterator]();
  assert.equal((await iterator.next()).value.id, 'one');
  await stream.close();
  await stream.close();
  assert.equal(requestSignal.aborted, true);
  assert.equal((await iterator.next()).done, true);
});
