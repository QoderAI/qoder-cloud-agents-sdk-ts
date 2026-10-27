import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import test from 'node:test';
import { ForwardClient, ManagedClient } from '../../dist/index.js';

export function searchReadOnlyTests(mode, resources) {
  const prefix = `QODER_${mode.toUpperCase()}`;
  for (const resource of resources) {
    test(`${mode}.${resource}.search readonly`, async t => {
      const pat = process.env[`${prefix}_PAT`]?.trim();
      if (!pat) return t.skip(`${prefix}_PAT is not configured`);
      const Client = mode === 'forward' ? ForwardClient : ManagedClient;
      const client = new Client({ pat, baseURL: process.env[`${prefix}_BASE_URL`], timeout: 30_000, maxRetries: 0 });
      try {
      const { data: page, response } = await client[resource].search({ limit: 1 }).withResponse();
      t.diagnostic(`request_id=${response.headers.get('x-request-id') ?? ''} first_page_items=${page.data.length}`);
      assert.equal(typeof page.has_more, 'boolean');
      assert.ok(page.data.length <= 1 && page.data.every(item => item.id));
      if (page.hasNextPage()) {
        const next = await page.getNextPage();
        t.diagnostic(`request_id=${next.response.headers.get('x-request-id') ?? ''} second_page_items=${next.data.length}`);
        assert.ok(next.data.length <= 1 && next.data.every(item => item.id));
      }
      const empty = await client[resource].search({ limit: 1, metadata: { sdk_search_probe: randomUUID() } });
      assert.deepEqual(empty.data, []);
      assert.equal(empty.hasNextPage(), false);
      } catch (error) {
        if (error.status) throw new Error(`Search failed: HTTP ${error.status} request_id=${error.request_id ?? ''}`);
        throw error;
      }
    });
  }
}
