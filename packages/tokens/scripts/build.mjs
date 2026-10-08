// Copies the single-source tokens, CSS and presets from the repo root into this package (nothing is duplicated in git).
// Layout mirrors the repo, so the presets' `@import "../css/atomus.css"` keeps working inside node_modules.
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const pkg = join(dirname(fileURLToPath(import.meta.url)), '..');
const root = join(pkg, '..', '..');

const copies = [
  ['css/atomus.css', 'css/atomus.css'],
  ['tailwind/atomus.tailwind.css', 'tailwind/atomus.tailwind.css'],
  ['shadcn/globals.css', 'shadcn/globals.css'],
  ['LICENSE', 'LICENSE'],
  ['NOTICE', 'NOTICE'],
];
for (const f of readdirSync(join(root, 'tokens'))) {
  if (f.endsWith('.json')) copies.push([`tokens/${f}`, `tokens/${f}`]);
}

for (const dir of ['css', 'tailwind', 'shadcn', 'tokens']) rmSync(join(pkg, dir), { recursive: true, force: true });
for (const [from, to] of copies) {
  const src = join(root, from);
  if (!existsSync(src)) throw new Error(`Missing source file: ${from}`);
  mkdirSync(dirname(join(pkg, to)), { recursive: true });
  cpSync(src, join(pkg, to));
}
console.log(`@stanvision/atomus-tokens: copied ${copies.length} files from the repo root.`);
