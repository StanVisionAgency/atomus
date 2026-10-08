// axe violations: render the output (SSR + hydration, Atomus CSS) in Chromium and run axe-core with the
// WCAG 2.2 A/AA rules, in the Light and the Dark theme. A file that does not build or render scores 0.
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { EVALS } from '../context.mjs';
import { browserLaunchOptions, renderPage } from '../render.mjs';

export const id = 'axe';
export const title = 'Accessibility (axe)';

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const WEIGHT = { critical: 0.4, serious: 0.25, moderate: 0.1, minor: 0.05 };
const axeSource = createRequire(join(EVALS, 'package.json')).resolve('axe-core/axe.min.js');

/** One browser per scoring run; ctx.close() shuts it down. */
async function browserOf(ctx) {
  if (!ctx.browser) {
    const opts = browserLaunchOptions();
    const { chromium } = await import('playwright');
    ctx.browser = await chromium.launch(opts);
    const prev = ctx.close;
    ctx.close = async () => { await ctx.browser?.close(); ctx.browser = null; await prev?.(); };
  }
  return ctx.browser;
}

export async function score({ file, css, ctx }) {
  const page = await renderPage(file, css);
  if (page.buildError) return { score: 0, issues: [{ rule: 'build-error', severity: 'error', message: `Does not build: ${page.buildError}` }], stats: { rendered: false } };
  const browser = await browserOf(ctx);
  const tab = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  tab.on('pageerror', (e) => errors.push(String(e.message ?? e)));
  const issues = [];
  const seen = new Map();
  try {
    await tab.setContent(page.html, { waitUntil: 'load' });
    await tab.waitForTimeout(150); // effects (dialogs opening, measured layouts)
    const empty = await tab.evaluate(() => !document.getElementById('root')?.innerHTML.trim());
    if (empty || errors.length) {
      return { score: 0, issues: [{ rule: 'render-error', severity: 'error', message: `Does not render${errors.length ? `: ${errors[0].split('\n')[0]}` : ' (empty output)'}` }], stats: { rendered: false } };
    }
    await tab.addScriptTag({ path: axeSource });
    for (const theme of ['light', 'dark']) {
      await tab.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
      const result = await tab.evaluate((tags) => window.axe.run(document, { runOnly: { type: 'tag', values: tags }, resultTypes: ['violations'] }), AXE_TAGS);
      for (const v of result.violations) {
        const key = v.id;
        const nodes = v.nodes.length;
        const prev = seen.get(key);
        if (prev) { prev.themes.push(theme); prev.nodes = Math.max(prev.nodes, nodes); continue; }
        const entry = { rule: v.id, impact: v.impact ?? 'minor', nodes, themes: [theme], message: `${v.help} (${nodes} element${nodes === 1 ? '' : 's'}): ${v.nodes[0]?.target?.join(' ') ?? ''}` };
        seen.set(key, entry);
      }
    }
  } finally {
    await tab.close();
  }
  for (const v of seen.values()) {
    issues.push({ rule: v.rule, severity: v.impact === 'critical' || v.impact === 'serious' ? 'error' : 'warning', impact: v.impact, message: `${v.message}${v.themes.length === 1 ? ` [${v.themes[0]} only]` : ''}` });
  }
  if (page.ssrError) issues.push({ rule: 'ssr-error', severity: 'warning', message: `Server render failed, scored after client render: ${page.ssrError}` });
  const penalty = [...seen.values()].reduce((s, v) => s + (WEIGHT[v.impact] ?? 0.05), 0) + (page.ssrError ? 0.1 : 0);
  return { score: Math.max(0, 1 - penalty), issues, stats: { rendered: true, violations: seen.size, ssr: !page.ssrError } };
}
