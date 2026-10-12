import assert from 'node:assert/strict';
import { test } from 'node:test';
import { clientOptions, formatExampleError } from '../examples/lib/auth.mjs';
import { makeForwardClient } from '../examples/lib/forward.mjs';
import { makeManagedClient } from '../examples/lib/managed.mjs';

const names = ['QODER_AUTH_MODE', 'QODER_SA_KEY', 'QODER_ACCESS_TOKEN', 'QODER_SA_REGION', 'QODER_PAT',
  'QODER_FORWARD_PAT', 'QODER_MANAGED_PAT', 'QODER_FORWARD_BASE_URL', 'QODER_MANAGED_BASE_URL'];

function withEnv(values, run) {
  const previous = names.map(name => process.env[name]);
  for (const name of names) delete process.env[name];
  Object.assign(process.env, { QODER_PAT: 'ambient-pat', ...values });
  return Promise.resolve().then(run).finally(() => names.forEach((name, index) => {
    if (previous[index] === undefined) delete process.env[name]; else process.env[name] = previous[index];
  }));
}

for (const [mode, factory] of [['forward', makeForwardClient], ['managed', makeManagedClient]]) {
  test(`${mode} business examples select PAT or SAT without ambient PAT masking SA`, async () => {
    for (const authMode of ['pat', 'sa']) {
      await withEnv({ QODER_AUTH_MODE: authMode, QODER_ACCESS_TOKEN: 'static-sat' }, async () => {
        const requests = [];
        const client = factory().withOptions({ fetch: async (url, init) => {
          requests.push(new Request(url, init));
          return new Response(JSON.stringify({ data: [] }), { headers: { 'content-type': 'application/json' } });
        } });
        await client.models.list({});
        assert.equal(requests[0].headers.get('authorization'), `Bearer ${authMode === 'sa' ? 'static-sat' : 'ambient-pat'}`);
      });
    }
  });
}

test('SA example factories reject missing credentials, conflicting credentials and invalid regions', async () => {
  for (const extra of [{}, { QODER_SA_KEY: 'key', QODER_ACCESS_TOKEN: 'sat' }]) {
    await withEnv({ QODER_AUTH_MODE: 'sa', ...extra }, () => {
      assert.throws(() => clientOptions('forward'), /exactly one/);
    });
  }
  await withEnv({ QODER_AUTH_MODE: 'sa', QODER_SA_KEY: 'key', QODER_SA_REGION: 'invalid' }, () => {
    assert.throws(() => clientOptions('managed'), /REGION must be cn or global/);
  });
});

test('SA Key examples keep exchange and business hosts in the selected region', async () => {
  await withEnv({ QODER_AUTH_MODE: 'sa', QODER_SA_KEY: 'key', QODER_SA_REGION: 'cn' }, async () => {
    const requests = [];
    const previousFetch = globalThis.fetch;
    globalThis.fetch = async (url, init) => {
      const request = new Request(url, init);
      requests.push(request);
      const body = request.url.endsWith('/exchange')
        ? { access_token: 'exchanged-sat', token_type: 'Bearer', expires_in: 3600 } : { data: [] };
      return new Response(JSON.stringify(body), { headers: { 'content-type': 'application/json' } });
    };
    try {
      await makeForwardClient().models.list({});
      assert.deepEqual(requests.map(r => new URL(r.url).hostname), ['openapi.qoder.com.cn', 'api.qoder.com.cn']);
      assert.deepEqual(requests.map(r => r.headers.get('authorization')), ['Bearer key', 'Bearer exchanged-sat']);
    } finally { globalThis.fetch = previousFetch; }
  });
});

test('example error logging retains diagnostics without request headers or response bodies', () => {
  const error = Object.assign(new Error('SAT-secret in a response message'), {
    name: 'ConflictError', status: 409, code: 'batch_already_processing', request_id: 'test-request-id',
    request: new Request('https://api.qoder.com', { headers: { authorization: 'Bearer SAT-secret' } }),
    error: { message: 'SAT-secret in response body' },
  });
  assert.equal(formatExampleError(error), 'ConflictError HTTP 409 code=batch_already_processing request_id=test-request-id');
  assert.ok(!formatExampleError(error).includes('SAT-secret'));
});
