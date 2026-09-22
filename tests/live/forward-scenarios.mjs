import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { toFile } from '../../dist/forward/index.js';
import { batchTerminal, liveName, marker } from './forward-support.mjs';

// Each run function is also executed by offline scenario tests with an injected SDK client.
// Operation fixtures separately cover all 110 API methods, including destructive variants
// that the live lifecycle suite deliberately does not invoke.
export const forwardScenarios = [];
const scenario = (name, run, extras = {}) => forwardScenarios.push({ name, gates: ['WRITE'], run, ...extras });

const shared = {
  valid_token: async (s) => { await s.client.templates.list({ limit: 1 }, s.options); },
  create_identity_minimal: async (s) => {
    const identity = await s.client.identities.create({ external_id: liveName('minimal') }, s.options);
    s.cleanup('minimal identity', (options) => s.client.identities.delete(identity.id, options));
    assert.match(identity.id, /^idn_/);
    assert.equal(identity.enabled, true);
  },
  create_identity_metadata: async (s) => { assert.equal((await s.identity()).metadata.suite, 'sdk-live'); },
  list_templates_limit: async (s) => { assert.ok((await s.client.templates.list({ limit: 1 }, s.options)).data.length <= 1); },
  list_templates_after_cursor: async (s, t) => {
    const page = await s.client.templates.list({ limit: 1 }, s.options);
    if (!page.last_id) { t?.skip('no template cursor'); return; }
    await s.client.templates.list({ limit: 1, after_id: page.last_id }, s.options);
  },
  get_template_not_found: async (s) => {
    await assert.rejects(s.client.templates.retrieve('tmpl_does_not_exist', s.options), { status: 404 });
  },
  stream_session_events: async (s) => {
    const signal = AbortSignal.timeout(s.timeout);
    let stream;
    try {
      stream = await s.client.sessions.events.streamEvents(s.existingSessionID ?? process.env.QODER_FORWARD_LIVE_SESSION_ID, {}, { signal });
      for await (const event of stream) { assert.ok(event); break; }
    } catch (error) { if (!signal.aborted) throw error; }
    finally { stream?.controller.abort(); }
  },
  stream_session_events_invalid_cursor: async (s) => {
    await assert.rejects(async () => {
      const stream = await s.client.sessions.events.streamEvents(s.existingSessionID ?? process.env.QODER_FORWARD_LIVE_SESSION_ID, { last_event_id: 'evt_not_in_this_session' }, { signal: AbortSignal.timeout(s.timeout) });
      try { for await (const _event of stream) break; }
      finally { stream.controller.abort(); }
    }, { status: 404 });
  },
};

const sharedManifest = JSON.parse(readFileSync(new URL('../fixtures/forward/sdk-forward-cases.json', import.meta.url), 'utf8'));
assert.deepEqual(sharedManifest.cases.map((item) => item.scenario).sort(), Object.keys(shared).sort(), 'shared live scenario inventory drift');
for (const item of sharedManifest.cases) {
  scenario(item.scenario, shared[item.scenario], {
    gates: item.scenario.startsWith('create_identity') ? ['WRITE'] : [],
    requiresSession: item.scenario.startsWith('stream_session'), sharedCaseID: item.id,
  });
}

scenario('collections', async (s) => {
  await s.client.models.list(s.options);
  for (const resource of ['identities', 'sessions', 'schedules', 'batches', 'channels', 'environments', 'files', 'skills', 'vaults', 'memoryStores']) {
    const result = await s.client[resource].list({ limit: 1 }, s.options);
    assert.ok(Array.isArray(result.data));
  }
}, { gates: [] });

scenario('template_lifecycle', async (s) => {
  const template = await s.template((await s.environment()).id);
  const got = await s.client.templates.retrieve(template.id, s.options);
  assert.equal(got.id, template.id);
  assert.ok(typeof got.model === 'string' ? got.model : got.model.id, 'template model must round trip');
  assert.equal((await s.client.templates.update(template.id, { name: `${template.name}-updated` }, s.options)).name, `${template.name}-updated`);
  const clone = await s.client.templates.clone(template.id, {}, s.options);
  s.cleanup('cloned template', (options) => s.client.templates.archive(clone.id, {}, options));
  assert.notEqual(clone.id, template.id);
});

