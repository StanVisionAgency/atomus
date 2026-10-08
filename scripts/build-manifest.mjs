#!/usr/bin/env node
// Builds the Atomus component manifest: packages/manifest/src/** → atomus.manifest.json
// (schema: schemas/manifest.schema.json → schemas/component.schema.json).
//
// One entry per component — every React export of @stanvision/atomus-react and every Figma-only
// component set documented in guidelines/components/*.md — plus the semantic tokens by intent.
//
// Sources (single sources; nothing is typed in by hand here):
//   react/src/index.ts, react/src/components/*.tsx   props, types, enums, defaults, JSDoc (TypeScript compiler API)
//   react/src/components/*.figma.ts                  Figma node ids and Figma property → prop mappings (Code Connect)
//   guidelines/components/*.md                        Figma properties, description, Do / Forbidden
//   guidelines/overview-components.md                 catalogue (purpose, category), "Also called" aliases
//   sites/docs/src/component-pages/*.mdx              usage examples, Do / Don't
//   sites/docs/scripts/component-pages.mjs            docs page of every guideline section
//   tokens/*.tokens.json                              token values and descriptions
//   skills/atomus/references/tokens.md                "Pick by intent" table and group intents
//
//   node scripts/build-manifest.mjs           write packages/manifest/src/** (committed) and atomus.manifest.json
//   node scripts/build-manifest.mjs --check   fail when the committed manifest (packages/manifest/src) is stale
//
// Needs the dev dependencies of packages/manifest (TypeScript, @types/react, Ajv):
//   cd packages/manifest && npm install
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname, relative, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');
const OUT = join(root, 'packages/manifest/atomus.manifest.json');
const DOCS = 'https://docs.atomus.io';
const PKG = '@stanvision/atomus-react';
const SINCE = '4.0.0';

const require = createRequire(join(root, 'packages/manifest/package.json'));
let ts;
try {
  ts = require('typescript');
} catch {
  console.error('build-manifest: TypeScript not found. Run `cd packages/manifest && npm install` first.');
  process.exit(2);
}

