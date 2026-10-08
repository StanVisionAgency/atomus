// Small TypeScript-AST helpers shared by the scorers: imports and JSX elements.
import { PACKAGE, TOKENS_PACKAGE, lineOf } from './context.mjs';

/** UI libraries an Atomus answer should not need. */
export const FOREIGN_UI = [
  /^@\/components\/ui(\/|$)/, /^@radix-ui\//, /^@mui\//, /^@chakra-ui\//, /^antd(\/|$)/, /^@mantine\//, /^react-bootstrap(\/|$)/,
  /^@headlessui\//, /^@nextui-org\//, /^@heroui\//, /^daisyui(\/|$)/, /^@shadcn\//, /^semantic-ui-react(\/|$)/, /^primereact(\/|$)/,
];

/** All import declarations: { source, names: [{ imported, local, typeOnly }], line, sideEffect }. */
export function importsOf(ts, sf) {
  const out = [];
  for (const st of sf.statements) {
    if (!ts.isImportDeclaration(st)) continue;
    const source = st.moduleSpecifier.text;
    const names = [];
    const clause = st.importClause;
    if (clause?.name) names.push({ imported: 'default', local: clause.name.text, typeOnly: !!clause.isTypeOnly });
    const nb = clause?.namedBindings;
    if (nb && ts.isNamedImports(nb)) {
      for (const el of nb.elements) names.push({ imported: (el.propertyName ?? el.name).text, local: el.name.text, typeOnly: !!(clause.isTypeOnly || el.isTypeOnly) });
    } else if (nb && ts.isNamespaceImport(nb)) names.push({ imported: '*', local: nb.name.text, typeOnly: !!clause.isTypeOnly });
    out.push({ source, names, line: lineOf(sf, st), sideEffect: !clause });
  }
  return out;
}

/** local name → Atomus export name, and namespace locals (import * as A from '@stanvision/atomus-react'). */
export function atomusBindings(imports) {
  const locals = new Map();
  const namespaces = new Set();
  for (const imp of imports) {
    if (imp.source !== PACKAGE) continue;
    for (const n of imp.names) {
      if (n.imported === '*') namespaces.add(n.local);
      else if (n.imported !== 'default') locals.set(n.local, n.imported);
    }
  }
  return { locals, namespaces };
}

export const isTokensImport = (source) => source === TOKENS_PACKAGE || source.startsWith(`${TOKENS_PACKAGE}/`) || source === `${PACKAGE}/styles.css` || source === `${PACKAGE}/atomus.css`;

/** Every JSX opening / self-closing element: { tag, node, attrs: [{ name, node, value }], spread, line }. */
export function jsxElements(ts, sf) {
  const out = [];
  const visit = (node) => {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(sf);
      const attrs = [];
      let spread = false;
      for (const a of node.attributes.properties) {
        if (ts.isJsxSpreadAttribute(a)) { spread = true; continue; }
        const name = a.name.getText(sf);
        attrs.push({ name, node: a, value: staticValue(ts, a.initializer) });
      }
      out.push({ tag, node, attrs, spread, line: lineOf(sf, node) });
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return out;
}

/** The static value of a JSX attribute: string, number, boolean, or undefined when it is an expression. */
export function staticValue(ts, init) {
  if (!init) return true; // <Button loading />
  if (ts.isStringLiteral(init)) return init.text;
  if (ts.isJsxExpression(init) && init.expression) {
    const e = init.expression;
    if (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e)) return e.text;
    if (ts.isNumericLiteral(e)) return Number(e.text);
    if (e.kind === ts.SyntaxKind.TrueKeyword) return true;
    if (e.kind === ts.SyntaxKind.FalseKeyword) return false;
  }
  return undefined;
}

/** The Atomus export a JSX tag refers to (Button, A.Button), or null. */
export function atomusTag(tag, bindings) {
  if (bindings.locals.has(tag)) return bindings.locals.get(tag);
  const [ns, member] = tag.split('.');
  if (member && bindings.namespaces.has(ns)) return member;
  return null;
}
