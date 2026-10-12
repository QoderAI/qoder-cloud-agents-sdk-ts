// Read-only authentication example: node examples/auth/sa-token.mjs.
// Set QODER_ACCESS_TOKEN and QODER_SA_REGION=cn|global. The caller renews the SAT.
import { ForwardClient, ManagedClient } from '../../dist/index.js';
import { isMain } from '../lib/forward.mjs';

export async function main() {
  if (process.env.QODER_SA_KEY) throw new Error('Unset QODER_SA_KEY before running the SAT example');
  const region = process.env.QODER_SA_REGION || 'cn';
  if (!['cn', 'global'].includes(region)) throw new Error('QODER_SA_REGION must be cn or global');
  const host = region === 'cn' ? 'https://api.qoder.com.cn' : 'https://api.qoder.com';
  const accessToken = process.env.QODER_ACCESS_TOKEN;
  if (!accessToken?.trim()) throw new Error('Configure QODER_ACCESS_TOKEN');
  const forward = new ForwardClient({ authMode: 'sa', accessToken, baseURL: `${host}/api/v1/forward`, maxRetries: 0 });
  const managed = new ManagedClient({ authMode: 'sa', accessToken, baseURL: `${host}/api/v1/cloud`, maxRetries: 0 });
  console.log('Forward templates:', (await forward.templates.list({ limit: 1 })).data.length);
  console.log('Managed agents:', (await managed.agents.list({ limit: 1 })).data.length);
}

if (isMain(import.meta.url)) main().catch(error => {
  console.error(`SAT example failed: ${error.name}`);
  process.exitCode = 1;
});
