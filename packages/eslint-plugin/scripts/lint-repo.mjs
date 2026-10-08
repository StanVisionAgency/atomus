#!/usr/bin/env node
// Lints this repository's own UI code with the Atomus rules (strict config).
//
//   node scripts/lint-repo.mjs [paths relative to the repo root …] [--format sarif] [--output file]
//
// Defaults to react/src. The React package is the design system itself and doesn't import
// @stanvision/atomus-react, so the import-driven rules (valid-props, prefer-atomus-component,
// icon-only-needs-label, one-primary-per-view) stay quiet there; the token rules apply in full.
import { writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ESLint } from 'eslint';
import tsParser from '@typescript-eslint/parser';
import atomus from '../src/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args.splice(i, 2)[1] : null; };
const format = opt('--format') ?? 'stylish';
const output = opt('--output');
const targets = args.length ? args : ['react/src'];

const eslint = new ESLint({
  cwd: root,
  overrideConfigFile: true,
  overrideConfig: [
    {
      ...atomus.configs.strict,
      languageOptions: { parser: tsParser, parserOptions: { ecmaFeatures: { jsx: true } } },
      linterOptions: { reportUnusedDisableDirectives: 'error' },
    },
  ],
});
const results = await eslint.lintFiles(targets);
const formatter = await eslint.loadFormatter(format === 'sarif' ? '@microsoft/eslint-formatter-sarif' : format);
const text = await formatter.format(results);
if (output) writeFileSync(resolve(process.cwd(), output), text);
else if (text) console.log(text);
const errors = results.reduce((n, r) => n + r.errorCount, 0);
const warnings = results.reduce((n, r) => n + r.warningCount, 0);
console.error(`atomus eslint: ${results.length} file(s), ${errors} error(s), ${warnings} warning(s)`);
process.exit(errors ? 1 : 0);