const read = (p) => readFileSync(join(root, p), 'utf8');
const rel = (p) => relative(root, p).split('\\').join('/');
const uniq = (a) => [...new Set(a.filter((x) => x != null && x !== ''))];
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
const stripMd = (s) => s.replace(/\*\*/g, '').replace(/`/g, '').trim();
/** camelCase / PascalCase → "Sentence case words" (ButtonIcon → Button icon). */
const words = (s) => s.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase()).replace(/ (\w)/g, (m, c) => ` ${c.toLowerCase()}`);

// ------------------------------------------------------------------ guidelines/components/*.md

/** Parses a guideline file into its "## Section" blocks: description, variants, properties, Do, Forbidden. */
function parseGuideline(file) {
  const src = read(`guidelines/components/${file}.md`);
  const out = [];
  const parts = src.split(/^## /m).slice(1);
  for (const part of parts) {
    const name = part.split('\n')[0].trim();
    if (name === 'React API') continue;
    const body = part.slice(part.indexOf('\n') + 1);
    const paras = body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    const description = paras.find((p) => !p.startsWith('|') && !p.startsWith('**') && !p.startsWith('-') && !/^Variants:/.test(p)) ?? null;
    const variants = Number(body.match(/^Variants:\s*(\d+)/m)?.[1] ?? NaN);
    const properties = [];
    for (const m of body.matchAll(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*$/gm)) {
      const [, prop, type] = m;
      if (prop === 'Property' || /^-+$/.test(prop)) continue;
      const t = type.trim();
      let kind = t;
      let options;
      if (t.includes(' · ')) { kind = 'variant'; options = t.split(' · ').map((x) => x.trim()); }
      else if (/^text/.test(t)) kind = 'text';
      else if (/^boolean/.test(t)) kind = 'boolean';
      else if (/^instance swap/.test(t)) kind = 'instance swap';
      else if (/^slot/.test(t)) kind = 'slot';
      properties.push({ componentSet: name, name: prop.trim(), type: kind === 'variant' ? 'variant' : t, ...(options ? { options } : {}) });
    }
    const list = (label) => {
      const m = body.match(new RegExp(`\\*\\*${label}\\*\\*\\s*\\n\\s*\\n((?:- .*(?:\\n|$))+)`));
      return m ? m[1].split('\n').filter((l) => l.startsWith('- ')).map((l) => l.slice(2).trim()) : [];
    };
    out.push({ file, name, description, variants: Number.isFinite(variants) ? variants : null, properties, do: list('Do'), forbidden: list('Forbidden') });
  }
  return out;
}

const guidelineFiles = readdirSync(join(root, 'guidelines/components')).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, '')).sort();
const sections = guidelineFiles.flatMap(parseGuideline);
const sectionByName = new Map(sections.map((s) => [norm(s.name), s]));

// ------------------------------------------------------------------ overview-components.md

const overview = read('guidelines/overview-components.md');
/** Catalogue rows: { category, names[], purpose, react[], guideline }. */
const catalogue = [];
{
  let category = null;
  for (const line of overview.split('\n')) {
    const h = line.match(/^### (.+)/);
    if (h) { category = h[1].trim(); continue; }
    if (line.startsWith('## ') && !line.startsWith('## Catalogue')) category = category && line.startsWith('## Also') ? null : category;
    if (!category || !line.startsWith('|') || /^\|\s*(Component|---)/.test(line)) continue;
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length < 4) continue;
    const [component, purpose, reactCell, guideline] = cells;
    const names = component.replace(/\(([^)]*)\)/g, ', $1').split(',').map((s) => s.trim()).filter(Boolean);
    const react = [...reactCell.matchAll(/`([A-Za-z]\w*)/g)].map((m) => m[1]);
    catalogue.push({ category: category.replace(/ and /g, ' and '), component, names, purpose: stripMd(purpose), react, guideline: guideline.replace(/`/g, '') });
  }
}
/** "Also called": [alias, target text]. */
const aliasRows = [];
{
  const block = overview.split('## Also called')[1]?.split('\n## ')[0] ?? '';
  for (const line of block.split('\n')) {
    if (!line.startsWith('|') || /^\|\s*(You may hear|---)/.test(line)) continue;
    const [heard, target] = line.split('|').slice(1, -1).map((c) => c.trim());
    aliasRows.push({ heard: heard.split(',').map((s) => s.trim()).filter(Boolean), target });
  }
}

// ------------------------------------------------------------------ docs pages

const { COMPONENT_PAGES } = await import(pathToFileURL(join(root, 'sites/docs/scripts/component-pages.mjs')).href);
const pageOf = (file, name) => COMPONENT_PAGES.find((p) => p.sections.some(([f, n]) => f === file && n === name)) ?? null;
const docsUrl = (page) => (page ? `${DOCS}/components/${page.slug}/` : null);

/** Usage examples and Do / Don't of a hand-written component page. */
function parseComponentPage(slug) {
  const p = join(root, 'sites/docs/src/component-pages', `${slug}.mdx`);
  if (!existsSync(p)) return { examples: [], do: [], dont: [] };
  const src = readFileSync(p, 'utf8');
  const examples = [];
  for (const m of src.matchAll(/```(tsx|jsx|html|css)\n([\s\S]*?)```/g)) {
    const before = src.slice(0, m.index);
    const heading = [...before.matchAll(/^#{2,4} (.+)$/gm)].pop()?.[1]?.trim() ?? 'Usage';
    examples.push({ title: heading, code: m[2].trimEnd(), language: m[1], source: rel(p) });
  }
  const list = (re) => {
    const m = src.match(re);
    return m ? m[1].split('\n').filter((l) => l.startsWith('- ')).map((l) => l.slice(2).trim()) : [];
  };
  return {
    examples,
    do: list(/\*\*Do\*\*\s*\n\s*\n((?:- .*(?:\n|$))+)/),
    dont: list(/\*\*Don[’']t\*\*\s*\n\s*\n((?:- .*(?:\n|$))+)/),
  };
}

// ------------------------------------------------------------------ React: TypeScript compiler API

const srcDir = join(root, 'react/src');
const program = ts.createProgram([join(srcDir, 'index.ts')], {
  jsx: ts.JsxEmit.ReactJSX,
  target: ts.ScriptTarget.ES2020,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  strict: true,
  skipLibCheck: true,
  noEmit: true,
  typeRoots: [join(root, 'packages/manifest/node_modules/@types')],
  types: ['react'],
});
const checker = program.getTypeChecker();
const indexFile = program.getSourceFile(join(srcDir, 'index.ts'));
const moduleSymbol = checker.getSymbolAtLocation(indexFile);
const exportSymbols = checker.getExportsOfModule(moduleSymbol);

const ELEMENT_BY_DOM = { HTMLSpanElement: 'span', HTMLDivElement: 'div', HTMLButtonElement: 'button', HTMLInputElement: 'input', HTMLAnchorElement: 'a', HTMLElement: 'element', SVGSVGElement: 'svg', HTMLSelectElement: 'select', HTMLTextAreaElement: 'textarea' };
const NATIVE_BY_TYPE = {
  ButtonHTMLAttributes: 'button',
  InputHTMLAttributes: 'input',
  AnchorHTMLAttributes: 'a',
  HTMLAttributes: 'element',
  SelectHTMLAttributes: 'select',
  TextareaHTMLAttributes: 'textarea',
};
const docOf = (sym) => ts.displayPartsToString(sym.getDocumentationComment(checker)).replace(/\s+/g, ' ').trim();
const figmaOf = (doc) => doc.match(/Figma:\s*([^.—(),;]+)/)?.[1]?.trim() ?? null;

/** Finds `interface <Name>` declarations reachable from a type alias or interface name. */
function interfaceDecl(name, file) {
  let found = null;
  ts.forEachChild(file, function visit(n) {
    if ((ts.isInterfaceDeclaration(n) || ts.isTypeAliasDeclaration(n)) && n.name.text === name) found = n;
    if (!found) ts.forEachChild(n, visit);
  });
  return found;
}

/** Native element(s) a Props interface extends, and the names it omits. Follows local base interfaces. */
function nativeOf(decl, file, seen = new Set()) {
  const out = { elements: [], omit: [] };
  if (!decl || seen.has(decl)) return out;
  seen.add(decl);
  const bases = [];
  if (ts.isInterfaceDeclaration(decl)) for (const h of decl.heritageClauses ?? []) bases.push(...h.types);
  else if (ts.isTypeAliasDeclaration(decl) && ts.isTypeReferenceNode(decl.type)) bases.push(decl.type);
  for (const b of bases) {
    let expr = ts.isExpressionWithTypeArguments(b) ? b.expression.getText(file) : b.typeName.getText(file);
    let args = b.typeArguments ?? [];
    let omits = [];
    if (expr === 'Omit' && args.length === 2) {
      const omitted = args[1];
      const lits = ts.isUnionTypeNode(omitted) ? omitted.types : [omitted];
      for (const l of lits) if (ts.isLiteralTypeNode(l) && ts.isStringLiteral(l.literal)) omits.push(l.literal.text);
      const inner = args[0];
      expr = inner.typeName?.getText(file) ?? inner.getText(file);
      args = inner.typeArguments ?? [];
    }
    const dom = args[0]?.getText(file);
    if (NATIVE_BY_TYPE[expr] || expr === 'SVGProps') {
      out.elements.push(expr === 'HTMLAttributes' || expr === 'SVGProps' ? ELEMENT_BY_DOM[dom] ?? 'element' : NATIVE_BY_TYPE[expr]);
      out.omit.push(...omits);
    } else {
      const local = interfaceDecl(expr, file);
      if (local) {
        const sub = nativeOf(local, file, seen);
        out.elements.push(...sub.elements);
        out.omit.push(...sub.omit);
      }
    }
  }
  return { elements: uniq(out.elements), omit: uniq(out.omit) };
}

/** Default values from the component's destructured first parameter. */
function defaultsOf(decl, file) {
  let fn = null;
  if (ts.isFunctionDeclaration(decl)) fn = decl;
  else if (ts.isVariableDeclaration(decl) && decl.initializer) {
    let init = decl.initializer;
    while (ts.isCallExpression(init)) {
      const arg = init.arguments[0];
      if (arg && (ts.isFunctionExpression(arg) || ts.isArrowFunction(arg))) { fn = arg; break; }
      if (arg && ts.isCallExpression(arg)) init = arg; else break;
    }
    if (!fn && (ts.isArrowFunction(init) || ts.isFunctionExpression(init))) fn = init;
  }
  const out = {};
  const p = fn?.parameters[0]?.name;
  if (p && ts.isObjectBindingPattern(p)) {
    for (const el of p.elements) {
      if (!el.initializer || el.dotDotDotToken) continue;
      const key = (el.propertyName ?? el.name).getText(file);
      out[key] = el.initializer.getText(file);
    }
  }
  return { defaults: out, fn };
}

/** Literal values of a type node in source order (follows local type aliases). */
function syntacticValues(node, depth = 0) {
  if (!node || depth > 5) return [];
  if (ts.isUnionTypeNode(node)) return node.types.flatMap((t) => syntacticValues(t, depth + 1));
  if (ts.isParenthesizedTypeNode(node)) return syntacticValues(node.type, depth + 1);
  if (ts.isLiteralTypeNode(node)) return ts.isStringLiteral(node.literal) ? [node.literal.text] : ts.isNumericLiteral(node.literal) ? [Number(node.literal.text)] : [];
  if (ts.isTypeOperatorNode(node) && node.operator === ts.SyntaxKind.KeyOfKeyword) return checker.getPropertiesOfType(checker.getTypeFromTypeNode(node.type)).map((p) => p.name);
  if (ts.isTypeReferenceNode(node)) {
    let sym = checker.getSymbolAtLocation(node.typeName);
    if (sym && sym.flags & ts.SymbolFlags.Alias) sym = checker.getAliasedSymbol(sym);
    const d = sym?.declarations?.find((x) => ts.isTypeAliasDeclaration(x));
    return d ? syntacticValues(d.type, depth + 1) : [];
  }
  return [];
}
const orderLike = (vals, node) => {
  const order = syntacticValues(node);
  if (!vals || order.length !== vals.length || !vals.every((v) => order.includes(v))) return vals;
  return order;
};
const literalValues = (type) => {
  const parts = type.isUnion() ? type.types : [type];
  const vals = [];
  for (const t of parts) {
    if (t.flags & ts.TypeFlags.Undefined || t.flags & ts.TypeFlags.Null) continue;
    if (t.isStringLiteral() || t.isNumberLiteral()) vals.push(t.value);
    else return null;
  }
  return vals.length ? vals : null;
};
const parseDefault = (s) => {
  if (s == null) return null;
  if (/^'.*'$|^".*"$/.test(s)) return s.slice(1, -1);
  if (s === 'true' || s === 'false') return s === 'true';
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  return s;
};

const reactExports = [];
const declaredIn = new Map();
const typeExports = exportSymbols.filter((sym) => {
  const t = sym.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(sym) : sym;
  return !(t.flags & (ts.SymbolFlags.Function | ts.SymbolFlags.Variable));
}).map((s) => s.name);
for (const sym of exportSymbols) {
  const target = sym.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(sym) : sym;
  if (!(target.flags & (ts.SymbolFlags.Function | ts.SymbolFlags.Variable))) continue; // types are not entries
  const decl = target.valueDeclaration;
  const file = decl.getSourceFile();
  const name = sym.name;
  const isHook = /^use[A-Z]/.test(name);
  // No JSDoc on the export: fall back to a module header comment (the first JSDoc, before any export).
  const header = file.getFullText().match(/^(?:(?!\bexport\b)[\s\S])*?\/\*\*([\s\S]*?)\*\//)?.[1] ?? '';
  const doc = docOf(target) || header.split('\n').map((l) => l.replace(/^\s*\*\s?/, '')).join(' ').replace(/\s+/g, ' ').trim();
  const entry = { name, kind: isHook ? 'hook' : 'component', file: rel(file.fileName), doc, props: {}, native: { elements: [], omit: [], ref: false } };
  if (!isHook) {
    const { defaults, fn } = defaultsOf(decl, file);
    // Props type: the declared type of the first parameter (function), or the forwardRef type argument.
    let propsTypeName = null;
    if (fn?.parameters[0]?.type) propsTypeName = fn.parameters[0].type.getText(file);
    if (ts.isVariableDeclaration(decl) && ts.isCallExpression(decl.initializer) && decl.initializer.typeArguments?.length === 2) {
      propsTypeName = decl.initializer.typeArguments[1].getText(file);
      entry.native.ref = true;
    }
    if (!propsTypeName) propsTypeName = `${name}Props`;
    const propsDecl = interfaceDecl(propsTypeName.replace(/<.*$/, ''), file);
    if (propsDecl) {
      const native = nativeOf(propsDecl, file);
      entry.native.elements = native.elements;
      entry.native.omit = native.omit;
      const type = checker.getTypeAtLocation(propsDecl.name);
      for (const prop of checker.getPropertiesOfType(type)) {
        const pdecl = prop.declarations?.[0];
        if (!pdecl || !pdecl.getSourceFile().fileName.startsWith(srcDir)) continue; // inherited native attribute
        const ptype = checker.getTypeOfSymbolAtLocation(prop, pdecl);
        const values = orderLike(literalValues(ptype), pdecl.type);
        const pdoc = docOf(prop);
        const typeText = values ? values.map((v) => (typeof v === 'string' ? `'${v}'` : String(v))).join(' | ') : (pdecl.type ? pdecl.type.getText(pdecl.getSourceFile()) : checker.typeToString(ptype));
        entry.props[prop.name] = {
          type: typeText,
          ...(values ? { values } : {}),
          default: parseDefault(defaults[prop.name]),
          required: !(prop.flags & ts.SymbolFlags.Optional),
          figma: figmaOf(pdoc),
          notes: pdoc || null,
        };
        declaredIn.set(`${name}.${prop.name}`, pdecl.parent?.name?.text ?? null);
      }
    }
  }
  reactExports.push(entry);
}

// Props inherited from another component's Props interface (DatePicker extends CalendarProps) and passed
// through to it take that component's defaults.
for (const ex of reactExports) {
  for (const [pname, p] of Object.entries(ex.props)) {
    if (p.default != null) continue;
    const owner = declaredIn.get(`${ex.name}.${pname}`)?.replace(/Props$/, '');
    const from = owner && owner !== ex.name ? reactExports.find((e) => e.name === owner) : null;
    if (from?.props[pname]?.default != null) p.default = from.props[pname].default;
  }
}

// ------------------------------------------------------------------ Code Connect (*.figma.ts)

function parseFigmaFile(path) {
  const text = readFileSync(path, 'utf8');
  const header = Object.fromEntries([...text.matchAll(/^\/\/ (url|source|component)=(.+)$/gm)].map((m) => [m[1], m[2].trim()]));
  const sf = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const vars = new Map();
  let id = null;
  const mappings = [];
  let staticProps = '';

  const str = (n) => (n && (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) ? n.text : null);
  const objMap = (n) => {
    if (!n || !ts.isObjectLiteralExpression(n)) return null;
    const o = {};
    for (const p of n.properties) if (ts.isPropertyAssignment(p)) {
      const v = p.initializer;
      o[p.name.getText(sf).replace(/^['"]|['"]$/g, '')] = str(v) ?? (v.kind === ts.SyntaxKind.TrueKeyword ? true : v.kind === ts.SyntaxKind.FalseKeyword ? false : v.getText(sf));
    }
    return o;
  };
  /** instance.getX('Prop', …) → { method, figma, map } */
  const instanceCall = (n) => {
    if (!n || !ts.isCallExpression(n) || !ts.isPropertyAccessExpression(n.expression)) return null;
    const method = n.expression.name.text;
    if (!/^get(Enum|String|Boolean|InstanceSwap|Slot)$/.test(method)) return null;
    return { method, figma: str(n.arguments[0]), map: objMap(n.arguments[1]) };
  };
  const unwrap = (n) => { while (n && (ts.isParenthesizedExpression(n) || ts.isAsExpression(n) || ts.isNonNullExpression(n))) n = n.expression; return n; };

  /** Describes how a JSX prop is computed from Figma properties. */
  function describe(prop, expr) {
    expr = unwrap(expr);
    const call = instanceCall(expr);
    if (call) {
      if (call.method === 'getEnum') return { figma: call.figma, prop, kind: 'enum', values: call.map ?? {} };
      if (call.method === 'getString') return { figma: call.figma, prop, kind: 'text' };
      if (call.method === 'getBoolean') return { figma: call.figma, prop, kind: 'boolean' };
      if (call.method === 'getInstanceSwap' || call.method === 'getSlot') return { figma: call.figma, prop, kind: 'instance' };
    }
    if (ts.isIdentifier(expr) && vars.has(expr.text)) {
      const v = vars.get(expr.text);
      return v ? { ...v, prop } : null;
    }
    if (ts.isBinaryExpression(expr) && expr.operatorToken.kind === ts.SyntaxKind.EqualsEqualsEqualsToken) {
      const id = unwrap(expr.left);
      const val = str(expr.right);
      const v = ts.isIdentifier(id) ? vars.get(id.text) : null;
      if (v?.kind === 'enum' && val != null) {
        const when = Object.entries(v.values).find(([, x]) => x === val)?.[0];
        if (when) return { figma: v.figma, prop, kind: 'flag', when };
      }
    }
    if (ts.isConditionalExpression(expr)) {
      const cond = instanceCall(unwrap(expr.condition));
      const whenTrue = describe(prop, expr.whenTrue);
      if (cond?.method === 'getBoolean' && whenTrue && whenTrue.kind !== 'expression') return { ...whenTrue, visibleWhen: cond.figma };
      if (cond?.method === 'getBoolean' && whenTrue?.kind === 'expression' && whenTrue.figma) return { ...whenTrue, visibleWhen: cond.figma };
      if (cond?.method === 'getBoolean') return { figma: cond.figma, prop, kind: 'boolean', notes: 'Rendered when the Figma boolean is on.' };
    }
    // Look for any instance call inside (e.g. icon swaps rendered through executeTemplate).
    let inner = null;
    (function find(n) {
      if (inner) return;
      const c = instanceCall(n);
      if (c) { inner = c; return; }
      if (ts.isIdentifier(n) && vars.get(n.text)?.kind === 'instance') { inner = { method: 'getInstanceSwap', figma: vars.get(n.text).figma }; return; }
      ts.forEachChild(n, find);
    })(expr);
    if (inner) return { figma: inner.figma, prop, kind: inner.method === 'getInstanceSwap' ? 'instance' : 'expression', notes: expr.getText(sf).replace(/\s+/g, ' ').slice(0, 160) };
    return null;
  }

  function visit(n) {
    if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.initializer) {
      const init = unwrap(n.initializer);
      const call = instanceCall(init);
      if (call?.method === 'getEnum') vars.set(n.name.text, { figma: call.figma, kind: 'enum', values: call.map ?? {} });
      else if (call?.method === 'getString') vars.set(n.name.text, { figma: call.figma, kind: 'text' });
      else if (call?.method === 'getBoolean') vars.set(n.name.text, { figma: call.figma, kind: 'boolean' });
      else if (call?.method === 'getInstanceSwap') vars.set(n.name.text, { figma: call.figma, kind: 'instance' });
      else if (ts.isConditionalExpression(init)) {
        const cond = instanceCall(unwrap(init.condition));
        const inner = describe('_', init.whenTrue);
        if (cond?.method === 'getBoolean' && inner) vars.set(n.name.text, { ...inner, figma: inner.figma ?? cond.figma, visibleWhen: cond.figma });
      }
    }
    if (ts.isPropertyAssignment(n) && n.name.getText(sf) === 'id' && str(n.initializer)) id = str(n.initializer);
    if (ts.isCallExpression(n) && n.expression.getText(sf).endsWith('renderProp')) {
      const prop = str(n.arguments[0]);
      const d = prop ? describe(prop, n.arguments[1]) : null;
      if (d) mappings.push(d);
      else if (prop) mappings.push({ figma: '(computed)', prop, kind: 'expression', notes: n.arguments[1]?.getText(sf).replace(/\s+/g, ' ').slice(0, 160) });
    }
    // `${instance.getBoolean('Close') ? ' onClose={() => {}}' : ''}` and `${instance.getBoolean('X') ? '' : ' attr={false}'}`
    if (ts.isConditionalExpression(n)) {
      const cond = instanceCall(unwrap(n.condition));
      const t = str(unwrap(n.whenTrue));
      const f = str(unwrap(n.whenFalse));
      const attr = (s) => s?.trim().match(/^([A-Za-z][\w-]*)(=.*)?$/);
      if (cond?.method === 'getBoolean' && (attr(t) || attr(f)) && !(t === '' && f === '')) {
        const a = attr(t) ?? attr(f);
        mappings.push({ figma: cond.figma, prop: a[1], kind: 'boolean', ...(t ? { whenTrue: t.trim() } : {}), ...(f ? { whenFalse: f.trim() } : {}) });
      }
    }
    if (ts.isTaggedTemplateExpression(n) && n.tag.getText(sf).endsWith('tsx') && ts.isTemplateExpression(n.template)) {
      const headText = n.template.head.text;
      const open = headText.match(/^\s*<[A-Z]\w*([\s\S]*)$/);
      if (open && !staticProps) {
        // Attributes up to the end of the opening tag (a ">" outside braces).
        let depth = 0, end = open[1].length;
        for (let i = 0; i < open[1].length; i++) {
          const c = open[1][i];
          if (c === '{') depth++;
          else if (c === '}') depth--;
          else if (c === '>' && depth === 0) { end = i; break; }
        }
        staticProps = open[1].slice(0, end).replace(/\s+/g, ' ').trim();
      }
      // Children: a getString call (or a text variable) placed between the tags, not inside renderProp.
      for (const span of n.template.templateSpans) {
        const before = span === n.template.templateSpans[0] ? headText : null;
        const e = unwrap(span.expression);
        const lit = span.literal.text;
        if (/^<\/[A-Z]/.test(lit)) {
          const d = describe('children', e);
          if (d && d.kind !== 'expression' && !mappings.some((m) => m.prop === 'children')) mappings.push(d);
          else if (!d && ts.isConditionalExpression(e)) {
            const dd = describe('children', e);
            if (dd) mappings.push(dd);
          }
        }
        void before;
      }
    }
    ts.forEachChild(n, visit);
  }
  visit(sf);
  const nodeId = header.url?.match(/node-id=(\d+)-(\d+)/);
  const fileKey = header.url?.match(/figma\.com\/design\/([^/]+)/)?.[1] ?? null;
  // Drop duplicates (a prop described twice) — keep the first, most specific description.
  const seen = new Set();
  const unique = mappings.filter((m) => { const k = `${m.prop}|${m.figma}|${m.kind}`; if (seen.has(k)) return false; seen.add(k); return true; });
  return {
    file: rel(path),
    component: header.component,
    id: id ?? basename(path).replace(/\.figma\.ts$/, ''),
    nodeId: nodeId ? `${nodeId[1]}:${nodeId[2]}` : null,
    fileKey,
    staticProps: staticProps.replace(/\s*[\w-]+=["']?[^"'\s]*$/, (m) => (/=["'][^"']*["']$/.test(m) ? m : '')).trim(),
    mappings: unique,
  };
}

const figmaFiles = readdirSync(join(srcDir, 'components')).filter((f) => f.endsWith('.figma.ts')).sort().map((f) => parseFigmaFile(join(srcDir, 'components', f)));

/** Code Connect id (ButtonIcon, TableCell) → Figma component set (guideline section) name. */
function sectionForId(id) {
  const w = words(id);
  return sectionByName.get(norm(w)) ?? sections.find((s) => norm(s.name).startsWith(norm(w))) ?? null;
}

// Guideline sections that belong to a React export but have no Code Connect file of their own.
const EXTRA_SECTIONS = { Card: ['Card header', 'Section footer'], Tabs: ['Tab'], DropdownMenu: ['Context menu'], DatePicker: ['Date input'] };

// ------------------------------------------------------------------ assemble components

const usedSections = new Set();
const components = [];
const catalogueByName = (names) => catalogue.find((row) => names.some((n) => row.names.some((x) => norm(x) === norm(n)))) ?? null;
const catalogueFor = (names) => catalogueByName(names) ?? catalogue.find((row) => names.some((n) => row.react.includes(n))) ?? null;
const aliasesFor = (names) => {
  const keys = names.map(norm);
  const out = [];
  for (const row of aliasRows) {
    const targets = row.target.split(' / ').map((t) => t.replace(/`[^`]*`/g, '').replace(/\(.*?\)/g, '').split('.')[0].trim());
    if (targets.some((t) => keys.includes(norm(t)))) out.push(...row.heard);
  }
  return uniq(out);
};
const A11Y = /\b(aria|label|accessib|keyboard|focus|contrast|screen reader|tooltip|alt text|colour alone|color alone)/i;

