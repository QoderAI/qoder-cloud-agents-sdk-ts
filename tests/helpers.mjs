import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as sdk from '../dist/index.js';

export { sdk };
export const pathSegment = 'segment /?%#';
export const fixture = (mode, file) => JSON.parse(readFileSync(new URL(`./fixtures/${mode}/${file}`, import.meta.url), 'utf8'));
export const methods = Object.fromEntries(['forward', 'managed'].map(mode => [mode, fixture(mode, 'api-methods.json')]));
export const contracts = Object.fromEntries(['forward', 'managed'].map(mode => [mode, fixture(mode, 'api-contracts.json')]));
export const operations = fixture('forward', 'api-operation-cases.json').cases;
export function response(body, status = 200, headers = {}) {
  return new Response(status === 204 ? null : typeof body === 'string' ? body : JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'x-request-id': 'req_contract', ...headers } });
}
export function testClient(mode, handler, options = {}) {
  const Client = mode === 'forward' ? sdk.ForwardClient : sdk.ManagedClient;
  return new Client({ accessToken: 'secret-pat', baseURL: `https://qoder.test/api/v1/${mode === 'forward' ? 'forward' : 'cloud'}`, maxRetries: 0, fetch: async (input, init) => handler(new Request(input, init)), ...options });
}
export const lookup = (mode, contract) => methods[mode].find(m => m.id === contract.id);
export const resource = (client, entry) => entry.split('.').reduce((value, key) => value[key], client);
export const headerParam = name => ({ 'Idempotency-Key': 'idempotency_key', 'Last-Event-ID': 'last_event_id', 'X-Qoder-Beta': 'x_qoder_beta', 'x-qoder-beta': 'betas' })[name] ?? name.toLowerCase().replaceAll('-', '_');
export const parameterValue = p => p.wire_name === 'identity_ids' ? ['idn_one', 'idn_two'] : p.wire_name.endsWith('[]') ? [String(p.value), 'second-value'] : p.value;
export const operationBody = op => op.operation_id === 'sendSessionEvents' ? { events: [{ type: 'user.message', content: [{ type: 'text', text: 'hello' }] }] } : op.request_body?.value;
export async function argumentsFor(mode, m, op, overrides = {}) {
  const params = {};
  if (op?.request_body?.kind === 'json') Object.assign(params, operationBody(op));
  for (const p of op?.parameters ?? []) {
    if (p.location === 'path') continue;
    const value = parameterValue(p);
    params[p.location === 'header' ? headerParam(p.wire_name) : p.wire_name] = value;
  }
  for (const p of op?.request_body?.fields ?? []) {
    params[p.wire_name] = p.binary ? await sdk.toFile(Buffer.from('sdk-contract'), 'skill/SKILL.md', { type: 'text/markdown' }) : p.value;
    if (p.binary && p.wire_name === 'files') params[p.wire_name] = [params[p.wire_name]];
  }
  return Promise.all(m.args.map(async a => {
    if (a.kind === 'path') return pathSegment;
    for (const f of a.fields ?? []) {
      if (f.location === 'path') params[f.wire] = pathSegment;
      if (f.binary && !params[f.wire]) {
        const file = await sdk.toFile(Buffer.from('sdk-contract'), 'skill/SKILL.md', { type: 'text/markdown' });
        params[f.wire] = f.binaryArray ? [file] : file;
      }
    }
    return { ...params, ...overrides };
  }));
}
export async function invoke(client, m, args, options) {
  const r = resource(client, m.entry);
  return r[m.method](...args, ...(options ? [options] : []));
}
export async function assertRequest(req, mode, c, op) {
  const url = new URL(req.url);
  const method = op?.http_method ?? c.httpMethod;
  const route = op?.path ?? c.route;
  assert.equal(req.method, method);
  assert.equal(url.pathname, `/api/v1/${mode === 'forward' ? 'forward' : 'cloud'}${route.replace(/\{[^}]+\}/g, encodeURIComponent(pathSegment))}`);
  assert.equal(req.headers.get('authorization'), 'Bearer secret-pat');
  assert.equal(url.searchParams.has('beta'), false);
  for (const p of op?.parameters ?? []) {
    if (p.location === 'query') {
      const want = parameterValue(p);
      assert.deepEqual(url.searchParams.getAll(p.wire_name), (Array.isArray(want) ? want : [want]).map(String), `query ${p.wire_name}`);
    }
    if (p.location === 'header') assert.equal(req.headers.get(p.wire_name), String(parameterValue(p)), `header ${p.wire_name}`);
  }
  if (op?.request_body?.kind === 'json') assert.deepEqual(await req.json(), operationBody(op));
  if (op?.request_body?.kind === 'multipart') {
    const form = await req.formData();
    for (const f of op.request_body.fields) {
      const values = form.getAll(f.wire_name);
      assert.equal(values.length, 1);
      if (f.binary) assert.equal(await values[0].text(), 'sdk-contract');
      else assert.equal(values[0], String(f.value));
    }
  }
}
