import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ForwardExampleSuite } from '../examples/forward-support.mjs';
import { testClient, response } from './helpers.mjs';
import { main } from '../examples/run.mjs';

const ownSession = (id, extra = {}) => ({ id, identity_id: 'identity-own', template: { id: 'template-own' }, source_type: 'batch', ...extra });
const batch = (extra = {}) => ({ id: 'batch-own', status: 'cancelled', request_counts: { total: 1 }, ...extra });
function makeSuite(list, { state, sessionResponse, owned = ['batch','identity','template'] } = {}) {
  const requests = [], evidence = [], records = {};
  let page = 0;
  const client = testClient('forward', async req => {
    const url = new URL(req.url); const path = url.pathname.replace('/api/v1/forward','');
    requests.push({ method: req.method, path, query: Object.fromEntries(url.searchParams) });
    if (path === '/batches/batch-own') return response(batch(state));
    if (path === '/sessions') {
      assert.deepEqual(url.searchParams.getAll('identity_ids'), ['identity-own']);
      assert.equal(url.searchParams.get('template_id'), 'template-own');
      assert.equal(url.searchParams.get('source_type'), 'batch');
      assert.equal(url.searchParams.get('include_archived'), 'true');
      assert.equal(url.searchParams.get('limit'), '100');
      return list(++page, req, url);
    }
    if (sessionResponse && path.startsWith('/sessions/')) { const res = await sessionResponse(req,path); if (res) return res; }
    if (req.method === 'GET' && /^\/sessions\/session-/.test(path)) return response({ id: path.split('/')[2], status: 'idle' });
    if (req.method === 'POST' && /^\/sessions\/session-[^/]+\/archive$/.test(path)) return response({ id: path.split('/')[2] });
    assert.fail(`unexpected request ${req.method} ${path}`);
  });
  const suite = new ForwardExampleSuite(client, { timeout: 1000, cleanupTimeout: 1000, pollInterval: 1 }, {
    step() {}, log() {}, check() {}, record(key, value) {
      records[key] = structuredClone(value);
      if (key === 'batch_cleanup_evidence') evidence.push(structuredClone(value));
    },
  });
  for (const kind of owned) suite.track(kind, `${kind}-own`, () => {});
  return { suite, requests, evidence, records };
}
const finish = (s, options) => s.finishBatch('batch-own', 'task-own', 'identity-own', 'template-own', options);
const mutations = requests => requests.filter(r => r.path.startsWith('/sessions/') && r.method !== 'GET');

test('cancelled batch without output validates every filtered page before cleaning owned sessions', async () => {
  const { suite, requests, evidence, records } = makeSuite((page, req, url) => {
    if (page === 1) return response({ data: [ownSession('session-one')], last_id: 'session-one', has_more: true });
    assert.equal(page, 2); assert.equal(url.searchParams.get('after_id'), 'session-one');
    return response({ data: [ownSession('session-two')], has_more: false });
  });
  await finish(suite);
  assert.deepEqual(requests.map(r => `${r.method} ${r.path}`), [
    'GET /batches/batch-own','GET /sessions','GET /sessions',
    'GET /sessions/session-one','POST /sessions/session-one/archive',
    'GET /sessions/session-two','POST /sessions/session-two/archive',
  ]);
  assert.equal(evidence[0].verified, false); assert.equal(records.batch_cleanup_evidence.verified, true);
  assert.deepEqual(records.batch_cleanup_evidence.sessions.map(s => [s.id,s.cleaned]), [['session-one',true],['session-two',true]]);
});
test('cancelled queued batch can prove zero owned sessions without a public output file', async () => {
  const { suite, requests, records } = makeSuite(() => response({ data: [], has_more: false }));
  await finish(suite);
  assert.deepEqual(requests.map(r => r.path), ['/batches/batch-own','/sessions']);
  assert.equal(records.batch_cleanup_evidence.verified, true); assert.deepEqual(records.batch_cleanup_evidence.sessions, []);
});
for (const [name, foreign] of [
  ['identity', { identity_id: 'foreign' }], ['template', { template: { id: 'foreign' } }], ['source', { source_type: 'interactive' }],
  ['missing ID', { id: '' }], ['duplicate ID', { id: 'session-one' }],
]) test(`batch cleanup refuses ${name} on a later page before touching any session`, async () => {
  const { suite, requests, records } = makeSuite(page => page === 1
    ? response({ data: [ownSession('session-one')], last_id: 'session-one', has_more: true })
    : response({ data: [ownSession('session-two', foreign)], has_more: false }));
  await assert.rejects(() => finish(suite));
  assert.deepEqual(mutations(requests), []);
  assert.equal(requests.some(r => r.path.startsWith('/sessions/')), false);
  assert.equal(records.batch_cleanup_evidence.verified, false);
});
for (const kind of ['batch','identity','template']) test(`batch fallback refuses missing tracked ${kind} ownership`, async () => {
  const { suite, requests } = makeSuite(() => assert.fail('unowned scope must not list sessions'), { owned: ['batch','identity','template'].filter(k => k !== kind) });
  await assert.rejects(() => finish(suite), new RegExp(`tracked ${kind}`));
  assert.deepEqual(requests.map(r => r.path), ['/batches/batch-own']);
});
for (const status of ['completed','failed','expired']) test(`missing output for ${status} batch remains a cleanup error`, async () => {
  const { suite, requests } = makeSuite(() => assert.fail('fallback only applies to cancelled batch'), { state: { status } });
  await assert.rejects(() => finish(suite), /no output/);
  assert.deepEqual(requests.map(r => r.path), ['/batches/batch-own']);
});
test('batch cleanup rejects a response for a different batch ID', async () => {
  const { suite, requests } = makeSuite(() => assert.fail('wrong batch must not list sessions'), { state: { id: 'other-batch' } });
  await assert.rejects(() => finish(suite), /response ID mismatch/);
  assert.deepEqual(mutations(requests), []);
});
for (const status of [404, 500]) test(`session discovery HTTP ${status} cannot be swallowed as successful cleanup`, async () => {
  const { suite, requests, records } = makeSuite(() => response({ error: { message: 'discovery failed' } }, status));
  suite.cleanup('batch batch-own', options => finish(suite, options));
  await assert.rejects(() => suite.close(), AggregateError);
  assert.deepEqual(mutations(requests), []);
  assert.equal(records.batch_cleanup_evidence.verified, false);
  assert.equal(records.cleanup.failed, 1);
});
test('canceling during session discovery propagates without mutation or verified evidence', async () => {
  const controller = new AbortController();
  const { suite, requests, records } = makeSuite(() => { controller.abort(); throw controller.signal.reason; });
  await assert.rejects(() => finish(suite, { signal: controller.signal }));
  assert.deepEqual(mutations(requests), []); assert.equal(records.batch_cleanup_evidence.verified, false);
});

