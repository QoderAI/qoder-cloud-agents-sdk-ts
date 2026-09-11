import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { ForwardLiveSuite, CleanupFailure, resourceAlreadyGone, batchTerminal } from '../tests/live/forward-support.mjs';
import { TurnResult } from './execution.mjs';

export const exampleMarker = () => randomBytes(8).toString('hex');
export const exampleName = (prefix) => `sdk-example-${prefix}-${exampleMarker()}`;
export const EXAMPLE_SYSTEM = '你是一个 SDK 示例助手。帮助用户了解会话、文件、技能与记忆的用法，必要时调用工具。仅使用可实际读取的数据回答问题。';

export function chooseForwardModel(configured, enabled) {
  if (configured) {
    assert.ok(enabled.includes(configured), 'configured model is not enabled for this account');
    return configured;
  }
  const selected = ['qoder-lite', 'lite', 'qoder-plus', 'plus'].find((name) => enabled.includes(name)) ?? enabled[0];
  assert.ok(selected, 'no enabled models returned');
  return selected;
}

/** Six Go example scenarios share this suite; every cleanup gets a fresh deadline. */
export class ForwardExampleSuite extends ForwardLiveSuite {
  constructor(client, config = {}, run = {}) {
    const timeout = config.timeout ?? 300_000;
    super(client, { timeout: 30_000, scenarioTimeout: timeout, pollInterval: config.pollInterval ?? 2000, fetch: config.fetch });
    this.config = { timeout, cleanupTimeout: config.cleanupTimeout ?? 90_000, ...config };
    this.run = run;
    this.options = { signal: run.signal ?? AbortSignal.timeout(timeout), timeout: 30_000 };
    this.resources = [];
    this.replies = [];
    this.turns = [];
  }

  step(text) { this.run.step?.(text); }
  log(text) { this.run.log?.(text); }
  check(text) { this.run.check?.(text); }
  record(key, value) { this.run.record?.(key, value); }

  track(kind, id, fn) {
    assert.ok(id, `created ${kind} has no ID`);
    this.record(kind, id);
    this.resources.push({ kind, id });
    this.record('resources', this.resources.slice());
    this.log(`已创建 ${kind}：${id}`);
    this.cleanup(`${kind} ${id}`, fn);
    return id;
  }

  async close() {
    const failures = [];
    const actions = this.cleanups.splice(0).reverse();
    const summary = { total: actions.length, passed: 0, failed: 0, items: [] };
    for (const { label, fn } of actions) {
      const [kind, id] = label.split(' ');
      try {
        await fn({ signal: AbortSignal.timeout(this.config.cleanupTimeout), timeout: 30_000 });
        summary.items.push({ kind, id, status: 'cleaned' });
        summary.passed++;
        this.log(`已清理 ${label}`);
      } catch (error) {
        if (resourceAlreadyGone(error)) {
          summary.items.push({ kind, id, status: 'already_gone' });
          summary.passed++;
          continue;
        }
        summary.items.push({ kind, id, status: 'failed' });
        summary.failed++;
        failures.push(new CleanupFailure(`cleanup ${label} failed`, error));
      }
    }
    this.record('cleanup', summary);
    if (failures.length) throw Object.assign(new AggregateError(failures, 'Forward example cleanup failed'), { cleanup: summary });
    return summary;
  }

  async models() {
    this.step('查询账号可用的模型');
    const models = await this.client.models.list(this.options);
    const enabled = models.data.filter((model) => model.is_enabled).map((model) => model.id);
    this.model = chooseForwardModel(this.config.model, enabled);
    this.record('model', this.model);
    this.log(`已启用 ${enabled.length} 个模型，本次使用：${this.model}`);
    return enabled;
  }

  async createEnvironment() {
    this.step('创建云端执行环境（Environment）');
    const environment = await this.client.environments.create({ name: exampleName('env'), config: { type: 'cloud' } }, this.options);
    return this.track('environment', environment.id, (options) => this.client.environments.archive(environment.id, options));
  }

