import assert from 'node:assert/strict';
import { test } from 'node:test';
import { VERSION } from '../dist/version.js';
import { testClient, response } from './helpers.mjs';

const stamp = { __qca_sdk_created: 'true', __qca_sdk_language: 'js', __qca_sdk_version: VERSION };

for (const mode of ['forward', 'managed']) {
  const params = mode === 'forward' ? { identity_id: 'idn', template_id: 'tmpl' } : { agent: 'agent', environment_id: 'env' };
  for (const metadata of [undefined, null, {}, { ticket: 'A-123' }, stamp]) {
    test(`${mode}: stamp Session metadata ${JSON.stringify(metadata)}`, async () => {
      const input = Object.freeze({ ...params, metadata: metadata && Object.freeze({ ...metadata }) });
      const original = structuredClone(input);
      let calls = 0;
      const client = testClient(mode, async req => {
        calls++;
        assert.equal(req.method, 'POST');
        assert.ok(new URL(req.url).pathname.endsWith('/sessions'));
        assert.deepEqual(await req.json(), { ...params, metadata: { ...metadata, ...stamp } });
        assert.equal(req.headers.get('x-qoder-package-version'), VERSION);
        return response({ id: 'sess_test' });
      });
      await client.sessions.create(input);
      await client.sessions.create(input);
      assert.equal(calls, 2);
      assert.deepEqual(input, original);
    });
  }
  for (const key of Object.keys(stamp)) for (const value of ['user-value', null, true, 12]) {
    test(`${mode}: reject conflicting ${key}=${value} before transport`, async () => {
      let calls = 0;
      const client = testClient(mode, () => { calls++; return response({}); });
      const metadata = Object.freeze({ ticket: 'A-123', [key]: value });
      await assert.rejects(async () => client.sessions.create({ ...params, metadata }), error => {
        assert.equal(error.message, `conflicting SDK metadata field: ${key}`);
        return error instanceof TypeError;
      });
      assert.equal(calls, 0);
    });
  }
  for (const metadata of [[], 'invalid', 1, false]) {
    test(`${mode}: reject invalid metadata ${JSON.stringify(metadata)}`, async () => {
      let calls = 0;
      const client = testClient(mode, () => { calls++; return response({}); });
      await assert.rejects(async () => client.sessions.create({ ...params, metadata }), /metadata must be a JSON object or null/);
      assert.equal(calls, 0);
    });
  }
  test(`${mode}: retain business data and use actual SDK version despite header overrides`, async () => {
    const metadata = { ticket: 'A-123', __qca_sdk_future: 'preserved' };
    if (mode === 'forward') metadata.nested = { items: [1, false, null] };
    const original = structuredClone(metadata);
    const client = testClient(mode, async req => {
      assert.deepEqual(await req.json(), { ...params, metadata: { ...original, ...stamp } });
      return response({});
    });
    await client.sessions.create({ ...params, metadata }, { headers: { 'X-Qoder-Package-Version': 'custom-header' } });
    assert.deepEqual(metadata, original);
  });
  test(`${mode}: do not stamp update or retrieve`, async () => {
    const metadata = { ticket: 'A-123', __qca_sdk_language: 'historic' };
    const client = testClient(mode, async req => {
      if (req.method === 'GET') assert.equal(await req.text(), '');
      else assert.deepEqual(await req.json(), { metadata });
      return response({});
    });
    await client.sessions.update('sess_test', { metadata });
    await client.sessions.retrieve('sess_test');
  });
}

test('Forward: stamp the final RequestOptions body and reject conflicts there', async () => {
  let calls = 0;
  const body = Object.freeze({ identity_id: 'extra-idn', template_id: 'extra-tmpl', metadata: Object.freeze({ ticket: 'extra' }) });
  const client = testClient('forward', async req => {
    calls++;
    assert.deepEqual(await req.json(), { ...body, metadata: { ...body.metadata, ...stamp } });
    return response({});
  });
  await client.sessions.create({ identity_id: 'typed', template_id: 'typed' }, { body });
  await assert.rejects(async () => client.sessions.create({}, { body: { metadata: { __qca_sdk_created: false } } }), /conflicting SDK metadata field/);
  assert.equal(calls, 1);
});
