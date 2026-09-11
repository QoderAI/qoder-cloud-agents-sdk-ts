import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';
import { TurnResult } from './execution.mjs';

export const managedMarker = () => randomBytes(8).toString('hex');
export const managedName = prefix => `sdk-example-${prefix}-${managedMarker()}`;
export const managedMessage = text => ({ type: 'user.message', content: [{ type: 'text', text }] });

/** Shared helpers ported from Go example/managed/session.go and dream.go. */
export function createManagedExampleSuite(client, config, run) {
  return new ManagedExampleSuite(client, config, run);
}

class ManagedExampleSuite {
  constructor(client, config = {}, run) {
    this.client = client;
    this.config = { timeout: 180_000, cleanupTimeout: 90_000, ...config };
    this.run = run;
    this.model = '';
    this.cleanups = [];
    this.resources = [];
    this.cleanupResults = [];
    this.turnResults = [];
    this.closed = false;
    this.signal = run.signal ?? AbortSignal.timeout(this.config.timeout);
  }

  options(extra = {}) { return { signal: this.signal, ...extra }; }
  pause() { return delay(2000, undefined, { signal: this.signal }); }

  noteResource(kind, id) {
    if (!this.resources.some(item => item.kind === kind && item.id === id)) {
      this.resources.push({ kind, id });
      this.run.record('resources', this.resources.map(item => ({ ...item })));
    }
  }

  track(kind, id, cleanup) {
    assert(id, `Created ${kind} returned no ID`);
    this.noteResource(kind, id);
    this.run.record(kind, id);
    this.cleanups.push({ kind, id, cleanup });
    this.run.log(`已创建 ${kind}：${id}`);
  }

  async close() {
    if (this.closed) return this.cleanupSummary();
    this.closed = true;
    const errors = [];
    while (this.cleanups.length) {
      const { kind, id, cleanup } = this.cleanups.pop();
      // A canceled/expired scenario never cancels its resource cleanup. Every
      // tracked resource receives its own independent cleanup deadline.
      this.signal = AbortSignal.timeout(this.config.cleanupTimeout);
      this.run.log(`清理 ${kind}：${id}`);
      try {
        await cleanup();
        this.cleanupResults.push({ kind, id, status: 'cleaned' });
      } catch (error) {
        this.cleanupResults.push({ kind, id, status: 'failed', error: error.message });
        errors.push(new Error(`清理 ${kind} ${id} 失败`, { cause: error }));
      }
      this.run.record('cleanup', this.cleanupSummary());
    }
    const summary = this.cleanupSummary();
    this.run.record('cleanup', summary);
    if (errors.length) throw Object.assign(new AggregateError(errors, `${errors.length} 项 Managed 资源清理失败`), { cleanup: summary });
    this.run.log(`清理完成：${this.cleanupResults.length} 项资源`);
    return summary;
  }

  cleanupSummary() {
    return {
      total: this.cleanupResults.length,
      passed: this.cleanupResults.filter(item => item.status === 'cleaned').length,
      failed: this.cleanupResults.filter(item => item.status === 'failed').length,
      items: this.cleanupResults.map(item => ({ ...item })),
    };
  }

  async models() {
    this.run.step('查询账号可用的模型');
    const models = await this.client.models.list({}, this.options());
    const enabled = models.data.filter(model => model.is_enabled).map(model => model.id);
    if (this.config.model) {
      assert(enabled.includes(this.config.model), 'Configured model is not enabled for this account');
      this.model = this.config.model;
    } else {
      this.model = ['qoder-lite', 'lite', 'qoder-plus', 'plus'].find(model => enabled.includes(model)) ?? enabled[0];
      assert(this.model, 'No enabled models returned');
    }
    this.run.record('model', this.model);
    this.run.record('enabledModels', enabled);
    this.run.log(`已启用 ${enabled.length} 个模型，本次使用：${this.model}`);
    return enabled;
  }

  async environment() {
    this.run.step('创建云端执行环境（Environment）');
    const environment = await this.client.environments.create({ name: managedName('env'), config: { type: 'cloud' } }, this.options());
    this.track('environment', environment.id, () => this.client.environments.archive(environment.id, {}, this.options()));
    return environment.id;
  }

  async agent(params = {}) {
    if (!this.model) await this.models();
    this.run.step('创建助手（Agent），配置模型和工具');
    const agent = await this.client.agents.create({
      ...params,
      name: managedName('agent'),
      model: { id: this.model },
      system: '你是一个 SDK 示例助手。帮助用户了解会话、文件、技能与记忆的用法，必要时调用工具。仅使用可实际读取的数据回答问题。',
      tools: [{ type: 'agent_toolset_20260401' }],
    }, this.options());
    this.track('agent', agent.id, () => this.client.agents.archive(agent.id, {}, this.options()));
    return agent.id;
  }

  async newSession(params) {
    this.run.step('创建会话（Session），关联助手和执行环境');
    const session = await this.client.sessions.create(params, this.options());
    this.track('session', session.id, () => this.finishSession(session.id));
    return session.id;
  }

  async finishSession(id) {
    let session = await this.client.sessions.retrieve(id, {}, this.options());
    if (!['idle', 'terminated'].includes(session.status)) {
      await this.client.sessions.events.send(id, { events: [{ type: 'user.interrupt' }] }, this.options());
      for (;;) {
        session = await this.client.sessions.retrieve(id, {}, this.options());
        if (['idle', 'terminated'].includes(session.status)) break;
        await this.pause();
      }
    }
    await this.client.sessions.delete(id, {}, this.options());
  }

