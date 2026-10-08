// inline styles and raw colours: `style={…}` attributes in the TSX, and hex / rgb() / hsl() colours in strings,
// class names and the CSS that comes with the output. Atomus code styles with components, classes and tokens.
import { lineOf, parseTsx } from '../context.mjs';

export const id = 'styles';
export const title = 'Inline styles and raw colours';

const COLOR = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])|\b(?:rgba?|hsla?)\(\s*\d/g;
const NOT_STYLE_ATTRS = new Set(['href', 'to', 'id', 'htmlFor', 'src', 'name', 'key']);

const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));

export async function score({ code, css }) {
  const { ts, sf } = await parseTsx(code);
  const issues = [];
  let inline = 0;
  let raw = 0;
  const visit = (node) => {
    if (ts.isJsxAttribute(node) && node.name.getText(sf) === 'style') {
      inline++;
      issues.push({ rule: 'inline-style', severity: 'warning', line: lineOf(sf, node), message: 'Inline style; use Atomus components, classes and tokens.' });
    }
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) {
      const attr = node.parent && ts.isJsxAttribute(node.parent) ? node.parent.name.getText(sf) : null;
      const isImport = node.parent && ts.isImportDeclaration(node.parent);
      if (!isImport && !(attr && (NOT_STYLE_ATTRS.has(attr) || attr.startsWith('aria-')))) {
        for (const m of node.text.matchAll(COLOR)) {
          raw++;
          issues.push({ rule: 'raw-color', severity: 'error', line: lineOf(sf, node), message: `Raw colour ${m[0].replace(/\($/, '(…)')}; use a semantic token (var(--color-…)).` });
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  if (css) {
    const text = stripCssComments(css);
    text.split('\n').forEach((line, i) => {
      // Custom-property definitions (--brand: #…) are token definitions; everything else should use var().
      if (/^\s*--[\w-]+\s*:/.test(line)) return;
      for (const m of line.matchAll(COLOR)) {
        raw++;
        issues.push({ rule: 'raw-color', severity: 'error', line: i + 1, file: 'css', message: `Raw colour ${m[0]} in CSS; use a semantic token.` });
      }
    });
  }
  return { score: Math.max(0, 1 - 0.1 * inline - 0.2 * raw), issues, stats: { inlineStyles: inline, rawColors: raw } };
}
