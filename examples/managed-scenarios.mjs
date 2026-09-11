import assert from 'node:assert/strict';
import { managedMarker, managedName, managedMessage } from './managed-support.mjs';
import { ProjectMemory, PROJECT_MEMORY_PATH } from './memory-proof.mjs';

export { createManagedExampleSuite } from './managed-support.mjs';

/** The six Managed scenarios run by `scenario-all`, including the memory proof. */
export const managedExamples = [
  {
    name: 'models',
    description: '查询当前账号可用的模型。',
    async run(suite, run) {
      const enabled = await suite.models();
      run.log(`模型列表：${enabled.join(', ')}`);
      run.check(`可用模型查询成功，本次使用 ${suite.model}`);
    },
  },
  {
    name: 'session',
    description: '创建 Agent 和 Session，发送一条消息，通过 SSE 接收助手回复。',
    async run(suite) {
      const environment = await suite.environment();
      const agent = await suite.agent();
      const session = await suite.newSession({ environment_id: environment, agent });
      const marker = managedMarker();
      await suite.turn(session, `请用一句话介绍你能提供什么帮助，并在回复末尾原样附上：${marker}`, [marker], false, true);
    },
  },
  {
    name: 'resources',
    description: '演示文件、环境变量和 Skill 在会话中的使用。',
    async run(suite, run) {
      const client = suite.client;
      const environment = await suite.environment();
      const fileToken = managedMarker(), envToken = managedMarker(), skillToken = managedMarker();
      run.step('上传示例文件，供会话中的工具读取');
      const file = await client.files.upload({ file: new File([fileToken], 'sdk-example.txt') }, suite.options());
      suite.track('file', file.id, () => client.files.delete(file.id, {}, suite.options()));
      const skillName = managedName('skill');
      run.step('上传自定义 Skill，其中包含一个随机校验值');
      const markdown = `---\nname: ${skillName}\ndescription: Provides a sample verification code for the SDK example.\n---\nThe example verification value EXAMPLE_SKILL_CODE is: ${skillToken}\n`;
      const skill = await client.skills.create({ files: [new File([markdown], `${skillName}/SKILL.md`)] }, suite.options());
      suite.track('skill', skill.id, () => client.skills.delete(skill.id, {}, suite.options()));
      const agent = await suite.agent({ skills: [{ type: 'custom', skill_id: skill.id, version: skill.latest_version }] });
      const session = await suite.newSession({ environment_id: environment, agent, environment_variables: { SDK_EXAMPLE_VALUE: envToken }, resources: [{ type: 'file', file_id: file.id, mount_path: '/data/workspace/sdk-example.txt' }] });
      await suite.turn(session, '请使用工具读取 /data/workspace/sdk-example.txt 的内容和 SDK_EXAMPLE_VALUE 环境变量，分别返回这两个示例值。', [fileToken, envToken], true);
      // The preceding turn may already have loaded the Skill. Require a fresh
      // read so the per-turn tool assertion remains meaningful;
      // the expected code remains exclusively in the uploaded Skill body.
      await suite.turn(session, `请在本轮实际调用 Read（或 Bash）工具，定位并重新读取技能 ${skillName} 的 SKILL.md 正文，再从刚读取的内容提取 EXAMPLE_SKILL_CODE 并返回这个示例校验码。即使之前已读取过该技能，也请本轮重新读取，不要只依据先前上下文回答。`, [skillToken], true);
    },
  },
  {
    name: 'memory',
    description: '写入项目发布约定并挂载到 Session，验证全新会话的上线安排体现这些记忆。',
    async run(suite, run) {
      const client = suite.client;
      const environment = await suite.environment();
      const memory = new ProjectMemory();
      run.record('memoryExpected', { project: memory.project, releaseTime: memory.releaseTime, contact: memory.contact, rollbackVersion: memory.rollbackVersion });
      run.step('创建记忆库（Memory Store）');
      const store = await client.memoryStores.create({ name: managedName('memory') }, suite.options());
      suite.track('memory_store', store.id, () => client.memoryStores.delete(store.id, {}, suite.options()));
      run.step('通过 SDK 写入项目背景和发布约定');
      const entry = await client.memoryStores.memories.create(store.id, { path: PROJECT_MEMORY_PATH, content: memory.content() }, suite.options());
      run.log(`记忆正文：\n${memory.content()}`);
      run.step('写入 MEMORY.md 索引，供新会话发现项目记忆');
      const index = await client.memoryStores.memories.create(store.id, { path: 'MEMORY.md', content: memory.index() }, suite.options());
      run.log('索引只包含正文入口，不包含发布时间、联系人和回滚版本');
      run.step('通过 SDK 重新读取，确认记忆正文和索引已保存');
      const saved = await client.memoryStores.memories.retrieve(entry.id, { memory_store_id: store.id }, suite.options());
      assert.equal(saved.content, memory.content(), '读取的记忆内容与写入内容不一致');
      const savedIndex = await client.memoryStores.memories.retrieve(index.id, { memory_store_id: store.id }, suite.options());
      assert.equal(savedIndex.content, memory.index(), '读取的记忆索引与写入内容不一致');
      run.check('记忆正文和索引已保存，内容与写入一致');
      const agent = await suite.agent();
      run.log('下面创建全新会话；项目约定只保存在记忆库中，不加入系统指令或聊天历史');
      const session = await suite.newSession({ environment_id: environment, agent, resources: [{ type: 'memory_store', memory_store_id: store.id, access: 'read_only' }] });
      run.step('查询新会话的资源，确认记忆库已挂载');
      let found = false;
      for await (const resource of client.sessions.resources.list(session, {}, suite.options())) {
        if (resource.type === 'memory_store' && resource.memory_store_id === store.id) found = true;
      }
      assert(found, '新会话的资源中未找到指定记忆库');
      run.check(`会话已挂载记忆库：${store.id}`);
      run.step('请助手结合记忆拟定上线安排');
      run.log(`用户：${memory.prompt()}`);
      const after = await suite.send(session, memory.prompt());
      const result = await suite.waitReply(session, after, false);
      memory.verify(result, run);
    },
  },
  {
    name: 'deployment',
    description: '创建 Deployment，手动触发一次运行并检查助手回复。',
    async run(suite, run) {
      const client = suite.client;
      const environment = await suite.environment();
      const agent = await suite.agent();
      const marker = managedMarker();
      run.log(`本次运行初始消息：Reply with exactly ${marker}`);
      run.step('创建 Deployment，设置运行时的初始消息');
      const deployment = await client.deployments.create({ name: managedName('deployment'), agent, environment_id: environment, initial_events: [managedMessage(`Reply with exactly ${marker}`)] }, suite.options());
      suite.track('deployment', deployment.id, () => client.deployments.archive(deployment.id, {}, suite.options()));
      run.step('手动触发一次 Deployment 运行');
      const result = await client.deployments.run(deployment.id, {}, suite.options());
      run.record('deploymentRunID', result.id);
      run.log(`本次运行 ID：${result.id}`);
      assert(result.session_id, 'Deployment run returned no session');
      suite.track('session', result.session_id, () => suite.finishSession(result.session_id));
      const got = await client.deploymentRuns.retrieve(result.id, {}, suite.options());
      assert.equal(got.session_id, result.session_id, 'Deployment run session ID changed');
      await suite.waitTurn(result.session_id, '', [marker]);
    },
  },
  {
    name: 'dream',
    description: '让 Dream 整理记忆，再读取输出记忆库验证整理结果。',
    async run(suite, run) {
      const client = suite.client;
      if (!suite.model) await suite.models();
      run.step('创建记忆库（Memory Store）');
      const store = await client.memoryStores.create({ name: managedName('dream-input') }, suite.options());
      suite.track('input_memory_store', store.id, () => client.memoryStores.delete(store.id, {}, suite.options()));
      const marker = managedMarker();
      run.step('向记忆库写入示例内容和随机校验值');
      await client.memoryStores.memories.create(store.id, { path: 'sdk-example/source.md', content: `Permanent project verification code: ${marker}. Preserve this exact code during consolidation.` }, suite.options());
      run.step('创建 Dream，整理输入记忆库中的内容');
      let dream = await client.dreams.create({ inputs: [{ type: 'memory_store', memory_store_id: store.id }], model: suite.model, instructions: 'Consolidate the supplied memory into sdk-example/consolidated.md. Preserve the exact project verification code. Keep the original source.' }, suite.options());
      const dreamID = dream.id;
      suite.track('dream', dreamID, () => suite.finishDream(dreamID, store.id));
      run.step('等待 Dream 整理记忆');
      let previous = '';
      while (['pending', 'running'].includes(dream.status)) {
        if (dream.status !== previous) run.log(`Dream 状态：${dream.status}`);
        previous = dream.status;
        await suite.pause();
        dream = await client.dreams.retrieve(dreamID, {}, suite.options());
      }
      run.step('读取 Dream 输出，检查整理后的记忆');
      assert.equal(dream.status, 'completed', `dream=${dreamID} status=${dream.status}`);
      assert(dream.outputs?.length, `dream=${dreamID} returned no outputs`);
      for (const output of dream.outputs) {
        for await (const memory of client.memoryStores.memories.list(output.memory_store_id, {}, suite.options())) {
          if (memory.path !== 'sdk-example/consolidated.md') continue;
          const got = await client.memoryStores.memories.retrieve(memory.id, { memory_store_id: output.memory_store_id }, suite.options());
          if (got.content.includes(marker)) {
            run.record('consolidatedMemory', { id: got.id, memoryStoreID: output.memory_store_id, path: got.path, content: got.content });
            run.check(`输出记忆保留了原始校验值：${got.path}`);
            run.log(`整理后的记忆：\n${got.content}`);
            return;
          }
        }
      }
      throw new Error('Dream did not persist consolidated memory with the original verification code');
    },
  },
];
