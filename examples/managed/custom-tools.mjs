// Managed · custom-tools：让 Agent 调用自定义工具 lookup_order；工具在本地 JS 函数里执行，
// 结果通过 user.custom_tool_result 回传，Agent 再据此给出最终回答。运单号只存在于本进程，
// 不出现在模型提示里，因此正确回答必然经过一次真实的工具调用。
// 运行：node examples/managed/custom-tools.mjs（需 QODER_PAT 或 QODER_MANAGED_PAT）。
import { isMain, marker, name, printReply, runManagedExample } from '../lib/managed.mjs';

// lookupOrder 是业务代码边界：把内存查询替换成你自己的服务或数据库查询即可。
function lookupOrder(call, order) {
  if (call.name !== 'lookup_order') return { text: 'unknown tool; use lookup_order', isError: true };
  const id = call.input?.order_id;
  if (typeof id !== 'string' || !id) return { text: 'order_id must be a non-empty string', isError: true };
  if (id !== order.order_id) return { text: 'order not found', isError: true };
  return { text: JSON.stringify(order), isError: false };
}

async function main() {
  await runManagedExample(async (s) => {
    const env = await s.environment();
    const model = await s.selectModel();

    s.step('创建带 lookup_order 自定义工具的 Agent');
    const agent = await s.client.agents.create({
      name: name('custom-tools'),
      model: { id: model },
      system: '查询订单时必须调用 lookup_order。拿到工具返回后，用中文回答订单状态和完整运单号，不得编造。',
      tools: [{
        type: 'custom',
        name: 'lookup_order',
        description: '根据订单 ID 查询订单状态和运单号。',
        input_schema: {
          type: 'object',
          properties: { order_id: { type: 'string', description: '待查询的订单 ID' } },
          required: ['order_id'],
        },
      }],
    });
    s.track(`agent ${agent.id}`, () => s.client.agents.archive(agent.id, {}));

    const session = await s.session({ agent: agent.id, environment_id: env.id });

    const order = { order_id: `order-${marker()}`, status: '已发货', tracking_number: `track-${marker()}` };
    const prompt = `请查询订单 ${order.order_id}，告诉我订单状态和完整运单号。`;
    s.step('发送订单查询消息');
    s.info(`你：${prompt}`);
    let after = await s.send(session.id, prompt);

    s.step('等待 Agent 调用本地工具并给出最终回答');
    for (let round = 0; round < 8; round++) {
      const stream = await s.openStream(session.id, { after });
      const pending = new Map();
      let requires = null;
      let done = false;
      let cursor = after;
      try {
        for await (const event of stream) {
          if (event.id) cursor = event.id;
          if (event.type === 'agent.custom_tool_use') {
            pending.set(event.id, event);
            s.info(`→ 调用工具：${event.name}`);
          } else if (event.type === 'agent.message') {
            printReply((event.content ?? []).filter((b) => b.type === 'text').map((b) => b.text ?? '').join(''));
          } else if (event.type === 'session.status_idle') {
            // requires_action 表示暂停以等待工具结果，而不是给出了最终答案。
            if (event.stop_reason?.type === 'requires_action') { requires = event.stop_reason.event_ids ?? []; break; }
            done = true;
            break;
          }
        }
      } finally {
        stream.controller.abort();
      }
      if (done) return;
      if (!requires) { s.info('流在给出最终答案前结束。'); return; }

      const results = [];
      for (const id of requires) {
        const call = pending.get(id);
        if (!call) continue;
        const { text, isError } = lookupOrder(call, order);
        s.info(`本地执行 ${call.name}，回传结果（is_error=${isError}）`);
        results.push({
          type: 'user.custom_tool_result',
          custom_tool_use_id: call.id,
          is_error: isError,
          content: [{ type: 'text', text }],
        });
      }
      await s.client.sessions.events.send(session.id, { events: results });
      // 从 idle 事件之后继续，避免遗漏紧随其后的最终回复。
      after = cursor;
    }
    s.info('自定义工具循环超过 8 轮，未得到最终回答。');
  });
}

if (isMain(import.meta.url)) main();