for (const ex of reactExports) {
  const ccFiles = figmaFiles.filter((f) => f.component === ex.name);
  const nodes = ccFiles.map((f) => {
    const sec = sectionForId(f.id);
    return { componentSet: sec?.name ?? words(f.id), nodeId: f.nodeId, codeConnectId: f.id, ...(f.staticProps ? { staticProps: f.staticProps } : {}), mappings: f.mappings };
  }).filter((n) => n.nodeId);
  // Figma component sets: Code Connect targets, sections named like the export, and the known extras.
  const secNames = uniq([
    ...nodes.map((n) => n.componentSet),
    sectionByName.get(norm(words(ex.name)))?.name,
    ...(EXTRA_SECTIONS[ex.name] ?? []),
  ]).filter((n) => sectionByName.has(norm(n)));
  const secs = secNames.map((n) => sectionByName.get(norm(n)));
  secs.forEach((s) => usedSections.add(s));
  const pages = uniq(secs.map((s) => pageOf(s.file, s.name)?.slug)).map((slug) => COMPONENT_PAGES.find((p) => p.slug === slug));
  const pageData = pages.map((p) => parseComponentPage(p.slug));
  const examples = pageData.flatMap((d) => d.examples).filter((e) => e.code.includes(`<${ex.name}`) || e.code.includes(`${ex.name}(`) || (ex.kind === 'hook' && e.code.includes(ex.name)));
  const row = catalogueFor([ex.name, ...secNames]);
  const isRealComponent = ex.kind === 'hook' || nodes.length > 0 || secs.length > 0 || row;
  const named = catalogueByName([ex.name, words(ex.name), ...secNames]);
  const purpose = named?.purpose ?? (ex.doc || null) ?? row?.purpose ?? secs[0]?.description ?? `${ex.name} from ${PKG}.`;
  const a11yNotes = uniq([
    ...Object.entries(ex.props).filter(([, p]) => p.notes && A11Y.test(p.notes)).map(([n, p]) => `\`${n}\`: ${p.notes}`),
    ...secs.flatMap((s) => [...s.do, ...s.forbidden]).filter((r) => A11Y.test(r)),
    ...pageData.flatMap((d) => [...d.do, ...d.dont]).filter((r) => A11Y.test(r)),
  ]);
  const elements = ex.native.elements;
  const ROLE = { Modal: 'dialog', Tabs: 'tablist', Table: 'table', SidebarNavigation: 'navigation', NavItem: 'a', Alert: 'status / alert', Toast: 'status / alert', DropdownMenu: 'menu', MenuItem: 'menuitem', Select: 'listbox', Calendar: 'grid', DatePicker: 'dialog', ProgressBar: 'progressbar', Card: 'section', AppHeader: 'header' };
  components.push({
    name: ex.name,
    kind: ex.kind,
    status: 'stable',
    since: SINCE,
    category: row?.category ?? null,
    import: `import { ${ex.name} } from '${PKG}';`,
    source: ex.file,
    purpose,
    description: secs[0]?.description ?? (ex.doc || null),
    aliases: aliasesFor([ex.name, ...secNames]),
    alternative: null,
    native: ex.native,
    props: ex.props,
    rules: {
      do: uniq([...secs.flatMap((s) => s.do.map((r) => (secs.length > 1 ? `${s.name}: ${r}` : r))), ...pageData.flatMap((d) => d.do)]),
      dont: uniq(pageData.flatMap((d) => d.dont)),
      forbidden: uniq(secs.flatMap((s) => s.forbidden.map((r) => (secs.length > 1 ? `${s.name}: ${r}` : r)))),
    },
    examples: examples.map(({ title, code, language, source }) => ({ title, code, language, source })),
    figma: {
      componentSet: secNames,
      fileKey: ccFiles[0]?.fileKey ?? null,
      nodeIds: nodes.map((n) => n.nodeId),
      nodes,
      codeConnect: nodes.length > 0,
      variants: secs.reduce((n, s) => n + (s.variants ?? 0), 0) || null,
      properties: secs.flatMap((s) => s.properties),
      docs: docsUrl(pages[0]),
    },
    docs: docsUrl(pages[0]),
    related: [],
    a11y: {
      element: ROLE[ex.name] ?? (elements.length ? elements[0] : null),
      requiresLabel: /^(Input|Select|Checkbox|Radio|Toggle|DatePicker|Tabs|SidebarNavigation|Table|Button)$/.test(ex.name),
      notes: a11yNotes,
    },
    _files: uniq(secs.map((s) => s.file)),
    _pages: pages.map((p) => p.slug),
    _internal: !isRealComponent,
  });
}

