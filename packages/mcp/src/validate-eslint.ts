// Runs the Atomus ESLint plugin (strict config) on a code string. Shared by the Node server and the Worker:
// each passes its own Linter class (eslint, or eslint/universal in the Worker) and parser.
import plugin from '../../eslint-plugin/src/index.js';
import type { Problem, ValidationResult } from './tools.js';

interface LinterMessage { ruleId: string | null; severity: number; message: string; line: number; column: number; endLine?: number; endColumn?: number; fix?: unknown; suggestions?: Array<{ desc: string }>; fatal?: boolean }
export interface LinterLike {
  verify(code: string, config: unknown[], filename: string): LinterMessage[];
  verifyAndFix(code: string, config: unknown[], filename: string): { output: string; messages: LinterMessage[]; fixed: boolean };
}

const RULES = Object.fromEntries(Object.keys(plugin.rules ?? {}).map((r) => [`atomus/${r}`, r === 'no-arbitrary-value' || r === 'prefer-atomus-component' || r === 'one-primary-per-view' ? 'warn' : 'error']));

// Cloudflare Workers forbid code generation from strings, which ESLint's option validation (Ajv) needs.
// We never pass rule options here, so the Worker uses the same rules with option schemas switched off.
const pluginWithoutSchemas = {
  ...plugin,
  rules: Object.fromEntries(Object.entries(plugin.rules ?? {}).map(([name, rule]) => [name, { ...(rule as object), meta: { ...(rule as { meta?: object }).meta, schema: false } }])),
};

export function eslintConfig(parser: unknown, { schemas = true } = {}) {
  return [
    {
      files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'],
      plugins: { atomus: schemas ? plugin : pluginWithoutSchemas },
      languageOptions: { parser, parserOptions: { ecmaFeatures: { jsx: true } } },
      rules: RULES,
    },
  ];
}

const toProblem = (m: LinterMessage): Problem => ({
  line: m.line,
  column: m.column,
  endLine: m.endLine,
  endColumn: m.endColumn,
  rule: m.ruleId ?? 'parse-error',
  severity: m.severity === 2 || m.fatal ? 'error' : 'warning',
  message: m.message,
  fixable: Boolean(m.fix),
  suggestions: m.suggestions?.map((s) => s.desc),
});

export function lintScript(linter: LinterLike, parser: unknown, code: string, filename: string, fix: boolean, options: { schemas?: boolean } = {}): ValidationResult {
  const config = eslintConfig(parser, options);
  const name = /\.(jsx?|mjs|cjs|tsx?|mts|cts)$/.test(filename) ? filename : `${filename}.tsx`;
  const messages = linter.verify(code, config, name);
  const result: ValidationResult = { language: 'tsx', engine: 'ESLint + @stanvision/eslint-plugin-atomus', problems: messages.map(toProblem) };
  if (fix) result.output = linter.verifyAndFix(code, config, name).output;
  return result;
}
