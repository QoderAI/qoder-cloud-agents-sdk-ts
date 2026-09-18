import { spawnSync } from 'node:child_process';
import { readFile, readdir, stat, rm, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import os from 'node:os';
import path from 'node:path';

// docs-check gate.
//
// Verifies that the committed API reference is a byte-for-byte match of what the
// deterministic generator produces from the current source, that generated docs
// contain no dangling internal links, and that the README's TypeScript snippets
// still compile against the public type surface. External http(s) links are
// reported but never block. The whole check runs offline: it reads no PAT and
// contacts no live environment.

const repoRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const docsDir = path.join(repoRoot, 'docs', 'api');
const readmePath = path.join(repoRoot, 'README.md');
const scratchDir = path.join(os.tmpdir(), 'qca-sdk-docs-check');

function run(cmd, args, opts = {}) {
  return spawnSync(cmd, args, { cwd: repoRoot, encoding: 'utf8', ...opts });
}

function fail(message, detail) {
  console.error(`docs-check: FAIL — ${message}`);
  if (detail) console.error(detail);
  process.exit(1);
}

async function walkMarkdown(dir) {
  const files = [];
  const entries = (await readdir(dir)).sort();
  for (const name of entries) {
    const full = path.join(dir, name);
    const info = await stat(full);
    if (info.isDirectory()) files.push(...(await walkMarkdown(full)));
    else if (name.endsWith('.md')) files.push(full);
  }
  return files;
}

// --- Step 1: clear any leftover temporary output from a previous run. --------
async function clearScratch() {
  await rm(scratchDir, { recursive: true, force: true });
}

// --- Step 2: regenerate docs/api deterministically. --------------------------
// Returns the set of relative link targets that TypeDoc reports as "not a file
// and will not be copied": these are JSDoc-authored references to hand-written
// companion documents outside the generated reference, not cross-references
// between generated pages, so the link check treats them as external.
function regenerate() {
  const result = run(process.execPath, [path.join(repoRoot, 'scripts', 'generate-docs.mjs')]);
  const output = `${result.stdout || ''}${result.stderr || ''}`;
  process.stdout.write(output);
  if (result.status !== 0) fail('docs generation failed');

  const notCopied = new Set();
  const warnRe = /The relative path (.+?) is not a file and will not be copied/g;
  let m;
  while ((m = warnRe.exec(output)) !== null) {
    notCopied.add(m[1].split('#')[0]);
  }
  return notCopied;
}

// --- Step 3: committed docs/api must equal freshly generated output. ---------
function assertNoDrift() {
  const diff = run('git', ['diff', '--exit-code', '--', 'docs/api']);
  const untracked = run('git', ['ls-files', '--others', '--exclude-standard', '--', 'docs/api']);
  const hasUntracked = untracked.status === 0 && untracked.stdout.trim() !== '';
  if (diff.status !== 0 || hasUntracked) {
    const detail = [diff.stdout, hasUntracked ? `untracked:\n${untracked.stdout}` : '']
      .filter(Boolean)
      .join('\n');
    fail('committed docs/api differs from generated output; run `npm run docs` and commit', detail);
  }
}

// --- Step 4: internal relative links in docs/api must resolve. ----------------
// External references are reported but never block: http(s) and protocol-
// relative URLs, site-absolute paths ("/en/..."), and JSDoc-authored links to
// non-generated companion docs (per TypeDoc's "will not be copied" warnings).
// A relative link pointing at another generated page that no longer exists is a
// broken cross-reference and fails the gate.
async function checkLinks(notCopied) {
  const files = await walkMarkdown(docsDir);
  const linkRe = /\]\(([^)]+)\)/g;
  const broken = [];
  let externalCount = 0;
  for (const file of files) {
    const content = await readFile(file, 'utf8');
    let match;
    while ((match = linkRe.exec(content)) !== null) {
      let target = match[1].trim();
      if (target.startsWith('<') && target.endsWith('>')) target = target.slice(1, -1);
      if (target === '') continue;
      // External / non-blocking: http(s), protocol-relative, site-absolute.
      if (/^(https?:)?\/\//i.test(target) || target.startsWith('/')) {
        externalCount += 1;
        continue;
      }
      if (target.startsWith('#') || target.startsWith('mailto:')) continue;
      const clean = target.split('#')[0].split('?')[0];
      if (clean === '') continue;
      // External / non-blocking: authored references to non-generated companion docs.
      if (notCopied.has(clean)) {
        externalCount += 1;
        continue;
      }
      const resolved = path.resolve(path.dirname(file), clean);
      if (!existsSync(resolved)) {
        broken.push(`${path.relative(repoRoot, file)} -> ${target}`);
      }
    }
  }
  if (broken.length) {
    fail(`${broken.length} dangling internal link(s) in docs/api`, broken.join('\n'));
  }
  console.log(`docs-check: internal links OK; ${externalCount} external/non-generated link(s) reported (not blocking)`);
}