// Figma-only: every guideline section that no React export covers.
const closestByFile = {};
for (const row of catalogue) closestByFile[row.guideline] ??= row;
for (const s of sections) {
  if (usedSections.has(s)) continue;
  const page = pageOf(s.file, s.name);
  const row = catalogueFor([s.name]);
  const props = {};
  for (const p of s.properties) {
    props[p.name] = {
      type: p.type,
      ...(p.options ? { values: p.options } : {}),
      default: p.type.match(/\((on|off)\)/) ? p.type.includes('(on)') : null,
      required: false,
      figma: p.name,
      notes: null,
    };
  }
  const pageInfo = page ? parseComponentPage(page.slug) : { do: [], dont: [] };
  components.push({
    name: s.name,
    kind: 'component',
    status: 'figma-only',
    since: SINCE,
    category: row?.category ?? closestByFile[`components/${s.file}.md`]?.category ?? page?.category.replace(/&/g, 'and') ?? null,
    import: null,
    source: `guidelines/components/${s.file}.md`,
    purpose: row?.purpose ?? s.description ?? s.name,
    description: s.description,
    aliases: aliasesFor([s.name]),
    alternative: null, // filled below from the React API notes
    props,
    rules: { do: s.do, dont: uniq(pageInfo.dont), forbidden: s.forbidden },
    examples: [],
    figma: {
      componentSet: [s.name],
      fileKey: null,
      nodeIds: [],
      nodes: [],
      codeConnect: false,
      variants: s.variants,
      docs: docsUrl(page),
    },
    docs: docsUrl(page),
    related: [],
    a11y: { element: null, requiresLabel: false, notes: uniq([...s.do, ...s.forbidden].filter((r) => A11Y.test(r))) },
    _files: [s.file],
    _pages: page ? [page.slug] : [],
  });
}