test('CLI still reports failed queued batch even when owned-scope fallback proves cleanup complete', async t => {
  const directory = mkdtempSync(join(tmpdir(), 'qoder-batch-cli-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const envFile = join(directory,'config.env'), reportFile = join(directory,'report.json');
  writeFileSync(envFile, 'QODER_FORWARD_PAT=test-token\n');
  const savedFetch = globalThis.fetch, savedLog = console.log;
  const keys = ['QODER_FORWARD_PAT','QODER_FORWARD_BASE_URL','QODER_FORWARD_MODEL','QODER_PAT'];
  const savedEnv = Object.fromEntries(keys.map(k => [k,process.env[k]]));
  process.env.QODER_FORWARD_PAT = 'test-token';
  delete process.env.QODER_FORWARD_BASE_URL; delete process.env.QODER_FORWARD_MODEL; delete process.env.QODER_PAT;
  const requests = []; let canceled = false;
  globalThis.fetch = async (input, init) => {
    const req = new Request(input,init), url = new URL(req.url), path = url.pathname.replace('/api/v1/forward','');
    requests.push(`${req.method} ${path}`);
    switch (`${req.method} ${path}`) {
      case 'GET /models': return response({ data: [{ id: 'auto', is_enabled: true }] });
      case 'POST /environments': return response({ id: 'env-own' });
      case 'POST /identities': return response({ id: 'identity-own' });
      case 'POST /templates': return response({ id: 'template-own' });
      case 'POST /files': return response({ id: 'file-own' });
      case 'POST /batches': return response(batch({ status: 'queued' }));
      case 'GET /batches/batch-own': return response(batch({ status: canceled ? 'cancelled' : 'queued' }));
      case 'POST /batches/batch-own/cancel': canceled = true; return response(batch());
      case 'GET /sessions':
        assert.equal(url.searchParams.get('identity_ids'),'identity-own'); assert.equal(url.searchParams.get('template_id'),'template-own'); assert.equal(url.searchParams.get('source_type'),'batch');
        return response({ data: [], has_more: false });
      case 'POST /identities/identity-own/clear': return response({ status: 'completed' });
      case 'DELETE /identities/identity-own':
      case 'DELETE /files/file-own':
      case 'POST /templates/template-own/archive':
      case 'POST /environments/env-own/archive': return response({});
      default: assert.fail(`unexpected offline request ${req.method} ${path}`);
    }
  };
  console.log = () => {};
  try {
    const code = await main(['-mode','forward','-scenario','batch','-region','international','-model','auto','-env',envFile,'-report',reportFile,'-timeout','100ms','-cleanup-timeout','1s']);
    const report = JSON.parse(readFileSync(reportFile,'utf8'));
    assert.equal(code, 1); assert.equal(report.scenarios[0].status, 'failed');
    assert.equal(report.scenarios[0].records.batch_cleanup_evidence.verified, true);
    assert.equal(report.scenarios[0].records.cleanup.failed, 0);
    assert.equal(report.summary.passed, 0); assert.equal(report.summary.failed, 1);
    assert.ok(requests.includes('POST /batches/batch-own/cancel'));
    assert.ok(requests.includes('DELETE /identities/identity-own'));
  } finally {
    globalThis.fetch = savedFetch; console.log = savedLog;
    for (const key of keys) { if (savedEnv[key] === undefined) delete process.env[key]; else process.env[key] = savedEnv[key]; }
  }
});


test('session cleanup 404 retains partial evidence and cannot mark the entire batch already gone', async () => {
  const { suite, records, requests } = makeSuite(() => response({ data: [ownSession('session-one'),ownSession('session-two')], has_more: false }), {
    sessionResponse: (req,path) => path === '/sessions/session-two' ? response({ error: { message: 'session disappeared during cleanup' } },404) : undefined,
  });
  suite.cleanup('batch batch-own', options => finish(suite, options));
  await assert.rejects(() => suite.close(), AggregateError);
  assert.equal(records.cleanup.failed,1);
  assert.equal(records.batch_cleanup_evidence.enumerated,true);
  assert.equal(records.batch_cleanup_evidence.verified,false);
  assert.deepEqual(records.batch_cleanup_evidence.sessions.map(s => [s.id,s.cleaned]), [['session-one',true],['session-two',false]]);
  assert.deepEqual(mutations(requests).map(r => r.path), ['/sessions/session-one/archive']);
});
