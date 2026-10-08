// Validator for the Cloudflare Worker: ESLint's universal Linter (no file system) and the Atomus Stylelint
// checks run directly on PostCSS (Stylelint itself needs Node). Same rules, same messages.
import { Linter } from 'eslint/universal';
import tsParser from '@typescript-eslint/parser';
import postcss from 'postcss';
import { checkDeclaration } from '../../stylelint-config/src/core.js';
import { lintScript, type LinterLike } from './validate-eslint.js';
import type { Problem, Validator, ValidationResult } from './tools.js';

const linter = new Linter({ configType: 'flat' }) as unknown as LinterLike;

function lintCss(code: string, fix: boolean): ValidationResult {
  let root;
  try {
    root = postcss.parse(code);
  } catch (e) {
    const err = e as { line?: number; column?: number; reason?: string; message: string };
    return { language: 'css', engine: 'Atomus CSS rules on PostCSS', problems: [{ line: err.line ?? 1, column: err.column ?? 1, rule: 'parse-error', severity: 'error', message: err.reason ?? err.message }] };
  }
  const problems: Problem[] = [];
  root.walkDecls((decl) => {
    let forcedColors = false;
    for (let n = decl.parent as postcss.Container | undefined; n; n = n.parent as postcss.Container | undefined) if (n.type === 'atrule' && (n as postcss.AtRule).name === 'media' && /forced-colors\s*:\s*active/.test((n as postcss.AtRule).params)) forcedColors = true;
    const start = decl.source?.start ?? { line: 1, column: 1 };
    const offset = decl.prop.length + (decl.raws.between ?? ':').length;
    for (const p of checkDeclaration(decl.prop, decl.value, { forcedColors }) as Array<{ rule: string; index: number; endIndex: number; message: string; fix?: string }>) {
      problems.push({ line: start.line, column: start.column + offset + p.index, endLine: start.line, endColumn: start.column + offset + p.endIndex, rule: p.rule, severity: 'error', message: p.message, fixable: Boolean(p.fix) });
      if (fix && p.fix) decl.value = p.fix;
    }
  });
  return { language: 'css', engine: 'Atomus CSS rules on PostCSS', problems, ...(fix ? { output: root.toString() } : {}) };
}

export const webValidator: Validator = {
  async validate(code, filename, fix) {
    if (/\.(css|scss|pcss|postcss)$/i.test(filename)) return lintCss(code, fix);
    return lintScript(linter, tsParser, code, filename, fix, { schemas: false });
  },
};
