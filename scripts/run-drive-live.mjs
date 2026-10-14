import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

try {
  const file = process.env.LIVE_ENV_FILE ?? '.env.live';
  if (existsSync(file)) process.loadEnvFile(file);
  if (process.env.QODER_DRIVE_LIVE_ALLOW_WRITE !== 'true') throw new Error('QODER_DRIVE_LIVE_ALLOW_WRITE=true is required');
  for (const key of ['QODER_FORWARD_CN_PAT', 'QODER_FORWARD_GLOBAL_PAT', 'QODER_SA_CN_KEY', 'QODER_SA_GLOBAL_KEY']) {
    if (!process.env[key]?.trim()) throw new Error(`${key} is required`);
  }
  const run = spawnSync(process.execPath, ['--test', 'tests/live/drive-live.mjs'], { stdio: 'inherit' });
  process.exitCode = run.status ?? 1;
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