// "What to use in code instead" for Figma-only components: the note in the guideline's generated React API section.
for (const c of components) {
  if (c.status !== 'figma-only') continue;
  const api = (read(c.source).split('<!-- react-api:start')[1] ?? '').split('<!-- react-api:end')[0];
  const notYet = api.match(/\*\*Not in React yet:\*\*\s*([^\n]+)/);
  if (notYet) { c.alternative = notYet[1].trim(); continue; }
  const paras = api.split(/\n\s*\n/).slice(1).map((p) => p.trim()).filter((p) => p && !p.startsWith('No React component yet') && !p.startsWith('|') && !p.startsWith('Package') && !p.startsWith('###'));
  c.alternative = paras.length ? paras.join(' ').replace(/\s+/g, ' ') : null;
}

// Related: same guideline file or same docs page, React exports first.
for (const c of components) {
  const rel2 = components.filter((o) => o !== c && !o._internal && (o._files.some((f) => c._files.includes(f)) || o._pages.some((p) => c._pages.includes(p))));
  c.related = uniq(rel2.sort((a, b) => (a.status === 'figma-only') - (b.status === 'figma-only')).map((o) => o.name));
}
for (const c of components) { delete c._files; delete c._pages; delete c._internal; }

// Stable order: React exports in index order, then Figma-only by guideline file and section order.
// (Already in that order.)