scenario('identity_config_lifecycle', async (s) => {
  const identity = await s.identity();
  const template = await s.template((await s.environment()).id);
  assert.equal((await s.client.identities.update(identity.id, { name: 'SDK renamed identity' }, s.options)).name, 'SDK renamed identity');
  assert.equal((await s.client.identities.disable(identity.id, s.options)).enabled, false);
  assert.equal((await s.client.identities.enable(identity.id, s.options)).enabled, true);
  await s.client.identities.configs.upsert(identity.id, template.id, {
    identity_config: { environment_variables: { SDK_LIVE: { op: 'set', value: 'one' } } },
  }, s.options);
  const config = await s.client.identities.configs.retrieve(identity.id, template.id, s.options);
  assert.equal(config.identity_config.environment_variables.SDK_LIVE.value, 'one');
  await s.client.identities.configs.getEffective(identity.id, template.id, s.options);
  await s.client.identities.configs.list(identity.id, {}, s.options);
  await s.client.identities.listTemplates(identity.id, s.options);
});

scenario('environment_lifecycle', async (s) => {
  const environment = await s.environment();
  const got = await s.client.environments.retrieve(environment.id, s.options);
  assert.equal(got.id, environment.id);
  assert.equal(got.config.type, 'cloud');
  assert.equal((await s.client.environments.update(environment.id, { description: 'SDK updated environment' }, s.options)).description, 'SDK updated environment');
});

scenario('session_resource_thread_lifecycle', async (s) => {
  const identity = await s.identity();
  const template = await s.template((await s.environment()).id);
  const session = await s.session(identity.id, template.id);
  assert.equal((await s.client.sessions.update(session.id, { title: 'SDK updated session' }, s.options)).title, 'SDK updated session');
  const file = await s.file('sdk-resource.txt', 'session_resource', 'SDK resource');
  const resource = await s.client.sessions.resources.add(session.id, { type: 'file', file_id: file.id, mount_path: '/data/workspace/sdk-resource.txt' }, s.options);
  assert.equal(resource.file_id, file.id);
  assert.equal(resource.mount_path, '/data/workspace/sdk-resource.txt');
  await s.client.sessions.events.list(session.id, { limit: 1 }, s.options);
  for (const thread of (await s.client.sessions.threads.list(session.id, {}, s.options)).data) {
    assert.equal((await s.client.sessions.threads.retrieve(session.id, thread.id, s.options)).id, thread.id);
    await s.client.sessions.threads.events.list(session.id, thread.id, {}, s.options);
  }
});

scenario('file_upload_download_lifecycle', async (s) => {
  const file = await s.file('sdk-live.txt', 'user_upload', 'SDK live file content');
  const meta = await s.client.files.getMetadata(file.id, s.options);
  assert.equal(meta.id, file.id);
  // CAS forbids downloading user_upload files; only round-trip when the API marks them downloadable.
  if (meta.downloadable) assert.equal(await (await s.client.files.download(file.id, s.options)).text(), 'SDK live file content');
});

export function assertNonemptyZip(bytes) {
  const data = Buffer.from(bytes);
  let end = -1;
  for (let offset = data.length - 22; offset >= Math.max(0, data.length - 65_557); offset--) {
    if (data.readUInt32LE(offset) === 0x06054b50) { end = offset; break; }
  }
  assert.ok(end >= 0, 'invalid skill ZIP archive: no central directory');
  assert.ok(data.readUInt16LE(end + 10) > 0, 'empty skill archive');
  const offset = data.readUInt32LE(end + 16);
  assert.ok(offset + 46 <= data.length, 'truncated skill ZIP central directory');
  assert.equal(data.readUInt32LE(offset), 0x02014b50, 'invalid skill ZIP central directory');
}

scenario('skill_version_lifecycle', async (s) => {
  const name = liveName('skill');
  const files = async (content) => [await toFile(`---\nname: ${name}\ndescription: SDK live skill\n---\n# SDK\n${content}\n`, `${name}/SKILL.md`)];
  const skill = await s.client.skills.create({ files: await files('version one'), metadata: { suite: 'sdk-live' } }, s.options);
  s.cleanup('skill', (options) => s.client.skills.delete(skill.id, options));
  assert.ok(skill.id && skill.latest_version);
  assert.equal((await s.client.skills.retrieve(skill.id, {}, s.options)).id, skill.id);
  const version = await s.client.skills.versions.create(skill.id, { files: await files('version two') }, s.options);
  assert.ok(version.version);
  assert.equal((await s.client.skills.versions.retrieve(skill.id, version.version, s.options)).id, version.id);
  assertNonemptyZip(await (await s.client.skills.versions.download(skill.id, version.version, s.options)).arrayBuffer());
});

