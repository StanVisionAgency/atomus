// lint violations: the Atomus ESLint rules (recommended config) on the TSX, and the Atomus Stylelint config on
// the CSS that comes with it (<prompt-id>.css next to the output). `valid-props` is left to the props scorer.
import { join } from 'node:path';
import { EVALS, loadLinters } from '../context.mjs';

export const id = 'lint';
export const title = 'Lint (ESLint + Stylelint)';

const engines = new WeakMap();
async function eslintFor(manifest) {
  if (engines.has(manifest)) return engines.get(manifest);
  const { ESLint, tsParser, atomusEslint } = await loadLinters();
  const eslint = new ESLint({
    cwd: EVALS,
    overrideConfigFile: true,
    overrideConfig: [{
      ...atomusEslint.configs.recommended,
      files: ['**/*.tsx'],
      languageOptions: { parser: tsParser, parserOptions: { ecmaFeatures: { jsx: true } } },
      settings: { atomus: { manifest } },
      rules: { ...atomusEslint.configs.recommended.rules, 'atomus/valid-props': 'off' },
    }],
  });
  engines.set(manifest, eslint);
  return eslint;
}

export async function score({ code, css, manifest }) {
  const eslint = await eslintFor(manifest);
  const [result] = await eslint.lintText(code, { filePath: join(EVALS, 'output.tsx') });
  const issues = result.messages.map((m) => ({
    rule: m.ruleId ?? 'parse-error',
    severity: m.fatal || m.severity === 2 ? 'error' : 'warning',
    line: m.line,
    message: m.message,
  }));
  if (css) {
    const { stylelint, atomusStylelint } = await loadLinters();
    const { results } = await stylelint.lint({ code: css, codeFilename: join(EVALS, 'output.css'), config: atomusStylelint });
    for (const w of results[0]?.warnings ?? []) issues.push({ rule: w.rule, severity: w.severity === 'error' ? 'error' : 'warning', line: w.line, message: w.text, file: 'css' });
  }
  const errors = issues.filter((i) => i.severity === 'error').length;
  const warnings = issues.length - errors;
  return { score: Math.max(0, 1 - 0.2 * errors - 0.05 * warnings), issues, stats: { errors, warnings } };
}
