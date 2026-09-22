import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';
import { ForwardClient, toFile } from '../../dist/forward/index.js';

export const liveName = (prefix) => `sdk-${prefix}-${Date.now()}-${randomBytes(4).toString('hex')}`;
export const marker = () => randomBytes(12).toString('hex');
export const batchTerminal = (status) => ['completed', 'failed', 'cancelled', 'expired'].includes(status);

export { TurnResult as ForwardTurnResult } from '../execution.mjs';
import { TurnResult as ForwardTurnResult } from '../execution.mjs';

export class CleanupFailure extends Error {
  constructor(message, cause) { super(message, { cause }); this.name = 'CleanupFailure'; }
}

export function resourceAlreadyGone(error) {
  if (error instanceof CleanupFailure) return false;
  return [404, 410].includes(error?.status) || Boolean(error?.cause && resourceAlreadyGone(error.cause));
}

/** Injecting a client and storage fetch lets offline tests execute the live scenarios. */
export class ForwardLiveSuite {
  constructor(client, { timeout = 15_000, scenarioTimeout = 180_000, pollInterval = 2000, model, fetch: storageFetch } = {}) {
    this.client = client;
    this.timeout = timeout;
    this.scenarioTimeout = scenarioTimeout;
    this.pollInterval = pollInterval;
    this.model = model;
    this.storageFetch = storageFetch ?? globalThis.fetch;
    this.options = { signal: AbortSignal.timeout(scenarioTimeout) };
    this.cleanups = [];
  }

  cleanup(label, fn) { this.cleanups.push({ label, fn }); }

  async close() {
    const failures = [];
    for (const { label, fn } of this.cleanups.splice(0).reverse()) {
      try { await fn({ signal: AbortSignal.timeout(this.scenarioTimeout) }); }
      catch (error) {
        if (resourceAlreadyGone(error)) continue;
        failures.push(new CleanupFailure(`cleanup ${label}: ${error.message}`, error));
      }
    }
    if (failures.length) throw new AggregateError(failures, 'Forward live scenario cleanup failed');
  }

  async pause(options = this.options) {
    if (options.signal?.aborted) options.signal.throwIfAborted();
    await delay(this.pollInterval, undefined, { signal: options.signal });
  }

  async environment() {
    const result = await this.client.environments.create({ name: liveName('environment'), config: { type: 'cloud' } }, this.options);
    this.cleanup(`environment ${result.id}`, async (options) => {
      try { await this.client.environments.delete(result.id, options); }
      catch (error) {
        if (error.status !== 409) throw error;
        await this.client.environments.archive(result.id, options);
      }
    });
    return result;
  }

  async identity() {
    const result = await this.client.identities.create({ external_id: liveName('identity'), metadata: { suite: 'sdk-live' } }, this.options);
    this.cleanup(`identity ${result.id}`, (options) => this.client.identities.delete(result.id, options));
    return result;
  }

  async template(environmentID) {
    let model = this.model;
    if (!model) model = (await this.client.models.list(this.options)).data.find((item) => item.is_enabled && item.id)?.id;
    assert.ok(model, 'the live account has no enabled model');
    const result = await this.client.templates.create({ name: liveName('template'), model, environment_id: environmentID, system: 'You are a test assistant.' }, this.options);
    this.cleanup(`template ${result.id}`, (options) => this.client.templates.archive(result.id, {}, options));
    return result;
  }

  async session(identityID, templateID) {
    const result = await this.client.sessions.create({ identity_id: identityID, template_id: templateID, title: 'SDK live session' }, this.options);
    this.cleanupSession(result.id);
    return result;
  }

  cleanupSession(id) { this.cleanup(`session ${id}`, (options) => this.finishSession(id, options)); }

  async file(name, purpose, content) {
    const result = await this.client.files.upload({ file: await toFile(content, name), purpose }, this.options);
    this.cleanup(`file ${result.id}`, (options) => this.client.files.delete(result.id, options));
    return result;
  }

  async sendTurn(sessionID, prompt) {
    const result = await this.client.sessions.events.send(sessionID, {
      events: [{ type: 'user.message', content: [{ type: 'text', text: prompt }] }], idempotency_key: liveName('send'),
    }, this.options);
    assert.equal(result.data.length, 1, 'send must return one user event');
    assert.ok(result.data[0].id, 'send must return the user event ID');
    return result.data[0].id;
  }

  async waitTurn(sessionID, after, expected, tool, streaming) {
    const options = { signal: AbortSignal.timeout(this.scenarioTimeout), timeout: this.scenarioTimeout };
    const result = new ForwardTurnResult();
    result.lastID = after;
    if (streaming) {
      const stream = await this.client.sessions.events.streamEvents(sessionID, { last_event_id: after || undefined, include_tool_calls: true }, options);
      try { for await (const event of stream) if (result.observe(event)) break; }
      finally { stream.controller.abort(); }
    } else {
      while (!result.complete) {
        let count = 0;
        const events = this.client.sessions.events.list(sessionID, { after_id: result.lastID || undefined, order: 'asc', limit: 100, include_tool_calls: true }, options);
        for await (const event of events) {
          assert.ok(++count <= 2000, 'execution exceeded 2000 events');
          if (result.observe(event)) break;
        }
        if (!result.complete) await this.pause(options);
      }
    }
    result.verify(expected, tool);
    return result;
  }

