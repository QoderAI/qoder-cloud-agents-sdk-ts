// Managed · deployment：创建 Deployment（携带运行时初始消息），手动触发一次运行，
// 等待完成后回读运行生成会话的助手回复。
// 运行：node examples/managed/deployment.mjs（需 QODER_PAT 或 QODER_MANAGED_PAT）。
import { isMain, marker, name, runManagedExample } from '../lib/managed.mjs';

async function main() {
  await runManagedExample(async (s) => {
    const env = await s.environment();
    const agent = await s.agent();
    const echo = marker();

    s.step('创建 Deployment，设置运行时的初始消息');
    const deployment = await s.client.deployments.create({
      name: name('deployment'),
      agent: agent.id,
      environment_id: env.id,
      initial_events: [{ type: 'user.message', content: [{ type: 'text', text: `Reply with exactly ${echo}` }] }],
    });
    s.track(`deployment ${deployment.id}`, () => s.client.deployments.archive(deployment.id, {}));

    s.step('手动触发一次 Deployment 运行');
    const run = await s.client.deployments.run(deployment.id, {});
    s.info(`本次运行 ID：${run.id}，会话：${run.session_id}`);
    if (!run.session_id) throw new Error('deployment run returned no session');
    s.track(`deployment session ${run.session_id}`, () => s.finishSession(run.session_id));

    const got = await s.client.deploymentRuns.retrieve(run.id, {});
    s.info(`Deployment Run 关联会话：${got.session_id}`);

    await s.listReply(run.session_id);
  });
}

if (isMain(import.meta.url)) main();
