// Scores a folder of generated outputs (<prompt-id>.tsx, optional <prompt-id>.css) against the prompts.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, join } from 'node:path';
import { loadManifest, loadPrompts } from './context.mjs';
import * as imports from './scorers/imports.mjs';
import * as props from './scorers/props.mjs';
import * as lint from './scorers/lint.mjs';
import * as axe from './scorers/axe.mjs';
import * as styles from './scorers/styles.mjs';
import * as expectations from './scorers/expectations.mjs';

export const SCORERS = [imports, props, lint, axe, styles, expectations];
export const VERSION = 1;

/** A prompt passes when every scorer is clean: no error-level issue anywhere. */
const passes = (results) => Object.values(results).every((r) => !r.issues.some((i) => i.severity === 'error'));

/** Scores one output. `ctx` holds the shared browser; call ctx.close() when done. */
export async function scoreOutput({ prompt, file, manifest, ctx, only }) {
  const code = readFileSync(file, 'utf8');
  const cssFile = file.replace(/\.tsx$/, '.css');
  const css = existsSync(cssFile) ? readFileSync(cssFile, 'utf8') : '';
  const results = {};
  for (const s of SCORERS) {
    if (only && !only.includes(s.id)) continue;
    try {
      results[s.id] = await s.score({ prompt, file, code, css, manifest, ctx });
    } catch (err) {
      results[s.id] = { score: 0, issues: [{ rule: 'scorer-error', severity: 'error', message: String(err?.message ?? err).split('\n')[0] }], stats: {} };
    }
  }
  const values = Object.values(results).map((r) => r.score);
  return { id: prompt.id, category: prompt.category, file: basename(file), score: values.reduce((a, b) => a + b, 0) / values.length, pass: passes(results), results };
}

const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

/**
 * Scores every prompt against `dir`. Prompts without an output count as missing (score 0).
 * Options: { prompts, ids, only, onProgress, meta }.
 */
export async function scoreRun(dir, opts = {}) {
  const manifest = await loadManifest();
  const all = opts.prompts ?? loadPrompts();
  const files = new Set(readdirSync(dir).filter((f) => f.endsWith('.tsx')));
  const prompts = opts.ids ? all.filter((p) => opts.ids.includes(p.id)) : all;
  const unknown = [...files].map((f) => f.replace(/\.tsx$/, '')).filter((id) => !all.some((p) => p.id === id));
  const ctx = {};
  const items = [];
  try {
    for (const prompt of prompts) {
      const file = join(dir, `${prompt.id}.tsx`);
      if (!files.has(`${prompt.id}.tsx`)) {
        if (!opts.ids) items.push({ id: prompt.id, category: prompt.category, missing: true, score: 0, pass: false, results: {} });
        continue;
      }
      const item = await scoreOutput({ prompt, file, manifest, ctx, only: opts.only });
      items.push(item);
      opts.onProgress?.(item);
    }
  } finally {
    await ctx.close?.();
  }
  const scored = items.filter((i) => !i.missing);
  const byScorer = Object.fromEntries(SCORERS.filter((s) => !opts.only || opts.only.includes(s.id)).map((s) => [s.id, mean(scored.map((i) => i.results[s.id]?.score ?? 0))]));
  const categories = [...new Set(items.map((i) => i.category))];
  const byCategory = Object.fromEntries(categories.map((c) => {
    const inCat = items.filter((i) => i.category === c);
    return [c, { prompts: inCat.length, score: mean(inCat.map((i) => i.score)), passed: inCat.filter((i) => i.pass).length }];
  }));
  const count = (pred) => scored.reduce((n, i) => n + Object.values(i.results).reduce((m, r) => m + r.issues.filter(pred).length, 0), 0);
  return {
    version: VERSION,
    run: basename(dir),
    ...(opts.meta ?? {}),
    scoredAt: new Date().toISOString(),
    atomus: { manifest: manifest.version, components: manifest.exports.values.length },
    totals: {
      prompts: items.length,
      outputs: scored.length,
      missing: items.length - scored.length,
      passed: items.filter((i) => i.pass).length,
      score: mean(items.map((i) => i.score)),
      errors: count((i) => i.severity === 'error'),
      warnings: count((i) => i.severity === 'warning'),
      inlineStyles: scored.reduce((n, i) => n + (i.results.styles?.stats.inlineStyles ?? 0), 0),
      rawColors: scored.reduce((n, i) => n + (i.results.styles?.stats.rawColors ?? 0), 0),
      axeViolations: scored.reduce((n, i) => n + (i.results.axe?.stats.violations ?? 0), 0),
    },
    byScorer,
    byCategory,
    unknownOutputs: unknown,
    items,
  };
}
