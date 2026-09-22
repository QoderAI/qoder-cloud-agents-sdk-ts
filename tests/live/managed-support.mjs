import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';
import { TurnResult } from '../execution.mjs';
export { TurnResult } from '../execution.mjs';

export const unique = (prefix) => `sdk-${prefix}-${Date.now()}-${randomBytes(4).toString('hex')}`;
export const marker = () => `SDK_PROOF_${randomBytes(16).toString('hex')}`;
export const userMessage = (text) => ({ type: 'user.message', content: [{ type: 'text', text }] });
export class ScenarioSkip extends Error {}

/** Used by the opt-in live runner and the offline scenario tests. */
export class ManagedScenarioSuite {
  constructor(client, { scenarioTimeout = 180_000, model, pollPause } = {}) {
    this.client = client;
    this.scenarioTimeout = scenarioTimeout;
    this.configuredModel = model;
    this.cleanups = [];
    this.pollPause = pollPause ?? (() => delay(2000, undefined, { signal: this.signal }));
    this.signal = AbortSignal.timeout(scenarioTimeout);
  }
  options(extra = {}) { return { signal: this.signal, ...extra }; }
  cleanup(label, run) { this.cleanups.push({ label, run }); }
  async run(scenario) {
    let failure;
    try { await scenario(this); } catch (error) { failure = error; }
    const cleanupErrors = [];
    // Each cleanup gets a fresh deadline even if execution has already timed out.
    while (this.cleanups.length) {
      const { label, run } = this.cleanups.pop();
      this.signal = AbortSignal.timeout(this.scenarioTimeout);
      try { await run(); }
      catch (error) {
        if (![404, 410].includes(error.status)) cleanupErrors.push(new Error(`Cleanup ${label} failed`, { cause: error }));
      }
    }
    if (failure && !cleanupErrors.length) throw failure;
    if (failure || cleanupErrors.length) throw new AggregateError([...(failure ? [failure] : []), ...cleanupErrors], 'Managed scenario or cleanup failed');
  }
  async model() {
    if (this.configuredModel) return this.configuredModel;
    const page = await this.client.models.list({}, this.options());
    const model = page.data.find((item) => item.is_enabled && item.id);
    if (!model) throw new ScenarioSkip('The Managed account has no enabled model');
    return model.id;
  }
  async createEnvironment(config = { type: 'cloud' }) {
    const environment = await this.client.environments.create({ name: unique('env'), config, metadata: { suite: 'sdk-live' } }, this.options());
    this.cleanup(`Environment ${environment.id}`, async () => {
      try { await this.client.environments.delete(environment.id, {}, this.options()); }
      catch (error) {
        if (error.status !== 409) throw error;
        await this.client.environments.archive(environment.id, {}, this.options());
      }
    });
    return environment;
  }
  async createAgent(extra = {}) {
    const agent = await this.client.agents.create({ name: unique('agent'), model: { id: await this.model() }, system: 'You are a Managed SDK test assistant.', metadata: { suite: 'sdk-live' }, ...extra }, this.options({ idempotencyKey: unique('ikey') }));
    this.cleanup(`Agent ${agent.id}`, () => this.client.agents.archive(agent.id, {}, this.options()));
    return agent;
  }
  async createMemoryStore() {
    const store = await this.client.memoryStores.create({ name: unique('memory'), metadata: { suite: 'sdk-live' } }, this.options());
    this.cleanup(`Memory Store ${store.id}`, () => this.client.memoryStores.delete(store.id, {}, this.options()));
    return store;
  }
  cleanupSession(id) { this.cleanup(`Session ${id}`, () => this.finishSession(id)); }
  async finishSession(id) {
    let session = await this.client.sessions.retrieve(id, {}, this.options());
    if (!['idle', 'terminated'].includes(session.status)) {
      await this.client.sessions.events.send(id, { events: [{ type: 'user.interrupt' }] }, this.options());
      for (;;) {
        session = await this.client.sessions.retrieve(id, {}, this.options());
        if (['idle', 'terminated'].includes(session.status)) break;
        await this.pollPause();
      }
    }
    await this.client.sessions.delete(id, {}, this.options());
  }
  async sendTurn(id, prompt) {
    const response = await this.client.sessions.events.send(id, { events: [userMessage(prompt)] }, this.options({ idempotencyKey: unique('send') }));
    assert.equal(response.data?.length, 1, 'Send must return one user event');
    assert(response.data[0].id, 'Send must return one user event ID');
    return response.data[0].id;
  }
  async waitTurn(id, after, expected, tool = false, streaming = false) {
    const result = new TurnResult(after);
    if (streaming) {
      const stream = await this.client.sessions.events.streamEvents(id, {}, this.options({ headers: { 'Last-Event-ID': after }, timeout: this.scenarioTimeout }));
      try {
        for await (const event of stream) if (result.observe(event)) break;
      } finally { stream.controller.abort(); }
    } else {
      while (!result.complete) {
        let count = 0;
        for await (const event of this.client.sessions.events.list(id, { after_id: result.lastID, order: 'asc', limit: 100 }, this.options())) {
          assert(++count <= 2000, 'Execution exceeded 2000 events');
          if (result.observe(event)) break;
        }
        if (!result.complete) await this.pollPause();
      }
    }
    result.verify(expected, tool);
    return result;
  }
}
