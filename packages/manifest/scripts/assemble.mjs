#!/usr/bin/env node
// Joins the committed manifest parts (src/index.json, src/components/*.json, src/tokens/*.json) into
// atomus.manifest.json, the file this package publishes. No dependencies.
//
//   node scripts/assemble.mjs          write atomus.manifest.json
//   import { assemble } from '…/assemble.mjs'   → the manifest object
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const pkg = join(dirname(fileURLToPath(import.meta.url)), '..');
const TOKEN_SECTIONS = ['rules', 'intents', 'groups', 'semantic', 'spacing', 'radius', 'shadows', 'textStyles', 'primitives'];

export const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

/** JSON with one key per line, but short objects and arrays kept on one line (readable, small diffs). */
export function stringify(value) {
  const fmt = (v, indent) => {
    const inline = JSON.stringify(v);
    if (v === null || typeof v !== 'object' || inline.length + indent.length <= 110) return inline;
    const next = `${indent}  `;
    if (Array.isArray(v)) return `[\n${v.map((x) => next + fmt(x, next)).join(',\n')}\n${indent}]`;
    return `{\n${Object.entries(v).map(([k, x]) => `${next}${JSON.stringify(k)}: ${fmt(x, next)}`).join(',\n')}\n${indent}}`;
  };
  return `${fmt(value, '')}\n`;
}

/** Manifest object → { 'index.json': …, 'components/button.json': …, 'tokens/semantic.json': … }. */
export function partsOf(manifest) {
  const { components, tokens, ...meta } = manifest;
  const files = {};
  const names = components.map((c) => slug(c.name));
  if (new Set(names).size !== names.length) throw new Error('two components share a file name');
  components.forEach((c, i) => { files[`components/${names[i]}.json`] = c; });
  for (const k of TOKEN_SECTIONS) files[`tokens/${k}.json`] = tokens[k];
  files['index.json'] = { ...meta, components: names, tokens: TOKEN_SECTIONS };
  return files;
}

export function assemble(src = join(pkg, 'src')) {
  const read = (f) => JSON.parse(readFileSync(join(src, f), 'utf8'));
  const { components, tokens, ...meta } = read('index.json');
  const out = { ...meta, components: components.map((n) => read(`components/${n}.json`)), tokens: {} };
  for (const k of tokens) out.tokens[k] = read(`tokens/${k}.json`);
  // Keep the key order of the generated manifest: … exports, components, tokens.
  return out;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  writeFileSync(join(pkg, 'atomus.manifest.json'), `${JSON.stringify(assemble(), null, 2)}\n`);
  console.log('@stanvision/atomus-manifest: assembled atomus.manifest.json from src/.');
}