// ------------------------------------------------------------------ tokens

const loadTok = (f) => JSON.parse(read(`tokens/${f}`));
function flatten(tree) {
  const list = [];
  (function walk(o, path) {
    for (const [k, v] of Object.entries(o)) {
      if (k.startsWith('$')) continue;
      if (v && typeof v === 'object' && '$value' in v) {
        const fig = v.$extensions?.['com.figma'] ?? {};
        const css = fig.codeSyntax?.WEB?.match(/var\((--[\w-]+)\)/)?.[1] ?? null;
        list.push({ path: [...path, k].join('.'), value: v.$value, type: v.$type, cssVar: css, figma: fig.variable ?? null, description: v.$description ?? '' });
      } else if (v && typeof v === 'object') walk(v, [...path, k]);
    }
  })(tree, []);
  return list;
}
function resolver(...sets) {
  const byPath = new Map(sets.flat().map((t) => [t.path, t]));
  const resolve = (v, depth = 0) => {
    if (typeof v !== 'string') return v;
    const m = v.match(/^\{([^}]+)\}$/);
    if (!m) return v;
    const t = byPath.get(m[1]);
    if (!t || depth > 10) return v;
    return resolve(t.value, depth + 1);
  };
  return resolve;
}
const fmt = (v) => {
  if (v && typeof v === 'object' && 'value' in v) return `${v.value}${v.unit ?? ''}`;
  if (Array.isArray(v)) return v.map((s) => (s && typeof s === 'object' ? [fmt(s.offsetX), fmt(s.offsetY), fmt(s.blur), fmt(s.spread), s.color].join(' ') : String(s))).join(', ');
  return typeof v === 'object' ? JSON.stringify(v) : String(v);
};
const primitives = flatten(loadTok('primitives.tokens.json'));
const brand = flatten(loadTok('brand.atomus.tokens.json'));
const light = flatten(loadTok('color.light.tokens.json'));
const dark = flatten(loadTok('color.dark.tokens.json'));
const resolveLight = resolver(primitives, brand, light);
const resolveDark = resolver(primitives, brand, dark);
const darkByVar = new Map(dark.map((t) => [t.cssVar, t]));

