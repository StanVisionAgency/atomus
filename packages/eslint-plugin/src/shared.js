// Shared data and helpers for the Atomus ESLint rules. The data comes from the Atomus manifest
// (@stanvision/atomus-manifest), copied into ../data at build time. `settings.atomus.manifest` overrides it.
import defaultManifest from '../data/atomus.manifest.json' with { type: 'json' };

export const DOCS = 'https://docs.atomus.io';
export const docsUrl = (rule) => `${DOCS}/ai/lint/#${rule}`;

const cache = new WeakMap();

/** Indexed manifest data for a rule context (cached per manifest object). */
export function atomus(context) {
  const settings = context.settings?.atomus ?? {};
  const manifest = settings.manifest ?? defaultManifest;
  let data = cache.get(manifest);
  if (!data) {
    data = indexManifest(manifest);
    cache.set(manifest, data);
  }
  return { ...data, packages: settings.packages ?? [manifest.package ?? '@stanvision/atomus-react'] };
}

export function indexManifest(manifest) {
  const components = new Map();
  const figmaOnly = new Map();
  for (const c of manifest.components) {
    if (c.status === 'figma-only') figmaOnly.set(c.name.replace(/\s+/g, '').toLowerCase(), c);
    else components.set(c.name, c);
  }
  const semantic = manifest.tokens.semantic.filter((t) => t.group !== 'components' && t.group !== 'gradient');
  const semanticByHex = new Map();
  for (const t of semantic) {
    const hex = normalizeHex(t.light);
    if (hex) semanticByHex.set(hex, [...(semanticByHex.get(hex) ?? []), t]);
  }
  const primitives = new Map(Object.entries(manifest.tokens.primitives));
  const ramps = [...new Set([...primitives.keys()].map((n) => n.replace(/^--color-/, '').replace(/-\d+$/, '')))].filter((r) => !/^(white|black)$/.test(r));
  // Spacing tokens whose value is the same at every breakpoint can replace an arbitrary px value exactly.
  const spacingByPx = new Map();
  for (const t of manifest.tokens.spacing) {
    if (!t.name.startsWith('--spacing-')) continue;
    const vals = new Set(Object.values(t.values));
    if (vals.size === 1) {
      const v = [...vals][0];
      if (!spacingByPx.has(v)) spacingByPx.set(v, t.name.replace('--spacing-', ''));
    }
  }
  const radiusByPx = new Map();
  for (const t of manifest.tokens.radius) {
    const v = t.values.default ?? Object.values(t.values)[0];
    if (!radiusByPx.has(v)) radiusByPx.set(v, t.name.replace('--radius-', ''));
  }
  return {
    manifest,
    components,
    figmaOnly,
    exportsValues: new Set(manifest.exports?.values ?? [...components.keys()]),
    exportsTypes: new Set(manifest.exports?.types ?? []),
    semanticByHex,
    primitives,
    rampRe: ramps.length ? ramps.map((r) => r.replace(/[-]/g, '\\-')).join('|') : null,
    spacingByPx,
    radiusByPx,
  };
}

// ------------------------------------------------------------------ colours

