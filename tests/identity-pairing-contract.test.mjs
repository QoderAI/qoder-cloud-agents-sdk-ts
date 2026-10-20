import assert from 'node:assert/strict';
import test from 'node:test';
import { testClient, response } from './helpers.mjs';
import { toFile } from '../dist/index.js';

// Official Forward resource ownership and pairing contracts (2026-10-20).
const operations = [
  ["GET", "environments", (c, scope, file) => c.environments.list({ ...scope })],
  ["POST", "environments", (c, scope, file) => c.environments.create({ name: 'env', ...scope })],
  ["GET", "environments/env", (c, scope, file) => c.environments.retrieve('env', scope)],
  ["POST", "environments/env", (c, scope, file) => c.environments.update('env', { name: 'renamed', ...scope })],
  ["POST", "environments/env/archive", (c, scope, file) => c.environments.archive('env', scope)],
  ["DELETE", "environments/env", (c, scope, file) => c.environments.delete('env', scope)],
  ["GET", "skills", (c, scope, file) => c.skills.list(scope)],
  ["POST", "skills", (c, scope, file) => c.skills.create({ files: [file], ...scope })],
  ["GET", "skills/skill", (c, scope, file) => c.skills.retrieve('skill', scope)],
  ["PUT", "skills/skill", (c, scope, file) => c.skills.update('skill', { description: 'desc', ...scope })],
  ["DELETE", "skills/skill", (c, scope, file) => c.skills.delete('skill', scope)],
  ["GET", "skills/skill/versions", (c, scope, file) => c.skills.versions.list('skill', scope)],
  ["POST", "skills/skill/versions", (c, scope, file) => c.skills.versions.create('skill', { files: [file], ...scope })],
  ["GET", "skills/skill/versions/1", (c, scope, file) => c.skills.versions.retrieve('skill', '1', scope)],
  ["DELETE", "skills/skill/versions/1", (c, scope, file) => c.skills.versions.delete('skill', '1', scope)],
  ["GET", "skills/skill/versions/1/content", (c, scope, file) => c.skills.versions.download('skill', '1', scope)],
  ["GET", "vaults", (c, scope, file) => c.vaults.list(scope)],
  ["POST", "vaults", (c, scope, file) => c.vaults.create({ display_name: 'vault', ...scope })],
  ["GET", "vaults/vault", (c, scope, file) => c.vaults.retrieve('vault', scope)],
  ["DELETE", "vaults/vault", (c, scope, file) => c.vaults.delete('vault', scope)],
  ["GET", "vaults/vault/credentials", (c, scope, file) => c.vaults.credentials.list('vault', scope)],
  ["POST", "vaults/vault/credentials", (c, scope, file) => c.vaults.credentials.create('vault', { auth: { type: 'static_bearer', token: 'secret' }, ...scope })],
  ["GET", "vaults/vault/credentials/cred", (c, scope, file) => c.vaults.credentials.retrieve('vault', 'cred', scope)],
  ["POST", "vaults/vault/credentials/cred", (c, scope, file) => c.vaults.credentials.update('vault', 'cred', { metadata: { note: 'rotation' }, ...scope })],
  ["DELETE", "vaults/vault/credentials/cred", (c, scope, file) => c.vaults.credentials.delete('vault', 'cred', scope)],
  ["GET", "files", (c, scope, file) => c.files.list(scope)],
  ["POST", "files", (c, scope, file) => c.files.upload({ file, ...scope })],
  ["GET", "files/file", (c, scope, file) => c.files.getMetadata('file', scope)],
  ["DELETE", "files/file", (c, scope, file) => c.files.delete('file', scope)],
  ["GET", "files/file/content", (c, scope, file) => c.files.download('file', scope)],
 ];
for (const [method, path, call] of operations) {
  for (const identity of ['idn_ /?&', '', undefined]) test(`${method} ${path} identity=${identity}`, async () => {
    let apiCalls = 0;
    const c = testClient('forward', async req => {
      const url = new URL(req.url);
      if (url.hostname === 'storage.test') {
        assert.equal(url.search, '?signature=ok');
        assert.equal(req.headers.get('authorization'), null);
        return new Response('content');
      }
      apiCalls++;
      assert.equal(req.method, method);
      assert.equal(url.pathname, `/api/v1/forward/${path}`);
      assert.equal(url.searchParams.get('identity_id'), identity ?? null);
      assert.deepEqual([...url.searchParams.keys()], identity === undefined ? [] : ['identity_id']);
      assert.ok(!(await req.text()).includes('identity_id'));
      if (path === 'files/file/content') return response({ url: 'https://storage.test/content?signature=ok' });
      if (path.endsWith('/content')) return new Response('archive');
      return response({ id: 'resource', data: [], has_more: false });
    });
    const result = await call(c, identity === undefined ? {} : { identity_id: identity }, await toFile('# skill', 'SKILL.md'));
    if (result instanceof Response) await result.arrayBuffer();
    assert.equal(apiCalls, 1);
  });
}

test('Identity options keep explicit query overrides and pagination scope', async () => {
  let calls = 0;
  const c = testClient('forward', req => {
    const url = new URL(req.url);
    assert.equal(url.searchParams.get('identity_id'), 'idn_override');
    calls++;
    return response({ data: [{ id: `env_${calls}` }], has_more: calls === 1, next_page: calls === 1 ? 'cursor' : null });
  });
  const items = []; for await (const e of c.environments.list({ identity_id: 'idn_typed' }, { query: { identity_id: 'idn_override' } })) items.push(e);
  assert.equal(items.length, 2);
  await c.environments.retrieve('env', { identity_id: 'idn_typed', query: { identity_id: 'idn_override' } });
  await c.environments.create({ name: 'env', identity_id: 'idn_typed' }, { query: { identity_id: 'idn_override' } });
});
const pairing = {"id": "pair_one", "type": "channel_pairing", "channel_id": "channel_one", "scope_type": "room", "scope_external_id": "room_one", "scope_display_name": "Team", "identity_id": "idn_one", "template_id": "tmpl_one", "status": "active", "paired_at": "2026-10-20T01:00:00Z"};
for (const selector of [{ code: 'K7MP92' }, { channel_pairing_id: 'pair_one' }]) test(`Pair channel with ${Object.keys(selector)[0]}`, async () => {
  const c = testClient('forward', async req => {
    assert.equal(new URL(req.url).search, '');
    assert.equal(req.headers.get('idempotency-key'), 'pair-once');
    assert.deepEqual(await req.json(), { ...selector, identity_id: 'idn_one', template_id: 'tmpl_one' });
    return response(pairing);
  });
  const result = await c.channelPairings.create({ ...selector, identity_id: 'idn_one', template_id: 'tmpl_one', idempotency_key: 'pair-once' });
  assert.deepEqual(result, pairing);
});