const twCss = read('tailwind/atomus.tailwind.css');
const tw = new Map();
for (const m of twCss.matchAll(/@utility ([\w-]+) \{[^}]*var\((--[\w-]+)\)/g)) tw.set(m[2], [...(tw.get(m[2]) ?? []), m[1]]);
for (const m of twCss.matchAll(/^\s*--shadow-([\w-]+):\s*var\((--shadow-[\w-]+)\)/gm)) tw.set(m[2], [...(tw.get(m[2]) ?? []), `shadow-${m[1]}`]);
// Theme-namespace utilities: --spacing-xl → p-xl, gap-xl …; --radius-md → rounded-md.
const themeVars = new Set([...twCss.matchAll(/^\s*(--(?:spacing|radius)-[\w-]+):/gm)].map((m) => m[1]));

const semantic = light.filter((t) => t.cssVar && t.type === 'color').map((t) => {
  const d = darkByVar.get(t.cssVar);
  return {
    name: t.cssVar,
    group: t.path.split('.')[0],
    light: fmt(resolveLight(t.value)),
    dark: d ? fmt(resolveDark(d.value)) : null,
    description: t.description,
    tailwind: tw.get(t.cssVar) ?? [],
    figma: t.figma,
  };
});
const semanticVars = new Set(semantic.map((t) => t.name));
const primitiveColors = Object.fromEntries(
  [...primitives, ...brand]
    .filter((t) => t.type === 'color' && t.cssVar && !semanticVars.has(t.cssVar))
    .map((t) => [t.cssVar, fmt(resolveLight(t.value))]),
);