  async createIdentity({ memory = false } = {}) {
    this.step(memory ? '创建有展示名的专用 Identity，用于记忆绑定' : '创建用于本次示例的身份（Identity）');
    const identity = await this.client.identities.create({
      external_id: exampleName('identity'),
      name: memory ? '记忆示例用户' : 'SDK 示例用户',
      metadata: { suite: 'sdk-example' },
    }, this.options);
    // Only the Identity created above is cleared. This reclaims the default
    // memory store automatically provisioned by its newly created Sessions.
    return this.track('identity', identity.id, async (options) => {
      const cleared = await this.client.identities.clear(identity.id, { reason: 'SDK example cleanup' }, options);
      assert.equal(cleared.status, 'completed', '专用 Identity 的关联资源清理未完成');
      this.record('identity_clear', { identity_id: identity.id, status: cleared.status, summary: cleared.summary });
      this.check('已清理专用 Identity 的关联资源（包含自动生成的默认记忆库）');
      await this.client.identities.delete(identity.id, options);
    });
  }

  async createTemplate(params) {
    if (!this.model) await this.models();
    this.step('创建助手模板（Template），配置模型和工具');
    const template = await this.client.templates.create({
      ...params, name: exampleName('template'), model: this.model, system: EXAMPLE_SYSTEM,
      tools: [{ type: 'agent_toolset_20260401' }],
    }, this.options);
    return this.track('template', template.id, (options) => this.client.templates.archive(template.id, {}, options));
  }

  async createSession(params) {
    this.step('创建会话（Session），关联助手和执行环境');
    const session = await this.client.sessions.create(params, this.options);
    return this.track('session', session.id, (options) => this.finishSession(session.id, options));
  }

  async finishBatch(batchID, customID, identityID, templateID, options = { signal: AbortSignal.timeout(this.config.cleanupTimeout), timeout: 30_000 }) {
    let current = await this.client.batches.retrieve(batchID, options);
    assert.equal(current.id, batchID, 'batch cleanup response ID mismatch');
    if (!batchTerminal(current.status)) await this.client.batches.cancel(batchID, {}, options);
    while (!batchTerminal(current.status)) {
      current = await this.client.batches.retrieve(batchID, options);
      assert.equal(current.id, batchID, 'batch cleanup response ID mismatch');
      if (!batchTerminal(current.status)) await this.pause(options);
    }
    this.record('batch_final_state', { id: batchID, status: current.status, request_counts: current.request_counts });
    if (!current.output_file_id) {
      if (current.request_counts?.total === 0) return;
      if (current.status !== 'cancelled') throw new CleanupFailure(`batch=${batchID} has no output for session cleanup`);
      // A cancelled queue entry may never produce output. Only a run-exclusive
      // Identity + Template can establish which Sessions this batch could own.
      for (const [kind, id] of [['batch', batchID], ['identity', identityID], ['template', templateID]]) {
        assert.ok(this.resources.some((item) => item.kind === kind && item.id === id), `batch cleanup requires this run's tracked ${kind}`);
      }
      const query = { identity_ids: [identityID], template_id: templateID, source_type: 'batch', include_archived: true, limit: 100 };
      const evidence = { batch_id: batchID, status: current.status, identity_id: identityID, template_id: templateID,
        method: 'exclusive_identity_template_sessions', query, enumerated: false, verified: false, sessions: [] };
      this.record('batch_cleanup_evidence', evidence);
      const seen = new Set();
      // Fully enumerate and validate before mutating any Session. PagePromise
      // visits every page and propagates listing, cursor, and deadline failures.
      try {
        for await (const session of this.client.sessions.list(query, options)) {
          assert.ok(session.id && !seen.has(session.id), 'batch cleanup returned a missing or repeated session ID');
          assert.equal(session.identity_id, identityID, 'batch cleanup session identity mismatch');
          assert.equal(session.template?.id, templateID, 'batch cleanup session template mismatch');
          assert.equal(session.source_type, 'batch', 'batch cleanup session source mismatch');
          seen.add(session.id);
          evidence.sessions.push({ id: session.id, identity_id: session.identity_id, template_id: session.template.id, source_type: session.source_type, cleaned: false });
        }
      } catch (error) {
        // A 404 while discovering Sessions is not evidence the Batch is gone.
        throw new CleanupFailure(`batch=${batchID} session discovery failed: ${error.message}`, error);
      }
      evidence.enumerated = true;
      this.record('batch_cleanup_evidence', evidence);
      try {
        for (const session of evidence.sessions) {
          await this.finishSession(session.id, options);
          session.cleaned = true;
          this.record('batch_cleanup_evidence', evidence);
        }
      } catch (error) {
        throw new CleanupFailure(`batch=${batchID} session cleanup failed: ${error.message}`, error);
      }
      evidence.verified = true;
      this.record('batch_cleanup_evidence', evidence);
      this.check(`已逐页核实本轮专用 Identity 和 Template 的 Batch 会话，${evidence.sessions.length} 个关联会话均已清理`);
      return;
    }
    let rows;
    try { rows = await this.batchOutput(batchID, options); }
    catch (error) { throw new CleanupFailure(`batch=${batchID} output cleanup failed`, error); }
    assert.equal(rows.length, 1, `batch=${batchID} cleanup output does not match test input`);
    const row = rows[0];
    assert.equal(row.custom_id, customID);
    assert.equal(row.identity_id, identityID);
    assert.equal(row.template_id, templateID);
    if (row.session_id) await this.finishSession(row.session_id, options);
  }

