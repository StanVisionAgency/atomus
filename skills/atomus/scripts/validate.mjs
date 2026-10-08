#!/usr/bin/env node
// Atomus validator — checks UI code against the Atomus rules before you hand it over.
//
//   node validate.mjs <file|dir> [...more]   [--json] [--warn-only]
//
// Flags:
//   raw-color        raw hex / rgb() / hsl() colours        → use a semantic token
//   primitive-token  --color-gray-500, bg-gray-500 …          → use the semantic token with the same job
//   unknown-export   an import from @stanvision/atomus-react that does not exist
//   unknown-prop     a prop the Atomus component does not have
//   invalid-value    a value outside the prop's enum (hierarchy="danger" …)
//   multiple-primary more than one hierarchy="primary" Button in one file (warning)
//
// Reads ../references/react-api.json and ../references/tokens.json (generated from the Atomus repo).
// No dependencies; Node 18+. Exit code 1 when there are errors.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const API = JSON.parse(readFileSync(join(here, '../references/react-api.json'), 'utf8'));
const TOKENS = JSON.parse(readFileSync(join(here, '../references/tokens.json'), 'utf8'));
const PKG = API.package;

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const warnOnly = args.includes('--warn-only');
const targets = args.filter((a) => !a.startsWith('--'));
if (!targets.length) {
  console.error('usage: node validate.mjs <file|dir> [...] [--json] [--warn-only]');
  process.exit(2);
}

const EXT = new Set(['.tsx', '.jsx', '.ts', '.js', '.mjs', '.css', '.scss', '.html', '.vue', '.svelte', '.astro', '.mdx']);
const SKIP_DIRS = new Set(['node_modules', 'dist', 'build', '.git', '.next', '.astro', 'coverage']);
function collect(p, out = []) {
  const st = statSync(p);
  if (st.isDirectory()) {
    for (const f of readdirSync(p)) if (!SKIP_DIRS.has(f)) collect(join(p, f), out);
  } else if (EXT.has(extname(p))) out.push(p);
  return out;
}

// ---- token data
const semanticByHex = new Map();
for (const [name, t] of Object.entries(TOKENS.semantic)) {
  if (t.group === 'components' || t.group === 'gradient') continue;
  const hex = t.light.toLowerCase();
  semanticByHex.set(hex, [...(semanticByHex.get(hex) ?? []), name]);
}
const primitiveNames = new Set(Object.keys(TOKENS.primitives));
const ramps = [...new Set([...primitiveNames].map((n) => n.replace(/^--color-/, '').replace(/-\d+$/, '')))].filter((r) => !/^(white|black)$/.test(r));
const suggest = (hex, tailwind = false) => {
  const s = semanticByHex.get(String(hex).toLowerCase());
  if (!s) return ' — pick the semantic token by intent (references/tokens.md)';
  const names = tailwind ? s.flatMap((x) => TOKENS.semantic[x].tailwind ?? []) : s.map((x) => `var(${x})`);
  return names.length ? ` — same value as ${names.slice(0, 3).join(', ')} (pick by intent)` : ' — pick the semantic token by intent (references/tokens.md)';
};

// ---- native attributes allowed on components that extend HTML attributes
const GLOBAL_ATTRS = new Set(['id', 'className', 'style', 'title', 'role', 'tabIndex', 'hidden', 'lang', 'dir', 'draggable', 'slot', 'translate', 'inert', 'autoFocus', 'children', 'dangerouslySetInnerHTML', 'suppressHydrationWarning']);
const EL_ATTRS = {
  button: ['type', 'disabled', 'form', 'formAction', 'name', 'value', 'popoverTarget'],
  input: ['type', 'name', 'value', 'defaultValue', 'checked', 'defaultChecked', 'placeholder', 'required', 'readOnly', 'disabled', 'min', 'max', 'step', 'pattern', 'autoComplete', 'maxLength', 'minLength', 'multiple', 'accept', 'inputMode', 'list', 'form', 'size', 'enterKeyHint'],
  a: ['href', 'target', 'rel', 'download', 'hrefLang', 'referrerPolicy', 'ping'],
};
const isNativeAttr = (name, els, omit) => {
  if (omit.includes(name)) return false;
  if (GLOBAL_ATTRS.has(name) || /^on[A-Z]/.test(name) || /^(aria|data)-/.test(name)) return true;
  return els.some((el) => (EL_ATTRS[el] ?? []).includes(name));
};

