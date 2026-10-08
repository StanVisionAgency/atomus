// prop/enum validity: every prop on an Atomus component exists and every literal enum value is allowed.
// Driven by the component manifest (packages/manifest) through the Atomus ESLint rule `valid-props`,
// the same check agents get from atomus_validate in the MCP server.
import { join } from 'node:path';
import { EVALS, loadLinters, parseTsx } from '../context.mjs';
import { atomusBindings, atomusTag, importsOf, jsxElements } from '../jsx.mjs';

export const id = 'props';
export const title = 'Props and enums';

const engines = new WeakMap();
async function eslintFor(manifest) {
  if (engines.has(manifest)) return engines.get(manifest);
  const { ESLint, tsParser, atomusEslint } = await loadLinters();
  const eslint = new ESLint({
    cwd: EVALS,
    overrideConfigFile: true,
    overrideConfig: [{
      files: ['**/*.tsx'],
      plugins: { atomus: atomusEslint },
      languageOptions: { parser: tsParser, parserOptions: { ecmaFeatures: { jsx: true } } },
      settings: { atomus: { manifest } },
      rules: { 'atomus/valid-props': 'error' },
    }],
  });
  engines.set(manifest, eslint);
  return eslint;
}

export async function score({ code, manifest }) {
  const eslint = await eslintFor(manifest);
  const [result] = await eslint.lintText(code, { filePath: join(EVALS, 'output.tsx') });
  if (result.messages.some((m) => m.fatal)) {
    const m = result.messages.find((x) => x.fatal);
    return { score: 0, issues: [{ rule: 'parse-error', severity: 'error', line: m.line, message: m.message }], stats: { checked: 0, invalid: 0 } };
  }
  // Unknown / Figma-only exports are scored by the import scorer.
  const issues = result.messages
    .filter((m) => m.ruleId === 'atomus/valid-props' && !/is not exported by|Figma-only/.test(m.message))
    .map((m) => ({ rule: /not a valid value/.test(m.message) ? 'invalid-value' : /missing the required/.test(m.message) ? 'missing-required' : 'unknown-prop', severity: 'error', line: m.line, message: m.message }));

  // Denominator: props written on Atomus components.
  const { ts, sf } = await parseTsx(code);
  const bindings = atomusBindings(importsOf(ts, sf));
  const checked = jsxElements(ts, sf).filter((e) => atomusTag(e.tag, bindings)).reduce((n, e) => n + e.attrs.length, 0);
  return {
    score: issues.length ? Math.max(0, 1 - issues.length / Math.max(checked, issues.length, 5)) : 1,
    issues,
    stats: { checked, invalid: issues.length },
  };
}
