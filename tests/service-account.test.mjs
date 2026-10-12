import assert from 'node:assert/strict';
import { test, mock } from 'node:test';
import { sdk, response } from './helpers.mjs';

const config = (fetch, options = {}) => ({ saKey: 'secret-key', region: 'global', scopes: ['qca.access', 'forward.access'], fetch, ...options });
const tokenResponse = (token = 'sat-1', expires = 100) => response({ access_token: token, token_type: 'Bearer', expires_in: expires, expires_at: '2099-01-01T00:00:00Z' });

for (const [Client, resource] of [[sdk.ForwardClient,'templates'], [sdk.ManagedClient,'agents']]) {
  test(`${resource}: PAT and SA modes isolate ambient credentials and survive copying`, async () => {
    const previous = [process.env.QODER_PAT, process.env.QODER_ACCESS_TOKEN];
    const requests = [];
    const fetch = async (input, init) => { requests.push(new Request(input, init)); return response({ data: [] }); };
    try {
      process.env.QODER_PAT = 'ambient-pat';
      delete process.env.QODER_ACCESS_TOKEN;
      const pat = new Client({ fetch });
      await pat[resource].list({});
      const sa = new Client({ authMode: 'sa', accessToken: 'static-sat', fetch });
      await sa.withOptions({})[resource].list({});
      await sa.withOptions({ authMode: 'pat' })[resource].list({});
      await assert.rejects(new Client({ authMode: 'sa', fetch })[resource].list({}), /Could not resolve/);
      process.env.QODER_ACCESS_TOKEN = 'generic-token';
      await new Client({ authMode: 'sa', fetch })[resource].list({});
      await new Client({ fetch })[resource].list({});
      assert.deepEqual(requests.map(r => r.headers.get('authorization')), ['Bearer ambient-pat','Bearer static-sat','Bearer ambient-pat','Bearer generic-token','Bearer generic-token']);
      assert.throws(() => new Client({ authMode: 'sa', pat: 'pat' }), /pat cannot/);
      assert.throws(() => new Client({ accessToken: 'sat', credential: { getToken: () => 'other' } }), /cannot be combined/);
      await assert.rejects(new Client({ accessToken: '', fetch })[resource].list({}), /empty/);
    } finally {
      for (const [name,value] of [['QODER_PAT',previous[0]],['QODER_ACCESS_TOKEN',previous[1]]]) {
        if (value === undefined) delete process.env[name]; else process.env[name] = value;
      }
    }
  });
}

test('shared SA credential exchanges once, keeps key off API requests and validates region', async () => {
  const exchanges = [], api = [];
  const credential = new sdk.ServiceAccountCredential(config(async (input, init) => { exchanges.push(new Request(input,init)); return tokenResponse(); }));
  const fetch = async (input, init) => { api.push(new Request(input,init)); return response({ data: [] }); };
  await new sdk.ForwardClient({ credential, fetch }).templates.list({});
  await new sdk.ManagedClient({ credential, fetch }).agents.list({});
  assert.equal(exchanges.length,1);
  assert.equal(exchanges[0].url,'https://openapi.qoder.sh/api/v1/serviceToken/exchange');
  assert.deepEqual(await exchanges[0].json(), { grant_type:'client_credentials', audience:'qoder', scope:'qca.access forward.access', ttl_seconds:3600 });
  assert.equal(exchanges[0].headers.get('authorization'),'Bearer secret-key');
  for (const request of api) assert.equal(request.headers.get('authorization'),'Bearer sat-1');
  assert.throws(() => new sdk.ManagedClient({ credential, pat: 'static' }), sdk.QoderError);
  assert.throws(() => new sdk.ManagedClient({ credential, baseURL: 'https://api.qoder.com.cn/api/v1/cloud/' }), /region/);
  assert.equal(JSON.stringify(credential).includes('secret-key'),false);
});

test('refresh uses monotonic TTL, bounded fallback and failure cooldown', async () => {
  let now = 1000, calls = 0, status = 200;
  const clock = mock.method(performance, 'now', () => now);
  try {
    const credential = new sdk.ServiceAccountCredential(config(async () => {
      calls++;
      return status === 200 ? tokenResponse(`sat-${calls}`, '100') : response({ error: { code: 'temporary', message: 'secret-key' } }, status);
    }));
    assert.equal(await credential.getToken(),'sat-1');
    now += 89_000;
    assert.equal(await credential.getToken(),'sat-1');
    assert.equal(calls,1);
    now += 1000;
    status = 503;
    assert.equal(await credential.getToken(),'sat-1');
    assert.equal(await credential.getToken(),'sat-1');
    assert.equal(calls,2);
    now += 5000;
    await assert.rejects(credential.getToken(), sdk.InternalServerError);
    assert.equal(calls,3);
    now += 5000;
    status = 200;
    assert.equal(await credential.getToken(),'sat-4');
    now += 90_000;
    status = 403;
    await assert.rejects(credential.getToken(), e => e instanceof sdk.PermissionDeniedError && !String(e).includes('secret-key'));
    await assert.rejects(credential.getToken(), sdk.PermissionDeniedError);
    assert.equal(calls,5);
  } finally { clock.mock.restore(); }
});

