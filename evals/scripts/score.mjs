#!/usr/bin/env node
// Scores a run folder and writes scorecard.json + scorecard.md into it.
//
//   node scripts/score.mjs runs/<agent>-<date> [--only imports,props] [--ids a,b] [--out <dir>] [--quiet]
//
// The folder holds one <prompt-id>.tsx per prompt (plus an optional <prompt-id>.css) and, optionally, a
// run.json with { agent, variant, model, date } written by scripts/generate.mjs.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { scoreRun } from '../src/score.mjs';
import { toMarkdown } from '../src/report.mjs';

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args.splice(i, 2)[1] : undefined; };
const flag = (name) => { const i = args.indexOf(name); if (i >= 0) args.splice(i, 1); return i >= 0; };
const only = opt('--only')?.split(',');
const ids = opt('--ids')?.split(',');
const outDir = opt('--out');
const quiet = flag('--quiet');
const dir = args[0] && resolve(args[0]);
if (!dir || !existsSync(dir)) {
  console.error('usage: node scripts/score.mjs <run folder> [--only scorers] [--ids prompt-ids] [--out dir]');
  process.exit(2);
}
const meta = existsSync(join(dir, 'run.json')) ? JSON.parse(readFileSync(join(dir, 'run.json'), 'utf8')) : {};
const card = await scoreRun(dir, {
  only,
  ids,
  meta,
  onProgress: (i) => { if (!quiet) console.log(`${i.pass ? '✓' : '✗'} ${i.id.padEnd(36)} ${Math.round(i.score * 100)}%`); },
});
const out = resolve(outDir ?? dir);
writeFileSync(join(out, 'scorecard.json'), `${JSON.stringify(card, null, 2)}\n`);
writeFileSync(join(out, 'scorecard.md'), toMarkdown(card));
const t = card.totals;
console.log(`\n${card.run}: ${Math.round(t.score * 100)}% · ${t.passed}/${t.prompts} clean · ${t.missing} missing → ${join(out, 'scorecard.md')}`);
