import { spawnSync } from 'node:child_process';
import { readFile, writeFile, readdir, rm, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Deterministic API reference generator.
//
// Runs TypeDoc + typedoc-plugin-markdown over the public `src/` entry points and
// writes Markdown to docs/api/. TypeDoc's default source links embed absolute
// paths, line numbers and a generator footer, all of which change across
// machines or checkouts; we disable those inputs and then post-process every
// file so that re-running on the same commit yields byte-identical output.

const repoRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const outDir = path.join(repoRoot, 'docs', 'api');
const metadataPath = path.join(repoRoot, 'docs', 'metadata.yaml');

// Public entry points, mirroring package.json "exports" (".", "./forward",
// "./managed"). The generator only reads exported symbols, types and JSDoc.
const entryPoints = ['src/index.ts', 'src/forward/index.ts', 'src/managed/index.ts'];

/**
 * Minimal parser for the fixed docs/metadata.yaml shape:
 *   order: [scalar]              (top-level scalar list)
 *   hidden: [scalar]             (top-level scalar list, may be `[]`)
 *   relatedLinks: [ {title, url} ] (list of maps)
 * It intentionally supports only this structure, not general YAML.
 */
function parseMetadata(text) {
  const result = { order: [], hidden: [], relatedLinks: [] };
  const lines = text.split('\n');
  let section = null;
  for (const raw of lines) {
    const line = raw.replace(/\r$/, '');
    if (line.trim() === '' || line.trim().startsWith('#')) continue;

    const topMatch = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(line);
    if (topMatch && !line.startsWith(' ')) {
      const key = topMatch[1];
      const inline = topMatch[2].trim();
      section = key;
      if (inline === '[]') result[key] = [];
      continue;
    }

    const listMatch = /^\s+-\s+(.*)$/.exec(line);
    if (listMatch && section) {
      const item = listMatch[1].trim();
      const kv = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(item);
      if (kv) {
        result[section].push({ [kv[1]]: kv[2].trim() });
      } else {
        result[section].push(item);
      }
      continue;
    }

    // Continuation key for the previous map entry (e.g. relatedLinks url).
    const contMatch = /^\s+([A-Za-z0-9_]+):\s*(.*)$/.exec(line);
    if (contMatch && section) {
      const list = result[section];
      const last = list[list.length - 1];
      if (last && typeof last === 'object') last[contMatch[1]] = contMatch[2].trim();
    }
  }
  return result;
}

async function walkMarkdown(dir) {
  const files = [];
  const entries = (await readdir(dir)).sort();
  for (const name of entries) {
    const full = path.join(dir, name);
    const info = await stat(full);
    if (info.isDirectory()) {
      files.push(...(await walkMarkdown(full)));
    } else if (name.endsWith('.md')) {
      files.push(full);
    }
  }
  return files;
}

/** Strip any non-deterministic fragments TypeDoc may inject. */
function stripNonDeterministic(content) {
  let text = content.replace(/\r\n/g, '\n');
  const out = [];
  for (const line of text.split('\n')) {
    // Generator/version footer lines (defensive; --hideGenerator already omits).
    if (/generated using \[?typedoc/i.test(line)) continue;
    if (/last (?:modified|updated)/i.test(line)) continue;
    // Absolute paths that could leak the build machine's layout.
    const scrubbed = line
      .split(repoRoot).join('.')
      .replace(/\/(?:private\/)?var\/folders\/[^\s)`]+/g, '.')
      .replace(/\/Users\/[^\s)`]+/g, '.');
    out.push(scrubbed);
  }
  return out.join('\n').replace(/\n+$/, '') + '\n';
}

/** Apply docs/metadata.yaml to the generated top-level index page. */
function applyMetadata(indexContent, metadata) {
  const lines = indexContent.split('\n');
  const start = lines.findIndex((l) => l.trim() === '## Modules');
  if (start === -1) return indexContent;

  let end = start + 1;
  while (end < lines.length && !/^## /.test(lines[end])) end += 1;

  const bullets = lines.slice(start + 1, end).filter((l) => l.trim().startsWith('- '));
  const nameOf = (bullet) => {
    const m = /\[([^\]]+)\]/.exec(bullet);
    return m ? m[1] : bullet;
  };

  let kept = bullets.filter((b) => !metadata.hidden.includes(nameOf(b)));
  if (metadata.order.length) {
    const rank = new Map(metadata.order.map((name, i) => [name, i]));
    kept = kept
      .map((b, i) => ({ b, name: nameOf(b), i }))
      .sort((a, x) => {
        const ra = rank.has(a.name) ? rank.get(a.name) : Number.MAX_SAFE_INTEGER;
        const rx = rank.has(x.name) ? rank.get(x.name) : Number.MAX_SAFE_INTEGER;
        return ra !== rx ? ra - rx : a.i - x.i;
      })
      .map((e) => e.b);
  }

  const rebuilt = [...lines.slice(0, start + 1), '', ...kept, '', ...lines.slice(end)];

  let result = rebuilt.join('\n');
  if (metadata.relatedLinks.length) {
    const links = metadata.relatedLinks
      .filter((l) => l && l.title && l.url)
      .map((l) => `- [${l.title}](${l.url})`);
    if (links.length) {
      result = `${result.replace(/\n+$/, '')}\n\n## Related\n\n${links.join('\n')}\n`;
    }
  }
  return result;
}

async function main() {
  const metadata = parseMetadata(await readFile(metadataPath, 'utf8'));

  await rm(outDir, { recursive: true, force: true });

  const typedocBin = path.join(repoRoot, 'node_modules', 'typedoc', 'bin', 'typedoc');
  const args = [
    typedocBin,
    '--plugin', 'typedoc-plugin-markdown',
    '--tsconfig', path.join(repoRoot, 'tsconfig.json'),
    '--out', outDir,
    '--readme', 'none',
    '--disableSources',
    '--hideGenerator',
  ];
  for (const ep of entryPoints) args.push('--entryPoints', ep);

  const run = spawnSync(process.execPath, args, { cwd: repoRoot, stdio: 'inherit' });
  if (run.status !== 0) process.exit(run.status ?? 1);

  const files = await walkMarkdown(outDir);
  for (const file of files) {
    const original = await readFile(file, 'utf8');
    let cleaned = stripNonDeterministic(original);
    if (path.resolve(file) === path.join(outDir, 'README.md')) {
      cleaned = stripNonDeterministic(applyMetadata(cleaned, metadata));
    }
    if (cleaned !== original) await writeFile(file, cleaned);
  }

  console.log(`docs/api generated (${files.length} files)`);
}

await main();