scenario('vault_credential_lifecycle', async (s) => {
  const vault = await s.client.vaults.create({ display_name: liveName('vault') }, s.options);
  s.cleanup('vault', (options) => s.client.vaults.delete(vault.id, options));
  assert.equal((await s.client.vaults.retrieve(vault.id, s.options)).id, vault.id);
  const secret = 'sdk-live-placeholder-secret';
  const credential = await s.client.vaults.credentials.create(vault.id, { auth: { type: 'static_bearer', mcp_server_url: `https://example.com/${liveName('mcp')}`, token: secret } }, s.options);
  s.cleanup('credential', (options) => s.client.vaults.credentials.delete(vault.id, credential.id, options));
  const got = await s.client.vaults.credentials.retrieve(vault.id, credential.id, s.options);
  assert.equal(got.id, credential.id);
  assert.ok(!JSON.stringify([credential, got]).includes(secret), 'credential responses must redact secrets');
  await s.client.vaults.credentials.list(vault.id, {}, s.options);
});

scenario('channel_qr_session_lifecycle', async (s) => {
  const identity = await s.identity();
  const template = await s.template((await s.environment()).id);
  const channel = await s.client.channels.create({ channel_type: 'wechat', identity_id: identity.id, template_id: template.id, name: liveName('channel') }, s.options);
  s.cleanup('channel', (options) => s.client.channels.delete(channel.id, options));
  assert.equal((await s.client.channels.retrieve(channel.id, s.options)).id, channel.id);
  const qr = await s.client.channels.qrSessions.create(channel.id, {}, s.options);
  assert.ok(qr.session_key);
  assert.equal((await s.client.channels.qrSessions.retrieve(qr.session_key, s.options)).session_key, qr.session_key);
  assert.equal((await s.client.channels.update(channel.id, { enabled: false }, s.options)).enabled, false);
}, { gates: ['WRITE', 'CHANNEL'] });

scenario('memory_store_memory_lifecycle', async (s) => {
  const store = await s.client.memoryStores.create({ name: liveName('memory'), idempotency_key: liveName('key') }, s.options);
  s.cleanup('memory store', (options) => s.client.memoryStores.delete(store.id, options));
  const memory = await s.client.memoryStores.memories.create(store.id, { path: 'sdk/live.md', content: 'SDK initial content' }, s.options);
  s.cleanup('memory', (options) => s.client.memoryStores.memories.delete(store.id, memory.id, options));
  const updated = await s.client.memoryStores.memories.update(store.id, memory.id, { content: 'SDK updated content', content_sha256: memory.content_sha256 }, s.options);
  assert.equal(updated.content, 'SDK updated content');
  assert.notEqual(updated.content_sha256, memory.content_sha256);
  await s.client.memoryStores.memoryVersions.list(store.id, {}, s.options);
  const identity = await s.identity();
  const template = await s.template((await s.environment()).id);
  await s.client.identities.memoryStores.mount(identity.id, template.id, { memory_store_id: store.id }, s.options);
  s.cleanup('memory mount', (options) => s.client.identities.memoryStores.detach(identity.id, template.id, store.id, options));
  await s.client.identities.memoryStores.list(identity.id, template.id, s.options);
});