// ---- helpers
function lineCol(src, index) {
  const before = src.slice(0, index);
  const line = before.split('\n').length;
  return { line, col: index - before.lastIndexOf('\n') };
}
/** Blanks out comments (keeps offsets) so commented code is not reported. */
function stripComments(src, ext) {
  const blank = (m) => m.replace(/[^\n]/g, ' ');
  let s = src.replace(/\/\*[\s\S]*?\*\//g, blank);
  if (ext !== '.css' && ext !== '.html') s = s.replace(/(^|[^:'"`\\])\/\/[^\n]*/g, (m, p) => p + blank(m.slice(p.length)));
  if (ext === '.html' || ext === '.vue' || ext === '.svelte' || ext === '.astro' || ext === '.mdx') s = s.replace(/<!--[\s\S]*?-->/g, blank);
  return s;
}
/** Parses JSX attributes from just after "<Name" to the closing ">" of the opening tag. */
function parseAttrs(src, start) {
  const attrs = [];
  let i = start;
  while (i < src.length) {
    while (/\s/.test(src[i])) i++;
    if (src[i] === '>' || (src[i] === '/' && src[i + 1] === '>')) return { attrs, end: i };
    if (src[i] === '{') { // spread or comment
      let depth = 0, j = i;
      for (; j < src.length; j++) { if (src[j] === '{') depth++; else if (src[j] === '}' && --depth === 0) break; }
      attrs.push({ spread: true, index: i });
      i = j + 1;
      continue;
    }
    const m = src.slice(i).match(/^([A-Za-z_$][\w$:.-]*)/);
    if (!m) return { attrs, end: i };
    const attr = { name: m[1], index: i, value: undefined, literal: null };
    i += m[1].length;
    while (/\s/.test(src[i])) i++;
    if (src[i] === '=') {
      i++;
      while (/\s/.test(src[i])) i++;
      if (src[i] === '"' || src[i] === "'") {
        const q = src[i];
        const close = src.indexOf(q, i + 1);
        attr.literal = src.slice(i + 1, close);
        i = close + 1;
      } else if (src[i] === '{') {
        let depth = 0, j = i;
        for (; j < src.length; j++) {
          const c = src[j];
          if (c === '"' || c === "'" || c === '`') { const close = src.indexOf(c, j + 1); j = close < 0 ? src.length : close; continue; }
          if (c === '{') depth++;
          else if (c === '}' && --depth === 0) break;
        }
        const expr = src.slice(i + 1, j).trim();
        const lit = expr.match(/^(['"`])([^'"`$]*)\1$/);
        if (lit) attr.literal = lit[2];
        attr.value = expr;
        i = j + 1;
      }
    }
    attrs.push(attr);
  }
  return { attrs, end: i };
}

// ---- checks
function check(file) {
  const raw = readFileSync(file, 'utf8');
  const ext = extname(file);
  const src = stripComments(raw, ext);
  const issues = [];
  const add = (index, level, rule, message) => issues.push({ file: relative(process.cwd(), file) || file, ...lineCol(raw, index), level, rule, message });

  // Raw colours (skip anchors like href="#section" and SVG url(#id)).
  for (const m of src.matchAll(/(^|[^\w&/-])#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/g)) {
    const at = m.index + m[1].length;
    const before = src.slice(Math.max(0, at - 12), at);
    if (/(href|to|url\(|id)=?\s*["'{(]?\s*$/.test(before) || /url\($/.test(before)) continue;
    add(at, 'error', 'raw-color', `raw colour #${m[2]}${suggest('#' + m[2])}`);
  }
  for (const m of src.matchAll(/\b(rgba?|hsla?|oklch|oklab)\(\s*(?!var\()[\d.]/g)) add(m.index, 'error', 'raw-color', `raw colour ${m[1]}(…) — use a semantic token (references/tokens.md)`);

  // Primitive tokens.
  for (const m of src.matchAll(/--color-[a-z]+(?:-[a-z]+)*-\d+\b/g)) {
    if (!primitiveNames.has(m[0])) continue;
    // Defining a primitive (e.g. a brand block) is a token change, not usage.
    if (/^\s*:/.test(src.slice(m.index + m[0].length))) { add(m.index, 'error', 'primitive-token', `defines ${m[0]} — adding or changing tokens needs human review (AGENTS.md)`); continue; }
    add(m.index, 'error', 'primitive-token', `primitive ${m[0]}${suggest(TOKENS.primitives[m[0]])}`);
  }
  if (ramps.length) {
    const tw = new RegExp(`(?<![\\w-])(?:[a-z]+:)*(bg|text|border|fill|stroke|ring|outline|divide|from|via|to|decoration|placeholder|accent|caret|shadow)-(${ramps.map((r) => r.replace(/[-]/g, '\\-')).join('|')})-(\\d{2,3})(?:\\/\\d+)?(?![\\w-])`, 'g');
    for (const m of src.matchAll(tw)) {
      const name = `--color-${m[2]}-${m[3]}`;
      if (!primitiveNames.has(name)) continue;
      add(m.index, 'warning', 'primitive-token', `Tailwind primitive class ${m[0]}${suggest(TOKENS.primitives[name], true)}`);
    }
  }

  // Atomus imports, props and enums.
  const locals = new Map();
  for (const m of src.matchAll(/import\s+(?:type\s+)?\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/g)) {
    if (m[2] !== PKG) continue;
    for (const part of m[1].split(',')) {
      const p = part.trim().replace(/^type\s+/, '');
      if (!p) continue;
      const [imported, local = imported] = p.split(/\s+as\s+/).map((x) => x.trim());
      if (!API.components[imported] && !/Props$|^[A-Z]\w*(Item|Option|Column|Range|Color|Size|Hierarchy|Name|Alias|Options|Date)$/.test(imported)) {
        add(m.index, 'error', 'unknown-export', `${imported} is not exported by ${PKG} — check references/components.md (Figma-only components have no React export)`);
      }
      if (API.components[imported]) locals.set(local, imported);
    }
  }
  let primaries = 0;
  for (const [local, name] of locals) {
    const c = API.components[name];
    if (c.kind !== 'component') continue;
    for (const m of src.matchAll(new RegExp(`<${local.replace(/\$/g, '\\$')}(?=[\\s/>])`, 'g'))) {
      const { attrs } = parseAttrs(src, m.index + local.length + 1);
      for (const a of attrs) {
        if (a.spread || a.name === 'key' || (a.name === 'ref' && (c.ref || c.native.length))) continue;
        const prop = c.props[a.name];
        if (!prop) {
          if (c.native.length && isNativeAttr(a.name, c.native, c.nativeOmit ?? [])) continue;
          add(a.index, 'error', 'unknown-prop', `<${name}> has no prop "${a.name}" — props: ${Object.keys(c.props).join(', ')}${c.native.length ? ` (+ native ${c.native.map((e) => (e === 'element' ? 'HTML' : `<${e}>`)).join('/')} attributes)` : ''}`);
          continue;
        }
        if (prop.values && a.literal !== null && !prop.values.includes(a.literal)) {
          add(a.index, 'error', 'invalid-value', `<${name} ${a.name}="${a.literal}"> — allowed: ${prop.values.map((v) => `"${v}"`).join(' | ')}`);
        }
        if (name === 'Button' && a.name === 'hierarchy' && a.literal === 'primary') primaries++;
      }
      for (const [pname, p] of Object.entries(c.props)) {
        if (p.required && pname !== 'children' && !attrs.some((a) => a.spread || a.name === pname)) add(m.index, 'warning', 'missing-prop', `<${name}> is missing required prop "${pname}"`);
      }
    }
  }
  if (primaries > 1) add(0, 'warning', 'multiple-primary', `${primaries} primary Buttons in this file — use one primary per view (check they are in different views)`);
  return issues;
}

const files = targets.flatMap((t) => collect(t));
const issues = files.flatMap((f) => check(f).sort((a, b) => a.line - b.line || a.col - b.col));
const errors = issues.filter((i) => i.level === 'error').length;
if (asJson) console.log(JSON.stringify({ files: files.length, errors, warnings: issues.length - errors, issues }, null, 2));
else {
  for (const i of issues) console.log(`${i.file}:${i.line}:${i.col}  ${i.level.padEnd(7)} ${i.rule.padEnd(16)} ${i.message}`);
  console.log(`\natomus-validate: ${files.length} file(s), ${errors} error(s), ${issues.length - errors} warning(s)`);
}
process.exit(errors && !warnOnly ? 1 : 0);
