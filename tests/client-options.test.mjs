import assert from 'node:assert/strict';
import { test } from 'node:test';
import { sdk, response, testClient } from './helpers.mjs';

// withOptions follows the fixed Anthropic sdk-v0.127.0 baseline: derive the same
// client type and replace supplied top-level options, keeping unspecified options.
for (const mode of ['forward', 'managed']) {
  const Client = mode === 'forward' ? sdk.ForwardClient : sdk.ManagedClient;
  const resource = client => mode === 'forward' ? client.templates : client.agents;

  test(`${mode}: withOptions retains configuration and binds resources to the derived client`, async () => {
    const requests = [];
    let tokenCalls = 0;
    const original = testClient(mode, req => { requests.push(req); return response({ data: [] }); }, {
      pat: async () => `rotating-${++tokenCalls}`,
      timeout: 10_000,
      maxRetries: 1,
      defaultHeaders: { 'x-default': 'kept' },
      defaultQuery: { user_filter: 'kept' },
      middleware: [async (req, next) => { req.headers.set('x-middleware', 'kept'); return next(req); }],
    });
    const derived = original.withOptions({ baseURL: 'https://derived.test/prefix', timeout: 30_000, maxRetries: 0 });
    assert.ok(derived instanceof Client);
    assert.notEqual(derived, original);
    assert.notEqual(resource(derived), resource(original));
    assert.equal(tokenCalls, 0);
    await resource(derived).list({});
    await resource(original).list({});
    assert.equal(new URL(requests[0].url).origin, 'https://derived.test');
    assert.equal(new URL(requests[1].url).origin, 'https://qoder.test');
    assert.equal(requests[0].headers.get('x-qoder-timeout'), '30');
    assert.equal(requests[1].headers.get('x-qoder-timeout'), '10');
    assert.equal(requests[0].headers.get('authorization'), 'Bearer rotating-1');
    assert.equal(requests[1].headers.get('authorization'), 'Bearer rotating-2');
    for (const req of requests) {
      assert.equal(req.headers.get('x-default'), 'kept');
      assert.equal(req.headers.get('x-middleware'), 'kept');
      assert.equal(new URL(req.url).searchParams.get('user_filter'), 'kept');
    }
    assert.equal(original.maxRetries, 1);
    assert.equal(original.timeout, 10_000);
    assert.equal(derived.maxRetries, 0);
  });

  test(`${mode}: withOptions replaces headers, query, middleware and fetch without changing the parent`, async () => {
    const parentRequests = [], derivedRequests = [];
    const original = testClient(mode, req => { parentRequests.push(req); return response({ data: [] }); }, {
      defaultHeaders: { 'x-parent': 'parent' },
      defaultQuery: { parent_filter: 'parent' },
      middleware: [async (req, next) => { req.headers.set('x-parent-middleware', 'parent'); return next(req); }],
    });
    const derived = original.withOptions({
      pat: 'derived-token',
      defaultHeaders: new Headers({ 'x-derived': 'derived' }),
      defaultQuery: { derived_filter: 'derived' },
      middleware: [],
      fetch: async (input, init) => { derivedRequests.push(new Request(input, init)); return response({ data: [] }); },
    });
    await resource(derived).list({}, { headers: { 'x-derived': 'request' }, query: { derived_filter: 'request' } });
    await resource(original).list({});
    assert.equal(derivedRequests.length, 1);
    assert.equal(parentRequests.length, 1);
    const req = derivedRequests[0];
    assert.equal(req.headers.get('authorization'), 'Bearer derived-token');
    assert.equal(req.headers.get('x-parent'), null);
    assert.equal(req.headers.get('x-derived'), 'request');
    assert.equal(req.headers.get('x-parent-middleware'), null);
    assert.equal(new URL(req.url).searchParams.has('parent_filter'), false);
    assert.equal(new URL(req.url).searchParams.get('derived_filter'), 'request');
    assert.equal(parentRequests[0].headers.get('x-parent'), 'parent');
    assert.equal(parentRequests[0].headers.get('x-parent-middleware'), 'parent');
    assert.equal(parentRequests[0].headers.get('authorization'), 'Bearer secret-pat');
    assert.equal(new URL(parentRequests[0].url).searchParams.get('parent_filter'), 'parent');
  });

  test(`${mode}: withOptions retains and can replace dynamic credentials`, async () => {
    const tokens = [];
    let calls = 0;
    const original = testClient(mode, req => { tokens.push(req.headers.get('authorization')); return response({ data: [] }); }, {
      pat: undefined,
      credential: { getToken: async () => `credential-${++calls}` },
    });
    const derived = original.withOptions({ timeout: 5000 }).withOptions({ maxRetries: 0 });
    await resource(derived).list({});
    await resource(original).list({});
    await resource(derived.withOptions({ credential: { getToken: () => 'replacement' } })).list({});
    await resource(derived.withOptions({ credential: undefined, pat: 'explicit-pat' })).list({});
    assert.deepEqual(tokens, ['Bearer credential-1', 'Bearer credential-2', 'Bearer replacement', 'Bearer explicit-pat']);
  });

  test(`${mode}: withOptions preserves resolved URL and fetch when environment defaults change`, async t => {
    const baseVariable = mode === 'forward' ? 'QODER_FORWARD_BASE_URL' : 'QODER_BASE_URL';
    const previous = process.env[baseVariable];
    const requests = [];
    try {
      process.env[baseVariable] = 'https://initial.test/api';
      t.mock.method(globalThis, 'fetch', async (input, init) => {
        requests.push(new Request(input, init));
        return response({ data: [] });
      });
      const original = new Client({ pat: 'test-token' });
      process.env[baseVariable] = 'https://changed.test/api';
      t.mock.method(globalThis, 'fetch', async () => { throw new Error('unexpected replacement fetch'); });
      const derived = original.withOptions({});
      await resource(derived).list({});
      assert.equal(derived.baseURL, original.baseURL);
      assert.equal(new URL(requests[0].url).origin, 'https://initial.test');
    } finally {
      if (previous === undefined) delete process.env[baseVariable]; else process.env[baseVariable] = previous;
    }
  });

  test(`${mode}: withOptions validates overrides and retains subclasses`, () => {
    class CustomClient extends Client { label = 'custom'; }
    const original = new CustomClient({ pat: 'test-token' });
    const derived = original.withOptions({ timeout: 1234 });
    assert.ok(derived instanceof CustomClient);
    assert.equal(derived.label, 'custom');
    assert.equal(original.timeout, 600_000);
    for (const options of [{ timeout: -1 }, { maxRetries: -1 }, { baseURL: 'ftp://invalid.test' }]) {
      assert.throws(() => original.withOptions(options), sdk.QoderError);
    }
  });
}
