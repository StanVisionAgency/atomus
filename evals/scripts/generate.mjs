#!/usr/bin/env node
// Generates outputs for the prompts with an agent CLI, into runs/<agent>-<variant>-<date>/.
//
//   node scripts/generate.mjs --agent claude-code --variant atomus     # skill + Atomus MCP server
//   node scripts/generate.mjs --agent claude-code --variant baseline   # no skill, no MCP
//   node scripts/generate.mjs --agent command --name codex --cmd 'codex exec "$(cat {prompt_file})"'
//   node scripts/generate.mjs --agent manual --name cursor             # writes prompts to paste (Cursor, Copilot)
//
// Options: --ids a,b  --model <model>  --out <dir>  --remote-mcp  --concurrency 2  --timeout 600  --force  --dry-run
// Then: node scripts/score.mjs runs/<folder>
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { EVALS, loadPrompts } from '../src/context.mjs';
import { ADAPTERS, extractCode, instruction, writeManualPrompts } from '../src/adapters.mjs';

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
const flag = (name) => args.includes(name);
const agent = opt('--agent', 'claude-code');
const variant = opt('--variant', agent === 'claude-code' ? 'atomus' : undefined);
const name = opt('--name', agent);
const date = new Date().toISOString().slice(0, 10);
const out = resolve(opt('--out', join(EVALS, 'runs', [name, variant, date].filter(Boolean).join('-'))));
const ids = opt('--ids')?.split(',');
const prompts = loadPrompts().filter((p) => !ids || ids.includes(p.id));
const concurrency = Number(opt('--concurrency', 2));
const timeoutMs = Number(opt('--timeout', 600)) * 1000;

mkdirSync(out, { recursive: true });
if (agent === 'manual') {
  writeManualPrompts(prompts, out);
  writeFileSync(join(out, 'run.json'), `${JSON.stringify({ agent: name, variant: variant ?? 'manual', date, prompts: prompts.length }, null, 2)}\n`);
  console.log(`Wrote ${prompts.length} instructions to ${join(out, 'prompts')}. Paste each into the agent (fresh chat each time) and save the code as ${out}/<id>.tsx (and <id>.css). Then: npm run score -- ${out}`);
  process.exit(0);
}
const adapter = ADAPTERS[agent];
if (!adapter) {
  console.error(`Unknown --agent ${agent}. Use one of: ${[...Object.keys(ADAPTERS), 'manual'].join(', ')}`);
  process.exit(2);
}
if (flag('--dry-run')) {
  console.log(`${prompts.length} prompts → ${out}\n\n--- instruction for ${prompts[0].id} ---\n${instruction(prompts[0])}`);
  process.exit(0);
}
const version = await adapter.available();
if (!version) {
  console.error(`${agent}: CLI not found. Install it, or use --agent manual and paste the prompts (see evals/README.md).`);
  process.exit(1);
}
writeFileSync(join(out, 'run.json'), `${JSON.stringify({ agent: name, variant, model: opt('--model') ?? null, cli: version, date, prompts: prompts.length }, null, 2)}\n`);

const queue = prompts.filter((p) => flag('--force') || !existsSync(join(out, `${p.id}.tsx`)));
let failed = 0;
async function worker() {
  for (let p = queue.shift(); p; p = queue.shift()) {
    const started = Date.now();
    const { reply, error } = await adapter.generate(p, { variant, model: opt('--model'), remoteMcp: flag('--remote-mcp'), cmd: opt('--cmd'), timeoutMs });
    const { tsx, css } = extractCode(reply ?? '');
    writeFileSync(join(out, `${p.id}.reply.md`), reply ?? '');
    if (tsx) writeFileSync(join(out, `${p.id}.tsx`), tsx);
    if (css) writeFileSync(join(out, `${p.id}.css`), css);
    if (!tsx) failed++;
    console.log(`${tsx ? '✓' : '✗'} ${p.id} (${Math.round((Date.now() - started) / 1000)}s)${error ? ` — ${error}` : tsx ? '' : ' — no tsx block in the reply'}`);
  }
}
await Promise.all(Array.from({ length: Math.max(1, concurrency) }, worker));
console.log(`\n${prompts.length - failed}/${prompts.length} outputs in ${out}. Score: npm run score -- ${out}`);
