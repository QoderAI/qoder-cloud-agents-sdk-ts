// Issue a Forward SAT, make one read-only business call, then revoke it.
// Set QODER_SA_KEY and QODER_SA_REGION=cn|global; QODER_IDENTITY_ID selects Identity mode.
import { ForwardClient } from '../../dist/index.js';
import { isMain } from '../lib/forward.mjs';

export async function main() {
  if (process.argv.includes('--help')) {
    console.log('Set QODER_SA_KEY and QODER_SA_REGION=cn|global; optionally QODER_IDENTITY_ID. Issues, uses and revokes a Forward SAT.');
    return;
  }
  const region = process.env.QODER_SA_REGION || 'cn';
  if (!['cn', 'global'].includes(region)) throw new Error('QODER_SA_REGION must be cn or global');
  const host = region === 'cn' ? 'https://api.qoder.com.cn' : 'https://api.qoder.com';
  const baseURL = `${host}/api/v1/forward`;
  const saKey = process.env.QODER_SA_KEY;
  if (!saKey?.trim()) throw new Error('Configure QODER_SA_KEY');
  const identityID = process.env.QODER_IDENTITY_ID;
  const issuer = new ForwardClient({ baseURL, authMode: 'sa' });
  const params = { saKey, ttl_seconds: 600, metadata: { purpose: 'sdk example' } };
  const token = identityID
    ? await issuer.identities.serviceAccountTokens.create(identityID, params)
    : await issuer.serviceAccountTokens.create(params);
  try {
    const runtime = new ForwardClient({ baseURL, authMode: 'sa', accessToken: token.access_token, maxRetries: 0 });
    if (identityID) console.log('Identity sessions:', (await runtime.sessions.list({ identity_ids: [identityID], limit: 1 })).data.length);
    else console.log('Forward templates:', (await runtime.templates.list({ limit: 1 })).data.length);
  } finally {
    await issuer.serviceAccountTokens.revoke(token.auth_token_id, {
      saKey, target_credential_id: token.credential_id, target_expires_at: token.expires_at, reason: 'sdk example complete',
    }, { timeout: 30_000 });
  }
}

if (isMain(import.meta.url)) main().catch(error => {
  console.error(`Forward token example failed: ${error.name}`);
  process.exitCode = 1;
});