  async finishSession(id, options = { signal: AbortSignal.timeout(this.scenarioTimeout) }) {
    let session = await this.client.sessions.retrieve(id, options);
    if (!['idle', 'terminated'].includes(session.status)) {
      await this.client.sessions.cancel(id, {}, options);
      for (;;) {
        session = await this.client.sessions.retrieve(id, options);
        if (['idle', 'terminated'].includes(session.status)) break;
        await this.pause(options);
      }
    }
    await this.client.sessions.archive(id, {}, options);
  }

  async finishScheduleRun(runID, identityID, options = { signal: AbortSignal.timeout(this.scenarioTimeout) }) {
    for (;;) {
      let run;
      try { run = await this.client.scheduleRuns.retrieve(runID, { identity_id: identityID }, options); }
      catch (error) { throw new Error(`run=${runID} cleanup: ${error.message}`, { cause: error }); }
      if (run.session_id) return this.finishSession(run.session_id, options);
      if (['failed', 'skipped'].includes(run.status)) return;
      assert.notEqual(run.status, 'completed', `completed run ${runID} has no session`);
      try { await this.pause(options); }
      catch (error) { throw new CleanupFailure(`run=${runID} remains ${run.status} without a session`, error); }
    }
  }

  async batchOutput(batchID, options = { signal: AbortSignal.timeout(this.scenarioTimeout) }) {
    const link = await this.client.batches.getOutput(batchID, options);
    const response = await this.storageFetch(link.url, {
      signal: AbortSignal.any([options.signal ?? new AbortController().signal, AbortSignal.timeout(this.timeout)]),
    });
    assert.equal(response.status, 200, `batch output HTTP ${response.status}`);
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let content = '';
    let size = 0;
    try {
      for (;;) {
        const result = await reader.read();
        if (result.done) break;
        size += result.value.byteLength;
        assert.ok(size <= 4 * 1024 * 1024, 'batch output exceeds 4 MiB');
        content += decoder.decode(result.value, { stream: true });
      }
      content += decoder.decode();
    } finally { await reader.cancel().catch(() => {}); reader.releaseLock(); }
    return content.split(/\r?\n/).filter(Boolean).map((line) => {
      assert.ok(Buffer.byteLength(line) <= 2 * 1024 * 1024, 'batch output row exceeds 2 MiB');
      return JSON.parse(line);
    });
  }

  async finishBatch(id, customID, identityID, templateID, options = { signal: AbortSignal.timeout(this.scenarioTimeout) }) {
    let current = await this.client.batches.retrieve(id, options);
    if (!batchTerminal(current.status)) await this.client.batches.cancel(id, {}, options);
    while (!batchTerminal(current.status)) {
      current = await this.client.batches.retrieve(id, options);
      if (!batchTerminal(current.status)) await this.pause(options);
    }
    if (!current.output_file_id) {
      if (current.request_counts?.total === 0) return;
      throw new CleanupFailure(`batch=${id} has no output for session cleanup`);
    }
    let rows;
    try { rows = await this.batchOutput(id, options); }
    catch (error) { throw new CleanupFailure(`batch=${id} output cleanup failed`, error); }
    assert.equal(rows.length, 1, `batch=${id} cleanup output does not match test input`);
    const row = rows[0];
    assert.equal(row.custom_id, customID);
    assert.equal(row.identity_id, identityID);
    assert.equal(row.template_id, templateID);
    if (row.session_id) await this.finishSession(row.session_id, options);
  }
}

function seconds(name, fallback, maximum = Number.MAX_SAFE_INTEGER) {
  if (!process.env[name]) return fallback * 1000;
  const value = Number(process.env[name]);
  assert.ok(Number.isInteger(value) && value > 0 && value <= maximum, `${name} must be between 1 and ${maximum}`);
  return value * 1000;
}

export function forwardLiveSkipReason(scenario) {
  if (!process.env.QODER_FORWARD_PAT) return 'QODER_FORWARD_PAT is not configured';
  for (const gate of scenario.gates ?? []) {
    const allowed = scenario.execution ? ['true'] : ['1', 't', 'T', 'true', 'TRUE', 'True'];
    if (!allowed.includes(process.env[`QODER_FORWARD_LIVE_ALLOW_${gate}`])) return `QODER_FORWARD_LIVE_ALLOW_${gate} is not true`;
  }
  if (scenario.execution && !process.env.QODER_FORWARD_MODEL) return 'QODER_FORWARD_MODEL is not configured';
  if (scenario.requiresSession && !process.env.QODER_FORWARD_LIVE_SESSION_ID) return 'QODER_FORWARD_LIVE_SESSION_ID is not configured';
  return false;
}

export function createForwardLiveSuite() {
  const timeout = seconds('QODER_FORWARD_LIVE_TIMEOUT_SECONDS', 15);
  const scenarioTimeout = seconds('QODER_E2E_TIMEOUT_SECONDS', 180, 1800);
  return new ForwardLiveSuite(new ForwardClient({ pat: process.env.QODER_FORWARD_PAT, timeout, maxRetries: 0 }), {
    timeout, scenarioTimeout, model: process.env.QODER_FORWARD_MODEL,
  });
}
