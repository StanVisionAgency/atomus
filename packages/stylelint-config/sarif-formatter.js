// SARIF 2.1.0 formatter for Stylelint, for GitHub code scanning and other SARIF viewers.
//
//   stylelint "src/**/*.css" --custom-formatter @stanvision/stylelint-config-atomus/sarif-formatter --output-file stylelint.sarif
import { pathToFileURL } from 'node:url';
import { relative } from 'node:path';

export default function sarifFormatter(results, returnValue) {
  const rules = new Map();
  const meta = returnValue?.ruleMetadata ?? {};
  const sarifResults = [];
  for (const r of results) {
    const uri = relative(process.cwd(), r.source ?? '').split('\\').join('/') || pathToFileURL(r.source ?? '').href;
    for (const w of r.warnings ?? []) {
      if (!rules.has(w.rule)) {
        const m = meta[w.rule] ?? {};
        rules.set(w.rule, {
          id: w.rule,
          shortDescription: { text: m.description ?? w.rule },
          ...(m.url ? { helpUri: m.url } : {}),
        });
      }
      sarifResults.push({
        ruleId: w.rule,
        level: w.severity === 'error' ? 'error' : 'warning',
        message: { text: w.text.replace(new RegExp(`\\s*\\(${w.rule.replace(/[/]/g, '\\/')}\\)$`), '') },
        locations: [{
          physicalLocation: {
            artifactLocation: { uri },
            region: {
              startLine: w.line,
              startColumn: w.column,
              ...(w.endLine ? { endLine: w.endLine } : {}),
              ...(w.endColumn ? { endColumn: w.endColumn } : {}),
            },
          },
        }],
      });
    }
  }
  return JSON.stringify({
    $schema: 'https://json.schemastore.org/sarif-2.1.0.json',
    version: '2.1.0',
    runs: [{
      tool: { driver: { name: 'stylelint', informationUri: 'https://stylelint.io', rules: [...rules.values()] } },
      results: sarifResults,
    }],
  }, null, 2);
}
