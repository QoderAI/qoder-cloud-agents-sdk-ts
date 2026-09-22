// Managed · dream：让 Dream 异步整理输入记忆库，等待完成后读取输出记忆库，确认整理后的
// 记忆保留了原始校验值。
// 运行：node examples/managed/dream.mjs（需 QODER_PAT 或 QODER_MANAGED_PAT）。
import { setTimeout as delay } from 'node:timers/promises';
import { isMain, marker, name, printReply, runManagedExample } from '../lib/managed.mjs';

async function main() {
  await runManagedExample(async (s) => {
    const model = await s.selectModel();

    s.step('创建记忆库（Memory Store）');
    const store = await s.client.memoryStores.create({ name: name('dream-input') });
    s.track(`input memory store ${store.id}`, () => s.client.memoryStores.delete(store.id, {}));

    const echo = marker();
    s.step('向记忆库写入示例内容和随机校验值');
    await s.client.memoryStores.memories.create(store.id, {
      path: 'sdk-example/source.md',
      content: `Permanent project verification code: ${echo}. Preserve this exact code during consolidation.`,
    });

    s.step('创建 Dream，整理输入记忆库中的内容');
    let dream = await s.client.dreams.create({
      inputs: [{ type: 'memory_store', memory_store_id: store.id }],
      model,
      instructions: 'Consolidate the supplied memory into sdk-example/consolidated.md. Preserve the exact project verification code. Keep the original source.',
    });
    s.track(`dream ${dream.id}`, () => s.client.dreams.archive(dream.id, {}));

    s.step('等待 Dream 整理记忆');
    let previous = '';
    while (['pending', 'running'].includes(dream.status)) {
      if (dream.status !== previous) { s.info(`Dream 状态：${dream.status}`); previous = dream.status; }
      await delay(2000);
      dream = await s.client.dreams.retrieve(dream.id, {});
    }
    s.info(`Dream 最终状态：${dream.status}`);

    s.step('读取 Dream 输出，检查整理后的记忆');
    for (const output of dream.outputs ?? []) {
      s.track(`dream output store ${output.memory_store_id}`, () => s.client.memoryStores.delete(output.memory_store_id, {}));
      for await (const memory of s.client.memoryStores.memories.list(output.memory_store_id, {})) {
        if (memory.path !== 'sdk-example/consolidated.md') continue;
        const got = await s.client.memoryStores.memories.retrieve(memory.id, { memory_store_id: output.memory_store_id });
        s.info(`整理后的记忆：${got.path}`);
        printReply(got.content);
      }
    }
  });
}

if (isMain(import.meta.url)) main();
