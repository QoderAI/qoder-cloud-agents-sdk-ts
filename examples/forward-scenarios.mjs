import assert from 'node:assert/strict';
import { toFile } from '../dist/forward/index.js';
import { batchTerminal } from '../test/live/forward-support.mjs';
import { exampleMarker, exampleName } from './forward-support.mjs';
import { ProjectMemory, PROJECT_MEMORY_PATH } from './memory-proof.mjs';

export { createForwardExampleSuite } from './forward-support.mjs';

async function models(suite) {
  const enabled = await suite.models();
  suite.log(`模型列表：${enabled.join(', ')}`);
}

async function session(suite) {
  const environmentID = await suite.createEnvironment();
  const identityID = await suite.createIdentity();
  const templateID = await suite.createTemplate({ environment_id: environmentID });
  const sessionID = await suite.createSession({ identity_id: identityID, template_id: templateID });
  const marker = exampleMarker();
  await suite.turn(sessionID, `请用一句话介绍你能提供什么帮助，并在回复末尾原样附上：${marker}`, [marker], false, true);
}

async function resources(suite) {
  const environmentID = await suite.createEnvironment();
  const identityID = await suite.createIdentity();
  const fileToken = exampleMarker(), envToken = exampleMarker(), skillToken = exampleMarker();
  suite.step('上传示例文件，供会话中的工具读取');
  const file = await suite.client.files.upload({ file: await toFile(fileToken, 'sdk-example.txt'), purpose: 'session_resource' }, suite.options);
  suite.track('file', file.id, (options) => suite.client.files.delete(file.id, options));
  const skillName = exampleName('skill');
  suite.step('上传自定义 Skill，其中包含一个随机校验值');
  const skill = await suite.client.skills.create({ files: [await toFile(
    `---\nname: ${skillName}\ndescription: Provides a sample verification code for the SDK example.\n---\nThe example verification value EXAMPLE_SKILL_CODE is: ${skillToken}\n`,
    `${skillName}/SKILL.md`,
  )] }, suite.options);
  suite.track('skill', skill.id, (options) => suite.client.skills.delete(skill.id, options));
  const templateID = await suite.createTemplate({
    environment_id: environmentID,
    skills: [{ type: 'custom', skill_id: skill.id, version: skill.latest_version }],
    environment_variables: { SDK_EXAMPLE_VALUE: 'template-default' },
  });
  suite.step('设置 Identity 的环境变量，覆盖模板中的默认值');
  await suite.client.identities.configs.upsert(identityID, templateID, {
    identity_config: { environment_variables: { SDK_EXAMPLE_VALUE: { op: 'set', value: envToken } } },
  }, suite.options);
  const sessionID = await suite.createSession({ identity_id: identityID, template_id: templateID,
    resources: [{ type: 'file', file_id: file.id, mount_path: '/data/workspace/sdk-example.txt' }] });
  await suite.turn(sessionID, '请使用工具读取 /data/workspace/sdk-example.txt 的内容和 SDK_EXAMPLE_VALUE 环境变量，分别返回这两个示例值。', [fileToken, envToken], true);
  await suite.turn(sessionID, `请在本轮实际调用 Read（或 Bash）工具，定位并重新读取技能 ${skillName} 的 SKILL.md 正文，再从刚读取的内容提取 EXAMPLE_SKILL_CODE 并返回这个示例校验码。即使之前已读取过该技能，也请本轮重新读取，不要只依据先前上下文回答。`, [skillToken], true);
}

