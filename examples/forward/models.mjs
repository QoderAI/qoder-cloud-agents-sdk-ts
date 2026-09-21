// Forward · models：查询当前账号可用的模型。
// 运行：node examples/forward/models.mjs（需 QODER_FORWARD_PAT 或 QODER_PAT）。
import { isMain, makeForwardClient } from '../lib/forward.mjs';

async function main() {
  const client = makeForwardClient();
  const models = await client.models.list();
  const enabled = models.data.filter((m) => m.is_enabled).map((m) => m.id);
  console.log(`共 ${models.data.length} 个模型，已启用 ${enabled.length} 个：`);
  console.log(`  ${enabled.join(', ')}`);
}

if (isMain(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
