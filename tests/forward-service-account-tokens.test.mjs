import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fixture, sdk, response, resource } from './helpers.mjs';
import * as cjs from '../dist/forward/index.js';
import * as esm from '../dist/esm/forward/index.js';

const operations = fixture('forward', 'service-account-tokens.json').operations;
const invoke = (client, op, params, options) => resource(client, op.tsentry)[op.method](
  ...((op.path.includes('{identity_id}') || op.path.includes('{auth_token_id}')) ? ['id /?%#'] : []), params, options,
);
const transport = handler => async (input, init) => handler(new Request(input, init));

for (const op of operations) {
  test(`${op.operation_id}: documented Key authentication, body, path and response`, async () => {
    let calls = 0;
    const client = new sdk.ForwardClient({
      accessToken: 'business-token', authMode: 'sa', baseURL: 'https://api.test/api/v1/forward',
      defaultHeaders: { authorization: 'Bearer default-token' },
      fetch: transport(async req => {
        calls++;
        assert.equal(req.method, 'POST');
        assert.equal(new URL(req.url).pathname, `/api/v1/forward${op.path.replace(/\{[^}]+\}/g, encodeURIComponent('id /?%#'))}`);
        assert.equal(req.headers.get('authorization'), 'Bearer explicit-sa-key');
        assert.equal(req.headers.get('x-trace'), 'test');
        assert.equal(req.headers.get('content-type'), 'application/json');
        assert.deepEqual(await req.json(), op.body);
        return response(op.response, op.method === 'revoke' ? 200 : 201, { 'x-request-id': 'req_sat' });
      }),
    });
    const result = await invoke(client, op, { saKey: 'explicit-sa-key', ...op.body }, { headers: new Headers({ AUTHORIZATION: 'Bearer wrong', 'x-trace': 'test' }) });
    assert.deepEqual(result, op.response);
    assert.equal(result._request_id, 'req_sat');
    assert.equal(calls, 1);
  });

  for (const failure of [429, 503, 'network']) test(`${op.operation_id}: ${failure} never retries`, async () => {
    let calls = 0;
    const client = new sdk.ForwardClient({ maxRetries: 3, fetch: transport(() => {
      calls++;
      if (failure === 'network') throw Error('connection interrupted');
      return response({ error: { message: 'response uncertain' } }, failure, { 'x-should-retry': 'true', 'retry-after-ms': '1' });
    }) });
    await assert.rejects(() => invoke(client, op, { saKey: 'sa-key' }, { maxRetries: 4, idempotencyKey: 'unsupported-key' }));
    assert.equal(calls, 1);
  });

  test(`${op.operation_id}: request options retain async body and do not mutate caller headers`, async () => {
    const headers = new Headers({ authorization: 'Bearer original', 'x-trace': 'kept' });
    const client = new sdk.ForwardClient({ fetch: transport(async req => {
      assert.deepEqual(await req.json(), op.body);
      assert.equal(req.headers.get('authorization'), 'Bearer sa-key');
      assert.equal(req.headers.get('x-trace'), 'kept');
      return response(op.response);
    }) });
    await invoke(client, op, { saKey: 'sa-key' }, { headers, body: Promise.resolve(op.body) });
    assert.equal(headers.get('authorization'), 'Bearer original');
  });

  for (const key of ['', ' ', 'key\nInjected:value', 'key\t', 'key\x00', undefined]) test(`${op.operation_id}: invalid Key ${JSON.stringify(key)} cannot use business auth`, () => {
    const client = new sdk.ForwardClient({ pat: 'business-token', fetch: transport(() => assert.fail('invalid Key reached fetch')) });
    assert.throws(() => invoke(client, op, { saKey: key }), /saKey/);
  });
}

for (const auth of ['none', 'ambient', 'static', 'provider']) test(`per-call SA Key preserves ${auth} business auth`, async () => {
  const previous = [process.env.QODER_PAT, process.env.QODER_ACCESS_TOKEN];
  let providerCalls = 0;
  const requests = [];
  try {
    delete process.env.QODER_PAT;
    delete process.env.QODER_ACCESS_TOKEN;
    if (auth === 'ambient') {
      process.env.QODER_PAT = 'business-token';
      process.env.QODER_ACCESS_TOKEN = 'business-token';
    }
    const options = auth === 'provider' ? { credential: { getToken() { providerCalls++; return 'business-token'; } } }
      : auth === 'static' ? { accessToken: 'business-token', authMode: 'sa' } : {};
    const client = new sdk.ForwardClient({ ...options, fetch: transport(async req => {
      requests.push(req);
      if (req.method === 'GET') return response({ data: [] });
      assert.equal(req.headers.get('authorization'), 'Bearer sa-key');
      assert.equal(await req.text(), '{}');
      return response(req.url.endsWith('/revoke') ? { revoked: true } : operations[0].response);
    }) });
    for (const op of operations) await invoke(client, op, { saKey: 'sa-key' });
    assert.equal(providerCalls, 0);
    if (auth !== 'none') {
      await client.models.list();
      assert.equal(requests.at(-1).headers.get('authorization'), 'Bearer business-token');
      assert.equal(providerCalls, auth === 'provider' ? 1 : 0);
    }
  } finally {
    ['QODER_PAT', 'QODER_ACCESS_TOKEN'].forEach((key, i) => { if (previous[i] === undefined) delete process.env[key]; else process.env[key] = previous[i]; });
  }
});

test('Forward resource exports work in CJS/ESM and do not appear on Managed', () => {
  for (const module of [cjs, esm]) {
    assert.equal(typeof module.ServiceAccountTokens, 'function');
    assert.equal(typeof module.IdentityServiceAccountTokens, 'function');
  }
  assert.equal('serviceAccountTokens' in new sdk.ManagedClient(), false);
});
