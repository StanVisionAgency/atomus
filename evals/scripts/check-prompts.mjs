#!/usr/bin/env node
// Validates prompts/*.yaml: ids, categories, and that every expected component and prop is real.
import { loadManifest, loadPrompts } from '../src/context.mjs';

const manifest = await loadManifest();
const prompts = loadPrompts();
const components = new Map(manifest.components.filter((c) => c.status !== 'figma-only').map((c) => [c.name, c]));
const problems = [];
for (const p of prompts) {
  for (const c of p.expect.components ?? []) if (!components.has(c)) problems.push(`${p.id}: expect.components lists ${c}, which is not a React export`);
  for (const pr of p.expect.props ?? []) {
    const c = components.get(pr.component);
    if (!c) { problems.push(`${p.id}: expect.props uses unknown component ${pr.component}`); continue; }
    const def = c.props?.[pr.prop];
    if (!def) problems.push(`${p.id}: ${pr.component} has no prop ${pr.prop}`);
    else if (pr.value !== undefined && def.values && !def.values.includes(pr.value)) problems.push(`${p.id}: ${pr.component} ${pr.prop}="${pr.value}" is not allowed (${def.values.join(', ')})`);
  }
}
const byCat = prompts.reduce((m, p) => ({ ...m, [p.category]: (m[p.category] ?? 0) + 1 }), {});
if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`prompts: ${prompts.length} OK (${Object.entries(byCat).map(([k, v]) => `${k} ${v}`).join(', ')})`);
