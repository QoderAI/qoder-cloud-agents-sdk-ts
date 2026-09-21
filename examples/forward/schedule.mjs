// Forward · schedule：创建只手动触发的 Schedule，触发一次运行，等待完成后回读会话回复。
// 运行：node examples/forward/schedule.mjs（需 QODER_FORWARD_PAT 或 QODER_PAT）。
import { setTimeout as delay } from 'node:timers/promises';
import { isMain, marker, name, runForwardExample } from '../lib/forward.mjs';

async function main() {
  await runForwardExample(async (s) => {
    const env = await s.environment();
    const identity = await s.identity();
    const template = await s.template({ environment_id: env.id });
    const echo = marker();

    s.step('创建只手动触发的 Schedule');
    const schedule = await s.client.schedules.create({
      identity_id: identity.id,
      template_id: template.id,
      environment_id: env.id,
      name: name('schedule'),
      initial_events: [{ type: 'user.message', content: `Reply with exactly ${echo}` }],
      trigger_policy: { type: 'manual' },
      execution: { max_attempts: 1, max_concurrent_runs: 1 },
    });
    s.track(`schedule ${schedule.id}`, () => s.client.schedules.archive(schedule.id, {}));

    s.step('手动触发一次 Schedule 运行');
    const created = await s.client.schedules.run(schedule.id, { idempotency_key: name('run') });
    const runID = created.id;
    s.track(`schedule run ${runID}`, async () => {
      const run = await s.client.scheduleRuns.retrieve(runID, { identity_id: identity.id });
      if (run.session_id) await s.finishSession(run.session_id);
    });

    s.step('轮询 Schedule Run 直到完成');
    let run;
    for (;;) {
      run = await s.client.scheduleRuns.retrieve(runID, { identity_id: identity.id });
      s.info(`运行状态：${run.status}`);
      if (run.status === 'completed') break;
      if (['failed', 'skipped'].includes(run.status)) throw new Error(`schedule run=${runID} status=${run.status}`);
      await delay(2000);
    }

    if (run.session_id) await s.listReply(run.session_id);
  });
}

if (isMain(import.meta.url)) main();
