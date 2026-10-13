import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

export function validateRealtimeEnvironment(environment, authMode, scenario) {
  if (!['all', 'pat', 'sa'].includes(authMode)) throw new Error('Realtime auth mode must be all, pat or sa');
  if (!['basic', 'text', 'pcm', 'work'].includes(scenario)) throw new Error('Realtime scenario must be basic, text, pcm or work');
  for (const flag of ['QODER_REALTIME_LIVE_ALLOW_WRITE', 'QODER_REALTIME_LIVE_ALLOW_EXECUTION']) if (environment[flag] !== 'true') throw new Error(`${flag}=true is required for Realtime resource creation and provider initialization`);
  for (const selectedMode of authMode === 'all' ? ['pat', 'sa'] : [authMode]) for (const region of ['CN', 'GLOBAL']) {
    const templateName = `QODER_REALTIME_${region}_${selectedMode.toUpperCase()}_TEMPLATE_ID`;
    if (!environment[templateName]?.trim()) throw new Error(`${templateName} is required; use an existing Realtime-enabled Template`);
    if (selectedMode === 'sa') {
      if (!environment[`QODER_REALTIME_${region}_SAT`]?.trim() && !environment[`QODER_SA_${region}_KEY`]?.trim()) throw new Error(`QODER_REALTIME_${region}_SAT or QODER_SA_${region}_KEY is required`);
    } else if (!environment[`QODER_FORWARD_${region}_PAT`]?.trim()) throw new Error(`QODER_FORWARD_${region}_PAT is required`);
  }
  if (scenario === 'pcm' && !environment.QODER_REALTIME_PCM_FILE?.trim()) throw new Error('QODER_REALTIME_PCM_FILE is required (16 kHz mono raw PCM16LE)');
  if (scenario === 'work' && !environment.QODER_REALTIME_WORK_PROMPT?.trim()) throw new Error('QODER_REALTIME_WORK_PROMPT is required; use a confirmed task trigger');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const authMode = process.argv[2] ?? 'all';
    const scenario = process.argv[3] ?? 'basic';
    const envFile = resolve(process.env.LIVE_ENV_FILE ?? '.env.live');
    if (existsSync(envFile)) process.loadEnvFile(envFile);
    validateRealtimeEnvironment(process.env, authMode, scenario); // Validate both regions before the first API call.
    const result = spawnSync(process.execPath, ['--test', '--test-concurrency=1', 'tests/realtime/live.mjs'], { stdio: 'inherit', env: { ...process.env, QCA_REALTIME_TEST_AUTH_MODE: authMode, QCA_REALTIME_TEST_SCENARIO: scenario } });
    process.exitCode = result.status ?? 1;
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
