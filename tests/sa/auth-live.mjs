import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ForwardClient, ManagedClient, ServiceAccountCredential } from '../../dist/index.js';
import { safeFailure } from './diagnostics.mjs';

for (const region of ['cn', 'global']) {
  test(`SA authentication: ${region} Forward and Managed, automatic and static SAT`, { timeout: 180_000 }, async () => {
    const name = region === 'cn' ? 'QODER_SA_CN_KEY' : 'QODER_SA_GLOBAL_KEY';
    assert.ok(process.env[name], `${name} is required`);
    const host = region === 'cn' ? 'https://api.qoder.com.cn' : 'https://api.qoder.com';
    const credential = new ServiceAccountCredential({ saKey: process.env[name], region, scopes: ['qca.access', 'forward.access'] });
    try {
      for (const [Client, resource, path] of [[ForwardClient, 'templates', 'forward'], [ManagedClient, 'agents', 'cloud']]) {
        const options = { baseURL: `${host}/api/v1/${path}/`, maxRetries: 0, timeout: 30_000 };
        const automatic = await new Client({ ...options, credential })[resource].list({ limit: 1 });
        assert.ok(Array.isArray(automatic.data));
        const accessToken = await credential.getToken();
        const direct = await new Client({ ...options, authMode: 'sa', accessToken })[resource].list({ limit: 1 });
        assert.ok(Array.isArray(direct.data));
      }
    } catch (error) { throw new Error(safeFailure(error)); }
  });
}
