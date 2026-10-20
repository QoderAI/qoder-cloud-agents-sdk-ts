import assert from 'node:assert/strict';
import test from 'node:test';
import { testClient, response } from './helpers.mjs';

// https://docs.qoder.com/cloud-agents/api/sessions/schemas, 2026-10-20.
for (const body of [{ budget: { type: 'limit', max_credit_cost: '100.00' } }, {}, { budget: null }]) {
  test(`Session budget preserves decimal/omission/null: ${JSON.stringify(body)}`, async () => {
    const client = testClient('managed', async req => {
      assert.deepEqual(await req.json(), body);
      return response({ id: 'sess_one', ...body });
    });
    const session = await client.sessions.update('sess_one', body);
    assert.deepEqual(session.budget, body.budget);
  });
}
for (const mode of ['managed', 'forward']) test(`${mode} cumulative Credits snapshot`, async () => {
  const usage = { model_credits: 7.66, sandbox_runtime_credits: 0.34, total_credits: 8 };
  const client = testClient(mode, req => response({ id: 'sess_one', ...(req.url.endsWith('sess_one') ? { usage } : {}) }));
  assert.deepEqual((await client.sessions.retrieve('sess_one')).usage, usage);
  assert.equal((await client.sessions.retrieve('sess_empty')).usage, undefined);
});
test('Managed history and SSE preserve top-level and per-call Credits', async () => {
  const events = [
    { id: 'evt_1', type: 'session.usage', model_credits: 7.66, sandbox_runtime_credits: 0.34, total_credits: 8 },
    { id: 'evt_2', type: 'agent.thread_context_compacted', usage: { credits: 0 } },
    { id: 'evt_3', type: 'span.model_request_end', model_usage: { credits: 1.25 } },
  ];
  const client = testClient('managed', req => req.url.endsWith('/stream')
    ? new Response(events.map(e => `id: ${e.id}\nevent: ${e.type}\ndata: ${JSON.stringify(e)}\n\n`).join(''), { headers: { 'content-type': 'text/event-stream' } })
    : response({ data: events, has_more: false, next_page: null }));
  assert.deepEqual((await client.sessions.events.list('sess_one')).data, events);
  for (const stream of [await client.sessions.events.streamEvents('sess_one'), await client.sessions.threads.events.streamEvents('thread_one', { session_id: 'sess_one' })]) {
    const actual = []; for await (const e of stream) actual.push(e);
    assert.deepEqual(actual, events);
  }
});
