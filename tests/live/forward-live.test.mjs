import test from 'node:test';
import { forwardScenarios } from './forward-scenarios.mjs';
import { createForwardLiveSuite, forwardLiveSkipReason } from './forward-support.mjs';

// Live runs are opt-in through explicit gates and PAT env vars. Never read token files.
for (const scenario of forwardScenarios) {
  test(`Forward live ${scenario.name}`, { skip: forwardLiveSkipReason(scenario) }, async (t) => {
    const suite = createForwardLiveSuite();
    try { await scenario.run(suite, t); }
    finally { await suite.close(); }
  });
}
