// import-match: the output uses @stanvision/atomus-react (and the tokens) the way the package is published.
//   - every name imported from @stanvision/atomus-react is a real export (Figma-only components are not)
//   - the components the prompt expects are imported
//   - no deep imports (@stanvision/atomus-react/Button) and no other UI kit (shadcn/ui, MUI, Chakra …)
import { PACKAGE, TOKENS_PACKAGE, parseTsx } from '../context.mjs';
import { FOREIGN_UI, importsOf, isTokensImport } from '../jsx.mjs';

export const id = 'imports';
export const title = 'Import match';

export async function score({ code, prompt, manifest }) {
  const { ts, sf } = await parseTsx(code);
  const imports = importsOf(ts, sf);
  const values = new Set(manifest.exports.values);
  const types = new Set(manifest.exports.types);
  const figmaOnly = new Map(manifest.components.filter((c) => c.status === 'figma-only').map((c) => [c.name.replace(/\s+/g, ''), c]));
  const issues = [];
  const imported = new Set();
  let atomusImports = 0;
  let tokens = false;

  for (const imp of imports) {
    if (isTokensImport(imp.source)) tokens = true;
    if (imp.source === PACKAGE) {
      atomusImports++;
      for (const n of imp.names) {
        if (n.imported === '*' || n.imported === 'default') {
          if (n.imported === 'default') issues.push({ rule: 'default-import', line: imp.line, message: `${PACKAGE} has no default export; import named components.` });
          continue;
        }
        imported.add(n.imported);
        if (values.has(n.imported) || types.has(n.imported)) continue;
        const fo = figmaOnly.get(n.imported);
        issues.push({
          rule: 'unknown-export',
          line: imp.line,
          message: fo ? `${n.imported} is a Figma-only Atomus component with no React export.` : `${n.imported} is not exported by ${PACKAGE}.`,
        });
      }
    } else if (imp.source.startsWith(`${PACKAGE}/`) && !isTokensImport(imp.source)) {
      issues.push({ rule: 'deep-import', line: imp.line, message: `Import from "${PACKAGE}", not "${imp.source}".` });
    } else if (imp.source.startsWith(`${TOKENS_PACKAGE}/`) && !/^@stanvision\/atomus-tokens\/(css|tailwind|shadcn|tokens\/.+)$/.test(imp.source)) {
      issues.push({ rule: 'unknown-tokens-entry', line: imp.line, message: `"${imp.source}" is not an entry of ${TOKENS_PACKAGE} (css, tailwind, shadcn, tokens/*).` });
    } else if (FOREIGN_UI.some((re) => re.test(imp.source))) {
      issues.push({ rule: 'foreign-ui', line: imp.line, message: `"${imp.source}" is another UI kit; use Atomus components.` });
    }
  }

  const expected = prompt.expect.components ?? [];
  const missing = expected.filter((c) => !imported.has(c));
  for (const c of missing) issues.push({ rule: 'missing-component', message: `Expected ${c} from ${PACKAGE}.` });
  if (!atomusImports) issues.push({ rule: 'no-atomus-import', message: `Nothing is imported from ${PACKAGE}.` });

  const weight = { 'unknown-export': 0.25, 'deep-import': 0.25, 'unknown-tokens-entry': 0.1, 'default-import': 0.25, 'foreign-ui': 0.5, 'missing-component': 0.25, 'no-atomus-import': 1 };
  const penalty = issues.reduce((s, i) => s + (weight[i.rule] ?? 0.25), 0);
  return {
    score: Math.max(0, 1 - penalty),
    issues: issues.map((i) => ({ severity: 'error', ...i })),
    stats: { atomusImports: imported.size, tokensImported: tokens, missing: missing.length },
  };
}