test('concurrent callers share success and failure; cancelled SDK waiter does not cancel exchange', async () => {
  let release, calls = 0;
  const gate = new Promise(resolve => { release = resolve; });
  const credential = new sdk.ServiceAccountCredential(config(async () => { calls++; await gate; return tokenResponse(); }));
  const controller = new AbortController();
  const client = new sdk.ManagedClient({ credential, fetch: async () => response({ data: [] }) });
  const abandoned = client.agents.list({}, { signal: controller.signal });
  const pending = Array.from({length:12},() => credential.getToken());
  controller.abort();
  await assert.rejects(abandoned, sdk.APIUserAbortError);
  release();
  assert.deepEqual(await Promise.all(pending),Array(12).fill('sat-1'));
  assert.equal(calls,1);
  calls = 0;
  const failed = new sdk.ServiceAccountCredential(config(async () => { calls++; return response({},429, {'retry-after':'120'}); }));
  const results = await Promise.allSettled(Array.from({length:12},() => failed.getToken()));
  assert.equal(calls,1);
  assert.ok(results.every(result => result.status === 'rejected' && result.reason instanceof sdk.RateLimitError));
  await assert.rejects(failed.getToken(),sdk.RateLimitError);
  assert.equal(calls,1);
});

test('invalid lifetimes and configuration fail without leaking response tokens', async () => {
  for (const ttl of [0,-1,1.5,'1.5',true,NaN,43201]) {
    const credential = new sdk.ServiceAccountCredential(config(async () => tokenResponse('sensitive-response-token',ttl)));
    await assert.rejects(credential.getToken(), e => e instanceof sdk.QoderError && !String(e).includes('sensitive-response-token'));
  }
  for (const options of [{region:'invalid'}, {scopes:[]}, {scopes:['has space']}, {ttlSeconds:0}, {timeout:0}, {saKey:''}]) {
    assert.throws(() => new sdk.ServiceAccountCredential(config(async () => tokenResponse(),options)),sdk.QoderError);
  }
});

test('CN exchange is explicit and 401 business writes are not replayed', async () => {
  let exchanges = 0, writes = 0;
  const credential = new sdk.ServiceAccountCredential(config(async (input) => {
    assert.equal(String(input),'https://openapi.qoder.com.cn/api/v1/serviceToken/exchange');
    exchanges++; return tokenResponse();
  },{region:'cn'}));
  const client = new sdk.ManagedClient({ credential, baseURL:'https://api.qoder.com.cn/api/v1/cloud/', fetch:async () => { writes++; return response({},401); } });
  await assert.rejects(client.request({method:'POST',path:'sessions',body:{}}),sdk.AuthenticationError);
  assert.equal(writes,1);
  assert.equal(exchanges,1);
});

test('short-lived responses must still be safe when exchange finishes', async () => {
  let now = 0;
  const clock = mock.method(performance, 'now', () => now);
  try {
    const credential = new sdk.ServiceAccountCredential(config(async () => {
      now = 1000;
      return tokenResponse('sensitive-token', 1);
    }));
    await assert.rejects(credential.getToken(), /insufficient remaining lifetime/);
  } finally { clock.mock.restore(); }
});

test('exchange rejects malformed fields and sanitizes transport errors', async () => {
  for (const body of [null, [], {}, {access_token:'token',token_type:'Basic',expires_in:100},
    ...[null, '', '2026-10-12'].map(expires_at => ({access_token:'token',token_type:'Bearer',expires_in:100,expires_at}))]) {
    const credential = new sdk.ServiceAccountCredential(config(async () => response(body)));
    await assert.rejects(credential.getToken(), /Invalid service account token exchange response/);
  }
  const credential = new sdk.ServiceAccountCredential(config(async () => { throw new sdk.QoderError('secret-key'); }));
  await assert.rejects(credential.getToken(), error => error instanceof sdk.APIConnectionError && !String(error).includes('secret-key') && error.cause === undefined);
});

test('exchange timeout covers reading the response body', async () => {
  const credential = new sdk.ServiceAccountCredential(config(async (_, init) => ({
    ok:true, status:200,
    text:() => new Promise((_,reject) => init.signal.addEventListener('abort', () => reject(new Error('secret-key')), {once:true})),
  }), {timeout:10}));
  await assert.rejects(credential.getToken(), error => error instanceof sdk.APIConnectionTimeoutError && !String(error).includes('secret-key'));
});