scenario('schedule_lifecycle', async (s) => {
  const environment = await s.environment();
  const identity = await s.identity();
  const template = await s.template(environment.id);
  const schedule = await s.client.schedules.create({ identity_id: identity.id, template_id: template.id, environment_id: environment.id,
    name: liveName('schedule'), initial_events: [{ type: 'user.message', content: 'Reply with SDK-LIVE.' }], trigger_policy: { type: 'manual' } }, s.options);
  s.cleanup('schedule', (options) => s.client.schedules.archive(schedule.id, {}, options));
  assert.equal((await s.client.schedules.retrieve(schedule.id, s.options)).id, schedule.id);
  assert.equal((await s.client.schedules.update(schedule.id, { description: 'SDK updated schedule' }, s.options)).description, 'SDK updated schedule');
  assert.equal((await s.client.schedules.pause(schedule.id, {}, s.options)).status, 'paused');
  assert.equal((await s.client.schedules.unpause(schedule.id, {}, s.options)).status, 'active');
  await s.client.scheduleRuns.list({ identity_id: identity.id, schedule_id: schedule.id }, s.options);
  assert.equal((await s.client.schedules.archiveMany({ schedule_ids: [schedule.id, schedule.id] }, s.options)).archived_count, 1);
});

scenario('validation_only_batch_lifecycle', async (s) => {
  const file = await s.file('sdk-validation.jsonl', 'session_resource', '{"custom_id":"sdk-live-validation","body":{"input":"missing required Forward batch fields"}}\n');
  const batch = await s.client.batches.create({ input_file_id: file.id, completion_window: '24h' }, s.options);
  s.cleanup('batch', async (options) => {
    const current = await s.client.batches.retrieve(batch.id, options);
    if (!batchTerminal(current.status)) await s.client.batches.cancel(batch.id, {}, options);
  });
  assert.equal((await s.client.batches.retrieve(batch.id, s.options)).id, batch.id);
  await s.client.batches.tasks.list(batch.id, {}, s.options);
}, { gates: ['WRITE', 'EXECUTION'] });

scenario('execution_e2e', async (s, t) => {
  const environment = await s.environment();
  const identityName = liveName('identity');
  const identity = await s.client.identities.create({ external_id: identityName, name: identityName, metadata: { suite: 'sdk-live' } }, s.options);
  s.cleanup('identity', (options) => s.client.identities.delete(identity.id, options));
  const fileToken = marker(), envToken = marker(), skillToken = marker(), memoryToken = marker();
  const file = await s.file('sdk-e2e.txt', 'session_resource', fileToken);
  const skillName = liveName('proof');
  const skill = await s.client.skills.create({ files: [await toFile(`---\nname: ${skillName}\ndescription: Provides the SDK_E2E_SKILL_TOKEN for SDK verification.\n---\nWhen asked for SDK_E2E_SKILL_TOKEN return exactly: ${skillToken}\n`, `${skillName}/SKILL.md`)] }, s.options);
  s.cleanup('skill', (options) => s.client.skills.delete(skill.id, options));
  const store = await s.client.memoryStores.create({ name: liveName('proof'), idempotency_key: liveName('memory-key') }, s.options);
  s.cleanup('memory store', (options) => s.client.memoryStores.delete(store.id, options));
  await s.client.memoryStores.memories.create(store.id, { path: 'sdk-e2e/proof.md', content: `SDK_E2E_MEMORY_TOKEN=${memoryToken}` }, s.options);
  const template = await s.client.templates.create({ name: liveName('proof'), environment_id: environment.id, model: s.model,
    system: 'Complete the requested SDK verification. Use the available tools to read files, environment variables, skills and memory. Do not guess missing values.',
    tools: [{ type: 'agent_toolset_20260401' }], skills: [{ type: 'custom', skill_id: skill.id, version: skill.latest_version }],
    environment_variables: { SDK_E2E_VALUE: 'template-default' } }, s.options);
  s.cleanup('template', (options) => s.client.templates.archive(template.id, {}, options));
  await s.client.identities.configs.upsert(identity.id, template.id, { identity_config: { environment_variables: { SDK_E2E_VALUE: { op: 'set', value: envToken } } } }, s.options);
  await s.client.identities.memoryStores.mount(identity.id, template.id, { memory_store_id: store.id }, s.options);
  s.cleanup('memory mount', (options) => s.client.identities.memoryStores.detach(identity.id, template.id, store.id, options));
  const session = await s.client.sessions.create({ identity_id: identity.id, template_id: template.id,
    resources: [{ type: 'file', file_id: file.id, mount_path: '/data/workspace/sdk-e2e.txt' }] }, s.options);
  s.cleanupSession(session.id);
  const echo = marker();
  for (const [name, prompt, expected, tool, stream] of [
    ['completion_and_sse', `Reply with exactly ${echo}`, [echo], false, true],
    ['file_and_identity_config', 'Use tools to read /data/workspace/sdk-e2e.txt and the SDK_E2E_VALUE environment variable. Reply with both exact values.', [fileToken, envToken], true, false],
    ['skill_and_memory', `Use skill ${skillName} to obtain SDK_E2E_SKILL_TOKEN. Read sdk-e2e/proof.md from the mounted memory store to obtain SDK_E2E_MEMORY_TOKEN. Reply with both exact tokens.`, [skillToken, memoryToken], true, false],
  ]) {
    const run = async () => s.waitTurn(session.id, await s.sendTurn(session.id, prompt), expected, tool, stream);
    if (t?.test) {
      let failure;
      await t.test(name, async () => {
        try { await run(); }
        catch (error) { failure = error; throw error; }
      });
      if (failure) return;
    }
    else await run();
  }
}, { gates: ['WRITE', 'EXECUTION'], execution: true });

