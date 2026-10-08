import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import stylelint from 'stylelint';
import config from '../index.js';
import sarif from '../sarif-formatter.js';
import { checkDeclaration } from '../src/core.js';

async function lint(code, fix = false) {
  const { results, code: output, ruleMetadata } = await stylelint.lint({ code, config, fix });
  return { warnings: results[0].warnings, output, results, ruleMetadata };
}
const rulesOf = (w) => w.map((x) => x.rule).sort();

describe('atomus/no-raw-color', () => {
  it('flags hex, rgb(), hsl() and named colours in declarations', async () => {
    const { warnings } = await lint('.a { color: #4057ff; background: rgb(0 0 0 / 10%); border: 1px solid red; box-shadow: 0 0 0 1px hsl(0 0% 0%); }');
    assert.deepEqual(rulesOf(warnings), ['atomus/no-raw-color', 'atomus/no-raw-color', 'atomus/no-raw-color', 'atomus/no-raw-color']);
    assert.match(warnings.find((w) => w.text.includes('#4057ff')).text, /var\(--color-text-link\)/);
  });
  it('allows token definitions and url() ids', async () => {
    const { warnings } = await lint(':root { --color-brand-600: #4057ff; }\n[data-brand="acme"] { --color-brand-500: #ff6600; }\n.a { fill: url(#grad); color: var(--color-text-primary); }');
    assert.equal(warnings.length, 0);
  });
  it('flags raw colours in non-token custom properties', async () => {
    const { warnings } = await lint('.a { --my-accent: #ff6600; }');
    assert.deepEqual(rulesOf(warnings), ['atomus/no-raw-color']);
  });
  it('reports the column of the colour', async () => {
    const { warnings } = await lint('.a { color: #123456; }');
    assert.equal(warnings[0].column, 13);
    assert.equal(warnings[0].endColumn, 20);
  });
});

describe('atomus/no-primitive-token', () => {
  it('flags primitives in component CSS', async () => {
    const { warnings } = await lint('.a { color: var(--color-gray-500); border-color: var(--color-brand-600); }');
    assert.deepEqual(rulesOf(warnings), ['atomus/no-primitive-token', 'atomus/no-primitive-token']);
    assert.match(warnings[0].text, /--color-text-tertiary/);
  });
  it('allows brand blocks that alias primitives', async () => {
    const { warnings } = await lint('[data-brand="violet"] { --color-brand-600: var(--color-violet-600); }');
    assert.equal(warnings.length, 0);
  });
});

describe('atomus/use-tokens', () => {
  it('requires tokens for spacing, radius and colour properties', async () => {
    const { warnings } = await lint('.a { padding: 16px 13px; gap: 8px; border-radius: 8px; margin: 0 auto; color: var(--color-text-primary); }');
    assert.deepEqual(rulesOf(warnings), ['atomus/use-tokens', 'atomus/use-tokens', 'atomus/use-tokens']);
  });
  it('allows var(), calc(var()), keywords, 0 and % radii', async () => {
    const { warnings } = await lint('.a { padding: var(--spacing-xl) 0; margin: calc(var(--spacing-xs) * -1) auto; border-radius: 50%; gap: var(--layout-md); color: inherit; background-color: transparent; }');
    assert.equal(warnings.length, 0);
  });
  it('allows CSS system colours inside forced-colors media queries only', async () => {
    assert.equal((await lint('@media (forced-colors: active) { .a { color: CanvasText; border-color: CanvasText; } }')).warnings.length, 0);
    assert.equal((await lint('.a { color: CanvasText; }')).warnings.length, 1);
  });
  it('autofixes spacing values that equal a spacing token', async () => {
    const { output } = await lint('.a { padding: 16px 8px; margin: 2px 0 0; }', true);
    assert.equal(output, '.a { padding: var(--spacing-xl) var(--spacing-md); margin: var(--spacing-xxs) 0 0; }');
  });
  it('does not autofix radius (it follows the Radius mode) or unknown spacing', async () => {
    const { output, warnings } = await lint('.a { border-radius: 8px; padding: 13px; }', true);
    assert.equal(output, '.a { border-radius: 8px; padding: 13px; }');
    assert.equal(warnings.length, 2);
    assert.match(warnings.find((w) => w.text.includes('radius')).text, /var\(--radius-md\)/);
  });
});

describe('core', () => {
  it('checkDeclaration works without Stylelint', () => {
    const p = checkDeclaration('padding', '16px');
    assert.equal(p.length, 1);
    assert.equal(p[0].fix, 'var(--spacing-xl)');
    assert.equal(checkDeclaration('color', 'var(--color-text-primary)').length, 0);
  });
});

describe('SARIF formatter', () => {
  it('produces SARIF 2.1.0 with rules and locations', async () => {
    const { results, ruleMetadata } = await lint('.a { color: #123456; }');
    const out = JSON.parse(sarif(results, { ruleMetadata }));
    assert.equal(out.version, '2.1.0');
    assert.equal(out.runs[0].results[0].ruleId, 'atomus/no-raw-color');
    assert.equal(out.runs[0].results[0].locations[0].physicalLocation.region.startColumn, 13);
    assert.equal(out.runs[0].tool.driver.rules[0].id, 'atomus/no-raw-color');
  });
});
