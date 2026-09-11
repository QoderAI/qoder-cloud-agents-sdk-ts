import test from 'node:test';
import { forwardScenarios } from './forward-scenarios.mjs';
import { createForwardLiveSuite, forwardLiveSkipReason } from './forward-support.mjs';

// Opt-in gates and PAT names mirror Go forward/*_live_test.go. Never read token files.
for (const scenario of forwardScenarios) {
  test(`Forward live ${scenario.name} [Go ${scenario.goTest}]`, { skip: forwardLiveSkipReason(scenario) }, async (t) => {
    const suite = createForwardLiveSuite();
    try { await scenario.run(suite, t); }
    finally { await suite.close(); }
  });
}
