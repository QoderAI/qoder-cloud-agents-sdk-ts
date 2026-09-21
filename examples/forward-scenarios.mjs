// Forward SDK 示例：最小可运行演示，展示会话生命周期与流式回复。
// 仅作代码示例，不承担测试作用；运行：node examples/forward-scenarios.mjs
import { pathToFileURL } from 'node:url';
import { ForwardClient } from '../dist/forward/index.js';

const name = (kind) => `sdk-example-${kind}-${Math.random().toString(16).slice(2, 10)}`;

// 从公开 API 构造客户端；凭据来自环境变量。
function makeClient() {
  const pat = process.env.QODER_FORWARD_PAT ?? process.env.QODER_PAT;
  if (!pat) throw new Error('设置 QODER_FORWARD_PAT 或 QODER_PAT 后运行本示例');
  return new ForwardClient({ pat, baseURL: process.env.QODER_FORWARD_BASE_URL, maxRetries: 0 });
}

// 选择一个已启用的模型。
async function chooseModel(client) {
  const models = await client.models.list();
  const enabled = models.data.filter((m) => m.is_enabled).map((m) => m.id);
  if (!enabled.length) throw new Error('账号没有已启用的模型');
  return enabled[0];
}

// 演示：创建环境 / 身份 / 模板 / 会话，发一轮消息并流式打印助手回复，最后清理。
async function sessionDemo(client) {
  const model = await chooseModel(client);
  console.log(`使用模型：${model}`);

  const environment = await client.environments.create({ name: name('env'), config: { type: 'cloud' } });
  const identity = await client.identities.create({ external_id: name('identity'), name: 'SDK 示例用户' });
  const template = await client.templates.create({
    name: name('template'), model, system: '你是一个 SDK 示例助手。',
    environment_id: environment.id, tools: [{ type: 'agent_toolset_20260401' }],
  });
  const session = await client.sessions.create({ identity_id: identity.id, template_id: template.id });
  console.log(`已创建会话：${session.id}`);

  const sent = await client.sessions.events.send(session.id, {
    events: [{ type: 'user.message', content: [{ type: 'text', text: '请用一句话介绍你能提供什么帮助。' }] }],
  });
  const lastEventID = sent.data[0]?.id;

  // 流式接收本轮事件，打印助手文本；见到会话空闲即结束。
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

  // 清理本次演示创建的资源。
  await client.templates.archive(template.id, {});
  await client.identities.delete(identity.id);
  await client.environments.archive(environment.id);
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
