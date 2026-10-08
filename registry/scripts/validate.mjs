// Validates the built registry (default ../sites/docs/public/r) against the shadcn schemas
// (the zod schemas the shadcn CLI itself uses, from `shadcn/schema`) and checks what the schema can't:
// every file has content and a safe target, every registryDependency resolves to a built item,
// every item has a description and docs, and every relative import in a file is shipped by the item or a dependency.
//
// Usage: node scripts/validate.mjs [dir]
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve, posix } from 'node:path';
import { registrySchema, registryItemSchema } from 'shadcn/schema';
import { REGISTRY_URL } from './items.mjs';

const here = new URL('../', import.meta.url).pathname;
const dir = resolve(here, process.argv[2] ?? '../sites/docs/public/r');
const errors = [];
const fail = (where, msg) => errors.push(`${where}: ${msg}`);

if (!existsSync(join(dir, 'registry.json'))) {
  console.error(`validate: ${dir}/registry.json not found — run npm run build first`);
  process.exit(1);
}
const index = JSON.parse(readFileSync(join(dir, 'registry.json'), 'utf8'));
const parsedIndex = registrySchema.safeParse(index);
if (!parsedIndex.success) fail('registry.json', parsedIndex.error.message);

const items = new Map();
for (const f of readdirSync(dir).filter((f) => f.endsWith('.json') && f !== 'registry.json')) {
  const json = JSON.parse(readFileSync(join(dir, f), 'utf8'));
  const parsed = registryItemSchema.safeParse(json);
  if (!parsed.success) fail(f, parsed.error.message);
  if (`${json.name}.json` !== f) fail(f, `name "${json.name}" does not match the file name`);
  items.set(json.name, json);
}
for (const it of index.items) if (!items.has(it.name)) fail('registry.json', `item ${it.name} has no ${it.name}.json`);

const base = (() => {
  // Built for another host (install tests): take it from any dependency URL.
  for (const it of items.values()) for (const d of it.registryDependencies ?? []) return d.slice(0, d.lastIndexOf('/'));
  return REGISTRY_URL;
})();

/** Installed path of every file, per item, including dependencies (transitively). */
const closure = (name, seen = new Set()) => {
  if (seen.has(name)) return seen;
  seen.add(name);
  for (const d of items.get(name)?.registryDependencies ?? []) closure(d.slice(base.length + 1).replace(/\.json$/, ''), seen);
  return seen;
};

for (const [name, it] of items) {
  const where = `${name}.json`;
  if (!it.description || it.description.length < 20) fail(where, 'needs a description');
  if (!it.title) fail(where, 'needs a title');
  if (it.type !== 'registry:lib' && it.type !== 'registry:component' && !it.docs) fail(where, 'needs a docs field');
  for (const d of it.registryDependencies ?? []) {
    if (!d.startsWith(`${base}/`) || !d.endsWith('.json')) fail(where, `registryDependency ${d} is not an Atomus registry URL`);
    else if (!items.has(d.slice(base.length + 1, -5))) fail(where, `registryDependency ${d} is not built`);
  }
  const shipped = new Set();
  for (const dep of closure(name)) for (const f of items.get(dep)?.files ?? []) shipped.add(f.target);
  for (const f of it.files ?? []) {
    if (!f.content?.trim()) fail(where, `${f.path} has no content`);
    if (!f.target?.startsWith('components/atomus/')) fail(where, `${f.path} must target components/atomus/`);
    for (const m of (f.content ?? '').matchAll(/from '(\.{1,2}\/[\w-]+)'/g)) {
      const target = posix.normalize(posix.join(posix.dirname(f.target), m[1]));
      if (!['.ts', '.tsx'].some((ext) => shipped.has(target + ext))) fail(where, `${f.target} imports ${m[1]}, which neither the item nor its dependencies install`);
    }
    for (const m of (f.content ?? '').matchAll(/from '(@\/[^']+|\.\.\/\.\.\/[^']*)'/g)) fail(where, `${f.target} has a non-relative/escaping import ${m[1]}`);
  }
}

if (errors.length) {
  console.error(`validate: ${errors.length} problem(s)\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log(`validate: ${items.size} items in ${dir} match the shadcn registry-item schema; dependencies and imports resolve`);
