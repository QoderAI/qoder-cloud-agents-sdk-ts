import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { testClient, response } from './helpers.mjs';

// Existing API contracts from docs.qoder.com/cloud-agents/api, 2026-10-20.
const fixture = JSON.parse(readFileSync(new URL('./fixtures/contract-alignment-0.8.json', import.meta.url)));

test('Forward limits preserve omission/null, Batch preserves false, search is a query', async () => {
  const calls = [];
  const client = testClient('forward', async req => {
    const body = req.method === 'GET' ? undefined : await req.json();
    calls.push({ req, body });
    if (req.method === 'GET') {
      assert.equal(new URL(req.url).searchParams.get('search'), 'report & 中文');
      return response({ data: [], has_more: false });
    }
    return response(body);
  });
  for (const limits of [{}, { max_tool_rounds: null }, { max_tool_rounds: 3 }]) {
    const base = { name: 'sdk-contract', model: 'model', environment_id: 'env_one' };
    await client.templates.create({ ...base, ...limits });
    assert.deepEqual(calls.at(-1).body, { ...base, ...limits });
    await client.templates.update('tmpl_one', limits);
    assert.deepEqual(calls.at(-1).body, limits);
  }
  for (const flag of [{}, { ignore_idle_window: false }, { ignore_idle_window: true }]) {
    const body = { input_file_id: 'file_one', completion_window: '24h', ...flag };
    await client.batches.create(body);
    assert.deepEqual(calls.at(-1).body, body);
  }
  await client.sessions.list({ search: 'report & 中文' });
});

test('MemoryStore create plus mount replays one operation with the same key and body', async () => {
  let count = 0;
  const client = testClient('forward', async req => {
    count++;
    assert.equal(new URL(req.url).pathname, '/api/v1/forward/memory_stores');
    assert.equal(req.headers.get('Idempotency-Key'), 'mount-one');
    assert.deepEqual(await req.json(), { name: 'sdk-contract', mount: fixture.mount });
    return response({ id: 'mem_one' });
  });
  for (let i = 0; i < 2; i++) await client.memoryStores.create({ name: 'sdk-contract', mount: fixture.mount, idempotency_key: 'mount-one' });
  assert.equal(count, 2);
});

test('Managed Session/Deployment Git resources and self-hosted setup script reach the wire', async () => {
  const calls = [];
  const client = testClient('managed', async req => {
    calls.push(await req.json());
    return response({ id: 'contract_one' });
  });
  const resources = [fixture.git, fixture.github];
  await client.sessions.create({ agent: 'agent_one', environment_id: 'env_one', resources });
  assert.deepEqual(calls.at(-1).resources, resources);
  await client.deployments.create({ agent: 'agent_one', environment_id: 'env_one', name: 'sdk-contract', initial_events: [], resources });
  assert.deepEqual(calls.at(-1).resources, resources);
  await client.deployments.update('dep_one', { resources });
  assert.deepEqual(calls.at(-1), { resources });
  const config = fixture.environment.config;
  await client.environments.create({ name: 'sdk-contract', config });
  assert.deepEqual(calls.at(-1), { name: 'sdk-contract', config });
  await client.environments.update('env_one', { config });
  assert.deepEqual(calls.at(-1), { config });
  await client.sessions.resources.update('sesr_one', { session_id: 'sess_one', password: ' token with spaces ' });
  assert.deepEqual(calls.at(-1), { password: ' token with spaces ' });
});

test('Managed artifact fields and diagnostics survive history and both SSE paths', async () => {
  const events = fixture.events;
  const client = testClient('managed', req => req.url.endsWith('/stream')
    ? new Response(events.map(e => `id: ${e.id}\nevent: ${e.type}\ndata: ${JSON.stringify(e)}\n\n`).join(''), { headers: { 'content-type': 'text/event-stream' } })
    : response({ data: events, has_more: false }));
  assert.deepEqual((await client.sessions.events.list('sess_one')).data, events);
  for (const stream of [
    await client.sessions.events.streamEvents('sess_one'),
    await client.sessions.threads.events.streamEvents('sthr_one', { session_id: 'sess_one' }),
  ]) {
    const items = []; for await (const event of stream) items.push(event);
    assert.deepEqual(items, events);
  }
});