function modeTokens(files, modes) {
  const sets = files.map((f) => flatten(loadTok(f)));
  const res = sets.map((s) => resolver(primitives, s));
  return sets[0].filter((t) => t.cssVar).map((t) => ({
    name: t.cssVar,
    values: Object.fromEntries(modes.map((mode, i) => [mode, fmt(res[i](sets[i].find((x) => x.cssVar === t.cssVar)?.value))])),
    description: t.description,
    tailwind: themeVars.has(t.cssVar) ? [t.cssVar.replace(/^--spacing-/, '{p,m,gap}-').replace(/^--radius-/, 'rounded-')] : [],
    figma: t.figma,
  }));
}
const spacing = modeTokens(['spacing-layout.desktop.tokens.json', 'spacing-layout.tablet.tokens.json', 'spacing-layout.mobile.tokens.json'], ['desktop', 'tablet', 'mobile']);
const radius = modeTokens(['radius.default.tokens.json', 'radius.sharp.tokens.json', 'radius.round.tokens.json'], ['default', 'sharp', 'round']);
const effLight = flatten(loadTok('effects.light.tokens.json'));
const effDark = flatten(loadTok('effects.dark.tokens.json'));
const shadows = effLight.map((t) => {
  const name = t.cssVar ?? `--${t.path.replace(/\./g, '-')}`;
  const d = effDark.find((x) => x.path === t.path);
  return { name, values: { light: fmt(t.value), dark: fmt(d?.value ?? t.value) }, description: t.description, tailwind: tw.get(name) ?? [], figma: t.figma };
});
const atomusCss = read('css/atomus.css');
const textStyles = uniq([...atomusCss.matchAll(/^\.(text-[\w-]+)\s*\{/gm)].map((m) => m[1]));

// Intents and group intents from the token reference.
const tokensMd = read('skills/atomus/references/tokens.md');
const intents = [];
for (const line of (tokensMd.split('## Pick by intent')[1] ?? '').split('\n## ')[0].split('\n')) {
  const m = line.match(/^\|\s*([^|]+?)\s*\|\s*(`--[^|]+)\|\s*$/);
  if (m) intents.push({ intent: m[1], tokens: [...m[2].matchAll(/`(--[\w-]+)`/g)].map((x) => x[1]) });
}
const GROUP_KEYS = { Text: 'text', Background: 'background', Border: 'border', Foreground: 'foreground', Gradient: 'gradient', 'Component tokens': 'components' };
const groups = {};
for (const [title, key] of Object.entries(GROUP_KEYS)) {
  const block = tokensMd.split(`\n## ${title}\n`)[1];
  if (!block) continue;
  const intent = block.trim().split('\n\n')[0].trim();
  groups[key] = { title, intent };
}
const tokenRules = (tokensMd.match(/^\*\*Rules:\*\*\s*(.+)$/m)?.[1] ?? '').split(/(?<=\.)\s+/).filter(Boolean).map((r) => r[0].toUpperCase() + r.slice(1));
const spacingNote = tokensMd.split('\n').find((l) => l.startsWith('Spacing: `--spacing-*`'));
if (spacingNote) tokenRules.push(...spacingNote.split(/(?<=\.)\s+/));

// ------------------------------------------------------------------ write / check

const reactPkg = JSON.parse(read('react/package.json'));
const manifest = {
  $schema: './schemas/manifest.schema.json',
  name: 'Atomus',
  version: reactPkg.version,
  package: PKG,
  tokensPackage: '@stanvision/atomus-tokens',
  generatedFrom: [
    'react/src/index.ts',
    'react/src/components/*.tsx',
    'react/src/components/*.figma.ts',
    'guidelines/components/*.md',
    'guidelines/overview-components.md',
    'sites/docs/src/component-pages/*.mdx',
    'tokens/*.tokens.json',
  ],
  docs: `${DOCS}/`,
  exports: { values: reactExports.map((e) => e.name), types: typeExports },
  components,
  tokens: {
    rules: tokenRules,
    intents,
    groups,
    semantic,
    spacing,
    radius,
    shadows,
    textStyles,
    primitives: primitiveColors,
  },
};

// Validate against the JSON Schema (2020-12).
const Ajv2020 = require('ajv/dist/2020').default;
const ajv = new Ajv2020({ allErrors: true, strict: true, allowUnionTypes: true });
ajv.addSchema(JSON.parse(read('schemas/component.schema.json')));
const validate = ajv.compile(JSON.parse(read('schemas/manifest.schema.json')));
if (!validate(manifest)) {
  console.error('build-manifest: the manifest does not match schemas/manifest.schema.json:');
  for (const e of validate.errors.slice(0, 20)) console.error(`  ${e.instancePath} ${e.message} ${JSON.stringify(e.params)}`);
  process.exit(1);
}

// Sanity checks that keep the manifest honest.
const problems = [];
for (const c of components) {
  if (c.status === 'figma-only' && c.import) problems.push(`${c.name}: figma-only entries have no import`);
  if (c.status !== 'figma-only' && c.kind === 'component' && !c.figma.componentSet.length && !['Icon', 'ToastProvider'].includes(c.name)) problems.push(`${c.name}: no Figma component set found`);
  for (const n of c.figma.nodes) for (const m of n.mappings) if (m.prop !== 'children' && !c.props[m.prop] && !(c.native?.elements.length)) problems.push(`${c.name}: Code Connect maps unknown prop ${m.prop}`);
}
if (problems.length) {
  console.error(`build-manifest:\n  ${problems.join('\n  ')}`);
  process.exit(1);
}

// The manifest is committed as small parts under packages/manifest/src (one file per component, one per token
// section, index.json for the rest): readable diffs per component. packages/manifest/scripts/assemble.mjs joins
// them into atomus.manifest.json (the published file, built by `npm run build` / prepack and gitignored).
const { assemble, partsOf, stringify } = await import(pathToFileURL(join(root, 'packages/manifest/scripts/assemble.mjs')).href);
const parts = partsOf(manifest);
const SRC = join(root, 'packages/manifest/src');
const summary = `${components.filter((c) => c.status !== 'figma-only').length} React exports, ${components.filter((c) => c.status === 'figma-only').length} Figma-only components, ${semantic.length} semantic colour tokens`;
const listJson = (dir) => (existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.json')) : []);
if (CHECK) {
  const stale = [];
  for (const [file, value] of Object.entries(parts)) {
    const p = join(SRC, file);
    if (!existsSync(p) || readFileSync(p, 'utf8') !== stringify(value)) stale.push(file);
  }
  for (const dir of ['components', 'tokens']) for (const f of listJson(join(SRC, dir))) if (!parts[`${dir}/${f}`]) stale.push(`${dir}/${f} (no longer generated)`);
  if (JSON.stringify(assemble(SRC)) !== JSON.stringify(manifest)) stale.push('(assembled manifest differs)');
  if (stale.length) {
    console.error(`build-manifest: packages/manifest/src is stale: ${stale.slice(0, 10).join(', ')}${stale.length > 10 ? ' …' : ''}. Run \`node scripts/build-manifest.mjs\` and commit the result.`);
    process.exit(1);
  }
  console.log(`build-manifest: packages/manifest/src is up to date (${summary}).`);
} else {
  for (const dir of ['components', 'tokens']) for (const f of listJson(join(SRC, dir))) if (!parts[`${dir}/${f}`]) rmSync(join(SRC, dir, f));
  for (const [file, value] of Object.entries(parts)) {
    mkdirSync(dirname(join(SRC, file)), { recursive: true });
    writeFileSync(join(SRC, file), stringify(value));
  }
  writeFileSync(OUT, `${JSON.stringify(assemble(SRC), null, 2)}\n`);
  console.log(`build-manifest: wrote packages/manifest/src (${Object.keys(parts).length} files) and ${rel(OUT)} (${summary}).`);
}
