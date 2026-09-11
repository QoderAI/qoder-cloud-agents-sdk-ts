import { rm, mkdir, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

await rm(new URL('../dist/', import.meta.url), { recursive: true, force: true });
for (const config of ['tsconfig.json', 'tsconfig.esm.json']) {
  const result = spawnSync(process.execPath, ['node_modules/typescript/bin/tsc', '-p', config], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
await mkdir(new URL('../dist/esm/', import.meta.url), { recursive: true });
await writeFile(new URL('../dist/esm/package.json', import.meta.url), '{"type":"module"}\n');
