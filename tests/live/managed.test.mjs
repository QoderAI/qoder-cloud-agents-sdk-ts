import test from 'node:test';
import { ManagedClient } from '../../dist/managed/index.js';
import { ManagedScenarioSuite, ScenarioSkip } from './managed-support.mjs';
import { managedScenarios } from './managed-scenarios.mjs';

function positiveSeconds(name, fallback, max = Number.MAX_SAFE_INTEGER) {
  const value = process.env[name] === undefined ? fallback : Number(process.env[name]);
  if (!Number.isInteger(value) || value <= 0 || value > max) throw new Error(`${name} must be a positive integer no greater than ${max}`);
  return value * 1000;
}

// Identical authorization gates to Go's live suite. The ordinary npm test never
// loads this runner; enabling live reads alone cannot start writes or inference.
for (const scenario of managedScenarios) {
  test(scenario.name, async (t) => {
    const pat = process.env.QODER_MANAGED_PAT?.trim();
    if (!pat) return t.skip('QODER_MANAGED_PAT is not configured');
    if (scenario.mode !== 'read' && process.env.QODER_MANAGED_LIVE_ALLOW_WRITE !== 'true') return t.skip('QODER_MANAGED_LIVE_ALLOW_WRITE is not true');
    if (['execution', 'e2e'].includes(scenario.mode) && process.env.QODER_MANAGED_LIVE_ALLOW_EXECUTION !== 'true') return t.skip('QODER_MANAGED_LIVE_ALLOW_EXECUTION is not true');
    if (scenario.mode === 'e2e' && !process.env.QODER_MANAGED_MODEL) return t.skip('QODER_MANAGED_MODEL is required for E2E');
    const client = new ManagedClient({
      accessToken: pat,
      baseURL: process.env.QODER_MANAGED_BASE_URL || 'https://api.qoder.com/api/v1/cloud/',
      timeout: positiveSeconds('QODER_MANAGED_LIVE_TIMEOUT_SECONDS', 15),
      maxRetries: 0,
      fetch: async (input, init) => {
        const started = Date.now();
        const url = new URL(input instanceof Request ? input.url : String(input));
        const response = await fetch(input, init);
        // The signed query, body and credentials never enter test diagnostics.
        t.diagnostic(`http method=${init?.method ?? 'GET'} path=${url.pathname} status=${response.status} request_id=${response.headers.get('x-request-id') ?? ''} elapsed=${Date.now() - started}ms`);
        return response;
      },
    });
    const suite = new ManagedScenarioSuite(client, { scenarioTimeout: positiveSeconds('QODER_E2E_TIMEOUT_SECONDS', 180, 1800), model: process.env.QODER_MANAGED_MODEL });
    try { await suite.run(scenario.run); }
    catch (error) {
      if (error instanceof ScenarioSkip) return t.skip(error.message);
      throw error;
    }
  });
}
