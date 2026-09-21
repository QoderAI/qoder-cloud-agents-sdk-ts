// Forward · batch：上传一个只含一条任务的 JSONL 输入文件，提交 Batch（跳过闲时窗口），
// 等待完成后读取任务列表与输出文件，并回读生成会话的助手回复。
// 运行：node examples/forward/batch.mjs（需 QODER_FORWARD_PAT 或 QODER_PAT）。
import { setTimeout as delay } from 'node:timers/promises';
import { isMain, marker, name, runForwardExample, toFile } from '../lib/forward.mjs';

const terminal = (status) => ['completed', 'failed', 'cancelled', 'expired'].includes(status);

// 下载并解析 Batch 的 JSONL 输出文件（每行一个任务结果）。
async function readBatchOutput(client, batchID) {
  const link = await client.batches.getOutput(batchID);
  const response = await fetch(link.url);
  if (!response.ok) throw new Error(`batch output HTTP ${response.status}`);
  const text = await response.text();
  return text.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
}

async function main() {
  await runForwardExample(async (s) => {
    const env = await s.environment();
    const identity = await s.identity();
    const template = await s.template({ environment_id: env.id });

    const echo = marker();
    const customID = name('task');
    const line = JSON.stringify({
      custom_id: customID,
      template_id: template.id,
      identity_id: identity.id,
      body: { input: `Reply with exactly ${echo}` },
    });

    s.step('上传包含一个任务的 JSONL 输入文件');
    const input = await s.client.files.upload({ file: await toFile(`${line}\n`, 'sdk-example-input.jsonl'), purpose: 'session_resource' });
    s.track(`input file ${input.id}`, () => s.client.files.delete(input.id));

    s.step('提交 Batch，跳过闲时窗口限制');
    const batch = await s.client.batches.create({
      input_file_id: input.id,
      completion_window: '24h',
      idempotency_key: name('batch'),
      ignore_idle_window: true,
    });
    s.track(`batch ${batch.id}`, async () => {
      const current = await s.client.batches.retrieve(batch.id);
      if (!terminal(current.status)) await s.client.batches.cancel(batch.id, {});
    });

    s.step('等待 Batch 完成');
    let current = batch;
    let previous = '';
    while (!terminal(current.status)) {
      if (current.status !== previous) { s.info(`Batch 状态：${current.status}`); previous = current.status; }
      await delay(2000);
      current = await s.client.batches.retrieve(batch.id);
    }
    s.info(`Batch 最终状态：${current.status}`);

    s.step('检查 Batch 的任务和输出文件');
    const tasks = await s.client.batches.tasks.list(batch.id, {});
    s.info(`任务数量：${tasks.data.length}，首个 custom_id：${tasks.data[0]?.custom_id ?? '(无)'}`);

    if (current.output_file_id) {
      const rows = await readBatchOutput(s.client, batch.id);
      const row = rows[0];
      if (row) {
        s.info(`输出行状态：${row.status}，会话：${row.session_id}`);
        if (row.session_id) {
          s.track(`batch session ${row.session_id}`, () => s.finishSession(row.session_id));
          await s.listReply(row.session_id);
        }
      }
    }
  });
}

if (isMain(import.meta.url)) main();
