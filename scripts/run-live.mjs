import { existsSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const mode = process.argv[2] ?? 'all';
const envFile = resolve(process.env.LIVE_ENV_FILE ?? '.env.live');
if (existsSync(envFile)) process.loadEnvFile(envFile);
const modes = mode === 'forward' || mode === 'managed' ? [mode] : ['forward', 'managed'];
for (const selected of modes) {
  const prefix = `QODER_${selected.toUpperCase()}`;
  if (!process.env[`${prefix}_PAT`]?.trim()) throw new Error(`${prefix}_PAT is required; use a dedicated test account`);
  if (mode === 'e2e') {
    for (const suffix of ['LIVE_ALLOW_WRITE', 'LIVE_ALLOW_EXECUTION']) {
      if (process.env[`${prefix}_${suffix}`] !== 'true') throw new Error(`${prefix}_${suffix}=true is required for E2E`);
    }
    if (!process.env[`${prefix}_MODEL`]) throw new Error(`${prefix}_MODEL is required for E2E`);
  }
}
const files = readdirSync('tests/live').filter(name => name.endsWith('.test.mjs') && modes.some(mode => name.startsWith(mode))).map(name => `tests/live/${name}`);
const args = ['--test', '--test-concurrency=1'];
if (mode === 'e2e') args.push('--test-name-pattern=E2E');
args.push(...files);
const result = spawnSync(process.execPath, args, { stdio: 'inherit' });
process.exit(result.status ?? 1);
