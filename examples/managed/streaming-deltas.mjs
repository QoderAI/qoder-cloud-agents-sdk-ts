// Managed · streaming-deltas：先订阅 SSE 的文本增量（agent.message deltas），随消息生成逐步
// 刷新预览，最后用完整的 agent.message 替换预览。预览事件不写入历史，故必须先订阅再发消息。
// 运行：node examples/managed/streaming-deltas.mjs（需 QODER_PAT 或 QODER_MANAGED_PAT）。
import { isMain, marker, printReply, runManagedExample } from '../lib/managed.mjs';

async function main() {
  await runManagedExample(async (s) => {
    const env = await s.environment();
    const agent = await s.agent();
    const session = await s.session({ agent: agent.id, environment_id: env.id });

    s.step('先订阅 SSE，开启 agent.message 文本增量');
    const stream = await s.openStream(session.id, { deltas: ['agent.message'] });

    const echo = marker();
    const prompt = `请分三句话解释为什么多轮对话要复用 Session ID，最后原样附上：${echo}`;
    s.step('发送消息');
    s.info(`你：${prompt}`);
    await s.send(session.id, prompt);

    s.step('接收增量并在收到完整消息后替换预览');
    const previews = new Map(); // event_id -> Map(blockIndex -> text)
    let deltas = 0;
    try {
      for await (const event of stream) {
        if (event.type === 'event_delta' && event.delta?.type === 'content_delta' && event.delta?.content?.type === 'text') {
          const id = event.event_id;
          const blocks = previews.get(id) ?? new Map();
          previews.set(id, blocks);
          // 同一消息可能拆成多个片段共享 event_id，按块索引累加。
          blocks.set(event.delta.index, (blocks.get(event.delta.index) ?? '') + (event.delta.content.text ?? ''));
          deltas++;
          const text = [...blocks.keys()].sort((a, b) => a - b).map((i) => blocks.get(i)).join('\n');
          console.log(`  预览（${id}）：${text}`);
        } else if (event.type === 'agent.message') {
          s.info(`消息 ${event.id} 收到完整内容，替换该消息的预览。`);
          printReply((event.content ?? []).filter((b) => b.type === 'text').map((b) => b.text ?? '').join(''));
        } else if (event.type === 'session.status_idle') {
          break;
        }
      }
    } finally {
      stream.controller.abort();
    }
    s.info(deltas ? `共收到 ${deltas} 个文本增量；增量是尽力提供的预览。` : '本次未收到增量，使用最终完整消息。');
  });
}

if (isMain(import.meta.url)) main();
