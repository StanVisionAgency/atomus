// Shared context for the scorers: repo paths, the Atomus manifest, the prompts, and the linters.
// ESLint and Stylelint are loaded from the Atomus lint packages (packages/eslint-plugin, packages/stylelint-config),
// so the evals use exactly the versions and rules that CI and the MCP server use. Run `npm run setup` once.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import YAML from 'yaml';

export const EVALS = join(dirname(fileURLToPath(import.meta.url)), '..');
export const ROOT = join(EVALS, '..');
export const PACKAGE = '@stanvision/atomus-react';
export const TOKENS_PACKAGE = '@stanvision/atomus-tokens';

/** The component manifest, assembled from the committed parts in packages/manifest/src. */
export async function loadManifest() {
  const { assemble } = await import(pathToFileURL(join(ROOT, 'packages/manifest/scripts/assemble.mjs')).href);
  return assemble();
}

export const CATEGORIES = ['component', 'app-screen', 'website', 'ai-chat'];

/** All prompts in evals/prompts/*.yaml, sorted by id. */
export function loadPrompts(dir = join(EVALS, 'prompts')) {
  const prompts = readdirSync(dir)
    .filter((f) => f.endsWith('.yaml'))
    .map((f) => {
      const p = YAML.parse(readFileSync(join(dir, f), 'utf8'));
      if (`${p.id}.yaml` !== f) throw new Error(`prompts/${f}: id "${p.id}" must match the file name`);
      if (!CATEGORIES.includes(p.category)) throw new Error(`prompts/${f}: category must be one of ${CATEGORIES.join(', ')}`);
      if (!p.prompt?.trim()) throw new Error(`prompts/${f}: prompt is empty`);
      p.expect ??= {};
      return p;
    });
  return prompts.sort((a, b) => a.id.localeCompare(b.id));
}

function requireFrom(pkgDir, name) {
  const req = createRequire(join(ROOT, pkgDir, 'package.json'));
  try {
    return req.resolve(name);
  } catch {
    throw new Error(`evals: ${name} not found in ${pkgDir}/node_modules — run \`npm run setup\` in evals/`);
  }
}

let linters;
/** ESLint (+ the TypeScript parser and the Atomus plugin) and Stylelint (+ the Atomus config). */
export async function loadLinters() {
  if (linters) return linters;
  for (const [pkg, data] of [['packages/eslint-plugin', 'data/atomus.manifest.json'], ['packages/stylelint-config', 'data']]) {
    if (!existsSync(join(ROOT, pkg, data))) throw new Error(`evals: ${pkg}/${data} is missing — run \`npm run setup\` in evals/`);
  }
  const { ESLint } = await import(pathToFileURL(requireFrom('packages/eslint-plugin', 'eslint')).href);
  const tsParser = (await import(pathToFileURL(requireFrom('packages/eslint-plugin', '@typescript-eslint/parser')).href)).default;
  const atomusEslint = (await import(pathToFileURL(join(ROOT, 'packages/eslint-plugin/src/index.js')).href)).default;
  const stylelint = (await import(pathToFileURL(requireFrom('packages/stylelint-config', 'stylelint')).href)).default;
  const atomusStylelint = (await import(pathToFileURL(join(ROOT, 'packages/stylelint-config/index.js')).href)).default;
  const ts = (await import(pathToFileURL(requireFrom('packages/eslint-plugin', 'typescript')).href)).default;
  linters = { ESLint, tsParser, atomusEslint, stylelint, atomusStylelint, ts };
  return linters;
}

/** Parses TSX with the TypeScript compiler (no type checking). */
export async function parseTsx(code, file = 'output.tsx') {
  const { ts } = await loadLinters();
  return { ts, sf: ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX) };
}

/** 1-based line of a node. */
export const lineOf = (sf, node) => sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
