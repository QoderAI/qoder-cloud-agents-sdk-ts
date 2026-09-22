// Forward · memory：通过 SDK 写入项目发布约定并绑定到 Identity + Template，
// 再创建全新会话——项目信息只存在于记忆库中，不进系统指令，也不进聊天历史。
// 运行：node examples/forward/memory.mjs（需 QODER_FORWARD_PAT 或 QODER_PAT）。
import { isMain, marker, name, runForwardExample } from '../lib/forward.mjs';

const PROJECT_MEMORY_PATH = 'projects/release-conventions.md';

// 构造一份随机化的项目发布约定，避免助手用套话蒙混过关。
function projectMemory() {
  const project = `青禾订单-${marker().slice(0, 6)}`;
  const releaseTime = '21:30';
  const contact = '林岚';
  const rollback = `v2.${100 + Math.floor(Math.random() * 900)}.${100 + Math.floor(Math.random() * 900)}`;
  return {
    project,
    content: `---\nname: release-conventions\ndescription: ${project} 的项目发布约定\nmetadata:\n  type: project\n---\n\n# ${project} 的发布约定\n\n- 这是一个订单服务项目。\n- 团队约定在北京时间 ${releaseTime} 开始发布。\n- 发布异常时先联系值班负责人${contact}。\n- 如果需要回滚，使用已验证的稳定版本 ${rollback}。\n`,
    index: `- [${project} 发布约定](${PROJECT_MEMORY_PATH}) — 项目的发布窗口、异常联系人与回滚约定。\n`,
    prompt: `请根据你记得的项目约定，为「${project}」拟一份简短的上线安排，涵盖开始时间、异常联系和回滚处理。只需给出计划，不要执行发布。`,
  };
}

async function main() {
  await runForwardExample(async (s) => {
    const env = await s.environment();
    const identity = await s.identity();
    const memory = projectMemory();

    s.step('创建记忆库（Memory Store）');
    const store = await s.client.memoryStores.create({ name: name('memory'), idempotency_key: name('memory-key') });
    s.track(`memory store ${store.id}`, () => s.client.memoryStores.delete(store.id));

    s.step('通过 SDK 写入项目背景和发布约定');
    const entry = await s.client.memoryStores.memories.create(store.id, { path: PROJECT_MEMORY_PATH, content: memory.content });
    s.step('写入 MEMORY.md 索引，供新会话发现项目记忆');
    await s.client.memoryStores.memories.create(store.id, { path: 'MEMORY.md', content: memory.index });

    s.step('通过 SDK 重新读取，确认记忆正文已保存');
    const saved = await s.client.memoryStores.memories.retrieve(store.id, entry.id);
    s.info(`已保存记忆：${saved.path}`);

    const template = await s.template({ environment_id: env.id });
    s.step('将记忆库绑定到 Identity 和 Template');
    await s.client.identities.memoryStores.mount(identity.id, template.id, { memory_store_id: store.id });
    s.track(`memory mount ${store.id}`, () => s.client.identities.memoryStores.detach(identity.id, template.id, store.id));

    s.step('查询绑定，确认记忆库已关联');
    const mounts = await s.client.identities.memoryStores.list(identity.id, template.id);
    s.info(`已绑定记忆库数量：${mounts.data?.length ?? 0}`);

    const session = await s.session({ identity_id: identity.id, template_id: template.id });
    s.info('下面创建的全新会话，只能通过记忆库获得项目约定。');
    await s.turn(session.id, memory.prompt);
  });
}

if (isMain(import.meta.url)) main();
