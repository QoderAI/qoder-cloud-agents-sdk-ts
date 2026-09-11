// Covers the example CLI's config parsing and output redaction without network access.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseArguments, loadConfiguration, createSanitizer } from '../examples/run.mjs';
import * as forwardModule from '../examples/forward-scenarios.mjs';
import * as managedModule from '../examples/managed-scenarios.mjs';
const { forwardExamples } = forwardModule;
const { managedExamples } = managedModule;

function configFile(t, content) {
  const directory = mkdtempSync(join(tmpdir(), 'qoder-example-config-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const path = join(directory, 'config.env'); writeFileSync(path, content, { mode: 0o600 });
  return { path, directory };
}

test('example CLI defaults to models, CN and five-minute scenario with independent cleanup deadline', () => {
  const args = parseArguments([]);
  assert.equal(args.scenario, 'models'); assert.equal(args.region, 'cn');
  assert.equal(args.timeout, 300_000); assert.equal(args.cleanupTimeout, 90_000);
  assert.equal(args.mode, 'both'); assert.equal(args.output, 'text');
});
for (const [flag, value] of [['mode','invalid'], ['region','invalid'], ['output','xml'], ['timeout','0'], ['timeout','-1s'], ['timeout','31m'], ['cleanup-timeout','0ms']]) {
  test(`example CLI rejects invalid ${flag}=${value}`, () => assert.throws(() => parseArguments([`-${flag}`, value])));
}
test('example CLI accepts single-dash and long flags with duration units', () => {
  const args = parseArguments(['--mode=managed', '-scenario','all', '-region','international', '--timeout=5m', '--cleanup-timeout=90s', '-model','auto']);
  assert.equal(args.mode, 'managed'); assert.equal(args.scenario, 'all'); assert.equal(args.region, 'international');
  assert.equal(args.timeout, 300_000); assert.equal(args.cleanupTimeout, 90_000); assert.equal(args.model, 'auto');
});
test('example CLI rejects unknown flags and missing values', () => {
  assert.throws(() => parseArguments(['--bogus','1']), /Unknown option/);
  assert.throws(() => parseArguments(['--model']), /Missing value/);
});

test('mode PAT isolation and environment precedence', t => {
  const file = configFile(t, 'QODER_MANAGED_BASE_URL=https://api.qoder.com/api/v1/cloud\nQODER_MANAGED_PAT=managed-value\nQODER_FORWARD_PAT=forward-value\nQODER_MANAGED_MODEL=file-model\nQODER_ACCESS_TOKEN=shared-value\n');
  const configs = loadConfiguration(parseArguments(['-env',file.path]), { QODER_MANAGED_PAT: 'managed-override', QODER_MANAGED_MODEL: 'env-model' });
  assert.deepEqual(configs.map(c => [c.mode,c.accessToken,c.baseURL,c.model]), [
    ['forward','forward-value','https://api.qoder.com.cn/api/v1/forward',undefined],
    ['managed','managed-override','https://api.qoder.com.cn/api/v1/cloud','env-model'],
  ]);
  assert.ok(configs.every(c => c.scenario === 'models'));
});
test('mode-specific PAT can fall back to shared PAT without borrowing the other mode credential', t => {
  const file = configFile(t, 'QODER_MANAGED_PAT=managed-only\nQODER_ACCESS_TOKEN=shared\n');
  const args = parseArguments(['-env',file.path,'-region','international']);
  const configs = loadConfiguration(args, {});
  assert.deepEqual(configs.map(c => [c.mode,c.accessToken,c.baseURL]), [
    ['forward','shared','https://api.qoder.com/api/v1/forward'], ['managed','managed-only','https://api.qoder.com/api/v1/cloud'],
  ]);
  writeFileSync(file.path, 'QODER_MANAGED_PAT=managed-only\n');
  assert.throws(() => loadConfiguration(args, {}), /QODER_FORWARD_PAT or QODER_ACCESS_TOKEN is required/);
});
test('explicit model flag overrides per-mode model in environment and file', t => {
  const file = configFile(t, 'QODER_ACCESS_TOKEN=test\nQODER_MANAGED_MODEL=file-model\n');
  const [config] = loadConfiguration(parseArguments(['-env',file.path,'-mode','managed','-model','flag-model']), { QODER_MANAGED_MODEL: 'env-model' });
  assert.equal(config.model, 'flag-model');
});

test('config is data: quoted spaces and shell expressions stay literal', t => {
  const file = configFile(t, 'QODER_ACCESS_TOKEN=test\n');
  const marker = join(file.directory, 'must-not-exist');
  writeFileSync(file.path, `export QODER_ACCESS_TOKEN='with # space'\nQODER_FORWARD_MODEL="$(touch ${marker})"\nQODER_MANAGED_MODEL=unquoted # comment\n`);
  const configs = loadConfiguration(parseArguments(['-env',file.path]), {});
  assert.equal(configs[0].accessToken, 'with # space');
  assert.equal(configs[0].model, `$(touch ${marker})`);
  assert.equal(configs[1].model, 'unquoted'); assert.equal(existsSync(marker), false);
});
test('env parsing rejects unterminated quoted assignments', t => {
  const file = configFile(t, "QODER_ACCESS_TOKEN='unterminated\n");
  assert.throws(() => loadConfiguration(parseArguments(['-env',file.path]), {}), /quote|invalid|unterminated/i);
});
for (const url of ['http://api.qoder.com/api/v1/forward', 'https://elsewhere.test/api/v1/forward', 'https://user:pass@api.qoder.com/api/v1/forward', 'https://api.qoder.com/api/v1/forward?signature=private', 'https://api.qoder.com/api/v1/forward#fragment']) {
  test(`config rejects unsafe API URL ${url}`, t => {
    const file = configFile(t, `QODER_ACCESS_TOKEN=test\nQODER_FORWARD_BASE_URL="${url}"\n`);
    assert.throws(() => loadConfiguration(parseArguments(['-env',file.path,'-mode','forward']), {}));
  });
}

test('explain output redacts all configured PATs, bearer values and signed object-store queries', () => {
  const safe = createSanitizer(['forward-private-pat','managed-private-pat']);
  const value = safe.text('forward-private-pat managed-private-pat Bearer other-secret https://storage.test/key?signature=private&expires=100 request-id');
  for (const secret of ['forward-private-pat','managed-private-pat','other-secret','signature=','expires=']) assert.equal(value.includes(secret), false);
  assert.ok(value.includes('request-id'));
});
test('safe structured report redacts credentials at any nesting depth', () => {
  const safe = createSanitizer(['private-pat']);
  const result = safe.data({ accessToken: 'private-pat', nested: { authorization: 'Bearer other', password: 'p', secret: 's', text: 'private-pat' }, children: [{ url: 'https://storage.test/file?signature=private' }] });
  assert.equal(result.accessToken, '[REDACTED]');
  assert.deepEqual(result.nested, { authorization: '[REDACTED]', password: '[REDACTED]', secret: '[REDACTED]', text: '[REDACTED]' });
  assert.equal(JSON.stringify(result).includes('signature='), false);
});
test('reply redaction runs before truncation and prevents terminal control output', () => {
  const result = createSanitizer(['private-test-token']).text('\x1b[2Jhttps://storage.test/file?signature=private\n'+'x'.repeat(3980)+'private-test-token');
  for (const forbidden of ['\x1b','signature=','private-test']) assert.equal(result.includes(forbidden), false);
});

test('-scenario all maps exactly the six Forward and six Managed example scenarios', () => {
  assert.equal(parseArguments(['-scenario','all']).scenario, 'all');
  assert.equal(typeof forwardModule.createForwardExampleSuite, 'function', 'Forward factory must be exported for dynamic CLI loading');
  assert.equal(typeof managedModule.createManagedExampleSuite, 'function', 'Managed factory must be exported for dynamic CLI loading');
  assert.deepEqual(forwardExamples.map(s => s.name), ['models','session','resources','memory','schedule','batch']);
  assert.deepEqual(managedExamples.map(s => s.name), ['models','session','resources','memory','deployment','dream']);
  const ids = [...forwardExamples.map(s => `forward/${s.name}`), ...managedExamples.map(s => `managed/${s.name}`)];
  assert.equal(ids.length, 12); assert.equal(new Set(ids).size, 12);
  for (const scenario of [...forwardExamples,...managedExamples]) { assert.equal(typeof scenario.run, 'function'); assert.ok(scenario.description); }
});


test('environment loader accepts quoted multiline data and preserves quoted comments', t => {
  const file = configFile(t, 'QODER_ACCESS_TOKEN=test\nQODER_FORWARD_MODEL="line one\nline two # literal" # ignored comment\nQODER_MANAGED_MODEL=auto # ignored comment\n');
  const configs = loadConfiguration(parseArguments(['-env',file.path]), {});
  assert.equal(configs[0].model, 'line one\nline two # literal');
  assert.equal(configs[1].model, 'auto');
});