async function memory(suite, run) {
  const environmentID = await suite.createEnvironment();
  const identityID = await suite.createIdentity({ memory: true });
  const memory = new ProjectMemory();
  suite.step('创建记忆库（Memory Store）');
  const store = await suite.client.memoryStores.create({ name: exampleName('memory'), idempotency_key: exampleName('memory-key') }, suite.options);
  suite.track('memory_store', store.id, (options) => suite.client.memoryStores.delete(store.id, options));
  suite.step('通过 SDK 写入项目背景和发布约定');
  const entry = await suite.client.memoryStores.memories.create(store.id, { path: PROJECT_MEMORY_PATH, content: memory.content() }, suite.options);
  suite.record('memory_entry', { id: entry.id, path: PROJECT_MEMORY_PATH });
  suite.log(`记忆正文：${memory.content()}`);
  suite.step('写入 MEMORY.md 索引，供新会话发现项目记忆');
  const index = await suite.client.memoryStores.memories.create(store.id, { path: 'MEMORY.md', content: memory.index() }, suite.options);
  suite.record('memory_index', { id: index.id, path: 'MEMORY.md' });
  suite.log('索引只包含正文入口，不包含发布时间、联系人和回滚版本');
  suite.step('通过 SDK 重新读取，确认记忆正文和索引已保存');
  assert.equal((await suite.client.memoryStores.memories.retrieve(store.id, entry.id, suite.options)).content, memory.content(), '读取的记忆内容与写入内容不一致');
  assert.equal((await suite.client.memoryStores.memories.retrieve(store.id, index.id, suite.options)).content, memory.index(), '读取的记忆索引与写入内容不一致');
  suite.check('记忆正文和索引已保存，内容与写入一致');
  const templateID = await suite.createTemplate({ environment_id: environmentID });
  suite.step('将记忆库绑定到 Identity 和 Template');
  await suite.client.identities.memoryStores.mount(identityID, templateID, { memory_store_id: store.id }, suite.options);
  suite.track('memory_mount', store.id, (options) => suite.client.identities.memoryStores.detach(identityID, templateID, store.id, options));
  suite.step('查询绑定，确认记忆库已关联');
  const mounts = await suite.client.identities.memoryStores.list(identityID, templateID, suite.options);
  assert.ok(mounts.data.some((mount) => mount.memory_store_id === store.id), 'memory mount was not persisted');
  suite.check(`已查到绑定的记忆库：${store.id}`);
  suite.log('下面创建全新会话；项目约定只保存在记忆库中，不加入系统指令或聊天历史');
  const sessionID = await suite.createSession({ identity_id: identityID, template_id: templateID });
  suite.step('请助手结合记忆拟定上线安排');
  suite.log(`用户：${memory.prompt()}`);
  const after = await suite.sendTurn(sessionID, memory.prompt());
  const reply = await suite.waitReply(sessionID, after);
  memory.verify(reply, run ?? suite.run);
}

async function schedule(suite) {
  const environmentID = await suite.createEnvironment();
  const identityID = await suite.createIdentity();
  const templateID = await suite.createTemplate({ environment_id: environmentID });
  const marker = exampleMarker();
  suite.log(`本次运行的初始消息：Reply with exactly ${marker}`);
  suite.step('创建只手动触发的 Schedule');
  const schedule = await suite.client.schedules.create({ identity_id: identityID, template_id: templateID, environment_id: environmentID,
    name: exampleName('schedule'), initial_events: [{ type: 'user.message', content: `Reply with exactly ${marker}` }],
    trigger_policy: { type: 'manual' }, execution: { max_attempts: 1, max_concurrent_runs: 1 } }, suite.options);
  suite.track('schedule', schedule.id, (options) => suite.client.schedules.archive(schedule.id, {}, options));
  suite.step('手动触发一次 Schedule 运行');
  const createdRun = await suite.client.schedules.run(schedule.id, { idempotency_key: exampleName('run') }, suite.options);
  const runID = createdRun.id;
  suite.track('schedule_run', runID, (options) => suite.finishScheduleRun(runID, identityID, options));
  suite.step('等待 Schedule Run 完成');
  let run, previous;
  for (;;) {
    run = await suite.client.scheduleRuns.retrieve(runID, { identity_id: identityID }, suite.options);
    if (run.status !== previous) { suite.log(`Schedule Run 状态：${run.status}`); previous = run.status; }
    if (run.status === 'completed') break;
    assert.ok(!['failed', 'skipped'].includes(run.status), `run=${runID} status=${run.status}`);
    await suite.pause();
  }
  assert.ok(run.session_id, `completed run ${runID} has no session`);
  suite.record('schedule_session', run.session_id);
  await suite.verifyTurn(run.session_id, '', [marker]);
}

