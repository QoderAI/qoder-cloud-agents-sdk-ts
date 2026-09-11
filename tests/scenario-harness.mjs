import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { contracts, operations, testClient, response } from './helpers.mjs';

const clone = value => structuredClone(value);
const terminal = new Set(['archived', 'terminated', 'completed', 'canceled', 'cancelled']);
const hash = value => createHash('sha256').update(value).digest('hex');

// Stored ZIP, so skill archive checks exercise real archive structure without a dependency.
export function zipFile(name, contents) {
  const filename = Buffer.from(name), data = Buffer.from(contents);
  let crc = 0xffffffff;
  for (const byte of data) { crc ^= byte; for (let k = 0; k < 8; k++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0); }
  crc = (crc ^ 0xffffffff) >>> 0;
  const local = Buffer.alloc(30), central = Buffer.alloc(46), end = Buffer.alloc(22);
  local.writeUInt32LE(0x04034b50,0); local.writeUInt16LE(20,4); local.writeUInt32LE(crc,14); local.writeUInt32LE(data.length,18); local.writeUInt32LE(data.length,22); local.writeUInt16LE(filename.length,26);
  central.writeUInt32LE(0x02014b50,0); central.writeUInt16LE(20,4); central.writeUInt16LE(20,6); central.writeUInt32LE(crc,16); central.writeUInt32LE(data.length,20); central.writeUInt32LE(data.length,24); central.writeUInt16LE(filename.length,28);
  end.writeUInt32LE(0x06054b50,0); end.writeUInt16LE(1,8); end.writeUInt16LE(1,10); end.writeUInt32LE(central.length + filename.length,12); end.writeUInt32LE(local.length + filename.length + data.length,16);
  return Buffer.concat([local, filename, data, central, filename, end]);
}

/** In-memory test server, driven by independently frozen Go routes.
 * It persists writes, enforces parent/binding identities and verifies cleanup.
 * Simulated agent output reads only the session's mounted resources and bindings.
 */
