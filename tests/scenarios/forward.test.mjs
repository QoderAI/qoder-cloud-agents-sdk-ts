import { test } from 'node:test';
import { MockPlatform } from '../scenario-harness.mjs';
import { ForwardLiveSuite } from '../live/forward-support.mjs';
import { forwardScenarios } from '../live/forward-scenarios.mjs';
for (const scenario of forwardScenarios) test(`Forward offline ${scenario.goTest}/${scenario.name}`, async () => {
  const platform = new MockPlatform('forward');
  const suite = new ForwardLiveSuite(platform.client, { timeout: 1000, scenarioTimeout: 2000, pollInterval: 1, model: 'model-test', fetch: platform.fetch });
  try {
    if (scenario.requiresSession) {
      const environment = await suite.environment(), identity = await suite.identity(), template = await suite.template(environment.id);
      const session = await suite.session(identity.id, template.id);
      suite.existingSessionID = session.id;
      await suite.sendTurn(session.id, 'Reply with exactly seeded');
    }
    await scenario.run(suite);
  } finally { await suite.close(); }
  platform.assertCleanup();
});
