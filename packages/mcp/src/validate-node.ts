// Validator for the stdio server: ESLint (Atomus plugin) for scripts, Stylelint (Atomus config) for CSS.
import { Linter } from 'eslint';
import tsParser from '@typescript-eslint/parser';
import stylelint from 'stylelint';
import stylelintConfig from '../../stylelint-config/index.js';
import { lintScript, type LinterLike } from './validate-eslint.js';
import type { Validator, ValidationResult } from './tools.js';

const linter = new Linter({ configType: 'flat' }) as unknown as LinterLike;

export const nodeValidator: Validator = {
  async validate(code, filename, fix): Promise<ValidationResult> {
    if (/\.(css|scss|pcss|postcss)$/i.test(filename)) {
      const res = await stylelint.lint({ code, codeFilename: filename, config: stylelintConfig as stylelint.Config, fix });
      const r = res.results[0];
      const problems = (r?.warnings ?? []).map((w) => ({
        line: w.line,
        column: w.column,
        endLine: w.endLine,
        endColumn: w.endColumn,
        rule: w.rule,
        severity: (w.severity === 'error' ? 'error' : 'warning') as 'error' | 'warning',
        message: w.text.replace(/\s*\([\w/-]+\)$/, ''),
        fixable: w.rule === 'atomus/use-tokens' && /→ var\(--spacing-/.test(w.text),
      }));
      return { language: 'css', engine: 'Stylelint + @stanvision/stylelint-config-atomus', problems, ...(fix ? { output: (res as { code?: string }).code ?? code } : {}) };
    }
    return lintScript(linter, tsParser, code, filename, fix);
  },
};
