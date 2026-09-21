// Managed SDK 示例：最小可运行演示，展示 Agent + 会话与流式回复。
// 仅作代码示例，不承担测试作用；运行：node examples/managed-scenarios.mjs
import { pathToFileURL } from 'node:url';
import { ManagedClient } from '../dist/managed/index.js';

const name = (kind) => `sdk-example-${kind}-${Math.random().toString(16).slice(2, 10)}`;

function makeClient() {
  const pat = process.env.QODER_PAT ?? process.env.QODER_MANAGED_PAT;
  if (!pat) throw new Error('设置 QODER_PAT 后运行本示例');
  return new ManagedClient({
    pat,
    baseURL: process.env.QODER_MANAGED_BASE_URL || 'https://api.qoder.com/api/v1/cloud/',
    maxRetries: 0,
  });
}

async function chooseModel(client) {
  const models = await client.models.list();
  const enabled = models.data.filter((m) => m.is_enabled).map((m) => m.id);
  if (!enabled.length) throw new Error('账号没有已启用的模型');
  return enabled[0];
}

// 演示：创建 Agent 与会话，发一轮消息并流式打印助手回复，最后清理。
async function sessionDemo(client) {
  const model = await chooseModel(client);
  console.log(`使用模型：${model}`);

  const agent = await client.agents.create({ name: name('agent'), model, system: '你是一个 SDK 示例助手。' });
  const session = await client.sessions.create({ agent_id: agent.id });
  console.log(`已创建会话：${session.id}`);

  const sent = await client.sessions.events.send(session.id, {
    events: [{ type: 'user.message', content: [{ type: 'text', text: '请用一句话介绍你能提供什么帮助。' }] }],
  });
  const lastEventID = sent.data[0]?.id;

  const stream = await client.sessions.events.streamEvents(session.id, { last_event_id: lastEventID });
  try {
    for await (const event of stream) {
      if (event.type === 'agent.message') {
        const text = (event.content ?? []).filter((b) => b.type === 'text').map((b) => b.text).join('');
        if (text) console.log(`助手：${text}`);
      } else if (event.type === 'session.status_idle') {
        break;
      }
    }
  } finally {
    stream.controller.abort();
  }

  await client.sessions.delete(session.id);
  await client.agents.archive(agent.id);
  console.log('已清理示例资源。');
}

async function main() {
  const client = makeClient();
  await sessionDemo(client);
}

// 仅在直接运行时执行（被 import 时不触发网络）。
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
