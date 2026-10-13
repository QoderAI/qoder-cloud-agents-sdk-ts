import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function validateSAEnvironment(environment, mode) {
  if (!['readonly', 'execution', 'tokens'].includes(mode)) throw new Error('SA suite must be readonly, execution or tokens');
  for (const name of ['QODER_SA_CN_KEY', 'QODER_SA_GLOBAL_KEY']) {
    if (!environment[name]?.trim()) throw new Error(`${name} is required`);
  }
  if (mode === 'execution' || mode === 'tokens') {
    const flags = mode === 'execution' ? ['QODER_SA_LIVE_ALLOW_WRITE', 'QODER_SA_LIVE_ALLOW_EXECUTION'] : ['QODER_SA_LIVE_ALLOW_WRITE'];
    for (const name of flags) {
      if (environment[name] !== 'true') throw new Error(`${name}=true is required`);
    }
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const mode = process.argv[2] ?? 'readonly';
    const envFile = resolve(process.env.LIVE_ENV_FILE ?? '.env.live');
    if (existsSync(envFile)) process.loadEnvFile(envFile);
    validateSAEnvironment(process.env, mode);
    const file = mode === 'execution' ? 'execution-live.mjs' : mode === 'tokens' ? 'tokens-live.mjs' : 'auth-live.mjs';
    const result = spawnSync(process.execPath, ['--test', '--test-concurrency=1', `tests/sa/${file}`], { stdio: 'inherit' });
    process.exitCode = result.status ?? 1;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
