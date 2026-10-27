import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fixture, sdk, testClient, response } from './helpers.mjs';

const contract = fixture('forward', 'decisions.json');

for (const auth of [{pat: 'token'}, {pat: undefined, authMode: 'sa', accessToken: 'token'}]) {
  test(`decisions state/session, false/zero/null, and future fields (${auth.authMode ?? 'pat'})`, async () => {
    let calls = 0;
    const client = testClient('forward', async request => {
      calls++;
      assert.equal(request.headers.get('authorization'), 'Bearer token');
      assert.equal(request.headers.has('x-qoder-beta'), false);
      assert.equal(new URL(request.url).search, '');
      const result = structuredClone(contract.response);
      result.future_field = 1;
      if (request.method === 'POST') {
        assert.equal(new URL(request.url).pathname, '/api/v1/forward/decisions');
        if (calls === 1) {
          assert.deepEqual(await request.json(), contract.request);
          assert.equal(request.headers.get('idempotency-key'), 'option-wins');
        } else {
          assert.deepEqual(await request.json(), {session_id: 'sess_own', questions: contract.request.questions});
          result.session_id = 'sess_own';
          Object.assign(result.context, {mode: 'session', anchor_event_id: 'evt_last', first_event_id: 'evt_first', last_event_id: 'evt_last', included_segment_count: 12, included_event_count: 14, future_context: true});
        }
      } else {
        assert.ok(new URL(request.url).pathname.endsWith('/decisions/opaque%20%2F%3F%25%23'));
        assert.equal(await request.text(), '');
      }
      return response(result);
    }, auth);
    const first = await client.decisions.create({...contract.request, idempotency_key: 'param-key'}, {idempotencyKey: 'option-wins'}).withResponse();
    assert.equal(first.request_id, 'req_contract');
    assert.equal(first.data.answers[0].value, false);
    assert.equal(first.data.answers[1].score, 0);
    assert.equal(Object.hasOwn(first.data.answers[1], 'value'), false);
    assert.equal(first.data.session_id, null);
    assert.equal(Object.hasOwn(first.data, 'usage'), false);
    assert.deepEqual(first.data.context, {mode: 'state'});
    assert.equal(first.data.future_field, 1);
    const session = await client.decisions.create({session_id: 'sess_own', questions: contract.request.questions});
    assert.equal(session.context.anchor_event_id, 'evt_last');
    assert.equal(session.context.first_event_id, 'evt_first');
    assert.equal(session.context.last_event_id, 'evt_last');
    assert.equal(session.context.included_segment_count, 12);
    assert.equal(session.context.included_event_count, 14);
    assert.equal(session.context.future_context, true);
    assert.equal(session.answers[0].value, false);
    assert.equal(session.answers[1].score, 0);
    assert.equal(Object.hasOwn(session.answers[1], 'value'), false);
    assert.equal((await client.decisions.retrieve('opaque /?%#')).id, 'dec_contract');
    assert.throws(() => client.decisions.retrieve(''), /required|empty/i);
    assert.equal(calls, 3);
  });
}

for (const cursor of ['after_id', 'before_id']) {
  test(`decisions pagination retains filters/options and order (${cursor})`, async () => {
    let calls = 0;
    const client = testClient('forward', async request => {
      calls++;
      const query = new URL(request.url).searchParams;
      assert.equal(query.get('session_id'), 'sess_own');
      assert.equal(query.get('limit'), '1');
      assert.equal(query.has('page'), false);
      assert.equal(query.get(cursor), calls === 1 ? 'dec_start' : 'dec_z');
      assert.equal(query.has(cursor === 'after_id' ? 'before_id' : 'after_id'), false);
      assert.equal(request.headers.get('x-page'), 'kept');
      assert.equal(await request.text(), '');
      return calls === 1
        ? response({data: [{id: 'dec_z', status: 'running', completed_at: null}], first_id: 'dec_z', last_id: 'dec_z', has_more: true})
        : response({data: [{id: 'dec_a', status: 'failed', error: {code: 'decision_upstream_timeout', message: 'Timed out'}}], first_id: 'dec_a', last_id: 'dec_a', has_more: false});
    });
    const items = [];
    for await (const item of client.decisions.list({session_id: 'sess_own', limit: 1, [cursor]: 'dec_start'}, {headers: {'X-Page': 'kept'}})) items.push(item);
    assert.deepEqual(items.map(d => d.id), ['dec_z', 'dec_a']);
    assert.equal(items[0].completed_at, null);
    assert.equal(items[1].error.code, 'decision_upstream_timeout');
    assert.equal(calls, 2);
  });
}

for (const keyed of [false, true]) {
  test(`decisions retry requires key and preserves bytes (${keyed})`, async () => {
    const bodies = [];
    const client = testClient('forward', async request => {
      bodies.push(await request.text());
      assert.equal(request.headers.get('Idempotency-Key'), keyed ? 'once' : null);
      return bodies.length === 1 ? response({error: {message: 'Unavailable'}}, 503, {'retry-after-ms': '1'}) : response(contract.response);
    }, {maxRetries: 1});
    const request = client.decisions.create({...contract.request, ...(keyed ? {idempotency_key: 'once'} : {})});
    if (keyed) {
      assert.equal((await request).id, 'dec_contract');
      assert.equal(bodies.length, 2);
      assert.equal(bodies[0], bodies[1]);
    } else {
      await assert.rejects(request, sdk.InternalServerError);
      assert.equal(bodies.length, 1);
    }
  });
}

test('decision conflict is not retried and error retains the decision ID', async () => {
  let calls = 0;
  const client = testClient('forward', () => {
    calls++;
    return response({request_id: 'req_decision', decision_id: 'dec_running', error: {type: 'conflict_error', code: 'decision_in_progress', message: 'Still running'}}, 409);
  }, {maxRetries: 2});
  await assert.rejects(client.decisions.create({...contract.request, idempotency_key: 'same'}), e => {
    assert.equal(e.status, 409);
    assert.equal(e.code, 'decision_in_progress');
    assert.equal(e.error.decision_id, 'dec_running');
    return true;
  });
  assert.equal(calls, 1);
});

test('decision exports are available from CJS and ESM root and Forward entry points', async () => {
  for (const path of ['../dist/index.js', '../dist/forward/index.js', '../dist/esm/index.js', '../dist/esm/forward/index.js']) {
    const exported = await import(path);
    assert.equal(typeof exported.Decisions, 'function');
    assert.ok(new exported.ForwardClient({pat: 'test'}).decisions instanceof exported.Decisions);
  }
});

for (const status of ['running', 'failed']) {
  test(`decisions retrieve/list ${status} records without internal fields`, async () => {
    const record = {...structuredClone(contract.response), status, session_id: 'sess_own', answers: [], context: {mode: 'session'}};
    if (status === 'running') record.completed_at = null;
    else record.error = {code: 'decision_invalid_upstream_response', message: 'Invalid JEV response.'};
    const client = testClient('forward', async request => response(
      new URL(request.url).pathname.endsWith('/dec_contract') ? record : {data: [record], first_id: record.id, last_id: record.id, has_more: false}
    ));
    const result = await client.decisions.retrieve(record.id);
    const page = await client.decisions.list({session_id: 'sess_own'});
    assert.deepEqual(result, record);
    assert.deepEqual(page.data, [record]);
  });
}
