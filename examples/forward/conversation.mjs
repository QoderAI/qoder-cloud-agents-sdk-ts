// Forward · conversation：复用同一个 Session 进行多轮对话；重建 SDK 客户端后仍能通过
// Session ID 读取服务端保存的历史，再追问上文约定的信息。
// 运行：node examples/forward/conversation.mjs（需 QODER_FORWARD_PAT 或 QODER_PAT）。
import { historyMessage, isMain, makeForwardClient, marker, runForwardExample } from '../lib/forward.mjs';

async function main() {
  await runForwardExample(async (s) => {
    const env = await s.environment();
    const identity = await s.identity();
    const template = await s.template({ environment_id: env.id });
    const session = await s.session({ identity_id: identity.id, template_id: template.id });

    const code = `project-${marker()}`;
    await s.turn(session.id, `这次项目代号是 ${code}。请在本次对话中记住它，不要使用工具或写入记忆库。现在只回复：已记住。`);

    s.info(`Session ID：${session.id}`);
    s.step('重新创建 SDK 客户端，通过 Session ID 读取服务端会话');
    // 新客户端没有任何本地聊天历史；服务端仍以 sessionID 保存整段会话。
    s.client = makeForwardClient();
    const current = await s.client.sessions.retrieve(session.id);
    s.info(`会话状态：${current.status}`);

    s.step('分页读取已有的用户消息和助手回复');
    for await (const event of s.client.sessions.events.list(session.id, { order: 'asc', limit: 100 })) {
      const message = historyMessage(event);
      if (message) s.info(`历史 · ${message.role}：${message.text}`);
    }

    await s.turn(session.id, '只根据本次会话上文，告诉我刚才约定的项目代号。只回复代号，不要使用工具。');
  });
}

if (isMain(import.meta.url)) main();
