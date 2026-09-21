// Managed · session：演示 Agent -> Session 生命周期，发送一条消息并通过 SSE 接收助手回复。
// 运行：node examples/managed/session.mjs（需 QODER_PAT 或 QODER_MANAGED_PAT）。
import { isMain, marker, runManagedExample } from '../lib/managed.mjs';

async function main() {
  await runManagedExample(async (s) => {
    const env = await s.environment();
    const agent = await s.agent();
    const session = await s.session({ agent: agent.id, environment_id: env.id });

    const echo = marker();
    await s.turn(session.id, `请用一句话介绍你能提供什么帮助，并在回复末尾原样附上：${echo}`);
  });
}

if (isMain(import.meta.url)) main();
