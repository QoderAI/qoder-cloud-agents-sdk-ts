import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { validateSAEnvironment } from '../scripts/run-sa-live.mjs';
import { safeFailure } from './sa/diagnostics.mjs';

test('SA preflight validates both regions before starting read or execution tests', () => {
  for (const mode of ['readonly', 'execution']) {
    assert.throws(() => validateSAEnvironment({ QODER_SA_CN_KEY: 'cn' }, mode), /QODER_SA_GLOBAL_KEY is required/);
  }
  validateSAEnvironment({ QODER_SA_CN_KEY: 'cn', QODER_SA_GLOBAL_KEY: 'global' }, 'readonly');
});

test('SA failure diagnostics omit authenticated requests and response bodies', () => {
  const failure = { status: 403, code: 'forbidden', request_id: 'req-test',
    request: { headers: { Authorization: 'Bearer secret' } }, body: { token: 'secret' }, message: 'secret' };
  assert.equal(safeFailure(failure), 'HTTP 403 code=forbidden request_id=req-test');
  assert.doesNotMatch(safeFailure(new AggregateError([failure], 'secret')), /secret|Authorization/);
});

test('SA execution requires both write and execution flags', () => {
  const env = { QODER_SA_CN_KEY: 'cn', QODER_SA_GLOBAL_KEY: 'global',
    QODER_SA_LIVE_ALLOW_WRITE: 'true', QODER_SA_LIVE_ALLOW_EXECUTION: 'true' };
  for (const name of ['QODER_SA_LIVE_ALLOW_WRITE', 'QODER_SA_LIVE_ALLOW_EXECUTION']) {
    assert.throws(() => validateSAEnvironment({ ...env, [name]: 'false' }, 'execution'), new RegExp(`${name}=true is required`));
  }
  validateSAEnvironment(env, 'execution');
});

test('SA entry loads the env file, respects explicit empty environment and fails before child tests', () => {
  const dir = mkdtempSync(join(tmpdir(), 'qca-sa-entry-'));
  try {
    const path = join(dir, '.env.live');
    writeFileSync(path, 'QODER_SA_CN_KEY=file-cn\nQODER_SA_GLOBAL_KEY=file-global\n');
    for (const name of ['QODER_SA_CN_KEY', 'QODER_SA_GLOBAL_KEY']) {
      const env = { ...process.env, LIVE_ENV_FILE: path };
      delete env.QODER_SA_CN_KEY;
      delete env.QODER_SA_GLOBAL_KEY;
      env[name] = '';
      const result = spawnSync(process.execPath, ['scripts/run-sa-live.mjs', 'readonly'], { env, encoding: 'utf8' });
      assert.equal(result.status, 1);
      assert.match(result.stderr, new RegExp(`${name} is required`));
      assert.equal(result.stdout, '', 'no account-backed child test should start');
      assert.doesNotMatch(result.stderr, /file-cn|file-global/);
    }
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