  async waitReply(sessionID, after, streaming = false) {
    this.step(streaming ? '通过 SSE 接收助手回复' : '轮询会话事件，等待助手回复');
    const result = new TurnResult(after);
    const toolCalls = [];
    const observe = (event) => {
      const complete = result.observe(event);
      if (event.type === 'agent.message' && result.text) {
        const reply = { session_id: sessionID, event_id: event.id, text: result.text };
        this.record('assistant_reply', reply);
        this.replies.push(reply);
        this.record('assistant_replies', this.replies.slice());
        this.log(`助手：${result.text}`);
      } else if (['agent.tool_use', 'agent.mcp_tool_use'].includes(event.type)) {
        const path = event.input?.file_path ?? event.input?.path ?? event.input?.filePath;
        toolCalls.push({ id: event.id, type: event.type, name: event.name || '工具执行', ...(typeof path === 'string' ? { path } : {}) });
        this.log(`工具调用：${event.name || '工具执行'}${typeof path === 'string' ? ` ${path}` : ''}`);
      } else if (event.type === 'session.status_idle' && complete) {
        this.check('助手已正常结束本轮回复');
      }
      return complete;
    };
    if (streaming) {
      const stream = await this.client.sessions.events.streamEvents(sessionID, { last_event_id: after || undefined, include_tool_calls: true }, {
        ...this.options, timeout: this.config.timeout,
      });
      try { for await (const event of stream) if (observe(event)) break; }
      finally { stream.controller.abort(); }
    } else {
      while (!result.complete) {
        let count = 0;
        const events = this.client.sessions.events.list(sessionID, {
          order: 'asc', limit: 100, include_tool_calls: true, after_id: result.lastID || undefined,
        }, this.options);
        for await (const event of events) {
          assert.ok(++count <= 2000, 'event polling exceeded 2000 events');
          if (observe(event)) break;
        }
        if (!result.complete) await this.pause(this.options);
      }
    }
    this.turns.push({ after, lastEventID: result.lastID, assistantText: result.text, toolUsed: result.toolUsed, complete: result.complete, toolCalls });
    this.record('turns', this.turns.slice());
    return result;
  }

  async verifyTurn(sessionID, after, expected = [], tool = false, streaming = false) {
    const result = await this.waitReply(sessionID, after, streaming);
    this.step('校验本轮回复');
    result.verify(expected, tool);
    this.check(`回复包含 ${expected.length} 个预期值，且本轮已正常结束`);
    if (tool) this.check('已观察到实际工具调用');
    return result;
  }

  async turn(sessionID, prompt, expected = [], tool = false, streaming = false) {
    this.step('向会话发送消息');
    this.log(`用户：${prompt}`);
    const after = await this.sendTurn(sessionID, prompt);
    return this.verifyTurn(sessionID, after, expected, tool, streaming);
  }
}

export const createForwardExampleSuite = (client, config, run) => new ForwardExampleSuite(client, config, run);
