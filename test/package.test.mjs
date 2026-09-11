import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { test } from 'node:test';

const require = createRequire(import.meta.url);
for (const mode of ['forward', 'managed']) {
  test(`package ${mode}: CommonJS and ESM exports resolve and call the API`, async () => {
    const modules = [require(`qca-sdk/${mode}`), await import(`qca-sdk/${mode}`)];
    for (const module of modules) {
      const Client = module.default;
      assert.equal(typeof Client, 'function');
      assert.equal(typeof module.PATCredential, 'function');
      assert.equal(typeof module.toFile, 'function');
      const client = new Client({ accessToken: 'package-test', maxRetries: 0, fetch: async (url, init) => {
        assert.match(String(url), /\/models$/);
        assert.equal(new Headers(init.headers).get('Authorization'), 'Bearer package-test');
        return new Response(JSON.stringify({ data: [{ id: 'model-one' }], has_more: false }));
      } });
      const page = await client.models.list();
      assert.equal(page.data[0].id, 'model-one');
    }
  });
}
test('package root: named exports are available to CommonJS and ESM', async () => {
  for (const module of [require('qca-sdk'), await import('qca-sdk')]) {
    for (const name of ['ForwardClient', 'ManagedClient', 'APIPromise', 'Stream', 'Page', 'PATCredential', 'toFile', 'APIError']) {
      assert.equal(typeof module[name], 'function', name);
    }
  }
});