async function batch(suite) {
  const environmentID = await suite.createEnvironment();
  const identityID = await suite.createIdentity();
  const templateID = await suite.createTemplate({ environment_id: environmentID });
  const marker = exampleMarker(), customID = exampleName('task');
  suite.log(`批处理任务的输入消息：Reply with exactly ${marker}`);
  const line = JSON.stringify({ custom_id: customID, template_id: templateID, identity_id: identityID, body: { input: `Reply with exactly ${marker}` } });
  suite.step('上传包含一个任务的 JSONL 输入文件');
  const input = await suite.client.files.upload({ file: await toFile(`${line}\n`, 'sdk-example-input.jsonl'), purpose: 'session_resource' }, suite.options);
  suite.track('input_file', input.id, (options) => suite.client.files.delete(input.id, options));
  suite.step('提交 Batch，交由服务端调度执行');
  let batch = await suite.client.batches.create({ input_file_id: input.id, completion_window: '24h', idempotency_key: exampleName('batch') }, suite.options);
  const batchID = batch.id;
  suite.track('batch', batchID, (options) => suite.finishBatch(batchID, customID, identityID, templateID, options));
  suite.step('等待 Batch 完成（执行时间取决于服务端窗口）');
  let previous;
  while (!batchTerminal(batch.status)) {
    if (batch.status !== previous) { suite.log(`Batch 状态：${batch.status}`); previous = batch.status; }
    try { await suite.pause(); }
    catch (error) { throw new Error(`batch=${batchID} status=${previous}; check server execution window`, { cause: error }); }
    batch = await suite.client.batches.retrieve(batchID, suite.options);
  }
  assert.equal(batch.status, 'completed', `batch=${batchID} status=${batch.status}`);
  assert.equal(batch.request_counts.completed, 1, 'batch did not complete exactly one request');
  assert.equal(batch.request_counts.failed, 0, 'batch contains failed requests');
  assert.ok(batch.output_file_id, 'completed batch has no output file');
  suite.step('检查 Batch 的任务和输出文件');
  const tasks = await suite.client.batches.tasks.list(batchID, {}, suite.options);
  assert.equal(tasks.data.length, 1, 'batch task count differs from input');
  assert.equal(tasks.data[0].custom_id, customID, 'batch task did not round trip');
  const rows = await suite.batchOutput(batchID, suite.options);
  assert.equal(rows.length, 1, 'expected one batch output row');
  const row = rows[0];
  assert.equal(row.custom_id, customID, 'batch output custom ID mismatch');
  assert.equal(row.identity_id, identityID, 'batch output identity mismatch');
  assert.equal(row.template_id, templateID, 'batch output template mismatch');
  assert.equal(row.status, 'completed', 'batch output status mismatch');
  assert.ok(row.session_id, 'batch output has no session');
  assert.ok(row.error == null, 'batch output contains an error');
  assert.ok(JSON.stringify(row.response).includes(marker), 'batch result missing expected output');
  suite.record('batch_session', row.session_id);
  await suite.verifyTurn(row.session_id, '', [marker]);
}

export const forwardExamples = [
  { name: 'models', description: '查询当前账号可用的模型。', run: models },
  { name: 'session', description: '创建 Identity 和 Template，发送一条消息，通过 SSE 接收助手回复。', run: session },
  { name: 'resources', description: '演示文件挂载、Identity 环境变量覆盖和自定义 Skill 的读取。', run: resources },
  { name: 'memory', description: '写入项目发布约定并绑定到 Identity + Template，验证全新会话的上线安排体现这些记忆。', run: memory },
  { name: 'schedule', description: '创建手动 Schedule，触发一次运行并检查助手回复。', run: schedule },
  { name: 'batch', description: '提交一个 JSONL 批处理任务，等待完成后检查结果。', run: batch },
];
