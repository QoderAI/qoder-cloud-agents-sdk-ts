// Independent oracle: verbatim documented fixtures and the frozen public API surface.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { sdk, methods, contracts, operations, lookup, argumentsFor, invoke, resource, response, testClient, assertRequest } from './helpers.mjs';

const handwrittenMethods = {
  forward: ['sessions.events.resumableStream'],
  managed: ['sessions.events.resumableStream'],
};

for (const mode of ['forward', 'managed']) {
  test(`${mode}: public resource inventory exactly matches the frozen API surface plus handwritten helpers (${mode === 'forward' ? 110 : 95} APIs)`, () => {
    const client = testClient(mode, () => { throw Error('inventory must not call network'); });
    const expectedRoots = [...new Set(methods[mode].map(m => m.entry.split('.')[0]))];
    const actualRoots = Object.entries(client).filter(([, value]) => value && typeof value === 'object' && Object.hasOwn(value, '_client')).map(([key]) => key);
    assert.deepEqual(actualRoots.sort(), expectedRoots.sort(), 'unexpected root API resource');
    const actual = [];
    const walk = (obj, path) => {
      const prototype = Object.getPrototypeOf(obj);
      for (const key of Object.getOwnPropertyNames(prototype)) {
        if (key !== 'constructor' && typeof prototype[key] === 'function') actual.push(`${path}.${key}`);
      }
      for (const [key, value] of Object.entries(obj)) {
        if (!key.startsWith('_') && value && typeof value === 'object' && !Array.isArray(value) && !['client', 'options'].includes(key)) walk(value, `${path}.${key}`);
      }
    };
    for (const entry of [...new Set(methods[mode].map(m => m.entry.split('.')[0]))]) walk(client[entry], entry);
    const expected = methods[mode].map(m => `${m.entry}.${m.method}`);
    assert.equal(expected.length, mode === 'forward' ? 110 : 95);
    assert.equal(new Set(expected).size, expected.length);
    assert.deepEqual(actual.sort(), [...expected, ...handwrittenMethods[mode]].sort());
  });
  for (const c of contracts[mode]) {
    const m = lookup(mode, c);
    const op = mode === 'forward' ? operations.find(o => o.operation_id === c.operation_id) : undefined;
    const name = `${mode}.${m.entry}.${m.method}`;
    const download = !!c.download;
    const raw = !!c.raw;
    const stream = !!c.stream;
    test(`${name}: successful documented request/response`, async () => {
      let calls = 0;
      const client = testClient(mode, async req => {
        calls++;
        if (new URL(req.url).hostname === 'storage.test') {
          assert.equal(req.headers.get('authorization'), null);
          return response('file bytes');
        }
        await assertRequest(req, mode, c, op);
        if (download) return response({ url: 'https://storage.test/file?signature=test', expires_at: '2026-09-09T00:00:00Z' });
        if (raw) return response('PK-zip-content', 200, { 'content-type': 'application/zip' });
        if (stream) {
          assert.equal(req.headers.get('accept'), 'text/event-stream');
          return response('id: evt_one\nevent: agent.message\ndata: {"id":"evt_one","type":"agent.message","session_id":"sess_one","content":[{"type":"text","text":"hello"}]}\n\n', 200, { 'content-type': 'text/event-stream' });
        }
        if (c.empty) return response(null, 204);
        return response(c.response);
      });
      const result = await invoke(client, m, await argumentsFor(mode, m, op));
      if (stream) {
        const events = [];
        for await (const event of result) events.push(event);
        assert.deepEqual(events, [{ id: 'evt_one', type: 'agent.message', session_id: 'sess_one', content: [{ type: 'text', text: 'hello' }] }]);
      } else if (download || raw) {
        assert.ok(result instanceof Response);
        assert.equal(await result.text(), download ? 'file bytes' : 'PK-zip-content');
      } else if (!c.empty) {
        // Assert every documented field, including unknown, nullable and nested data.
        const actual = JSON.parse(JSON.stringify(result));
        assert.deepEqual(actual, c.response);
      } else assert.equal(result, undefined);
      assert.equal(calls, download ? 2 : 1);
    });
    for (const status of [400, 401, 403, 404, 409, 422, 429, 500, 503]) {
      test(`${name}: HTTP ${status} preserves the documented error contract`, async () => {
        let calls = 0;
        const client = testClient(mode, () => { calls++; return response({ request_id: 'body-id', error: { type: 'test_error', code: 'TEST_FAILURE', message: 'expected failure' } }, status, { 'x-request-id': 'header-id' }); });
        const args = await argumentsFor(mode, m, op);
        await assert.rejects(() => invoke(client, m, args), error => {
          assert.ok(error instanceof sdk.APIError);
          assert.equal(error.status, status);
          assert.equal(error.code, 'TEST_FAILURE');
          assert.equal(error.request_id, 'body-id');
          assert.equal(error.type, 'test_error');
          assert.ok(error.message.includes('expected failure'));
          assert.ok(error.request);
          assert.ok(error.response);
          return true;
        });
        assert.equal(calls, 1);
      });
    }
    for (const body of ['{broken', 'upstream unavailable']) {
      test(`${name}: gateway error ${body}`, async () => {
        const client = testClient(mode, () => response(body, 502, { 'x-request-id': 'gateway-id' }));
        const args = await argumentsFor(mode, m, op);
        await assert.rejects(() => invoke(client, m, args), error => {
          assert.ok(error instanceof sdk.APIError);
          assert.equal(error.status, 502);
          assert.equal(error.request_id, 'gateway-id');
          assert.ok(error.message.includes(body));
          return true;
        });
      });
    }
    test(`${name}: transport error retains cause`, async () => {
      const cause = Error('connection failed');
      const client = testClient(mode, () => { throw cause; });
      const args = await argumentsFor(mode, m, op);
      await assert.rejects(() => invoke(client, m, args), e => e === cause || e.cause === cause);
    });
    test(`${name}: canceled request cannot succeed`, async () => {
      const controller = new AbortController();
      controller.abort();
      const client = testClient(mode, req => { req.signal.throwIfAborted(); throw Error('canceled request lost signal'); });
      const args = await argumentsFor(mode, m, op);
      await assert.rejects(() => invoke(client, m, args, { signal: controller.signal }), e => /abort|cancel/i.test(`${e.name} ${e.message}`));
    });
    for (const [index, a] of m.args.entries()) {
      const paths = a.kind === 'path' ? [null] : (a.fields ?? []).filter(f => f.location === 'path').map(f => f.wire);
      for (const field of paths) test(`${name}: missing path ${field ?? a.name} fails before transport`, async () => {
        const client = testClient(mode, () => { assert.fail('missing required path reached transport'); });
        const args = await argumentsFor(mode, m, op);
        if (field) args[index][field] = ''; else args[index] = '';
        await assert.rejects(() => invoke(client, m, args), /missing required/i);
      });
    }
  }
}