export class MockPlatform {
  constructor(mode) {
    this.mode = mode; this.counter = 0; this.records = new Map(); this.collections = new Map(); this.files = new Map(); this.events = new Map(); this.logs = []; this.artifacts = new Map();
    this.routes = contracts[mode].map(c => {
      const op = mode === 'forward' ? operations.find(o => o.operation_id === c.operation_id) : null;
      const route = op?.path ?? c.route;
      return { ...c, verb: op?.http_method ?? c.method, route, pattern: new RegExp(`^${route.replace(/\{[^}]+\}/g,'[^/]+')}$`) };
    }).sort((a,b) => (a.route.match(/\{/g)?.length ?? 0) - (b.route.match(/\{/g)?.length ?? 0));
    this.client = testClient(mode, req => this.handle(req));
    this.fetch = (input, init) => this.handle(new Request(input, init));
  }
  id(prefix) { return `${prefix}_${++this.counter}`; }
  put(collection, item) {
    if (!this.collections.has(collection)) this.collections.set(collection, new Set());
    const path = `${collection}/${item.id}`;
    this.collections.get(collection).add(path); this.records.set(path, item);
    return item;
  }
  get(path) { const result = this.records.get(path); assert(result, `unknown test resource: ${path}`); return result; }
  data(path) { return [...(this.collections.get(path) ?? [])].map(key => this.records.get(key)).filter(Boolean); }
  pagination(data) { return response({ data: clone(data), first_id: data[0]?.id ?? null, last_id: data.at(-1)?.id ?? null, has_more: false, next_page: null }); }
  delete(path) {
    for (const key of this.records.keys()) if (key === path || key.startsWith(`${path}/`)) this.records.delete(key);
  }
  create(collection, body = {}) {
    const kind = collection.split('/').at(-1);
    const id = this.id(({ environments:'env', agents:'agent', templates:'tmpl', identities:'idn', sessions:'sess', memory_stores:'store', memories:'mem', memory_versions:'mver', skills:'skill', versions:'version', files:'file', vaults:'vault', credentials:'cred', schedules:'schedule', deployments:'deployment', dreams:'dream', batches:'batch', resources:'resource', channels:'channel', qr_sessions:'qr' })[kind] ?? kind);
    const item = { id, type: kind.replace(/s$/,''), status: kind === 'sessions' ? 'idle' : 'active', enabled: true, version: 1, created_at: new Date(0).toISOString(), ...clone(body) };
    if (['agents','templates'].includes(kind) && typeof item.model === 'string') item.model = { id: item.model };
    if (['agents','templates','sessions','deployments','schedules'].includes(kind)) {
      if (item.environment_id) this.get(`/environments/${item.environment_id}`);
      if (item.template_id) this.get(`/templates/${item.template_id}`);
      if (item.identity_id) this.get(`/identities/${item.identity_id}`);
      if (typeof item.agent === 'string') this.get(`/agents/${item.agent}`);
    }
    if (kind === 'sessions') {
      this.events.set(id, []);
      for (const r of body.resources ?? []) {
        if (r.file_id) this.get(`/files/${r.file_id}`);
        if (r.memory_store_id) this.get(`/memory_stores/${r.memory_store_id}`);
        this.create(`/sessions/${id}/resources`, r);
      }
      this.put(`/sessions/${id}/threads`, { id: `${id}_thread`, session_id: id, status: 'idle' });
    }
    if (kind === 'memories') {
      item.content_sha256 = hash(item.content ?? '');
      const store = collection.split('/')[2]; this.get(`/memory_stores/${store}`);
      this.put(`/memory_stores/${store}/memory_versions`, { ...clone(item), id: this.id('mver'), memory_id: item.id });
    }
    if (kind === 'agents') this.put(`${collection}/${id}/versions`, clone(item));
    if (kind === 'credentials') {
      item.auth = { ...item.auth }; delete item.auth.token; delete item.auth.client_secret;
    }
    this.put(collection, item); return item;
  }
  update(path, body) {
    const item = this.get(path);
    if (item.content_sha256 && body.content_sha256) assert.equal(body.content_sha256, item.content_sha256, 'memory optimistic concurrency hash');
    Object.assign(item, clone(body));
    if (path.startsWith('/agents/')) { item.version++; this.put(`${path}/versions`, { ...clone(item), id: this.id('agent_version') }); }
    if (/\/memories\//.test(path) && body.content !== undefined) {
      item.content_sha256 = hash(item.content);
      this.put(`${path.split('/memories/')[0]}/memory_versions`, { ...clone(item), id: this.id('mver'), memory_id: item.id });
    }
    return item;
  }
  proof(session, prompt) {
    const agent = session.template_id ? this.get(`/templates/${session.template_id}`) : this.get(`/agents/${typeof session.agent === 'string' ? session.agent : session.agent?.id}`);
    if (prompt.startsWith('Reply with exactly ')) return prompt.slice('Reply with exactly '.length);
    if (prompt.includes('Reply with SDK-LIVE')) return 'SDK-LIVE';
    const values = [];
    const resources = this.data(`/sessions/${session.id}/resources`);
    for (const r of resources) if (r.file_id) values.push(this.files.get(r.file_id)?.contents ?? '');
    for (const value of Object.values(session.environment_variables ?? agent.environment_variables ?? {})) values.push(String(value));
    if (session.identity_id) {
      const config = this.records.get(`/identities/${session.identity_id}/templates/${session.template_id}/config`);
      for (const override of Object.values(config?.identity_config?.environment_variables ?? {})) if (override.op === 'set') values.push(String(override.value));
    }
    for (const binding of agent.skills ?? []) {
      const skill = this.get(`/skills/${binding.skill_id}`);
      values.push(skill.markdown ?? '');
    }
    const stores = resources.filter(r => r.memory_store_id).map(r => r.memory_store_id);
    if (session.identity_id) stores.push(...this.data(`/identities/${session.identity_id}/templates/${session.template_id}/memory_stores`).map(r => r.memory_store_id));
    for (const id of stores) values.push(...this.data(`/memory_stores/${id}/memories`).map(m => m.content));
    return values.join('\n');
  }
  send(sessionID, inputs) {
    const session = this.get(`/sessions/${sessionID}`), result = [];
    for (const input of inputs) {
      const user = { id: this.id('evt'), session_id: sessionID, ...clone(input) };
      this.events.get(sessionID).push(user); result.push(user);
      if (input.type === 'user.interrupt') { session.status = 'idle'; continue; }
      const prompt = typeof input.content === 'string' ? input.content : (input.content ?? []).filter(x => x.type === 'text').map(x => x.text).join('\n');
      const events = this.events.get(sessionID);
      if (!prompt.startsWith('Reply with exactly ')) events.push({ id: this.id('evt'), type: 'agent.tool_use', name: 'Read' });
      events.push({ id: this.id('evt'), type: 'agent.message', content: [{ type: 'text', text: this.proof(session, prompt) }] }, { id: this.id('evt'), type: 'session.status_idle', stop_reason: 'end_turn' });
      session.status = 'idle';
    }
    return result;
  }
  async handle(req) {
    const url = new URL(req.url);
    req.signal.throwIfAborted();
    if (url.host === 'storage.test') {
      assert.equal(req.headers.get('authorization'), null, 'API auth leaked into object storage');
      const data = this.artifacts.get(url.pathname) ?? this.files.get(url.pathname.slice(1))?.contents;
      assert.notEqual(data, undefined, `unknown storage object ${url.pathname}`);
      return response(data);
    }
    assert.equal(req.headers.get('authorization'), 'Bearer secret-pat');
    const path = url.pathname.replace(/^\/api\/v1\/(forward|cloud)/,'').split('/').map(decodeURIComponent).join('/');
    const route = this.routes.find(c => c.verb === req.method && c.pattern.test(path));
    assert(route, `API outside Go scope: ${req.method} ${path}`);
    let body = {};
    if (req.body) {
      if (req.headers.get('content-type')?.startsWith('multipart/form-data')) {
        const form = await req.formData();
        for (const [key, value] of form) {
          if (typeof value === 'string') { try { body[key] = JSON.parse(value); } catch { body[key] = value; } }
          else { const file = { name: value.name, contents: await value.text() }; if (key === 'files') (body.files ??= []).push(file); else body[key] = file; }
        }
      } else body = await req.json();
    }
    this.logs.push({ method: req.method, path, body: clone(body), query: Object.fromEntries(url.searchParams) });
    const parts = path.split('/').filter(Boolean), action = parts.at(-1), parent = '/' + parts.slice(0,-1).join('/');
    if (req.method === 'GET') {
      if (action === 'models') return this.pagination([{ id: 'model-test', is_enabled: true, enabled: true, name: 'Mock model' }]);
      if (action === 'stats') return response({ total: this.data('/identities').length });
      if (action === 'stream' || action === 'events') {
        const id = parts[1]; let events = this.events.get(id) ?? [];
        const after = url.searchParams.get('after_id') ?? req.headers.get('last-event-id');
        if (after) { const pos = events.findIndex(e => e.id === after); if (pos >= 0) events = events.slice(pos + 1); else if (action === 'stream') return response({ error: { message: 'event cursor not found' } }, 404); }
        if (action === 'stream') return response(events.map(e => `id: ${e.id}\nevent: ${e.type}\ndata: ${JSON.stringify(e)}\n\n`).join(''), 200, { 'content-type': 'text/event-stream' });
        return this.pagination(events);
      }
      if (action === 'content') {
        if (parts[0] === 'files') return response({ url: `https://storage.test/${parts[1]}?signature=test` });
        const version = this.get(parent); return new Response(zipFile('skill/SKILL.md', version.markdown ?? 'skill'), { headers: { 'content-type': 'application/zip' } });
      }
      if (action === 'effective') return response(this.records.get(parent + '/config') ?? {});
      if (parts[0] === 'qr_sessions') return response(this.get(path));
      if (route.name === 'List' || ['ListTemplates','ListAgents'].includes(route.name)) {
        let values = this.data(path);
        for (const field of ['identity_id','template_id','schedule_id','status']) if (url.searchParams.has(field)) values = values.filter(v => String(v[field]) === url.searchParams.get(field));
        return this.pagination(values);
      }
      if (!this.records.has(path)) return response({ error: { message: 'not found' } }, 404);
      return response(clone(this.get(path)));
    }
    if (req.method === 'DELETE') { const item = this.get(path); this.delete(path); return response({ id: item.id, deleted: true }); }
    if (action === 'archive' && parts.length === 2 && parts[0] === 'schedules') {
      const ids = [...new Set(body.schedule_ids)]; for (const id of ids) this.get(`/schedules/${id}`).status = 'archived';
      return response({ archived_count: ids.length });
    }
    if (['archive','pause','unpause','disable','enable','cancel'].includes(action)) {
      const item = this.get(parent);
      item.status = ({ archive:'archived', pause:'paused', unpause:'active', cancel: parts[0] === 'sessions' ? 'idle' : 'canceled' })[action] ?? item.status;
      if (action === 'disable' || action === 'enable') item.enabled = action === 'enable';
      return response(clone(item));
    }
    if (action === 'clone') return response(this.create('/templates', { ...this.get(parent), id: this.id('tmpl') }));
    if (action === 'config') { this.records.set(path, { ...clone(body) }); return response(body); }
    if (action === 'events') return this.pagination(this.send(parts[1], body.events));
    if (action === 'run') {
      const source = this.get(parent), session = this.create('/sessions', { agent: source.agent, identity_id: source.identity_id, template_id: source.template_id, environment_id: source.environment_id });
      this.send(session.id, source.initial_events ?? []);
      const runs = parts[0] === 'schedules' ? '/schedule_runs' : '/deployment_runs';
      const run = this.create(runs, { session_id: session.id, schedule_id: source.id, deployment_id: source.id, identity_id: source.identity_id, status: 'completed' });
      return response(run);
    }
    if (action === 'qr_sessions') {
      const qr = this.create(path, { session_key: this.id('qrkey'), channel_id: parts[1] });
      this.records.set(`/qr_sessions/${qr.session_key}`, qr); return response(qr);
    }
    if (route.name === 'New' || route.name === 'Upload' || route.name === 'Add' || route.name === 'Mount') {
      if (parts[0] === 'identities' && action === 'memory_stores') {
        this.get(`/memory_stores/${body.memory_store_id}`);
        const mount = this.put(path, { id: body.memory_store_id, ...body }); return response(mount);
      }
      const item = this.create(path, body);
      if (action === 'files') { this.files.set(item.id, body.file); item.filename = body.file.name; item.size_bytes = Buffer.byteLength(body.file.contents); delete item.file; }
      if (action === 'skills' || action === 'versions') {
        item.markdown = body.files?.[0]?.contents ?? '';
        if (action === 'skills') {
          const version = this.create(`${path}/${item.id}/versions`, { markdown: item.markdown }); version.version = version.id;
          item.latest_version = version.version; item.latest_version_id = version.version;
        } else item.version = item.id;
        delete item.files;
      }
      if (action === 'batches') {
        const input = this.files.get(body.input_file_id); assert(input, 'batch input file must exist');
        const rows = input.contents.trim().split('\n').map(line => JSON.parse(line));
        if (rows.some(row => !row.template_id || !row.identity_id)) {
          item.status = 'failed'; item.request_counts = { total: 0, completed: 0, failed: 0 };
        } else {
          const output = rows.map(row => {
            const session = this.create('/sessions', { identity_id: row.identity_id, template_id: row.template_id });
            this.send(session.id, [{ type: 'user.message', content: row.body.input }]);
            const assistant = this.events.get(session.id).find(e => e.type === 'agent.message');
            const result = { custom_id: row.custom_id, identity_id: row.identity_id, template_id: row.template_id, session_id: session.id, status: 'completed', response: assistant, error: null };
            this.create(`/batches/${item.id}/tasks`, result); return result;
          });
          item.status = 'completed'; item.request_counts = { total: rows.length, completed: rows.length, failed: 0 }; item.output_file_id = this.id('output');
          this.artifacts.set('/'+item.output_file_id, output.map(row => JSON.stringify(row)).join('\n')+'\n');
          this.records.set(`/batches/${item.id}/output`, { url: `https://storage.test/${item.output_file_id}` });
        }
      }
      if (action === 'dreams') {
        const input = body.inputs[0].memory_store_id; this.get(`/memory_stores/${input}`);
        item.status = 'completed'; item.outputs = [{ type: 'memory_store', memory_store_id: input }];
        if (body.instructions.includes('consolidated.md')) this.create(`/memory_stores/${input}/memories`, { path: 'sdk-e2e/consolidated.md', content: this.data(`/memory_stores/${input}/memories`).map(m => m.content).join('\n') });
      }
      return response(clone(item), 201);
    }
    return response(clone(this.update(path, body)));
  }
  assertCleanup() {
    const remaining = [];
    for (const [path, value] of this.records) {
      if (!/^\/(environments|agents|templates|identities|sessions|memory_stores|files|skills|vaults|channels|schedules|deployments|dreams)\/[^/]+$/.test(path)) continue;
      if (!terminal.has(value.status)) remaining.push(path);
    }
    assert.deepEqual(remaining, [], 'scenario cleanup left active top-level resources');
  }
}