scenario('schedule_e2e', async (s) => {
  const environment = await s.environment();
  const identity = await s.identity();
  const template = await s.template(environment.id);
  const token = marker();
  const schedule = await s.client.schedules.create({ identity_id: identity.id, template_id: template.id, environment_id: environment.id,
    name: liveName('schedule-e2e'), initial_events: [{ type: 'user.message', content: `Reply with exactly ${token}` }],
    trigger_policy: { type: 'manual' }, execution: { max_attempts: 1, max_concurrent_runs: 1 } }, s.options);
  s.cleanup('schedule', (options) => s.client.schedules.archive(schedule.id, {}, options));
  const created = await s.client.schedules.run(schedule.id, { idempotency_key: liveName('schedule-run') }, s.options);
  const runID = created.id;
  s.cleanup(`schedule run ${runID}`, (options) => s.finishScheduleRun(runID, identity.id, options));
  let sessionID;
  for (;;) {
    const run = await s.client.scheduleRuns.retrieve(runID, { identity_id: identity.id }, s.options);
    sessionID ||= run.session_id;
    if (run.status === 'completed') break;
    assert.ok(!['failed', 'skipped'].includes(run.status), `schedule run=${runID} status=${run.status}`);
    await s.pause();
  }
  assert.ok(sessionID, 'completed schedule has no session');
  await s.waitTurn(sessionID, '', [token], false, false);
}, { gates: ['WRITE', 'EXECUTION'], execution: true });

scenario('batch_e2e', async (s) => {
  const identity = await s.identity();
  const template = await s.template((await s.environment()).id);
  const token = marker(), customID = liveName('task');
  const input = await s.file('sdk-e2e-input.jsonl', 'session_resource', `${JSON.stringify({ custom_id: customID, template_id: template.id,
    identity_id: identity.id, body: { input: `Reply with exactly ${token}` } })}\n`);
  let batch = await s.client.batches.create({ input_file_id: input.id, completion_window: '24h', idempotency_key: liveName('batch') }, s.options);
  const batchID = batch.id;
  s.cleanup(`batch ${batchID}`, (options) => s.finishBatch(batchID, customID, identity.id, template.id, options));
  while (!batchTerminal(batch.status)) {
    batch = await s.client.batches.retrieve(batchID, s.options);
    if (!batchTerminal(batch.status)) await s.pause();
  }
  assert.equal(batch.status, 'completed');
  assert.equal(batch.request_counts.completed, 1);
  assert.equal(batch.request_counts.failed, 0);
  assert.ok(batch.output_file_id);
  const tasks = await s.client.batches.tasks.list(batchID, {}, s.options);
  assert.equal(tasks.data.length, 1);
  assert.equal(tasks.data[0].custom_id, customID);
  const rows = await s.batchOutput(batchID, s.options);
  assert.equal(rows.length, 1);
  const row = rows[0];
  assert.equal(row.custom_id, customID);
  assert.equal(row.identity_id, identity.id);
  assert.equal(row.template_id, template.id);
  assert.equal(row.status, 'completed');
  assert.ok(row.session_id);
  assert.ok(row.error == null);
  await s.waitTurn(row.session_id, '', [token], false, false);
  assert.ok(JSON.stringify(row.response).includes(token), 'batch output must contain the assistant result');
}, { gates: ['WRITE', 'EXECUTION'], execution: true });
