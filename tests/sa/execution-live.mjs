import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ForwardClient, ManagedClient, ServiceAccountCredential } from '../../dist/index.js';
import { ForwardLiveSuite, marker } from '../live/forward-support.mjs';
import { ManagedScenarioSuite } from '../live/managed-support.mjs';
import { safeFailure } from './diagnostics.mjs';

for (const region of ['cn', 'global']) {
  for (const mode of ['forward', 'managed']) {
    test(`SA execution: ${region} ${mode} write, read, SSE and cleanup`, { timeout: 600_000 }, async (t) => {
      for (const flag of ['QODER_SA_LIVE_ALLOW_WRITE', 'QODER_SA_LIVE_ALLOW_EXECUTION']) {
        assert.equal(process.env[flag], 'true', `${flag}=true is required`);
      }
      const name = region === 'cn' ? 'QODER_SA_CN_KEY' : 'QODER_SA_GLOBAL_KEY';
      assert.ok(process.env[name], `${name} is required`);
      const host = region === 'cn' ? 'https://api.qoder.com.cn' : 'https://api.qoder.com';
      const path = mode === 'forward' ? 'forward' : 'cloud';
      const credential = new ServiceAccountCredential({ saKey: process.env[name], region, scopes: ['qca.access', 'forward.access'] });
      const Client = mode === 'forward' ? ForwardClient : ManagedClient;
      const client = new Client({ credential, baseURL: `${host}/api/v1/${path}/`, maxRetries: 0, timeout: 30_000,
        fetch: async (input, init) => {
          const response = await fetch(input, init);
          const url = new URL(input instanceof Request ? input.url : String(input));
          t.diagnostic(`http method=${init?.method ?? 'GET'} path=${url.pathname} status=${response.status} request_id=${response.headers.get('x-request-id') ?? ''}`);
          return response;
        },
      });
      const model = process.env.QODER_SA_MODEL || 'auto';
      try {
        if (mode === 'forward') {
          const suite = new ForwardLiveSuite(client, { model });
          let failure;
          try {
            const environment = await suite.environment();
            assert.equal((await client.environments.retrieve(environment.id, suite.options)).id, environment.id);
            const identity = await suite.identity();
            const template = await suite.template(environment.id);
            assert.equal((await client.templates.retrieve(template.id, suite.options)).id, template.id);
            const session = await suite.session(identity.id, template.id);
            t.diagnostic(`created session=${session.id} model=${model}`);
            assert.equal((await client.sessions.retrieve(session.id, suite.options)).id, session.id);
            const expected = marker();
            const after = await suite.sendTurn(session.id, `Reply with exactly ${expected}`);
            const reply = await suite.waitTurn(session.id, after, [expected], false, true);
            t.diagnostic(`verified session=${session.id} last_event_id=${reply.lastID} via SSE`);
          } catch (error) { failure = error; }
          const resources = suite.cleanups.map(item => item.label);
          try { await suite.close(); }
          catch (error) { throw new AggregateError([...(failure ? [failure] : []), error], 'Execution or cleanup failed'); }
          t.diagnostic(`cleanup completed: ${resources.join(', ')}`);
          if (failure) throw failure;
        } else {
          const suite = new ManagedScenarioSuite(client, { model });
          await suite.run(async (s) => {
            const environment = await s.createEnvironment();
            assert.equal((await client.environments.retrieve(environment.id, {}, s.options())).id, environment.id);
            const agent = await s.createAgent();
            assert.equal((await client.agents.retrieve(agent.id, {}, s.options())).id, agent.id);
            const session = await client.sessions.create({ agent: agent.id, environment_id: environment.id }, s.options());
            s.cleanupSession(session.id);
            t.diagnostic(`created session=${session.id} model=${model}`);
            assert.equal((await client.sessions.retrieve(session.id, {}, s.options())).id, session.id);
            const expected = marker();
            const after = await s.sendTurn(session.id, `Reply with exactly ${expected}`);
            const reply = await s.waitTurn(session.id, after, [expected], false, true);
            t.diagnostic(`verified session=${session.id} last_event_id=${reply.lastID} via SSE`);
          });
          t.diagnostic('cleanup completed: session, agent, environment');
        }
      } catch (error) { throw new Error(safeFailure(error)); }
    });
  }
}
