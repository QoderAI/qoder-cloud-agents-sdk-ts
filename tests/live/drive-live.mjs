import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { test } from 'node:test';
import { ForwardClient } from '../../dist/index.js';

// Explicit entry point: no model calls; clear is limited to newly created Identities.
for (const region of ['cn', 'global']) for (const auth of ['pat', 'admin_sat', 'identity_sat']) {
  test(`Drive ${region}/${auth}`, { timeout: 240_000 }, async () => {
    assert.equal(process.env.QODER_DRIVE_LIVE_ALLOW_WRITE, 'true');
    const host = region === 'cn' ? 'https://api.qoder.com.cn' : 'https://api.qoder.com';
    const options = { baseURL: `${host}/api/v1/forward/`, maxRetries: 0, timeout: 30_000 };
    const issuer = new ForwardClient({ ...options, authMode: 'sa' });
    const saKey = process.env[`QODER_SA_${region.toUpperCase()}_KEY`];
    const cleanups = [];
    const failures = [];
    let stage = 'setup';
    const safeError = error => error.status ? `HTTP ${error.status} code=${error.code ?? ''} request_id=${error.request_id ?? ''}` : error.name;
    async function issue(identityID) {
      assert.ok(saKey, `QODER_SA_${region.toUpperCase()}_KEY is required`);
      const params = { saKey, ttl_seconds: 600 };
      const token = identityID ? await issuer.identities.serviceAccountTokens.create(identityID, params)
        : await issuer.serviceAccountTokens.create(params);
      cleanups.push(() => issuer.serviceAccountTokens.revoke(token.auth_token_id, {
        saKey, target_credential_id: token.credential_id, target_expires_at: token.expires_at,
      }));
      return new ForwardClient({ ...options, authMode: 'sa', accessToken: token.access_token });
    }
    async function storage(signed, body) {
      assert.ok(!Object.keys(signed.headers).some(key => key.toLowerCase() === 'authorization'));
      return fetch(signed.url, { method: signed.method, headers: signed.headers, body,
        redirect: 'error', signal: AbortSignal.timeout(30_000) });
    }
    try {
      const pat = process.env[`QODER_FORWARD_${region.toUpperCase()}_PAT`];
      if (auth === 'pat') assert.ok(pat, `QODER_FORWARD_${region.toUpperCase()}_PAT is required`);
      const admin = auth === 'pat' ? new ForwardClient({ ...options, authMode: 'pat', pat }) : await issue();
      const identity = await admin.identities.create({ external_id: `sdk-drive-${randomUUID()}` });
      cleanups.push(() => admin.identities.delete(identity.id));
      cleanups.push(() => admin.drives.clear({ identity_id: identity.id }));
      const runtime = auth === 'identity_sat' ? await issue(identity.id) : admin;
      const query = { identity_id: identity.id };
      console.log(`Drive ${region}/${auth} identity_id=${identity.id}`);
      assert.deepEqual((await runtime.drives.listEntries(query)).entries, []);
      const paths = ['sdk 目录/a+b.txt', 'sdk 目录/zero.txt', 'sdk 目录/nested/child.txt'];
      const content = 'SDK Drive verification';
      stage = 'upload';
      for (const path of paths) {
        const signed = await runtime.drives.createUploadUrl({ ...query, path, content_type: 'text/plain' });
        assert.equal(signed.method, 'PUT');
        const response = await storage(signed, path.includes('zero') ? '' : content);
        assert.ok(response.ok, `Storage PUT HTTP ${response.status}`);
        await response.arrayBuffer();
      }
      stage = 'pagination';
      const entries = [], seen = new Set();
      let pageToken;
      do {
        const page = await runtime.drives.listEntries({ ...query, path: 'sdk 目录', limit: 1, page_token: pageToken });
        entries.push(...page.entries);
        pageToken = page.next_page_token;
        if (pageToken) {
          assert.ok(!seen.has(pageToken), 'Repeated cursor');
          seen.add(pageToken);
          assert.ok(seen.size < 10, 'Pagination did not finish');
        }
      } while (pageToken);
      assert.deepEqual(new Set(entries.map(entry => entry.path)), new Set([paths[0], paths[1], 'sdk 目录/nested']));
      assert.equal(entries.find(entry => entry.path === paths[1]).size, 0);
      assert.equal(entries.find(entry => entry.type === 'directory').size, undefined);
      stage = 'download';
      const signed = await runtime.drives.createDownloadUrl({ ...query, path: paths[0] });
      assert.equal(signed.method, 'GET');
      const download = await storage(signed);
      assert.equal(download.status, 200);
      assert.equal(await download.text(), content);
      stage = 'deletion';
      await assert.rejects(runtime.drives.deleteEntry({ ...query, path: 'sdk 目录' }), error => error.status === 409);
      assert.equal((await runtime.drives.deleteEntry({ ...query, path: paths[0] })).deleted_count, 1);
      assert.equal((await runtime.drives.deleteEntry({ ...query, path: paths[0] })).deleted_count, 0);
      assert.equal((await runtime.drives.deleteEntry({ ...query, path: 'sdk 目录/nested', recursive: true })).deleted_count, 1);
      assert.equal((await runtime.drives.clear(query)).deleted_count, 1);
      assert.equal((await runtime.drives.clear(query)).deleted_count, 0);
      if (auth === 'identity_sat') {
        stage = 'Identity isolation';
        const other = await admin.identities.create({ external_id: `sdk-drive-other-${randomUUID()}` });
        cleanups.push(() => admin.identities.delete(other.id));
        await assert.rejects(runtime.drives.listEntries({ identity_id: other.id }), error => error.status === 403);
      } else {
        stage = 'Template managed tools';
        const env = await admin.environments.create({ name: `sdk-drive-${randomUUID()}`, config: { type: 'cloud' } });
        cleanups.push(() => admin.environments.archive(env.id));
        const template = await admin.templates.create({ name: `sdk-drive-${randomUUID()}`, model: 'auto', environment_id: env.id,
          managed_tool_config: { enabled_tools: ['drive'] } });
        cleanups.push(() => admin.templates.archive(template.id, {}));
        assert.deepEqual((await admin.templates.retrieve(template.id)).managed_tool_config.enabled_tools, ['drive']);
        const updated = await admin.templates.update(template.id, { managed_tool_config: { enabled_tools: [] } });
        assert.deepEqual(updated.managed_tool_config?.enabled_tools ?? [], []);
      }
    } catch (error) { failures.push(`${stage}: ${safeError(error)}`); }
    finally {
      for (const action of cleanups.reverse()) {
        try { await action(); } catch (error) { failures.push(`cleanup: ${safeError(error)}`); }
      }
    }
    assert.deepEqual(failures, []);
  });
}
