// Managed SDK 示例共享助手（examples 专用）。
//
// 仅作代码示例：纯演示、无断言、不 import tests/。集中放置各主题共用的步骤——
// 构造客户端、选模型、创建 Environment/Agent/Session、发一轮消息并流式打印助手
// 回复、逆序清理资源。等价于 Go 仓 examples/internal 下的 managedutil/live，但
// 去掉了断言与校验逻辑。
import { pathToFileURL } from 'node:url';
import { randomBytes } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';
import { ManagedClient, toFile } from '../../dist/managed/index.js';

export { toFile };

export const name = (kind) => `sdk-example-${kind}-${randomBytes(4).toString('hex')}`;
export const marker = () => randomBytes(12).toString('hex');

// 仅当文件被 `node <file>` 直接运行时返回 true；被 import 时为 false（不触发网络）。
export const isMain = (moduleURL) => Boolean(process.argv[1]) && moduleURL === pathToFileURL(process.argv[1]).href;

// 从公开 API 构造 Managed 客户端；凭据与地址来自环境变量。
export function makeManagedClient() {
  const pat = process.env.QODER_PAT ?? process.env.QODER_MANAGED_PAT;
  if (!pat) throw new Error('设置 QODER_PAT 或 QODER_MANAGED_PAT 后运行本示例');
  return new ManagedClient({ pat, baseURL: process.env.QODER_MANAGED_BASE_URL, maxRetries: 0 });
}

export function printReply(text) {
  const trimmed = (text ?? '').trim();
  if (!trimmed) return;
  console.log('  助手：');
  for (const line of trimmed.split('\n')) console.log(`    ${line}`);
}

export function historyMessage(event) {
  const role = event.type === 'user.message' ? '用户' : event.type === 'agent.message' ? '助手' : '';
  if (!role) return null;
  const content = event.content;
  const text = typeof content === 'string'
    ? content
    : Array.isArray(content) ? content.filter((b) => b.type === 'text').map((b) => b.text ?? '').join('\n') : '';
  return text ? { role, text } : null;
}

function messageText(event) {
  return (event.content ?? []).filter((b) => b.type === 'text').map((b) => b.text ?? '').join('');
}

// Managed 示例运行器：持有客户端、选中的模型，以及待清理资源（逆序清理）。
export class ManagedExample {
  constructor() {
    this.client = makeManagedClient();
    this.model = '';
    this.cleanups = [];
  }

  step(message) { console.log(`\n[步骤] ${message}`); }
  info(message) { console.log(`  ${message}`); }

  track(label, run) { this.cleanups.push({ label, run }); }

  async cleanup() {
    for (const { label, run } of this.cleanups.reverse()) {
      try { await run(); console.log(`  已清理：${label}`); }
      catch (error) { console.log(`  清理失败（忽略）：${label} — ${error?.message ?? error}`); }
    }
    this.cleanups = [];
  }

  async selectModel() {
    if (this.model) return this.model;
    this.step('查询账号可用的模型');
    const models = await this.client.models.list({});
    const enabled = models.data.filter((m) => m.is_enabled).map((m) => m.id);
    if (!enabled.length) throw new Error('账号没有已启用的模型');
    this.model = enabled.find((id) => ['qoder-lite', 'lite', 'qoder-plus', 'plus'].includes(id)) ?? enabled[0];
    this.info(`已启用 ${enabled.length} 个模型，本次使用：${this.model}`);
    return this.model;
  }

  async environment() {
    this.step('创建云端执行环境（Environment）');
    const env = await this.client.environments.create({ name: name('env'), config: { type: 'cloud' } });
    this.track(`environment ${env.id}`, () => this.client.environments.archive(env.id, {}));
    return env;
  }

  // 创建助手（Agent），配置模型和工具；extra 可覆盖/追加字段（如 tools、skills）。
  async agent(extra = {}) {
    await this.selectModel();
    this.step('创建助手（Agent），配置模型和工具');
    const agent = await this.client.agents.create({
      name: name('agent'),
      model: { id: this.model },
      system: '你是一个 SDK 示例助手。帮助用户了解会话、文件、技能与记忆的用法，必要时调用工具。仅使用可实际读取的数据回答问题。',
      tools: [{ type: 'agent_toolset_20260401' }],
      ...extra,
    });
    this.track(`agent ${agent.id}`, () => this.client.agents.archive(agent.id, {}));
    return agent;
  }

  async session(params) {
    this.step('创建会话（Session），关联助手和执行环境');
    const session = await this.client.sessions.create(params);
    this.track(`session ${session.id}`, () => this.finishSession(session.id));
    return session;
  }

  // 结束会话：非空闲/终止先发送 user.interrupt 并等待，再删除。
  async finishSession(id) {
    let session = await this.client.sessions.retrieve(id, {});
    if (!['idle', 'terminated'].includes(session.status)) {
      await this.client.sessions.events.send(id, { events: [{ type: 'user.interrupt' }] });
      for (;;) {
        session = await this.client.sessions.retrieve(id, {});
        if (['idle', 'terminated'].includes(session.status)) break;
        await delay(2000);
      }
    }
    await this.client.sessions.delete(id, {});
  }

  async send(sessionID, prompt) {
    const sent = await this.client.sessions.events.send(sessionID, {
      events: [{ type: 'user.message', content: [{ type: 'text', text: prompt }] }],
    });
    return sent.data[0]?.id ?? '';
  }

  // 打开一个 SSE 流。after 通过 Last-Event-ID 头恢复；deltas 订阅文本增量事件类型。
  async openStream(sessionID, { after = '', deltas = [] } = {}) {
    const params = {};
    if (after) params.last_event_id = after;
    if (deltas.length) params.event_deltas = deltas;
    return this.client.sessions.events.streamEvents(sessionID, params);
  }

  async streamReply(sessionID, after) {
    this.step('通过 SSE 接收助手回复');
    const stream = await this.openStream(sessionID, { after });
    try {
      for await (const event of stream) {
        if (event.type === 'agent.tool_use' || event.type === 'agent.mcp_tool_use' || event.type === 'agent.custom_tool_use') {
          this.info(`→ 调用工具：${event.name ?? '工具执行'}`);
        } else if (event.type === 'agent.message') {
          printReply(messageText(event));
        } else if (event.type === 'session.status_idle') {
          break;
        }
      }
    } finally {
      stream.controller.abort();
    }
  }

  async listReply(sessionID, after = '') {
    this.step('轮询会话事件，打印助手回复');
    let lastID = after;
    let count = 0;
    for (;;) {
      let idle = false;
      for await (const event of this.client.sessions.events.list(sessionID, {
        after_id: lastID || undefined, order: 'asc', limit: 100,
      })) {
        if (++count > 2000) return;
        if (event.id) lastID = event.id;
        if (event.type === 'agent.message') printReply(messageText(event));
        else if (event.type === 'session.status_idle') { idle = true; break; }
      }
      if (idle) break;
      await delay(2000);
    }
  }

  async turn(sessionID, prompt, { stream = true } = {}) {
    this.step('向会话发送消息');
    this.info(`你：${prompt}`);
    const after = await this.send(sessionID, prompt);
    if (stream) await this.streamReply(sessionID, after);
    else await this.listReply(sessionID, after);
  }
}

// 顶层入口封装：运行 demo(example)，无论成败都清理资源；失败置退出码。
export async function runManagedExample(demo) {
  const example = new ManagedExample();
  try {
    await demo(example);
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    await example.cleanup();
  }
}
