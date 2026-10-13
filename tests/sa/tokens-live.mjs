import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { test } from 'node:test';
import { ForwardClient } from '../../dist/index.js';
import { safeFailure } from './diagnostics.mjs';
import { validateSAEnvironment } from '../../scripts/run-sa-live.mjs';

validateSAEnvironment(process.env, 'tokens');

async function requestLog(input, init) {
  const response = await fetch(input, init);
  const url = new URL(typeof input === 'string' ? input : input.url);
  console.log(`http method=${init?.method ?? input.method ?? 'GET'} path=${url.pathname} status=${response.status} request_id=${response.headers.get('x-request-id') ?? ''}`);
  return response;
}

function verifyToken(token, subject, identityID) {
  assert.ok(token.access_token && token.type === 'service_account_token' && token.token_type === 'Bearer'
    && token.auth_token_id && token.credential_id && token.service_account_id
    && token.subject_type === subject && token.identity_id === identityID
    && token.expires_in > 0 && token.expires_in <= 600 && Date.parse(token.expires_at) > Date.now(),
  'Issued SAT metadata did not match the requested subject and lifetime');
  console.log(`issued subject=${subject} auth_token_id=${token.auth_token_id} credential_id=${token.credential_id} identity_id=${token.identity_id ?? ''} expires_at=${token.expires_at}`);
}

async function denied(action, statuses) {
  try { await action(); }
  catch (error) {
    if (statuses.includes(error.status)) return;
    throw new Error(`Unexpected access refusal: ${safeFailure(error)}`);
  }
  throw new Error('Expected access refusal, but the request succeeded');
}

for (const region of ['cn', 'global']) {
  test(`Forward SAT management: ${region} admin, Identity isolation, revoke`, { timeout: 180_000 }, async () => {
    const saKey = process.env[region === 'cn' ? 'QODER_SA_CN_KEY' : 'QODER_SA_GLOBAL_KEY'];
    const host = region === 'cn' ? 'https://api.qoder.com.cn' : 'https://api.qoder.com';
    const options = { baseURL: `${host}/api/v1/forward/`, authMode: 'sa', maxRetries: 0, timeout: 30_000, fetch: requestLog };
    const issuer = new ForwardClient(options);
    const params = { saKey, ttl_seconds: 600, metadata: { purpose: 'sdk verification', sdk: 'ts' } };
    const cleanups = [];
    async function revoke(token, runtime, identityID) {
      const result = await issuer.serviceAccountTokens.revoke(token.auth_token_id, {
        saKey, target_credential_id: token.credential_id, target_expires_at: token.expires_at, reason: 'sdk verification complete',
      });
      assert.equal(result.revoked, true, 'Revoke did not acknowledge success');
      await denied(() => identityID ? runtime.identities.configs.list(identityID, { limit: 1 })
        : runtime.templates.list({ limit: 1 }), [401, 403]);
    }
    let originalFailure;
    try {
      const adminToken = await issuer.serviceAccountTokens.create(params);
      const admin = new ForwardClient({ ...options, accessToken: adminToken.access_token });
      cleanups.push([`admin SAT ${adminToken.auth_token_id}`, () => revoke(adminToken, admin)]);
      verifyToken(adminToken, 'admin', undefined);
      assert.ok(Array.isArray((await admin.templates.list({ limit: 1 })).data));
      const identities = [];
      for (let i = 0; i < 2; i++) {
        const identity = await admin.identities.create({ external_id: `sdk-ts-sat-${randomUUID()}` });
        cleanups.push([`identity ${identity.id}`, () => admin.identities.delete(identity.id)]);
        assert.ok(identity.id, 'Created Identity must have an ID');
        identities.push(identity.id);
      }
      const identityToken = await issuer.identities.serviceAccountTokens.create(identities[0], params);
      const runtime = new ForwardClient({ ...options, accessToken: identityToken.access_token });
      cleanups.push([`identity SAT ${identityToken.auth_token_id}`, () => revoke(identityToken, runtime, identities[0])]);
      verifyToken(identityToken, 'identity', identities[0]);
      assert.ok(Array.isArray((await runtime.identities.configs.list(identities[0], { limit: 1 })).data));
      await denied(() => runtime.identities.configs.list(identities[1], { limit: 1 }), [403]);
      console.log(`verified ${region} business access and Identity isolation`);
    } catch (error) { originalFailure = safeFailure(error); }
    const failures = originalFailure ? [originalFailure] : [];
    for (const [label, action] of cleanups.reverse()) {
      try {
        await action();
        console.log(`cleanup ${label}: completed`);
      } catch (error) { failures.push(`cleanup ${label}: ${safeFailure(error)}`); }
    }
    if (failures.length) throw new Error(failures.join('; '));
  });
}
