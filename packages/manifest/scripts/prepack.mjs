// Copies the JSON Schemas and the licence files from the repo root into this package before `npm pack` / `npm publish`
// (nothing is duplicated in git). The manifest parts are committed in src/; assemble.mjs joins them.
import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const pkg = join(dirname(fileURLToPath(import.meta.url)), '..');
const root = join(pkg, '..', '..');
rmSync(join(pkg, 'schemas'), { recursive: true, force: true });
mkdirSync(join(pkg, 'schemas'), { recursive: true });
for (const f of ['component.schema.json', 'manifest.schema.json']) cpSync(join(root, 'schemas', f), join(pkg, 'schemas', f));
for (const f of ['LICENSE', 'NOTICE']) cpSync(join(root, f), join(pkg, f));
console.log('@stanvision/atomus-manifest: copied the schemas and licence files.');
