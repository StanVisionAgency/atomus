// Proves the scorers work: hand-written good outputs score clean, bad outputs are caught by the right scorer.
// Run: npm test (after npm install && npm run setup). Uses Chromium for the axe scorer.
import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { readdirSync } from 'node:fs';
import { EVALS, loadManifest, loadPrompts } from '../src/context.mjs';
import { scoreOutput, scoreRun } from '../src/score.mjs';
import { toMarkdown } from '../src/report.mjs';

const prompts = new Map(loadPrompts().map((p) => [p.id, p]));
const fixture = (kind, id) => join(EVALS, 'fixtures', kind, `${id}.tsx`);
const rules = (item, scorer) => item.results[scorer].issues.map((i) => i.rule);

let manifest;
const ctx = {};
const results = {};
const run = async (kind, id) => (results[`${kind}/${id}`] ??= await scoreOutput({ prompt: prompts.get(id), file: fixture(kind, id), manifest, ctx }));

before(async () => { manifest = await loadManifest(); });
after(async () => { await ctx.close?.(); });

describe('fixtures', () => {
  test('every fixture answers a real prompt', () => {
    for (const kind of ['good', 'bad']) {
      const ids = readdirSync(join(EVALS, 'fixtures', kind)).filter((f) => f.endsWith('.tsx')).map((f) => f.replace(/\.tsx$/, ''));
      assert.equal(ids.length, 3, `${kind}: three fixtures`);
      for (const id of ids) assert.ok(prompts.has(id), `${kind}/${id}.tsx has a prompt`);
    }
  });
});

describe('good outputs score clean', () => {
  for (const id of ['button-save-cancel', 'modal-delete-confirm', 'ai-chat-basic']) {
    test(id, async () => {
      const item = await run('good', id);
      for (const [scorer, r] of Object.entries(item.results)) assert.deepEqual(r.issues, [], `${scorer} has no issues`);
      assert.equal(item.pass, true);
      assert.equal(item.score, 1);
      assert.equal(item.results.axe.stats.rendered, true, 'renders in Chromium');
      assert.equal(item.results.axe.stats.ssr, true, 'renders on the server');
    });
  }
});

describe('bad outputs are caught', () => {
  test('raw HTML, inline styles and hex colours (input-error-state)', async () => {
    const item = await run('bad', 'input-error-state');
    assert.equal(item.pass, false);
    assert.deepEqual([...new Set(rules(item, 'imports'))].sort(), ['missing-component', 'no-atomus-import']);
    assert.equal(item.results.imports.score, 0);
    assert.equal(item.results.styles.stats.inlineStyles, 4);
    assert.equal(item.results.styles.stats.rawColors, 3);
    assert.equal(rules(item, 'lint').filter((r) => r === 'atomus/no-raw-color').length, 3);
    assert.ok(rules(item, 'expectations').includes('forbid-element'), 'raw <input> is reported');
    assert.ok(item.results.expectations.score < 0.5);
  });

  test('invented props, Figma-only and foreign imports (select-country)', async () => {
    const item = await run('bad', 'select-country');
    const imp = rules(item, 'imports');
    assert.ok(imp.includes('unknown-export'), 'Combobox is not an export');
    assert.ok(imp.includes('deep-import'));
    assert.ok(imp.includes('foreign-ui'), 'shadcn/ui import');
    assert.deepEqual(rules(item, 'props').sort(), ['invalid-value', 'unknown-prop']);
    assert.equal(item.results.props.stats.invalid, 2);
    assert.ok(rules(item, 'axe').includes('build-error'), 'an output that does not build scores 0 on axe');
    assert.equal(item.results.axe.score, 0);
  });

  test('icon buttons without names and two primaries (button-icon-only)', async () => {
    const item = await run('bad', 'button-icon-only');
    assert.deepEqual(item.results.imports.issues, [], 'imports are fine');
    assert.deepEqual(item.results.props.issues, [], 'props are fine');
    assert.equal(rules(item, 'lint').filter((r) => r === 'atomus/icon-only-needs-label').length, 3);
    assert.ok(rules(item, 'lint').includes('atomus/one-primary-per-view'));
    assert.ok(rules(item, 'axe').includes('button-name'), 'axe finds the unnamed buttons');
    assert.ok(item.results.axe.score < 1);
    assert.equal(item.results.styles.score, 1);
  });

  test('every bad output scores below every good output', async () => {
    const good = await Promise.all(['button-save-cancel', 'modal-delete-confirm', 'ai-chat-basic'].map((id) => run('good', id)));
    const bad = await Promise.all(['input-error-state', 'select-country', 'button-icon-only'].map((id) => run('bad', id)));
    assert.ok(Math.max(...bad.map((b) => b.score)) < Math.min(...good.map((g) => g.score)));
  });
});

describe('run scorecard', () => {
  test('scores a run folder, counts missing outputs and writes Markdown', async () => {
    const card = await scoreRun(join(EVALS, 'fixtures', 'good'), { only: ['imports', 'props', 'styles', 'expectations'], meta: { agent: 'fixtures', variant: 'good' } });
    assert.equal(card.totals.prompts, prompts.size);
    assert.equal(card.totals.outputs, 3);
    assert.equal(card.totals.missing, prompts.size - 3);
    assert.equal(card.totals.passed, 3);
    assert.equal(card.byCategory['ai-chat'].prompts, 5);
    const md = toMarkdown(card);
    assert.match(md, /# Atomus agent eval — good/);
    assert.match(md, /✓ button-save-cancel/);
    assert.match(md, /\| .*missing/);
  });
});
