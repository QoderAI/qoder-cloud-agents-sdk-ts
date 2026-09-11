import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import ts from 'typescript';

// The baseline is a frozen snapshot of the upstream wire contract: for every type
// the Managed surface exposes, the JSON property names it must declare, the native
// union variants it must accept, and the request bodies it flattens into itself.
// It was read from the published API schema, not from this SDK's sources, and this
// test neither imports nor runs the code generator. Every listed property must be
// explicitly declared; a string index signature cannot satisfy it. A type with an
// empty entry only has to stay exported.
const expected = JSON.parse(readFileSync(new URL('./fixtures/managed/wire-fields.json', import.meta.url), 'utf8'));
const entry = fileURLToPath(new URL('../src/managed/index.ts', import.meta.url));
const program = ts.createProgram([entry], {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.NodeNext,
  moduleResolution: ts.ModuleResolutionKind.NodeNext,
  strict: true,
  skipLibCheck: true,
  noEmit: true,
});
const checker = program.getTypeChecker();
const source = program.getSourceFile(entry);
const exports = new Map(checker.getExportsOfModule(checker.getSymbolAtLocation(source)).map(symbol => [symbol.name, symbol]));

function declared(name) {
  let symbol = exports.get(name);
  assert(symbol, `Missing exported Managed type: ${name}`);
  if (symbol.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);
  return checker.getDeclaredTypeOfSymbol(symbol);
}
function branches(type) {
  return type.isUnion() ? type.types.flatMap(branches) : [type];
}
function explicitProperty(type, name) {
  return branches(type).map(member => checker.getPropertyOfType(member, name)).filter(Boolean);
}
function concrete(type) {
  return !(type.flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown | ts.TypeFlags.Never));
}
function preserves(sourceType, targetType) {
  // Verify every source variant against a concrete destination branch. Requiring
  // the complete explicit property set rejects Record<string,unknown> stand-ins.
  return branches(sourceType).every(sourceBranch => branches(targetType).some(targetBranch => {
    if (!concrete(targetBranch) || !checker.isTypeAssignableTo(sourceBranch, targetBranch)) return false;
    if (sourceBranch === targetBranch) return true;
    return checker.getPropertiesOfType(sourceBranch).every(property => checker.getPropertyOfType(targetBranch, property.name));
  }));
}
function preservesVariant(notation, target) {
  if (notation.endsWith('[]')) {
    const element = declared(notation.slice(0, -2));
    return branches(target).some(branch => checker.isArrayType(branch) && preserves(element, checker.getTypeArguments(branch)[0]));
  }
  if (notation === 'string') return branches(target).some(branch => branch.flags & ts.TypeFlags.String);
  return preserves(declared(notation), target);
}

test('Managed wire parity: all 695 pinned types keep their 2568 wire properties, native variants and flattened bodies', () => {
  assert.equal(Object.keys(expected).length, 695);
  const diagnostics = ts.getPreEmitDiagnostics(program);
  assert.equal(diagnostics.length, 0, ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: name => name,
    getCurrentDirectory: () => process.cwd(),
    getNewLine: () => '\n',
  }));
  const failures = [];
  let properties = 0, variants = 0, bodies = 0, extras = 0;
  for (const [name, spec] of Object.entries(expected)) {
    const type = declared(name);
    for (const wire of spec.properties ?? []) {
      properties++;
      if (!explicitProperty(type, wire).length) failures.push(`${name}: explicit property ${wire} missing`);
    }
    for (const notation of spec.variants ?? []) {
      variants++;
      if (!preservesVariant(notation, type)) failures.push(`${name}: native ${notation} variant is missing`);
    }
    for (const body of spec.flattenedBodies ?? []) {
      bodies++;
      for (const property of checker.getPropertiesOfType(declared(body))) {
        if (!explicitProperty(type, property.name).length) failures.push(`${name}: flattened body property ${property.name} missing`);
      }
    }
    if (spec.extensible) {
      // The JSON Schema object carries arbitrary extension keywords at its root.
      extras++;
      const index = checker.getIndexTypeOfType(type, ts.IndexKind.String);
      if (!index || !(index.flags & ts.TypeFlags.Unknown)) failures.push(`${name}: JSON Schema extension keyword support missing`);
    }
  }
  assert.equal(properties, 2303, 'Wire property inventory changed');
  assert.equal(variants, 261, 'Native union adapter inventory changed');
  assert.equal(bodies, 3, 'Flattened body adapter inventory changed');
  assert.equal(extras, 1);
  assert.equal(properties + variants + bodies + extras, 2568);
  assert.deepEqual(failures, []);
});
