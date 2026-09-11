import assert from 'node:assert/strict';
import { marker, unique, userMessage } from './managed-support.mjs';

const snake = (name) => name.replace(/(?<!^)[A-Z]/g, (c) => `_${c}`).toLowerCase();
const scenario = (name, mode, run) => ({ name, mode, run });
const listResources = { Agent: 'agents', Session: 'sessions', MemoryStore: 'memoryStores', Skill: 'skills', Environment: 'environments', Vault: 'vaults', File: 'files', Deployment: 'deployments', Dream: 'dreams', DeploymentRun: 'deploymentRuns', Model: 'models' };

/** Names and assertions mirror the Managed live coverage matrix. */
export const managedScenarios = [
  ...Object.entries(listResources).map(([name, resource]) => scenario(`${snake(name)}_list`, 'read', async (s) => {
    await s.client[resource].list({}, s.options());
  })),
  scenario('agent_lifecycle', 'write', async (s) => {
    const agent = await s.createAgent();
    await s.client.agents.retrieve(agent.id, {}, s.options());
    await s.client.agents.update(agent.id, { version: agent.version, description: 'updated through Managed TypeScript SDK' }, s.options());
    const versions = await s.client.agents.versions.list(agent.id, {}, s.options());
    assert(versions.data.length >= 2, 'Expected at least two Agent versions');
  }),
  scenario('session_lifecycle', 'write', async (s) => {
    const environment = await s.createEnvironment();
    const agent = await s.createAgent();
    const session = await s.client.sessions.create({ agent: agent.id, environment_id: environment.id, title: 'Managed SDK live session' }, s.options());
    s.cleanup(`Session ${session.id}`, () => s.client.sessions.delete(session.id, {}, s.options()));
    await s.client.sessions.retrieve(session.id, {}, s.options());
    await s.client.sessions.update(session.id, { title: 'Managed SDK renamed session' }, s.options());
    await s.client.sessions.events.list(session.id, {}, s.options());
    await s.client.sessions.resources.list(session.id, {}, s.options());
    await s.client.sessions.threads.list(session.id, {}, s.options());
  }),
  scenario('memory_store_lifecycle', 'write', async (s) => {
    const store = await s.createMemoryStore();
    await s.client.memoryStores.retrieve(store.id, {}, s.options());
    await s.client.memoryStores.update(store.id, { description: 'updated through Managed TypeScript SDK' }, s.options());
    const memory = await s.client.memoryStores.memories.create(store.id, { path: 'notes/sdk-live.md', content: 'Managed SDK memory v1' }, s.options());
    s.cleanup(`Memory ${memory.id}`, () => s.client.memoryStores.memories.delete(memory.id, { memory_store_id: store.id }, s.options()));
    await s.client.memoryStores.memories.retrieve(memory.id, { memory_store_id: store.id }, s.options());
    await s.client.memoryStores.memories.update(memory.id, { memory_store_id: store.id, content: 'Managed SDK memory v2' }, s.options());
    const versions = await s.client.memoryStores.memoryVersions.list(store.id, {}, s.options());
    assert(versions.data.length > 0, 'Expected at least one memory version');
    await s.client.memoryStores.memoryVersions.retrieve(versions.data[0].id, { memory_store_id: store.id }, s.options());
  }),
  scenario('skill_lifecycle', 'write', async (s) => {
    const name = unique('skill');
    const markdown = `---\nname: ${name}\ndescription: Managed SDK live skill\n---\n# ${name}\nReply with SDK-LIVE.\n`;
    const files = () => [new File([markdown], `${name}/SKILL.md`, { type: 'text/markdown' })];
    const skill = await s.client.skills.create({ files: files(), display_title: name, metadata: { suite: 'sdk-live' } }, s.options());
    s.cleanup(`Skill ${skill.id}`, () => s.client.skills.delete(skill.id, {}, s.options()));
    await s.client.skills.retrieve(skill.id, {}, s.options());
    const version = await s.client.skills.versions.create(skill.id, { files: files() }, s.options());
    s.cleanup(`Skill version ${version.version}`, () => s.client.skills.versions.delete(version.version, { skill_id: skill.id }, s.options()));
    await s.client.skills.versions.retrieve(version.version, { skill_id: skill.id }, s.options());
    const download = await s.client.skills.versions.download(version.version, { skill_id: skill.id }, s.options());
    assert((await download.arrayBuffer()).byteLength > 0, 'Empty skill archive');
  }),
  scenario('environment_lifecycle', 'write', async (s) => {
    const environment = await s.createEnvironment();
    const got = await s.client.environments.retrieve(environment.id, {}, s.options());
    assert.equal(got.id, environment.id);
    await s.client.environments.update(environment.id, { description: 'updated through Managed TypeScript SDK' }, s.options());
    await s.client.environments.work.list(environment.id, {}, s.options());
  }),
  scenario('vault_lifecycle', 'write', async (s) => {
    const vault = await s.client.vaults.create({ display_name: unique('vault'), metadata: { suite: 'sdk-live' } }, s.options());
    s.cleanup(`Vault ${vault.id}`, () => s.client.vaults.delete(vault.id, {}, s.options()));
    await s.client.vaults.retrieve(vault.id, {}, s.options());
    await s.client.vaults.credentials.list(vault.id, {}, s.options());
  }),
  scenario('file_lifecycle', 'write', async (s) => {
    const content = 'Managed SDK live file\n';
    const file = await s.client.files.upload({ file: new File([content], `${unique('file')}.txt`), metadata: { suite: 'sdk-live' } }, s.options());
    s.cleanup(`File ${file.id}`, () => s.client.files.delete(file.id, {}, s.options()));
    await s.client.files.getMetadata(file.id, {}, s.options());
    const download = await s.client.files.download(file.id, {}, s.options());
    assert.equal(await download.text(), content, 'Download content');
  }),
  scenario('deployment_lifecycle', 'write', async (s) => {
    const environment = await s.createEnvironment();
    const agent = await s.createAgent();
    const deployment = await s.client.deployments.create({ name: unique('deployment'), agent: agent.id, environment_id: environment.id, initial_events: [userMessage('Reply with SDK-LIVE.')] }, s.options());
    s.cleanup(`Deployment ${deployment.id}`, () => s.client.deployments.archive(deployment.id, {}, s.options()));
    await s.client.deployments.retrieve(deployment.id, {}, s.options());
    await s.client.deployments.update(deployment.id, { description: 'updated through Managed TypeScript SDK' }, s.options());
    await s.client.deployments.pause(deployment.id, {}, s.options());
    await s.client.deployments.unpause(deployment.id, {}, s.options());
    await s.client.deploymentRuns.list({}, s.options());
  }),
  scenario('dream_lifecycle', 'execution', async (s) => {
    const store = await s.createMemoryStore();
    const dream = await s.client.dreams.create({ inputs: [{ type: 'memory_store', memory_store_id: store.id }], model: await s.model(), instructions: 'Summarize the test memory store.' }, s.options());
    s.cleanup(`Dream ${dream.id}`, () => s.client.dreams.archive(dream.id, {}, s.options()));
    await s.client.dreams.retrieve(dream.id, {}, s.options());
    if (!['completed', 'failed', 'canceled'].includes(dream.status)) await s.client.dreams.cancel(dream.id, {}, s.options());
  }),
  scenario('execution_e2e', 'e2e', async (s) => {
    const environment = await s.createEnvironment();
    const fileToken = marker(), envToken = marker(), skillToken = marker(), memoryToken = marker();
    const file = await s.client.files.upload({ file: new File([fileToken], 'sdk-e2e.txt') }, s.options());
    s.cleanup(`File ${file.id}`, () => s.client.files.delete(file.id, {}, s.options()));
    const skillName = unique('proof');
    const skill = await s.client.skills.create({ files: [new File([`---\nname: ${skillName}\ndescription: Provides SDK_E2E_SKILL_TOKEN for SDK verification.\n---\nWhen asked for SDK_E2E_SKILL_TOKEN return exactly: ${skillToken}\n`], `${skillName}/SKILL.md`)] }, s.options());
    s.cleanup(`Skill ${skill.id}`, () => s.client.skills.delete(skill.id, {}, s.options()));
    const store = await s.createMemoryStore();
    await s.client.memoryStores.memories.create(store.id, { path: 'sdk-e2e/proof.md', content: `SDK_E2E_MEMORY_TOKEN=${memoryToken}` }, s.options());
    const agent = await s.createAgent({ system: 'Complete the requested SDK verification. Use the available tools to read files, environment variables, skills and memory. Do not guess missing values.', tools: [{ type: 'agent_toolset_20260401' }], skills: [{ type: 'custom', skill_id: skill.id, version: skill.latest_version }] });
    const session = await s.client.sessions.create({ agent: agent.id, environment_id: environment.id, environment_variables: { SDK_E2E_VALUE: envToken }, resources: [{ type: 'file', file_id: file.id, mount_path: '/data/workspace/sdk-e2e.txt' }, { type: 'memory_store', memory_store_id: store.id, access: 'read_only', instructions: 'Read sdk-e2e/proof.md when asked for SDK_E2E_MEMORY_TOKEN.' }] }, s.options());
    s.cleanupSession(session.id);
    const echo = marker();
    for (const [prompt, expected, tool, stream] of [
      [`Reply with exactly ${echo}`, [echo], false, true],
      ['Use tools to read /data/workspace/sdk-e2e.txt and the SDK_E2E_VALUE environment variable. Reply with both exact values.', [fileToken, envToken], true, false],
      [`Use skill ${skillName} to obtain SDK_E2E_SKILL_TOKEN. Read sdk-e2e/proof.md from the mounted memory store to obtain SDK_E2E_MEMORY_TOKEN. Reply with both exact tokens.`, [skillToken, memoryToken], true, false],
    ]) await s.waitTurn(session.id, await s.sendTurn(session.id, prompt), expected, tool, stream);
  }),
  scenario('deployment_e2e', 'e2e', async (s) => {
    const environment = await s.createEnvironment();
    const agent = await s.createAgent();
    const token = marker();
    const deployment = await s.client.deployments.create({ name: unique('deployment-e2e'), agent: agent.id, environment_id: environment.id, initial_events: [userMessage(`Reply with exactly ${token}`)] }, s.options());
    s.cleanup(`Deployment ${deployment.id}`, () => s.client.deployments.archive(deployment.id, {}, s.options()));
    const run = await s.client.deployments.run(deployment.id, {}, s.options());
    assert(run.session_id, `Deployment run=${run.id} returned no session`);
    s.cleanupSession(run.session_id);
    const got = await s.client.deploymentRuns.retrieve(run.id, {}, s.options());
    assert.equal(got.session_id, run.session_id, 'Run session changed');
    await s.waitTurn(run.session_id, '', [token]);
  }),
  scenario('dream_e2e', 'e2e', async (s) => {
    const store = await s.createMemoryStore();
    const token = marker();
    await s.client.memoryStores.memories.create(store.id, { path: 'sdk-e2e/source.md', content: `Permanent project verification code: ${token}. Preserve this exact code during consolidation.` }, s.options());
    let dream = await s.client.dreams.create({ inputs: [{ type: 'memory_store', memory_store_id: store.id }], model: await s.model(), instructions: 'Consolidate the supplied memory into sdk-e2e/consolidated.md. Preserve the exact project verification code. Keep the original source.' }, s.options());
    s.cleanup(`Dream ${dream.id}`, async () => {
      let current = await s.client.dreams.retrieve(dream.id, {}, s.options());
      if (['pending', 'running'].includes(current.status)) {
        await s.client.dreams.cancel(dream.id, {}, s.options());
        for (;;) {
          current = await s.client.dreams.retrieve(dream.id, {}, s.options());
          if (!['pending', 'running'].includes(current.status)) break;
          await s.pollPause();
        }
      }
      for (const output of current.outputs ?? []) {
        if (output.memory_store_id && output.memory_store_id !== store.id) s.cleanup(`Dream output ${output.memory_store_id}`, () => s.client.memoryStores.delete(output.memory_store_id, {}, s.options()));
      }
      if (current.session_id) s.cleanupSession(current.session_id);
      await s.client.dreams.archive(dream.id, {}, s.options());
    });
    while (['pending', 'running'].includes(dream.status)) {
      await s.pollPause();
      dream = await s.client.dreams.retrieve(dream.id, {}, s.options());
    }
    assert.equal(dream.status, 'completed', `Dream status=${dream.status}`);
    assert(dream.outputs?.length > 0, 'Dream returned no outputs');
    let found = false;
    for (const output of dream.outputs) {
      for await (const memory of s.client.memoryStores.memories.list(output.memory_store_id, {}, s.options())) {
        if (memory.path !== 'sdk-e2e/consolidated.md') continue;
        const got = await s.client.memoryStores.memories.retrieve(memory.id, { memory_store_id: output.memory_store_id }, s.options());
        if (got.content.includes(token)) found = true;
      }
    }
    assert(found, 'Dream did not persist the requested consolidated memory with the original verification code');
  }),
];