/** #abc → #aabbcc; #abcd → #aabbccdd; lower case. Returns null for non-hex. */
export function normalizeHex(v) {
  const m = String(v ?? '').trim().toLowerCase().match(/^#([0-9a-f]{3,8})$/);
  if (!m) return null;
  let h = m[1];
  if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('');
  if (h.length !== 6 && h.length !== 8) return null;
  if (h.length === 8 && h.endsWith('ff')) h = h.slice(0, 6);
  return `#${h}`;
}

// Raw colour patterns. Hex: not part of a word, an id reference (url(#a), href="#a") or an HTML entity.
const HEX = /(^|[^\w&/#-])#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/g;
const FUNC = /\b(rgba?|hsla?|hwb|oklch|oklab|lab|lch|color)\(\s*(?!var\(|from\b)[^)]*\)/g;

/** Finds raw colours in a CSS-ish string. Returns [{ index, length, text, hex }]. */
export function findRawColors(text, { named = false } = {}) {
  const out = [];
  for (const m of text.matchAll(HEX)) {
    const at = m.index + m[1].length;
    const before = text.slice(Math.max(0, at - 6), at);
    if (/url\(\s*['"]?$/.test(before)) continue;
    out.push({ index: at, length: m[2].length + 1, text: `#${m[2]}`, hex: normalizeHex(`#${m[2]}`) });
  }
  for (const m of text.matchAll(FUNC)) {
    // color-mix(), var() inside and relative colours are fine; a plain rgb(0 0 0) is not.
    if (/^color$/.test(m[1]) && !/^color\(\s*(srgb|display-p3|rec2020|a98-rgb|prophoto-rgb|xyz)/.test(m[0])) continue;
    if (/var\(/.test(m[0])) continue;
    out.push({ index: m.index, length: m[0].length, text: m[0], hex: null });
  }
  if (named) {
    for (const m of text.matchAll(/(^|[\s,(:])([a-zA-Z]+)(?=$|[\s,);!])/g)) {
      const word = m[2].toLowerCase();
      if (!NAMED_COLORS.has(word)) continue;
      out.push({ index: m.index + m[1].length, length: m[2].length, text: m[2], hex: null, named: true });
    }
  }
  return out.sort((a, b) => a.index - b.index);
}

export const NAMED_COLORS = new Set(
  'aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen'.split(' '),
);

/** CSS properties whose values are colours (camelCase and kebab-case). */
export const COLOR_PROPS = new Set(
  [
    'color', 'background', 'backgroundColor', 'backgroundImage', 'border', 'borderColor', 'borderTop', 'borderRight', 'borderBottom', 'borderLeft',
    'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor', 'borderBlock', 'borderInline', 'borderBlockColor', 'borderInlineColor',
    'borderBlockStart', 'borderBlockEnd', 'borderInlineStart', 'borderInlineEnd',
    'outline', 'outlineColor', 'fill', 'stroke', 'boxShadow', 'textShadow', 'caretColor', 'accentColor', 'textDecoration', 'textDecorationColor',
    'columnRule', 'columnRuleColor', 'stopColor', 'floodColor', 'lightingColor', 'scrollbarColor', 'webkitTextFillColor', 'WebkitTextFillColor',
  ].flatMap((p) => [p, p.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)]),
);

/** Token group that usually fits a CSS property (color → text, fill → foreground …). */
export function groupForProperty(prop) {
  const p = String(prop ?? '').replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
  if (/^(color|caret-color|text-decoration(-color)?|-?webkit-text-fill-color)$/.test(p)) return 'text';
  if (/^(fill|stroke|stop-color|flood-color|lighting-color)$/.test(p)) return 'foreground';
  if (/^background/.test(p)) return 'background';
  if (/^(border|outline|column-rule)/.test(p)) return 'border';
  return null;
}

/** Semantic tokens with the same Light value as a hex colour, the group that fits `property` first. */
export function sameValueTokens(data, hex, property) {
  const list = hex ? data.semanticByHex.get(normalizeHex(hex)) ?? [] : [];
  const group = groupForProperty(property);
  if (!group) return list;
  return [...list.filter((t) => t.group === group), ...list.filter((t) => t.group !== group)];
}

/** CSS property of the declaration that contains `index` in a CSS string ("color: #fff; …"). */
export function cssPropertyAt(text, index) {
  const start = Math.max(text.lastIndexOf(';', index), text.lastIndexOf('{', index), text.lastIndexOf('\n', index)) + 1;
  return text.slice(start, index).match(/^\s*([-\w]+)\s*:/)?.[1] ?? null;
}

/** Key of the object property (or name of the JSX attribute) whose value contains `node`. */
export function propertyKeyOf(node) {
  for (let n = node, depth = 0; n?.parent && depth < 4; n = n.parent, depth++) {
    const p = n.parent;
    if (p.type === 'Property' && p.value === n) return p.key.type === 'Identifier' ? p.key.name : p.key.value;
    if (p.type === 'JSXAttribute') return attrName(p);
  }
  return null;
}

export function tokenHint(data, hex, property) {
  const same = sameValueTokens(data, hex, property);
  if (!same.length) return 'Pick the semantic token by intent (atomus_find_token, or https://docs.atomus.io/foundations/color/).';
  return `Same Light value as ${same.slice(0, 3).map((t) => `var(${t.name})`).join(', ')}; pick the one whose intent matches.`;
}

// ------------------------------------------------------------------ class names

const CLASS_ATTRS = new Set(['className', 'class', 'tw']);
const CLASS_FUNCS = new Set(['cx', 'clsx', 'cn', 'classnames', 'classNames', 'twMerge', 'twJoin', 'cva', 'tv']);

/** Is this node (a string or template) used as a class list? */
export function isClassContext(node) {
  let n = node;
  for (let depth = 0; n?.parent && depth < 8; depth++) {
    const p = n.parent;
    if (p.type === 'JSXAttribute') return CLASS_ATTRS.has(attrName(p));
    if (p.type === 'CallExpression' && p.arguments.includes(n)) return CLASS_FUNCS.has(calleeName(p.callee));
    if (p.type === 'TaggedTemplateExpression') return ['tw', 'cx', 'clsx'].includes(calleeName(p.tag));
    if (p.type === 'Property' && p.key === n) { n = p; continue; } // clsx({ 'bg-red-500': cond })
    if (['ConditionalExpression', 'LogicalExpression', 'ArrayExpression', 'ObjectExpression', 'Property', 'TemplateLiteral', 'JSXExpressionContainer', 'BinaryExpression', 'SpreadElement'].includes(p.type)) { n = p; continue; }
    return false;
  }
  return false;
}

export const attrName = (attr) => (attr.name?.type === 'JSXNamespacedName' ? `${attr.name.namespace.name}:${attr.name.name.name}` : attr.name?.name);
export function calleeName(callee) {
  if (!callee) return null;
  if (callee.type === 'Identifier') return callee.name;
  if (callee.type === 'MemberExpression') return calleeName(callee.object);
  if (callee.type === 'CallExpression') return calleeName(callee.callee);
  return null;
}

/** Text and source offset of a string Literal or TemplateElement (offset of the first character of its content). */
export function stringParts(node) {
  if (node.type === 'Literal' && typeof node.value === 'string') return [{ text: node.value, start: node.range[0] + 1, node, exact: node.raw.slice(1, -1) === node.value }];
  if (node.type === 'TemplateElement') return [{ text: node.value.cooked ?? node.value.raw, start: node.range[0] + 1, node, exact: node.value.cooked === node.value.raw }];
  if (node.type === 'JSXText') return [{ text: node.value, start: node.range[0], node, exact: true }];
  return [];
}

/** Splits a class string into tokens with their offsets. */
export function classTokens(text) {
  const out = [];
  for (const m of text.matchAll(/[^\s]+/g)) out.push({ token: m[0], index: m.index });
  return out;
}

/** Parses one Tailwind class: variants, important, negative, utility, arbitrary value. */
export function parseClass(token) {
  // Split variants on ":" outside brackets.
  const parts = [];
  let depth = 0, last = 0;
  for (let i = 0; i < token.length; i++) {
    const c = token[i];
    if (c === '[' || c === '(') depth++;
    else if (c === ']' || c === ')') depth--;
    else if (c === ':' && depth === 0) { parts.push(token.slice(last, i)); last = i + 1; }
  }
  let base = token.slice(last);
  const variants = token.slice(0, last);
  let important = '';
  if (base.startsWith('!')) { important = '!'; base = base.slice(1); }
  if (base.endsWith('!')) { important = '!'; base = base.slice(0, -1); }
  let negative = '';
  if (base.startsWith('-')) { negative = '-'; base = base.slice(1); }
  const arb = base.match(/^([a-z][\w-]*?)-\[(.+)\](\/[\w.[\]%-]+)?$/);
  const prop = base.match(/^\[([a-z-]+):(.+)\]$/);
  return {
    variants,
    important,
    negative,
    base,
    utility: arb ? arb[1] : null,
    value: arb ? arb[2].replace(/_/g, ' ') : prop ? prop[2].replace(/_/g, ' ') : null,
    property: prop ? prop[1] : null,
    rawValue: arb ? arb[2] : prop ? prop[2] : null,
  };
}

/** Reports at a sub-range of a string node. */
export function locOf(context, start, length) {
  const sc = context.sourceCode ?? context.getSourceCode();
  return { start: sc.getLocFromIndex(start), end: sc.getLocFromIndex(start + length) };
}

// ------------------------------------------------------------------ JSX and imports

/** Local name → Atomus export name, for every import from the Atomus package(s). Also namespace imports. */
export function atomusImports(program, packages) {
  const locals = new Map();
  const namespaces = new Set();
  for (const node of program.body) {
    if (node.type !== 'ImportDeclaration' || !packages.includes(node.source.value)) continue;
    for (const s of node.specifiers) {
      if (s.type === 'ImportSpecifier') locals.set(s.local.name, s.imported.name ?? s.imported.value);
      else if (s.type === 'ImportNamespaceSpecifier') namespaces.add(s.local.name);
    }
  }
  return { locals, namespaces, any: locals.size > 0 || namespaces.size > 0 };
}

/** Atomus export name of a JSX element name, or null. */
export function jsxAtomusName(nameNode, imports) {
  if (nameNode.type === 'JSXIdentifier') return imports.locals.get(nameNode.name) ?? null;
  if (nameNode.type === 'JSXMemberExpression' && nameNode.object.type === 'JSXIdentifier' && imports.namespaces.has(nameNode.object.name)) return nameNode.property.name;
  return null;
}

/** Static string value of a JSX attribute: "x", {'x'}, {`x`}, {1}. undefined when dynamic; true for a bare attribute. */
export function attrStaticValue(attr) {
  const v = attr.value;
  if (v == null) return true;
  if (v.type === 'Literal') return v.value;
  if (v.type === 'JSXExpressionContainer') {
    const e = v.expression;
    if (e.type === 'Literal') return e.value;
    if (e.type === 'TemplateLiteral' && e.expressions.length === 0) return e.quasis[0].value.cooked;
  }
  return undefined;
}

/** The node holding a JSX attribute's static string, for fixes. */
export function attrValueNode(attr) {
  const v = attr.value;
  if (!v) return null;
  if (v.type === 'Literal') return v;
  if (v.type === 'JSXExpressionContainer' && (v.expression.type === 'Literal' || v.expression.type === 'TemplateLiteral')) return v.expression;
  return null;
}

export function findAttr(opening, name) {
  return opening.attributes.find((a) => a.type === 'JSXAttribute' && attrName(a) === name) ?? null;
}

// ------------------------------------------------------------------ native attributes

const GLOBAL_ATTRS = new Set([
  'id', 'className', 'style', 'title', 'role', 'tabIndex', 'hidden', 'lang', 'dir', 'draggable', 'slot', 'translate', 'inert', 'autoFocus', 'children',
  'dangerouslySetInnerHTML', 'suppressHydrationWarning', 'suppressContentEditableWarning', 'contentEditable', 'spellCheck', 'accessKey', 'autoCapitalize',
  'enterKeyHint', 'inputMode', 'is', 'itemProp', 'itemScope', 'itemType', 'itemID', 'itemRef', 'nonce', 'popover', 'radioGroup', 'about', 'datatype',
  'inlist', 'prefix', 'property', 'resource', 'rev', 'typeof', 'vocab', 'autoCorrect', 'autoSave', 'color', 'results', 'security', 'unselectable',
  'defaultValue', 'defaultChecked',
]);
const EL_ATTRS = {
  button: ['type', 'disabled', 'form', 'formAction', 'formEncType', 'formMethod', 'formNoValidate', 'formTarget', 'name', 'value', 'popoverTarget', 'popoverTargetAction'],
  input: ['type', 'name', 'value', 'checked', 'placeholder', 'required', 'readOnly', 'disabled', 'min', 'max', 'step', 'pattern', 'autoComplete', 'maxLength', 'minLength', 'multiple', 'accept', 'list', 'form', 'size', 'alt', 'src', 'width', 'height', 'capture', 'formAction', 'formEncType', 'formMethod', 'formNoValidate', 'formTarget'],
  a: ['href', 'target', 'rel', 'download', 'hrefLang', 'referrerPolicy', 'ping', 'type', 'media'],
  select: ['name', 'value', 'required', 'disabled', 'multiple', 'form', 'size', 'autoComplete'],
  textarea: ['name', 'value', 'placeholder', 'required', 'readOnly', 'disabled', 'rows', 'cols', 'wrap', 'maxLength', 'minLength', 'form', 'autoComplete'],
  svg: ['viewBox', 'width', 'height', 'fill', 'stroke', 'strokeWidth', 'xmlns', 'preserveAspectRatio', 'focusable'],
};

export function isNativeAttr(name, elements, omit) {
  if (omit.includes(name)) return false;
  if (GLOBAL_ATTRS.has(name) || /^on[A-Z]/.test(name) || /^(aria|data)-/.test(name)) return true;
  return elements.some((el) => (EL_ATTRS[el] ?? []).includes(name));
}
