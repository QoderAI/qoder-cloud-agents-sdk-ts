import assert from 'node:assert/strict';
import { test } from 'node:test';
import { sdk, testClient } from './helpers.mjs';

const encoder = new TextEncoder();
const frame = (id, type) => `id: ${id}\nevent: ${type}\ndata: ${JSON.stringify({ id: 'payload-id', type })}\n\n`;
function subscribe(client, mode, params = {}, options = {}) {
  return mode === 'forward'
    ? client.sessions.threads.events.resumableStream('sess-one', 'thread-one', params, options)
    : client.sessions.threads.events.resumableStream('thread-one', { session_id: 'sess-one', ...params }, options);
}
async function retry(t) {
  await new Promise(resolve => setImmediate(resolve));
  t.mock.timers.tick(500);
}

for (const mode of ['forward', 'managed']) {
  for (const ending of ['eof', 'transport']) {
    test(`${mode} thread: ${ending} resumes with scoped route, cursor and options`, async t => {
      t.mock.timers.enable({ apis: ['setTimeout'] });
      const requests = [];
      const client = testClient(mode, req => {
        requests.push(req);
        if (requests.length > 1) return new Response(frame('terminal', 'session.thread_status_terminated'));
        const content = frame('checkpoint', 'session.thread_status_idle') + 'id: partial\ndata: {"id":"not-yielded"}';
        let sent = false;
        return new Response(new ReadableStream({
          pull(controller) {
            if (!sent) { sent = true; controller.enqueue(encoder.encode(content)); }
            else if (ending === 'transport') controller.error(new Error('disconnected'));
            else controller.close();
          },
        }));
      }, { defaultHeaders: { 'x-remove': 'default', 'last-event-id': 'default' } });
      const params = { last_event_id: 'initial', ...(mode === 'managed' ? { workspace_id: 'workspace', betas: ['beta-one'] } : {}) };
      const options = { headers: { 'last-event-id': 'override', 'x-test': 'kept', 'x-remove': null }, timeout: 7000, maxRetries: 0 };
      const stream = subscribe(client, mode, params, options);
      options.headers['x-test'] = 'changed';
      params.last_event_id = 'changed';
      if (params.betas) params.betas.push('changed');
      const iterator = stream[Symbol.asyncIterator]();
      assert.equal((await iterator.next()).value.type, 'session.thread_status_idle');
      const next = iterator.next();
      await retry(t);
      assert.equal((await next).value.type, 'session.thread_status_terminated');
      assert.equal((await iterator.next()).done, true);
      assert.equal(stream.lastEventID, 'terminal');
      assert.deepEqual(requests.map(req => req.headers.get('last-event-id')), ['override', 'checkpoint']);
      for (const req of requests) {
        const url = new URL(req.url);
        assert(url.pathname.endsWith('/sessions/sess-one/threads/thread-one/stream'));
        assert.equal(url.search, '');
        assert.equal(req.method, 'GET');
        assert.equal(req.headers.get('x-test'), 'kept');
        assert.equal(req.headers.get('x-remove'), null);
        assert.equal(req.headers.get('x-qoder-timeout'), '7');
        if (mode === 'managed') {
          assert.equal(req.headers.get('qoder-workspace-id'), 'workspace');
          assert.equal(req.headers.get('x-qoder-beta'), 'beta-one');
        }
      }
    });
  }

  for (const status of [400, 401, 403, 404, 409, 429, 503]) {
    test(`${mode} thread: HTTP ${status} retry policy`, async t => {
      t.mock.timers.enable({ apis: ['setTimeout'] });
      const cursors = [];
      const client = testClient(mode, req => {
        cursors.push(req.headers.get('last-event-id'));
        return cursors.length === 1
          ? new Response(JSON.stringify({ error: { message: 'test failure' } }), { status })
          : new Response(frame('terminal', 'session.thread_status_terminated'));
      }, { maxRetries: 0 });
      const stream = subscribe(client, mode, { last_event_id: 'initial' });
      const iterator = stream[Symbol.asyncIterator]();
      const next = iterator.next();
      if (status === 429 || status === 503) {
        await retry(t);
        assert.equal((await next).value.type, 'session.thread_status_terminated');
        assert.equal((await iterator.next()).done, true);
        assert.deepEqual(cursors, ['initial', 'initial']);
      } else {
        await assert.rejects(next, error => error.status === status);
        assert.deepEqual(cursors, ['initial']);
      }
    });
  }

  for (const action of ['abort', 'close']) {
    test(`${mode} thread: ${action} interrupts backoff without reconnecting`, async t => {
      t.mock.timers.enable({ apis: ['setTimeout'] });
      let calls = 0;
      const client = testClient(mode, () => { calls++; return new Response(''); });
      const controller = new AbortController();
      const stream = subscribe(client, mode, {}, { signal: controller.signal });
      const next = stream[Symbol.asyncIterator]().next();
      await new Promise(resolve => setImmediate(resolve));
      if (action === 'abort') {
        controller.abort();
        await assert.rejects(next, sdk.APIUserAbortError);
      } else {
        await stream.close();
        assert.equal((await next).done, true);
      }
      t.mock.timers.tick(10_000);
      assert.equal(calls, 1);
    });
  }

  test(`${mode}: child termination does not end a Session subscription`, async () => {
    const client = testClient(mode, () => new Response(frame('thread', 'session.thread_status_terminated') + frame('session', 'session.deleted')));
    const events = [];
    for await (const event of client.sessions.events.resumableStream('sess-one')) events.push(event.type);
    assert.deepEqual(events, ['session.thread_status_terminated', 'session.deleted']);
  });

  test(`${mode} thread: missing IDs fail before opening a connection`, () => {
    const client = testClient(mode, () => { throw new Error('unexpected HTTP request'); });
    if (mode === 'forward') {
      assert.throws(() => client.sessions.threads.events.resumableStream('', 'thread'), /session_id/);
      assert.throws(() => client.sessions.threads.events.resumableStream('session', ''), /thread_id/);
    } else {
      assert.throws(() => client.sessions.threads.events.resumableStream('thread', { session_id: '' }), /session_id/);
      assert.throws(() => client.sessions.threads.events.resumableStream('', { session_id: 'session' }), /thread_id/);
    }
  });
}
