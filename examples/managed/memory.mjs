// Managed · memory：通过 SDK 写入项目发布约定，并以只读资源挂载到会话——项目信息只存在
// 于记忆库中，不进系统指令，也不进聊天历史，验证新会话能凭记忆拟定上线安排。
// 运行：node examples/managed/memory.mjs（需 QODER_PAT 或 QODER_MANAGED_PAT）。
import { isMain, marker, name, runManagedExample } from '../lib/managed.mjs';

const PROJECT_MEMORY_PATH = 'projects/release-conventions.md';

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
  await runManagedExample(async (s) => {
    const env = await s.environment();
    const memory = projectMemory();

    s.step('创建记忆库（Memory Store）');
    const store = await s.client.memoryStores.create({ name: name('memory') });
    s.track(`memory store ${store.id}`, () => s.client.memoryStores.delete(store.id, {}));

    s.step('通过 SDK 写入项目背景和发布约定');
    const entry = await s.client.memoryStores.memories.create(store.id, { path: PROJECT_MEMORY_PATH, content: memory.content });
    s.step('写入 MEMORY.md 索引，供新会话发现项目记忆');
    await s.client.memoryStores.memories.create(store.id, { path: 'MEMORY.md', content: memory.index });

    s.step('通过 SDK 重新读取，确认记忆已保存');
    const saved = await s.client.memoryStores.memories.retrieve(entry.id, { memory_store_id: store.id });
    s.info(`已保存记忆：${saved.path}`);

    const agent = await s.agent();
    const session = await s.session({
      agent: agent.id,
      environment_id: env.id,
      resources: [{ type: 'memory_store', memory_store_id: store.id, access: 'read_only' }],
    });

    s.step('查询新会话的资源，确认记忆库已挂载');
    let mounted = 0;
    for await (const resource of s.client.sessions.resources.list(session.id, {})) {
      if (resource.type === 'memory_store' && resource.memory_store_id === store.id) mounted++;
    }
    s.info(`会话中匹配的记忆库资源：${mounted}`);

    s.info('下面的对话，项目约定只能来自挂载的记忆库。');
    await s.turn(session.id, memory.prompt);
  });
}

if (isMain(import.meta.url)) main();
