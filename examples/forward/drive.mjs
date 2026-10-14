// Drive Beta. Uses shared PAT/SA configuration and a new isolated Identity.
// Run: node examples/forward/drive.mjs
import { isMain, runForwardExample } from '../lib/forward.mjs';

async function transfer(signed, body) {
  // Independent storage request: no QCA client/default headers or Authorization.
  let response;
  try {
    response = await fetch(signed.url, { method: signed.method, headers: signed.headers, body,
      redirect: 'error', signal: AbortSignal.timeout(30_000) });
  } catch { throw new Error('Storage transfer failed'); }
  if (!response.ok) throw new Error(`Storage HTTP ${response.status}`);
  return response;
}

async function main() {
  await runForwardExample(async s => {
    const identity = await s.identity();
    const query = { identity_id: identity.id };
    const path = 'sdk-example/说明.txt';
    s.track('Drive example directory', () => s.client.drives.deleteEntry({ ...query, path: 'sdk-example', recursive: true }));
    s.step('申请签名 URL，向存储服务上传文件');
    const upload = await s.client.drives.createUploadUrl({ ...query, path, content_type: 'text/plain' });
    const uploaded = await transfer(upload, 'Hello from QCA Drive');
    await uploaded.arrayBuffer();
    s.step('按服务端顺序列出目录，使用独立的 Drive 游标翻页');
    let pageToken;
    do {
      const page = await s.client.drives.listEntries({ ...query, path: 'sdk-example', limit: 20, page_token: pageToken });
      for (const entry of page.entries) s.info(`${entry.type}: ${entry.path} (${entry.size ?? 'directory'} bytes)`);
      pageToken = page.next_page_token;
    } while (pageToken);
    s.step('下载文件并删除示例条目');
    const download = await s.client.drives.createDownloadUrl({ ...query, path });
    s.info(await (await transfer(download)).text());
    const result = await s.client.drives.deleteEntry({ ...query, path });
    s.info(`deleted_count=${result.deleted_count}`);
  });
}

if (isMain(import.meta.url)) main();
