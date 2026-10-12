// Read-only authentication example: node examples/auth/sa-key.mjs.
// Set QODER_SA_KEY and QODER_SA_REGION=cn|global in the process environment.
import { ForwardClient, ManagedClient, ServiceAccountCredential } from '../../dist/index.js';
import { isMain } from '../lib/forward.mjs';

export async function main() {
  if (process.env.QODER_ACCESS_TOKEN) throw new Error('Unset QODER_ACCESS_TOKEN before running the SA Key example');
  const region = process.env.QODER_SA_REGION || 'cn';
  if (!['cn', 'global'].includes(region)) throw new Error('QODER_SA_REGION must be cn or global');
  const host = region === 'cn' ? 'https://api.qoder.com.cn' : 'https://api.qoder.com';
  const credential = new ServiceAccountCredential({
    saKey: process.env.QODER_SA_KEY,
    region,
    scopes: ['qca.access', 'forward.access'],
  });
  // Both clients share the automatically renewed SAT cache.
  const forward = new ForwardClient({ credential, baseURL: `${host}/api/v1/forward`, maxRetries: 0 });
  const managed = new ManagedClient({ credential, baseURL: `${host}/api/v1/cloud`, maxRetries: 0 });
  console.log('Forward templates:', (await forward.templates.list({ limit: 1 })).data.length);
  console.log('Managed agents:', (await managed.agents.list({ limit: 1 })).data.length);
}

if (isMain(import.meta.url)) main().catch(error => {
  console.error(`SA Key example failed: ${error.name}`);
  process.exitCode = 1;
});
