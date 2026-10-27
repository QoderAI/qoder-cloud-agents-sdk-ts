// Official docs.qoder.com contracts retrieved 2026-10-27; no network required.
import assert from 'node:assert/strict';
import test from 'node:test';
import { testClient, response } from './helpers.mjs';

for (const model of [undefined, null, '', 'auto', { id: 'auto', effort: 'none', context_window: 400000 }]) {
  test(`Managed Dream model default/tuning: ${JSON.stringify(model)}`, async () => {
    const inputs = [{ type: 'memory_store', memory_store_id: 'mem' }];
    const client = testClient('managed', async req => {
      assert.deepEqual(await req.json(), model === undefined ? { inputs } : { inputs, model });
      return response({ model: { id: 'auto', effort: 'none', context_window: 400000 } });
    });
    const dream = await client.dreams.create({ inputs, model });
    assert.equal(dream.model.effort, 'none');
  });
}

for (const rubric of [{ type: 'text', content: 'report exists' }, { type: 'file', file_id: 'file' }]) {
  test(`Outcome rubric ${rubric.type} round trip`, async () => {
    const event = { type: 'user.define_outcome', description: 'write report', rubric };
    const client = testClient('forward', async req => {
      if (req.method === 'POST') assert.deepEqual(await req.json(), { events: [event] });
      return response({ data: [event], has_more: false });
    });
    await client.sessions.events.send('sess', { events: [event] });
    assert.deepEqual((await client.sessions.events.list('sess')).data[0].rubric, rubric);
  });
}

test('Identity false, null clearing, sparse capability overrides and tools replacement', async () => {
  const queue = [];
  const client = testClient('forward', async req => {
    const [path, body] = queue.shift();
    assert.equal(new URL(req.url).pathname, '/api/v1/forward' + path);
    assert.deepEqual(await req.json(), body);
    return response(body);
  });
  queue.push(['/identities/idn', { auto_memory_store: false }]);
  assert.equal((await client.identities.update('idn', { auto_memory_store: false })).auto_memory_store, false);
  for (const spec of [
    { tools: [], managed_tool_config: { schedule: { enabled: false }, drive: null } },
    { tools: { Bash: { enabled: false } } },
    { tools: null, managed_tool_config: null, system: null, model: null },
  ]) {
    queue.push(['/identities/idn/templates/tmpl/config', { identity_config: spec }]);
    assert.deepEqual((await client.identities.configs.upsert('idn', 'tmpl', { identity_config: spec })).identity_config, spec);
  }
  queue.push(['/identities/idn/templates/tmpl/memory_stores', { memory_store_id: 'mem', access: 'read_write' }]);
  assert.equal((await client.identities.memoryStores.mount('idn', 'tmpl', { memory_store_id: 'mem', access: 'read_write' })).access, 'read_write');
  assert.equal(queue.length, 0);
});

for (const direction of ['after_id', 'before_id']) {
  test(`Identity mounts ${direction} pagination retains scope and uses memory_store_id cursor`, async () => {
    let calls = 0;
    const client = testClient('forward', req => {
      const url = new URL(req.url);
      assert.equal(url.pathname, '/api/v1/forward/identities/idn/templates/tmpl/memory_stores');
      assert.equal(url.searchParams.get('limit'), '1');
      assert.equal(url.searchParams.get(direction), calls++ ? 'mem_one' : 'start');
      assert.equal(url.searchParams.has(direction === 'before_id' ? 'after_id' : 'before_id'), false);
      const id = calls === 1 ? 'mem_one' : 'mem_two';
      return response({ data: [{ memory_store_id: id }], first_id: id, last_id: id, has_more: calls === 1 });
    });
    const ids = [];
    for await (const mount of client.identities.memoryStores.list('idn', 'tmpl', { limit: 1, [direction]: 'start' })) ids.push(mount.memory_store_id);
    assert.deepEqual(ids, ['mem_one', 'mem_two']);
    assert.equal(calls, 2);
  });
}

test('Schedule file attachments and Run input snapshots use body and query respectively', async () => {
  const resources = [{ type: 'file', file_id: 'file', mount_path: '/data/test.txt' }];
  const initial_events = [{ type: 'user.message', content: [{ type: 'text', text: 'run input' }] }];
  const client = testClient('forward', async req => {
    if (new URL(req.url).pathname.endsWith('/schedules/sched')) {
      assert.deepEqual(await req.json(), { resources });
      return response({ resources });
    }
    assert.equal(new URL(req.url).searchParams.get('include_initial_events'), 'true');
    assert.equal(await req.text(), '');
    return response({ initial_events });
  });
  assert.deepEqual((await client.schedules.update('sched', { resources })).resources, resources);
  assert.deepEqual((await client.scheduleRuns.retrieve('run', { include_initial_events: true })).initial_events, initial_events);
});