  async send(id, prompt) {
    const response = await this.client.sessions.events.send(id, { events: [managedMessage(prompt)] }, this.options({ idempotencyKey: managedName('event') }));
    assert.equal(response.data?.length, 1, 'Send did not return one user event');
    assert(response.data[0].id, 'Send did not return one user event ID');
    return response.data[0].id;
  }

  async waitReply(id, after, streaming = false) {
    this.run.step(streaming ? '通过 SSE 接收助手回复' : '轮询会话事件，等待助手回复');
    const result = new TurnResult(after);
    const toolCalls = [];
    const observe = event => {
      const complete = result.observe(event);
      if (['agent.tool_use', 'agent.mcp_tool_use'].includes(event.type)) {
        // Retain paths for diagnosing reused Skill content without logging tool
        // result bodies, shell commands, or environment variable values.
        const path = event.input?.file_path ?? event.input?.path ?? event.input?.filePath;
        toolCalls.push({ id: event.id, type: event.type, name: event.name, ...(typeof path === 'string' ? { path } : {}) });
        this.run.log(`工具调用：${event.name ?? event.type}${typeof path === 'string' ? ` · ${path}` : ''}`);
      }
      if (event.type === 'agent.message') this.run.log(`助手：${result.text.trim()}`);
      if (event.type.startsWith('session.status_')) this.run.log(`会话状态：${event.type.slice('session.status_'.length)}`);
      return complete;
    };
    if (streaming) {
      const stream = await this.client.sessions.events.streamEvents(id, {}, this.options({ headers: { 'Last-Event-ID': after }, timeout: this.config.timeout }));
      try { for await (const event of stream) if (observe(event)) break; }
      finally { await stream.close(); }
    } else {
      while (!result.complete) {
        const params = { order: 'asc', limit: 100, ...(result.lastID ? { after_id: result.lastID } : {}) };
        let count = 0;
        for await (const event of this.client.sessions.events.list(id, params, this.options())) {
          assert(++count <= 2000, 'Event polling exceeded 2000 events');
          if (observe(event)) break;
        }
        if (!result.complete) await this.pause();
      }
    }
    this.run.record('lastEventID', result.lastID);
    this.run.record('assistantText', result.text);
    this.run.record('toolUsed', result.toolUsed);
    this.turnResults.push({ after, lastEventID: result.lastID, assistantText: result.text, toolUsed: result.toolUsed, complete: result.complete, toolCalls });
    this.run.record('turns', this.turnResults.map(turn => ({ ...turn, toolCalls: turn.toolCalls.map(call => ({ ...call })) })));
    return result;
  }

  async waitTurn(id, after, expected, tool = false, streaming = false) {
    const result = await this.waitReply(id, after, streaming);
    this.run.step('校验本轮回复');
    result.verify(expected, tool);
    this.run.check(`回复包含 ${expected.length} 个预期值，且本轮已正常结束`);
    if (tool) this.run.check('已观察到实际工具调用');
    return result;
  }

  async turn(id, prompt, expected, tool = false, streaming = false) {
    this.run.step('向会话发送消息');
    this.run.log(`用户：${prompt}`);
    const after = await this.send(id, prompt);
    return this.waitTurn(id, after, expected, tool, streaming);
  }

  async finishDream(id, inputID) {
    let current = await this.client.dreams.retrieve(id, {}, this.options());
    if (['pending', 'running'].includes(current.status)) {
      await this.client.dreams.cancel(id, {}, this.options());
      while (['pending', 'running'].includes(current.status)) {
        await this.pause();
        current = await this.client.dreams.retrieve(id, {}, this.options());
      }
    }
    const errors = [];
    if (current.session_id) {
      this.noteResource('dream_session', current.session_id);
      this.run.log(`清理 Dream 关联的会话：${current.session_id}`);
      try {
        await this.finishSession(current.session_id);
        this.cleanupResults.push({ kind: 'dream_session', id: current.session_id, status: 'cleaned' });
      } catch (error) {
        this.cleanupResults.push({ kind: 'dream_session', id: current.session_id, status: 'failed', error: error.message });
        errors.push(error);
      }
    }
    const seen = new Set([inputID]);
    for (const output of current.outputs ?? []) {
      if (!output.memory_store_id || seen.has(output.memory_store_id)) continue;
      seen.add(output.memory_store_id);
      this.noteResource('dream_output_memory_store', output.memory_store_id);
      this.run.log(`清理 Dream 输出记忆库：${output.memory_store_id}`);
      try {
        await this.client.memoryStores.delete(output.memory_store_id, {}, this.options());
        this.cleanupResults.push({ kind: 'dream_output_memory_store', id: output.memory_store_id, status: 'cleaned' });
      } catch (error) {
        this.cleanupResults.push({ kind: 'dream_output_memory_store', id: output.memory_store_id, status: 'failed', error: error.message });
        errors.push(error);
      }
    }
    try { await this.client.dreams.archive(id, {}, this.options()); }
    catch (error) { errors.push(error); }
    if (errors.length) throw new AggregateError(errors, 'Dream 关联资源清理失败');
  }
}
