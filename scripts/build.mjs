import { rm, mkdir, writeFile, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

// The reported version is a hand-written constant, so a release that forgets to
// bump it would make the SDK report a version that was never published.
const declared = (await readFile(new URL('../src/version.ts', import.meta.url), 'utf8')).match(/VERSION = '(.*)'/)?.[1];
const published = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8')).version;
if (declared !== published) {
  console.error(`src/version.ts declares ${declared} but package.json is ${published}`);
  process.exit(1);
}

await rm(new URL('../dist/', import.meta.url), { recursive: true, force: true });
for (const config of ['tsconfig.json', 'tsconfig.esm.json']) {
  const result = spawnSync(process.execPath, ['node_modules/typescript/bin/tsc', '-p', config], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
await mkdir(new URL('../dist/esm/', import.meta.url), { recursive: true });
await writeFile(new URL('../dist/esm/package.json', import.meta.url), '{"type":"module"}\n');