test('Forward Multiagent roster preserves string, self and advisor variants', async () => {
  const multiagent = { type: 'roster', agents: ['tmpl_helper', { type: 'self' }, { type: 'advisor', model: 'ultimate' }] };
  const client = testClient('forward', async req => {
    assert.deepEqual(await req.json(), { multiagent });
    return response({ multiagent });
  });
  assert.deepEqual((await client.templates.update('tmpl', { multiagent })).multiagent, multiagent);
});

test('Forward Dream lifecycle keeps no-body actions and pending pairing empty strings', async () => {
  const queue = [
    ['POST', '/dreams', { inputs: [{ type: 'identity_template', identity_id: 'idn', template_id: 'tmpl' }] }],
    ['POST', '/dreams/drm/cancel', undefined],
    ['POST', '/dreams/drm/archive', undefined],
    ['GET', '/channel_pairings/pair', undefined],
    ['POST', '/channel_pairings/pair', { template_id: 'tmpl_new' }],
  ];
  const client = testClient('forward', async req => {
    const [method, path, body] = queue.shift();
    assert.equal(req.method, method);
    assert.equal(new URL(req.url).pathname, '/api/v1/forward' + path);
    if (body) assert.deepEqual(await req.json(), body); else assert.equal(await req.text(), '');
    return response(path.includes('pairings') ? { status: 'pairing', identity_id: '', template_id: '', paired_at: '' } : { id: 'drm' });
  });
  await client.dreams.create({ inputs: [{ type: 'identity_template', identity_id: 'idn', template_id: 'tmpl' }] });
  await client.dreams.cancel('drm');
  await client.dreams.archive('drm');
  assert.equal((await client.channelPairings.retrieve('pair')).paired_at, '');
  await client.channelPairings.update('pair', { template_id: 'tmpl_new' });
  assert.equal(queue.length, 0);
});

test('OAuth sends secret only in body and keeps workspace header out of payload', async () => {
  const body = { vault_id: 'vault', mcp_server_url: 'https://mcp.example.com', client_id: 'client', client_secret: 'test-secret' };
  const expected = { authorization_url: 'https://auth.example.com', state: 'opaque', callback_origin: 'https://api.example.com' };
  const client = testClient('managed', async req => {
    assert.equal(new URL(req.url).pathname, '/api/v1/cloud/oauth/start');
    assert.equal(new URL(req.url).search, '');
    assert.equal(req.headers.get('qoder-workspace-id'), 'workspace');
    assert.deepEqual(await req.json(), body);
    return response(expected);
  });
  assert.deepEqual(await client.oauth.start({ ...body, workspace_id: 'workspace' }), expected);
});

test('OSS credentials, update omission and empty bucket clearing retain explicit beta', async () => {
  const bucket = { name: 'assets', provider: 'aliyun-oss', region: 'cn-hangzhou', bucket: 'example', credential: { type: 'access_key', access_key_id: 'test-ak', access_key_secret: 'test-secret' } };
  const readBucket = { ...bucket, credential: { type: 'access_key', access_key_id: 'test****' } };
  const queue = [];
  const client = testClient('managed', async req => {
    assert.equal(req.headers.get('x-qoder-beta'), 'oss-bucket-2026-09-23');
    assert.deepEqual(await req.json(), queue.shift());
    assert.equal(new URL(req.url).search, '');
    return response({ config: { type: 'cloud', storage: { buckets: [readBucket] } } });
  });
  const { credential, ...retain } = bucket;
  for (const buckets of [[bucket], [retain], []]) {
    const config = { type: 'cloud', storage: { buckets } };
    queue.push({ config });
    const env = await client.environments.update('env', { config, betas: ['oss-bucket-2026-09-23'] });
    assert.deepEqual(env.config.storage.buckets[0].credential, readBucket.credential);
  }
  assert.equal(queue.length, 0);
});

test('Managed Memory Store ID cursor starts in query', async () => {
  const client = testClient('managed', async req => {
    assert.equal(new URL(req.url).searchParams.get('before_id'), 'mem_before');
    assert.equal(new URL(req.url).searchParams.get('include_archived'), 'false');
    assert.equal(await req.text(), '');
    return response({ data: [], has_more: false });
  });
  await client.memoryStores.list({ before_id: 'mem_before', include_archived: false });
});