// --- Step 5: extract README TypeScript snippets and type-check them. ----------
function extractTsSnippets(readme) {
  const lines = readme.split('\n');
  const snippets = [];
  let current = null;
  for (const line of lines) {
    if (current === null) {
      if (/^```ts\s*$/.test(line.trim())) current = [];
    } else if (line.trim() === '```') {
      snippets.push(current.join('\n'));
      current = null;
    } else {
      current.push(line);
    }
  }
  return snippets;
}

async function checkReadmeSnippets() {
  const readme = await readFile(readmePath, 'utf8');
  const snippets = extractTsSnippets(readme);
  if (snippets.length === 0) {
    console.log('docs-check: no README ts snippets to compile');
    return;
  }

  await mkdir(scratchDir, { recursive: true });

  // Ambient declarations for the illustrative identifiers the README uses
  // without setup: the two clients (typed, so option shapes are still checked)
  // plus assorted free variables and the Node builtins referenced by upload
  // examples. Local declarations inside a snippet shadow these. This is an
  // ambient script file (no import/export), so the declarations stay global.
  // It keeps snippet compilation focused on import resolution, option shapes
  // and syntax rather than on reconstructing full runnable programs.
  const globals = `declare const ForwardClient: typeof import('qca-sdk').ForwardClient;
declare const ManagedClient: typeof import('qca-sdk').ManagedClient;
declare const client: any;
declare const forward: any;
declare const managed: any;
declare const session: any;
declare const stream: any;
declare const previousEventID: any;
declare const uploaded: any;
declare const params: any;
declare const process: any;
declare const fs: any;
declare module 'node:fs';
`;
  await writeFile(path.join(scratchDir, 'globals.d.ts'), globals);

  const files = [];
  for (let i = 0; i < snippets.length; i += 1) {
    const file = path.join(scratchDir, `snippet-${String(i).padStart(3, '0')}.mts`);
    await writeFile(file, `${snippets[i]}\n`);
    files.push(file);
  }

  const tsconfig = {
    compilerOptions: {
      noEmit: true,
      strict: true,
      target: 'ES2022',
      lib: ['ES2022', 'DOM', 'DOM.Iterable'],
      module: 'Node16',
      moduleResolution: 'Node16',
      skipLibCheck: true,
      baseUrl: repoRoot,
      types: [],
      paths: {
        'qca-sdk': ['src/index.ts'],
        'qca-sdk/forward': ['src/forward/index.ts'],
        'qca-sdk/managed': ['src/managed/index.ts'],
      },
    },
    include: [
      path.join(scratchDir, 'globals.d.ts'),
      path.join(scratchDir, 'snippet-*.mts'),
    ],
  };
  const tsconfigPath = path.join(scratchDir, 'tsconfig.docs-check.json');
  await writeFile(tsconfigPath, JSON.stringify(tsconfig, null, 2));

  const tscBin = path.join(repoRoot, 'node_modules', 'typescript', 'bin', 'tsc');
  const result = run(process.execPath, [tscBin, '-p', tsconfigPath]);
  if (result.status !== 0) {
    fail(
      `README ts snippet compilation failed (${snippets.length} snippet(s))`,
      `${result.stdout || ''}${result.stderr || ''}`,
    );
  }
  console.log(`docs-check: ${snippets.length} README ts snippet(s) compiled`);
}

async function main() {
  await clearScratch();
  const notCopied = regenerate();
  assertNoDrift();
  await checkLinks(notCopied);
  await checkReadmeSnippets();
  await clearScratch();
  console.log('docs-check: PASS');
}

await main();
