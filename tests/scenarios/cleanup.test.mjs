// Cleanup lifecycles with real SDK requests and deterministic failure injection.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { testClient, response } from '../helpers.mjs';
import { MockPlatform } from '../scenario-harness.mjs';
import { ForwardLiveSuite, CleanupFailure, resourceAlreadyGone } from '../live/forward-support.mjs';
import { forwardScenarios } from '../live/forward-scenarios.mjs';
import { ManagedScenarioSuite } from '../live/managed-support.mjs';
const key = req => `${req.method} ${new URL(req.url).pathname}`;

test('schedule cleanup: pending run -> cancel -> idle -> archive', async () => {
  const requests = []; let runs = 0, sessions = 0;
  const suite = new ForwardLiveSuite(testClient('forward', req => {
    const route = key(req); requests.push(route);
    switch (route) {
      case 'GET /api/v1/forward/schedule_runs/run': return response(++runs === 1 ? { id: 'run', status: 'pending' } : { id: 'run', status: 'running', session_id: 'session' });
      case 'GET /api/v1/forward/sessions/session': return response({ id: 'session', status: ++sessions === 1 ? 'running' : 'idle' });
      case 'POST /api/v1/forward/sessions/session/cancel':
      case 'POST /api/v1/forward/sessions/session/archive': return response({ id: 'session' });
      default: assert.fail(route);
    }
  }), { pollInterval: 1, scenarioTimeout: 1000 });
  await suite.finishScheduleRun('run', 'identity');
  assert.deepEqual(requests, ['GET /api/v1/forward/schedule_runs/run', 'GET /api/v1/forward/schedule_runs/run', 'GET /api/v1/forward/sessions/session', 'POST /api/v1/forward/sessions/session/cancel', 'GET /api/v1/forward/sessions/session', 'POST /api/v1/forward/sessions/session/archive']);
});
test('pending schedule cleanup deadline preserves the run ID', async () => {
  const suite = new ForwardLiveSuite(testClient('forward', () => response({ id: 'run', status: 'pending' })), { pollInterval: 2 });
  await assert.rejects(() => suite.finishScheduleRun('run', 'identity', { signal: AbortSignal.timeout(10) }), /run=run/);
});
for (const state of ['failed', 'processing']) test(`batch failure cleanup ${state}`, async () => {
  const requests = []; let reads = 0;
  const suite = new ForwardLiveSuite(testClient('forward', req => {
    const route = key(req); requests.push(route);
    switch (route) {
      case 'GET /api/v1/forward/batches/batch': return response({ id: 'batch', status: ++reads > 1 ? 'cancelled' : state, output_file_id: 'internal-file', request_counts: { total: 1 } });
      case 'POST /api/v1/forward/batches/batch/cancel': return response({ id: 'batch', status: 'cancelling' });
      case 'GET /api/v1/forward/batches/batch/output': return response({ url: 'https://storage.test/output' });
      case 'GET /api/v1/forward/sessions/session': return response({ id: 'session', status: 'idle' });
      case 'POST /api/v1/forward/sessions/session/archive': return response({ id: 'session' });
      default: assert.fail(route);
    }
  }), { pollInterval: 1, fetch: async (input, init) => {
    assert.equal(new Request(input, init).headers.get('authorization'), null);
    return response('{"custom_id":"task","identity_id":"identity","template_id":"template","session_id":"session","status":"failed","error":{"code":"timeout"}}\n');
  } });
  await suite.finishBatch('batch', 'task', 'identity', 'template');
  assert.equal(requests.at(-1), 'POST /api/v1/forward/sessions/session/archive');
  assert.equal(requests.some(r => r.includes('/files/')), false);
});
test('batch cleanup retains a missing-output failure', async () => {
  const suite = new ForwardLiveSuite(testClient('forward', req => new URL(req.url).pathname.endsWith('/output') ? response({ error: { message: 'output not generated' } }, 404) : response({ id: 'batch', status: 'cancelled', output_file_id: 'internal', request_counts: { total: 1 } })));
  await assert.rejects(() => suite.finishBatch('batch', 'task', 'identity', 'template'), e => e instanceof CleanupFailure && !resourceAlreadyGone(e));
});
for (const name of ['schedule_e2e', 'batch_e2e']) test(`execution failure cleanup ${name} resolves the immutable ID after a failed first poll`, async () => {
  const platform = new MockPlatform('forward'); let polls = 0, stableID;
  const client = testClient('forward', async req => {
    const path = new URL(req.url).pathname.replace('/api/v1/forward', '');
    if (req.method === 'GET' && (/^\/schedule_runs\/[^/]+$/.test(path) || /^\/batches\/[^/]+$/.test(path))) {
      polls++; stableID ??= path; assert.equal(path, stableID);
      if (polls === 1) return response({ request_id: 'failed-poll', error: { type: 'api_error', message: 'deliberate test failure' } }, 503);
    }
    const res = await platform.handle(req);
    if (req.method === 'POST' && path === '/batches') { const body = await res.json(); return response({ ...body, status: 'processing' }); }
    return res;
  });
  const suite = new ForwardLiveSuite(client, { timeout: 1000, scenarioTimeout: 2000, pollInterval: 1, model: 'model-test', fetch: platform.fetch });
  await assert.rejects(async () => { try { await forwardScenarios.find(s => s.name === name).run(suite); } finally { await suite.close(); } }, e => e.request_id === 'failed-poll');
  assert.equal(polls, 2);
  assert.ok(platform.logs.some(r => r.method === 'POST' && /^\/sessions\/[^/]+\/archive$/.test(r.path)));
  platform.assertCleanup();
});
test('Managed session cleanup interrupts, waits then deletes', async () => {
  const requests = []; let reads = 0;
  const suite = new ManagedScenarioSuite(testClient('managed', async req => {
    const route = key(req); requests.push(route);
    switch (route) {
      case 'GET /api/v1/cloud/sessions/session': return response({ id: 'session', status: ++reads === 1 ? 'running' : 'idle' });
      case 'POST /api/v1/cloud/sessions/session/events': assert.deepEqual(await req.json(), { events: [{ type: 'user.interrupt' }] }); return response({ data: [] });
      case 'DELETE /api/v1/cloud/sessions/session': return response({ id: 'session', type: 'session_deleted' });
      default: assert.fail(route);
    }
  }), { pollPause: async () => {} });
  await suite.finishSession('session');
  assert.deepEqual(requests, ['GET /api/v1/cloud/sessions/session', 'POST /api/v1/cloud/sessions/session/events', 'GET /api/v1/cloud/sessions/session', 'DELETE /api/v1/cloud/sessions/session']);
});
for (const mode of ['forward','managed']) for (const kind of ['error','timeout','cleanup_error']) test(`${mode}: cleanup LIFO survives ${kind} with fresh deadline`, async () => {
  const order = [], client = testClient(mode, () => response({}));
  if (mode === 'forward') {
    const suite = new ForwardLiveSuite(client, { scenarioTimeout: 1000 });
    suite.options = { signal: AbortSignal.abort() };
    suite.cleanup('parent', options => { options.signal.throwIfAborted(); order.push('parent'); });
    suite.cleanup('child', options => { options.signal.throwIfAborted(); order.push('child'); if (kind === 'cleanup_error') throw Error('cleanup failed'); });
    if (kind === 'cleanup_error') await assert.rejects(() => suite.close(), AggregateError); else await suite.close();
  } else {
    const suite = new ManagedScenarioSuite(client, { scenarioTimeout: 1000 });
    await assert.rejects(() => suite.run(async s => {
      s.cleanup('parent', () => { s.options().signal.throwIfAborted(); order.push('parent'); });
      s.cleanup('child', () => { s.options().signal.throwIfAborted(); order.push('child'); if (kind === 'cleanup_error') throw Error('cleanup failed'); });
      if (kind === 'timeout') { s.signal = AbortSignal.abort(); s.signal.throwIfAborted(); }
      if (kind === 'error') throw Error('failed');
    }));
  }
  assert.deepEqual(order, ['child','parent']);
});
