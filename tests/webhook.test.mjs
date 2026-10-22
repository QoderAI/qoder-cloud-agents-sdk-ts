import assert from 'node:assert/strict';
import { test } from 'node:test';
import { sdk, testClient, response, fixture } from './helpers.mjs';

test('webhooks cursor order, partial update, no-body actions and unsafe retry', async () => {
  const requests = [];
  const client = testClient('forward', async r => {
    requests.push(r);
    assert.equal(r.headers.get('authorization'), 'Bearer test-sat');
    if (r.method === 'GET') {
      const q = new URL(r.url).searchParams;
      assert.equal(q.get('limit'), '2'); assert.equal(q.has('page'), false);
      if (requests.length === 1) return response({ data: [{id: 'z'}, {id: 'a'}], last_id: 'opaque/+?', has_more: true });
      assert.equal(q.get('after_id'), 'opaque/+?');
      return response({data: [], last_id: null, first_id: null, has_more: false});
    }
    if (r.method === 'PUT') {
      assert.deepEqual(await r.json(), {active: false, metadata: {remove: null, keep: 'value'}});
      return response({id: 'id', active: false});
    }
    assert.equal(await r.text(), '');
    if (r.method === 'DELETE') return response(null, 204);
    return response({error: {message: 'unavailable'}}, 503);
  }, {authMode: 'sa', accessToken: 'test-sat', pat: undefined, maxRetries: 2});
  const ids = [];
  for await (const e of client.webhooks.endpoints.list({limit: 2})) ids.push(e.id);
  assert.deepEqual(ids, ['z', 'a']); assert.equal(requests.length, 2);
  await client.webhooks.endpoints.update('id', {active: false, metadata: {remove: null, keep: 'value'}});
  await client.webhooks.endpoints.delete('id');
  await assert.rejects(client.webhooks.endpoints.test('id'), sdk.InternalServerError);
  assert.equal(requests.length, 5);
});

test('webhook signature vector, boundaries, tampering, malformed input and multiple signatures', async t => {
  const v = fixture('forward', 'webhook-signature.json');
  const now = t.mock.method(Date, 'now', () => Number(v.timestamp) * 1000);
  const body = new TextEncoder().encode(v.payload);
  const headers = {'webhook-id': v.id, 'Webhook-Timestamp': v.timestamp, 'Webhook-Signature': 'v2,unknown v1,invalid ' + v.signature};
  for (const delta of [-300, 0, 300]) {
    now.mock.mockImplementation(() => (Number(v.timestamp) + delta) * 1000);
    await sdk.verifyWebhookSignature(body, headers, v.secret);
  }
  for (const delta of [-301, 301]) {
    now.mock.mockImplementation(() => (Number(v.timestamp) + delta) * 1000);
    await assert.rejects(sdk.verifyWebhookSignature(body, headers, v.secret), sdk.WebhookVerificationError);
  }
  now.mock.mockImplementation(() => Number(v.timestamp) * 1000);
  for (const [name, value] of [['Webhook-Timestamp','9223372036854775807'],['Webhook-Timestamp','-1'],['Webhook-Signature','v2,abc'],['webhook-id','other']]) {
    await assert.rejects(sdk.verifyWebhookSignature(body, {...headers, [name]: value}, v.secret), sdk.WebhookVerificationError);
  }
  await assert.rejects(sdk.verifyWebhookSignature(new TextEncoder().encode(v.payload + ' '), headers, v.secret), sdk.WebhookVerificationError);
  for (const secret of ['', 'whsec_', 'whsec_bad!', 'whsec_dG9vIHNob3J0']) await assert.rejects(sdk.verifyWebhookSignature(body, headers, secret), sdk.WebhookVerificationError);
  await sdk.verifyWebhookSignature(body, new Headers(headers), v.secret);
});


test('receiver example preserves unknown and synthetic events', async () => {
  const {parseDelivery} = await import('../examples/forward/webhooks.mjs');
  const {createHmac} = await import('node:crypto');
  const key = Buffer.from('0123456789abcdef0123456789abcdef');
  for (const event of [{type: 'event', data: {type: 'future.event', extra: 42}}, {type: 'event', endpoint_id: 'id', note: 'synthetic'}]) {
    const body = Buffer.from(JSON.stringify(event)), timestamp = String(Math.floor(Date.now()/1000));
    const signature = createHmac('sha256',key).update(`whe_test.${timestamp}.`).update(body).digest('base64');
    const headers = {'Webhook-ID': 'whe_test', 'Webhook-Timestamp': timestamp, 'Webhook-Signature': 'v1,' + signature};
    assert.deepEqual(await parseDelivery(body,headers,'whsec_' + key.toString('base64')), event);
    await assert.rejects(parseDelivery(Buffer.concat([body,Buffer.from(' ')]),headers,'whsec_' + key.toString('base64')),sdk.WebhookVerificationError);
  }
});

test('creation and test retain 201/202 status and one-time secret', async () => {
  const client = testClient('forward', async r => {
    if (r.url.endsWith('/test')) return response({event_id: 7, delivery_rows: 0}, 202);
    assert.equal(r.headers.get('idempotency-key'), 'one-create');
    assert.deepEqual(await r.json(), {url: 'https://hooks.example.com/qca', events: ['*']});
    return response({id: 'endpoint', signing_secret: 'synthetic'}, 201);
  });
  const created = await client.webhooks.endpoints.create({url: 'https://hooks.example.com/qca', events: ['*']}, {idempotencyKey: 'one-create'}).withResponse();
  assert.equal(created.response.status, 201); assert.equal(created.data.signing_secret, 'synthetic');
  const accepted = await client.webhooks.endpoints.test(created.data.id).withResponse();
  assert.equal(accepted.response.status, 202); assert.equal(accepted.data.delivery_rows, 0);
});
