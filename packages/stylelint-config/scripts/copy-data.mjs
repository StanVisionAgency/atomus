// Writes the Atomus manifest (props, enums, tokens) into data/ so the package works from npm without the repo.
// The manifest parts live in packages/manifest/src (built by scripts/build-manifest.mjs at the repo root).
import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const pkg = join(dirname(fileURLToPath(import.meta.url)), '..');
const root = join(pkg, '..', '..');
const { assemble } = await import(pathToFileURL(join(root, 'packages/manifest/scripts/assemble.mjs')).href);
mkdirSync(join(pkg, 'data'), { recursive: true });
writeFileSync(join(pkg, 'data/atomus.manifest.json'), `${JSON.stringify(assemble())}\n`);
if (process.argv.includes('--with-licence')) for (const f of ['LICENSE', 'NOTICE']) cpSync(join(root, f), join(pkg, f));
