// Forward · session：演示 Identity -> Template -> Session 生命周期，发送一条消息并通过 SSE 接收助手回复。
// 运行：node examples/forward/session.mjs（需 QODER_FORWARD_PAT 或 QODER_PAT）。
import { isMain, marker, runForwardExample } from '../lib/forward.mjs';

async function main() {
  await runForwardExample(async (s) => {
    const env = await s.environment();
    const identity = await s.identity();
    const template = await s.template({ environment_id: env.id });
    const session = await s.session({ identity_id: identity.id, template_id: template.id });

    const echo = marker();
    await s.turn(session.id, `请用一句话介绍你能提供什么帮助，并在回复末尾原样附上：${echo}`);
  });
}

if (isMain(import.meta.url)) main();
