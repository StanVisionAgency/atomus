// Builds the registry with the shadcn CLI (`shadcn build`) into the docs site's public folder, so
// https://docs.atomus.io/r/registry.json and https://docs.atomus.io/r/<name>.json are served by Cloudflare Pages.
//
// Usage: node scripts/build.mjs [--output <dir>] [--base-url <url>]
//   --output    default ../sites/docs/public/r
//   --base-url  rewrite https://docs.atomus.io/r in registryDependencies (e.g. http://localhost:4599/r for install tests)
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { REGISTRY_URL } from './items.mjs';

const here = new URL('../', import.meta.url).pathname;
const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : fallback;
};
const output = resolve(here, arg('--output', '../sites/docs/public/r'));
const baseUrl = arg('--base-url', REGISTRY_URL).replace(/\/$/, '');

rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
const bin = join(here, 'node_modules/.bin/shadcn');
// .build/registry.json = registry.json + each item's CSS (written by scripts/generate.mjs, which `npm run build` runs first).
execFileSync(bin, ['build', '.build/registry.json', '--output', output], { cwd: here, stdio: 'inherit' });

let files = readdirSync(output).filter((f) => f.endsWith('.json'));
if (baseUrl !== REGISTRY_URL) {
  for (const f of files) {
    const p = join(output, f);
    writeFileSync(p, readFileSync(p, 'utf8').split(`${REGISTRY_URL}/`).join(`${baseUrl}/`));
  }
}
console.log(`registry: built ${files.length - 1} items into ${output}${baseUrl !== REGISTRY_URL ? ` (dependencies on ${baseUrl})` : ''}`);
