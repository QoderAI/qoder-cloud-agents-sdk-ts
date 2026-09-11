import { test } from 'node:test';
import { MockPlatform } from '../scenario-harness.mjs';
import { ManagedScenarioSuite } from '../live/managed-support.mjs';
import { managedScenarios } from '../live/managed-scenarios.mjs';
for (const scenario of managedScenarios) test(`Managed offline ${scenario.name}`, async () => {
  const platform = new MockPlatform('managed');
  const suite = new ManagedScenarioSuite(platform.client, { scenarioTimeout: 2000, model: 'model-test', pollPause: async () => {} });
  await suite.run(scenario.run);
  platform.assertCleanup();
});
