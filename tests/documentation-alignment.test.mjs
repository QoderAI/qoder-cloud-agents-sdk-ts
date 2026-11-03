import assert from 'node:assert/strict';
import test from 'node:test';
import { testClient, response } from './helpers.mjs';

// Official Forward Session and Managed Memory/Environment/Vault schemas, 2026-11-03.
for (const body of [
  {},
  { budget: null, config: { model: null } },
  { budget: { type: 'limit', max_credit_cost: '100.00' }, config: { model: 'ultimate' } },
  { config: { model: { id: 'ultimate', speed: 'high', effort: 'none', context_window: 200000 } } },
]) test(`Forward budget/model update: ${JSON.stringify(body)}`, async () => {
  const client = testClient('forward', async req => {
    assert.deepEqual(await req.json(), body);
    return response({ id: 's', ...body });
  });
  const session = await client.sessions.update('s', body);
  assert.equal(Object.hasOwn(session, 'budget'), Object.hasOwn(body, 'budget'));
  assert.deepEqual(session.budget, body.budget);
  assert.deepEqual(session.config, body.config);
});

for (const budget of [undefined, null, { type: 'limit', max_credit_cost: '100.00' }]) {
  test(`Forward create budget and metadata: ${JSON.stringify(budget)}`, async () => {
    const metadata = { business: 'kept' };
    const config = { model: { id: 'ultimate', speed: 'high' } };
    const client = testClient('forward', async req => {
      const body = await req.json();
      assert.deepEqual(body.budget, budget);
      assert.deepEqual(body.config, config);
      assert.equal(body.metadata.business, 'kept');
      assert.equal(body.metadata.__qca_sdk_created, 'true');
      return response(body);
    });
    await client.sessions.create({ identity_id: 'idn', template_id: 'tmpl', budget, config, metadata });
    assert.deepEqual(metadata, { business: 'kept' });
  });
}

test('Forward history and both SSE routes retain approval, cumulative usage and budget states', async () => {
  const events = [
    ...[['allow', 'always_allow'], ['ask', 'always_ask'], ['allow', 'auto'], ['ask', 'auto', 'indeterminate'], ['deny', 'auto', 'high_risk']].map(([decision, policy, reason], i) => ({
      id: `approval-${i}`, type: 'agent.tool_use', evaluated_permission: decision,
      evaluation: { type: policy, ...(policy === 'auto' ? { evaluated_permission: { type: decision, ...(reason ? { reason_code: reason } : {}) } } : {}) },
    })),
    { id: 'zero', type: 'session.usage', model_credits: 0, sandbox_runtime_credits: 0, total_credits: 0 },
    { id: 'usage', type: 'session.usage', model_credits: 0.68, sandbox_runtime_credits: 0.04, total_credits: 0.72 },
    { id: 'idle', type: 'session.status_idle', reason: 'outcome_evaluation' },
    { id: 'end', type: 'span.outcome_evaluation_end', iteration: 2, explanation: 'done', outcome_evaluation_start_id: 'start' },
    { id: 'clear', type: 'session.updated', budget: null },
    { id: 'set', type: 'session.updated', budget: { type: 'limit', max_credit_cost: '0.01' } },
  ];
  const client = testClient('forward', req => req.url.endsWith('/stream')
    ? new Response(events.map(e => `id: ${e.id}\ndata: ${JSON.stringify(e)}\n\n`).join(''), { headers: { 'content-type': 'text/event-stream' } })
    : response({ data: events, has_more: false }));
  assert.deepEqual((await client.sessions.events.list('s')).data, events);
  for (const stream of [await client.sessions.events.streamEvents('s'), await client.sessions.threads.events.streamEvents('s', 't')]) {
    const actual = []; for await (const event of stream) actual.push(event);
    assert.deepEqual(actual, events);
  }
});

for (const mode of ['forward', 'managed']) test(`${mode} startup script reaches create/update and response`, async () => {
  const config = { type: 'cloud', startup_script: '#!/bin/sh\necho ready\n' };
  const client = testClient(mode, async req => {
    const body = await req.json();
    assert.deepEqual(body.config, config);
    return response({ id: 'env', config });
  });
  assert.deepEqual((await client.environments.create({ name: 'test', config })).config, config);
  assert.deepEqual((await client.environments.update('env', { config })).config, config);
});
