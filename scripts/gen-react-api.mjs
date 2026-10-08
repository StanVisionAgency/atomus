#!/usr/bin/env node
// Generates the "React API" section of every guidelines/components/*.md file from the TypeScript
// source in react/src/components/*.tsx, plus the machine-readable API the Atomus agent skill uses:
//
//   guidelines/components/*.md           "## React API" section between react-api markers
//   skills/atomus/references/components.md   catalogue (from guidelines/overview-components.md) + React API
//   skills/atomus/references/react-api.json  props, enums and defaults (read by skills/atomus/scripts/validate.mjs)
//
// No dependencies: the component files follow one pattern (exported Props interface with JSDoc'd
// members, destructured defaults), and this script parses exactly that. Run it after changing a
// component's props:   node scripts/gen-react-api.mjs   (add --check to fail when files are stale).
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(root, 'react/src/components');
const guideDir = join(root, 'guidelines/components');
const skillRefs = join(root, 'skills/atomus/references');
const CHECK = process.argv.includes('--check');
const PKG = '@stanvision/atomus-react';

// guidelines/components/<file>.md → the React exports documented in it (in order).
// Files not listed here have no React component yet; `closest` tells agents what to use instead.
const FILES = {
  'button': { exports: ['Button'] },
  'badge': { exports: ['Badge', 'Tag'] },
  'input-select': { exports: ['Input', 'Select'], closest: 'Textarea, Number input, Slider, Tags input, Phone input, Payment input, Verification code input and Multi-select are Figma-only: use a native element styled with Atomus tokens, or `Input`/`Select` where they fit.' },
  'checkbox-radio': { exports: ['Checkbox', 'Radio'] },
  'toggle': { exports: ['Toggle'] },
  'avatar': { exports: ['Avatar'], closest: 'Avatar group and Avatar label group are Figma-only: render several `Avatar`s in a row (negative inline margin) or an `Avatar` next to the name and email text.' },
  'message-alert': { exports: ['Alert', 'Toast', 'ToastProvider', 'useToast'], closest: 'Notifications panel and Notification item are Figma-only.' },
  'card': { exports: ['Card'], closest: 'Card header and Section footer are built into `Card` (`title`, `supportingText`, `headerAction`, `footer`). Inline CTA is Figma-only.' },
  'tabs': { exports: ['Tabs'], closest: 'Vertical tabs are Figma-only: use a list of `NavItem`s for settings navigation.' },
  'progress-loading': { exports: ['ProgressBar'], closest: 'Progress circle, Progress steps, Loading indicator and Skeleton are Figma-only. For a spinner inside a button use `<Button loading>`.' },
  'metrics-feeds': { exports: ['MetricCard'], closest: 'Activity item, Banner and Code snippet are Figma-only.' },
  'empty-state-file-upload': { exports: ['EmptyState'], closest: 'File upload and File upload item are Figma-only: use a native `<input type="file">` inside a dashed drop zone styled with tokens.' },
  'menu': { exports: ['DropdownMenu', 'MenuItem'], closest: 'Context menu uses `DropdownMenu` (open it on right-click) with `destructive` items.' },
  'modal': { exports: ['Modal'] },
  'table': { exports: ['Table'], closest: 'Filter bar is Figma-only: compose it from `Input` (search), `Select` and `Button` above the `Table`.' },
  'date-time-pickers': { exports: ['DatePicker', 'Calendar'] },
  'navigation': { exports: ['AppHeader', 'SidebarNavigation', 'NavItem'] },
  'atomus-icons': { closest: 'Use your icon library (Font Awesome names match the Figma icons) and pass icons as React nodes to `icon`, `iconLeading` and `iconTrailing` props. `Icon` from the package only ships the few glyphs the components use internally.' },
  'breadcrumb': { closest: 'Render an ordered list of links inside `<nav aria-label="Breadcrumb">`, styled with `--color-text-tertiary` links and a `--color-text-primary` current item.' },
  'button-group': { closest: 'To switch views use `<Tabs variant="segmented">`. For a row of actions use several `Button`s.' },
  'charts': { closest: 'Use a charting library (Recharts, Chart.js, ECharts) and colour the key series with `--color-fg-brand` and comparisons with `--color-fg-tertiary`; grid lines use `--color-border-secondary`. `MetricCard type="chart"` covers sparklines.' },
  'headers-dividers': { closest: 'Compose Page header and Section header from text styles (`.text-headline-h4`, `.text-content-body`) plus `Button`s and `Tabs`; use `<hr>` with `--color-border-secondary` for Divider.' },
  'messaging': { closest: 'Compose Chat from `Avatar`, tokens and a native `<textarea>`.' },
  'pagination': { closest: 'Compose Pagination from `Button hierarchy="tertiary" size="sm"` items.' },
  'slideout-command-menu': { closest: 'Drawer, Slideout menu and Command menu are Figma-only. For a focused task use `Modal`; for a short action list use `DropdownMenu`.' },
  'tooltip-popover': { closest: 'Use the `title` attribute or a headless tooltip (Radix, Floating UI) styled with `--color-bg-inverse` and `--color-text-inverse`.' },
  'tree-editor-color-picker': { closest: 'Tree view, Text editor and Color picker are Figma-only.' },
  'shared-assets': { closest: 'These are design-only mockups and annotations; they have no code counterpart.' },
};

// ---------------------------------------------------------------- parsing

/** Index: which exports are components / hooks / types, and from which file. */
function parseIndex() {
  const index = readFileSync(join(root, 'react/src/index.ts'), 'utf8');
  const out = {};
  for (const m of index.matchAll(/export\s*\{([^}]+)\}\s*from\s*'\.\/components\/(\w+)'/g)) {
    for (const raw of m[1].split(',')) {
      const name = raw.trim();
      if (!name) continue;
      const isType = name.startsWith('type ');
      out[name.replace(/^type\s+/, '')] = { file: m[2], isType };
    }
  }
  return out;
}

/** Returns the index of the bracket that closes the one at `start`. */
function matchBracket(s, start) {
  const open = s[start];
  const close = { '{': '}', '(': ')', '<': '>', '[': ']' }[open];
  let depth = 0;
  for (let i = start; i < s.length; i++) {
    const c = s[i];
    if (c === "'" || c === '"' || c === '`') { i = skipString(s, i); continue; }
    if (c === '/' && s[i + 1] === '*') { i = s.indexOf('*/', i) + 1; continue; }
    if (c === '/' && s[i + 1] === '/') { i = s.indexOf('\n', i); continue; }
    if (c === '=' && s[i + 1] === '>') { i++; continue; }
    if (c === open) depth++;
    else if (c === close && --depth === 0) return i;
  }
  throw new Error(`unbalanced ${open} at ${start}`);
}

function skipString(s, i) {
  const q = s[i];
  for (let j = i + 1; j < s.length; j++) {
    if (s[j] === '\\') { j++; continue; }
    if (s[j] === q) return j;
  }
  return s.length;
}

/** Splits at top-level separators (outside brackets, strings and comments). Keeps comments attached. */
function splitTop(s, seps) {
  const parts = [];
  let depth = 0, last = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "'" || c === '"' || c === '`') { i = skipString(s, i); continue; }
    if (c === '/' && s[i + 1] === '*') { i = s.indexOf('*/', i) + 1; continue; }
    if (c === '/' && s[i + 1] === '/') { i = s.indexOf('\n', i); if (i < 0) break; continue; }
    if (c === '=' && s[i + 1] === '>') { i++; continue; }
    if ('{(<['.includes(c)) depth++;
    else if ('})>]'.includes(c)) depth--;
    else if (depth === 0 && seps.includes(c)) { parts.push(s.slice(last, i)); last = i + 1; }
  }
  parts.push(s.slice(last));
  return parts.map((p) => p.trim()).filter(Boolean);
}

const cleanDoc = (d) => d.replace(/^\/\*\*|\*\/$/g, '').split('\n').map((l) => l.replace(/^\s*\*\s?/, '')).join(' ').replace(/\s+/g, ' ').trim();

/** Parses `interface X<..> extends A, B { members }` declarations and `type X = …` aliases of one file. */
function parseDeclarations(code) {
  const interfaces = {};
  const aliases = {};
  for (const m of code.matchAll(/(?:\/\*\*((?:(?!\*\/)[\s\S])*)\*\/\s*)?(export\s+)?interface\s+(\w+)(<[^{]*?>)?\s*(?:extends\s+([^{]+?))?\s*\{/g)) {
    const bodyStart = m.index + m[0].length - 1;
    const body = code.slice(bodyStart + 1, matchBracket(code, bodyStart));
    const members = [];
    let pending = [];
    for (const raw of splitTop(body, ';\n')) {
      const docs = [...pending, ...[...raw.matchAll(/\/\*\*([\s\S]*?)\*\//g)].map((d) => cleanDoc(d[0]))];
      const decl = raw.replace(/\/\*\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '').trim();
      if (!decl) { pending = docs; continue; }
      pending = [];
      const mm = decl.match(/^('[^']+'|[\w$]+)(\?)?\s*:\s*([\s\S]+)$/);
      if (!mm) continue;
      members.push({ name: mm[1].replace(/'/g, ''), optional: !!mm[2], type: mm[3].replace(/\s+/g, ' ').trim(), doc: docs.join(' ') });
    }
    interfaces[m[3]] = { name: m[3], exported: !!m[2], generics: m[4] ?? '', extends: m[5] ? splitTop(m[5], ',') : [], members, doc: m[1] ? cleanDoc(`/**${m[1]}*/`) : '' };
  }
  for (const m of code.matchAll(/(?:\/\*\*((?:(?!\*\/)[\s\S])*)\*\/\s*)?export\s+type\s+(\w+)\s*=\s*/g)) {
    const start = m.index + m[0].length;
    // The alias ends at the first top-level ';'.
    const rest = code.slice(start);
    const value = splitTop(rest, ';')[0];
    aliases[m[2]] = { name: m[2], value: value.replace(/\s+/g, ' ').trim(), doc: m[1] ? cleanDoc(`/**${m[1]}*/`) : '' };
  }
  return { interfaces, aliases };
}

/** Finds the component's props type, defaults, ref target and JSDoc. */
function parseComponent(code, name) {
  let m = code.match(new RegExp(`(?:\\/\\*\\*((?:(?!\\*\\/)[\\s\\S])*)\\*\\/\\s*)?export\\s+const\\s+${name}\\s*=\\s*forwardRef<\\s*(\\w+)\\s*,\\s*(\\w+)\\s*>\\(\\s*function\\s+\\w+\\s*\\(`));
  let propsType, refTarget = null, doc = '', paramsStart;
  if (m) {
    refTarget = m[2];
    propsType = m[3];
    doc = m[1] ? cleanDoc(`/**${m[1]}*/`) : '';
    paramsStart = m.index + m[0].length - 1;
  } else {
    m = code.match(new RegExp(`(?:\\/\\*\\*((?:(?!\\*\\/)[\\s\\S])*)\\*\\/\\s*)?export\\s+function\\s+${name}\\s*(<[^(]*>)?\\s*\\(`));
    if (!m) return null;
    doc = m[1] ? cleanDoc(`/**${m[1]}*/`) : '';
    paramsStart = m.index + m[0].length - 1;
  }
  const paramsEnd = matchBracket(code, paramsStart);
  const params = code.slice(paramsStart + 1, paramsEnd).trim();
  const defaults = {};
  if (params.startsWith('{')) {
    const close = matchBracket(params, 0);
    for (const part of splitTop(params.slice(1, close), ',')) {
      const d = part.match(/^([\w$]+)\s*=\s*([\s\S]+)$/);
      if (d) defaults[d[1]] = d[2].trim();
    }
    if (!propsType) propsType = (params.slice(close + 1).match(/:\s*(\w+)/) || [])[1];
  }
  const ret = code.slice(paramsEnd + 1).match(/^\s*:\s*([\w<>, |[\]]+?)\s*\{/);
  return { name, propsType, refTarget, doc, defaults, params: propsType ? '' : params, returns: ret?.[1] };
}

// Descriptions for common props that have no JSDoc in the source.
const COMMON_DOCS = {
  className: 'Extra class on the root element (layout only — never restyle colours or sizes).',
  fullWidth: 'Stretches to the width of its container.',
  disabled: 'Disables the control.',
  id: 'Element id; generated when omitted (wires label and hint).',
  value: 'Controlled value.',
  defaultValue: 'Initial value when uncontrolled.',
  onChange: 'Called with the new value.',
  placeholder: 'Placeholder text — never a replacement for the label.',
  hint: 'Help text under the field.',
  error: 'Error message; replaces the hint and marks the field invalid.',
  children: 'Content.',
  iconLeading: 'Icon before the text.',
  iconTrailing: 'Icon after the text.',
  align: 'Alignment.',
  size: 'Size.',
  open: 'Whether it is shown (controlled).',
  onClose: 'Called when the user closes it.',
  'aria-label': 'Accessible name.',
  name: 'Form field name.',
  action: 'Action element, e.g. a link-style Button.',
  min: 'Earliest selectable date.',
  max: 'Latest selectable date.',
  locale: 'BCP 47 locale for month and weekday names.',
  range: 'Selected range (type="range").',
  onRangeChange: 'Called with the new range (type="range").',
  selected: 'Keys of the selected rows (controlled).',
  onSelectedChange: 'Called with the selected row keys.',
  columns: 'Column definitions.',
  rows: 'Row data.',
  rowKey: 'Returns a stable key for a row.',
  options: 'The options.',
  items: 'The items.',
  onSelect: 'Called when the item is chosen.',
  role: 'ARIA role.',
  active: 'Highlighted by keyboard navigation.',
  position: 'Where toasts appear.',
};

// Native attribute sets: what "extends ButtonHTMLAttributes<…>" means for users.
const NATIVE = {
  ButtonHTMLAttributes: 'button',
  InputHTMLAttributes: 'input',
  HTMLAttributes: null, // element from the generic
  AnchorHTMLAttributes: 'a',
  SVGProps: 'svg',
};
const EL = { HTMLButtonElement: 'button', HTMLInputElement: 'input', HTMLDivElement: 'div', HTMLSpanElement: 'span', HTMLElement: 'element', HTMLAnchorElement: 'a', SVGSVGElement: 'svg' };

/** Resolves an interface's own + inherited members; returns { members, native: [{el, omit}] }. */
function resolveMembers(decls, name, omit = []) {
  // `type RadioProps = ChoiceBase` aliases an interface.
  const alias = decls.aliases[name]?.value;
  if (!decls.interfaces[name] && alias && decls.interfaces[alias]) return resolveMembers(decls, alias, omit);
  const it = decls.interfaces[name];
  if (!it) return { members: [], native: [] };
  let members = [];
  const native = [];
  for (const ext of it.extends) {
    let base = ext, extOmit = [];
    const om = ext.match(/^Omit<\s*([\s\S]+)\s*,\s*([^,]+)>$/);
    if (om) { base = om[1].trim(); extOmit = [...om[2].matchAll(/'([^']+)'/g)].map((x) => x[1]); }
    const nm = base.match(/^(\w+)(?:<\s*(\w+)\s*>)?$/);
    if (nm && nm[1] in NATIVE) native.push({ el: NATIVE[nm[1]] ?? EL[nm[2]] ?? nm[2], omit: extOmit });
    else if (nm && decls.interfaces[nm[1]]) {
      const r = resolveMembers(decls, nm[1], extOmit);
      members.push(...r.members);
      native.push(...r.native);
    }
  }
  const own = new Set(it.members.map((m) => m.name));
  members = members.filter((m) => !own.has(m.name)).concat(it.members.map((m) => ({ ...m, from: name })));
  return { members: members.filter((m) => !omit.includes(m.name)), native };
}

/** Expands string-literal aliases (ButtonHierarchy → 'primary' | …) in a type expression. */
function expandType(type, decls) {
  return type.replace(/\b([A-Z]\w+)\b/g, (w) => {
    const a = decls.aliases[w];
    return a && /^\|?\s*'/.test(a.value) && !a.value.includes('{') ? a.value.replace(/^\|\s*/, '') : w;
  });
}

const enumValues = (type) => (/^(\s*'[^']*'\s*\|?)+$/.test(type) ? [...type.matchAll(/'([^']*)'/g)].map((x) => x[1]) : null);

function parseAll() {
  const index = parseIndex();
  const files = {};
  const api = {};
  for (const [exp, { file, isType }] of Object.entries(index)) {
    if (isType) continue;
    files[file] ??= (() => {
      const code = readFileSync(join(srcDir, `${file}.tsx`), 'utf8');
      return { code, decls: parseDeclarations(code) };
    })();
    const { code, decls } = files[file];
    const c = parseComponent(code, exp);
    if (!c) throw new Error(`gen-react-api: could not find export ${exp} in react/src/components/${file}.tsx`);
    const kind = /^use[A-Z]/.test(exp) ? 'hook' : 'component';
    const retIface = c.returns && decls.interfaces[c.returns];
    const returnShape = retIface ? `{ ${retIface.members.map((m) => `${m.name}: ${m.type}`).join('; ')} }` : null;
    const entry = { returnShape, name: exp, kind, file: `react/src/components/${file}.tsx`, doc: c.doc, props: [], native: [], ref: c.refTarget ? EL[c.refTarget] ?? c.refTarget : null, returns: c.returns ?? null, related: [] };
    if (kind === 'component' && c.propsType) {
      const { members, native } = resolveMembers(decls, c.propsType);
      entry.propsType = c.propsType;
      entry.native = native;
      entry.props = members.map((m) => {
        const type = expandType(m.type, decls);
        return { name: m.name, from: m.from, type, required: !m.optional, default: c.defaults[m.name] ?? null, doc: m.doc || COMMON_DOCS[m.name] || '', values: enumValues(type) };
      });
      // Related exported types used in prop types (TabItem, SelectOption, DropdownItem …).
      const seen = new Set([c.propsType]);
      const visit = (t) => {
        for (const w of t.match(/\b[A-Z]\w+\b/g) ?? []) {
          if (seen.has(w)) continue;
          seen.add(w);
          if (decls.interfaces[w] && !/Props$/.test(w)) {
            const r = resolveMembers(decls, w);
            entry.related.push({ name: w, kind: 'interface', doc: decls.interfaces[w].doc, members: r.members.map((m) => ({ name: m.name, type: expandType(m.type, decls), required: !m.optional, doc: m.doc })) });
            r.members.forEach((m) => visit(m.type));
          } else if (decls.aliases[w] && !enumValues(decls.aliases[w].value.replace(/^\|\s*/, ''))) {
            entry.related.push({ name: w, kind: 'type', doc: decls.aliases[w].doc, value: decls.aliases[w].value });
          }
        }
      };
      entry.props.forEach((p) => visit(p.type));
    }
    api[exp] = entry;
  }
  // Inherited props keep the default of the component that owns them (DatePicker passes Calendar props through).
  const byProps = Object.fromEntries(Object.values(api).filter((e) => e.propsType).map((e) => [e.propsType, e]));
  for (const e of Object.values(api)) {
    for (const p of e.props) {
      if (p.default === null && p.from && p.from !== e.propsType) p.default = byProps[p.from]?.props.find((q) => q.name === p.name)?.default ?? null;
    }
  }
  return api;
}

// ---------------------------------------------------------------- Markdown

const cell = (s) => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
const code = (s) => '`' + cell(s) + '`';
const NATIVE_EXAMPLES = { button: '`onClick`, `type`, `disabled`, `form`', input: '`name`, `value`, `checked`, `onChange`, `required`', div: '`id`, `role`, `onClick`', span: '`id`, `title`', a: '`href`, `target`, `onClick`', element: '`id`, `role`', svg: '`aria-label`, `role`' };

function componentMarkdown(e, level = '###') {
  const lines = [`${level} \`${e.name}\``, ''];
  if (e.doc) lines.push(e.doc, '');
  lines.push(`\`import { ${e.name} } from '${PKG}';\` — source: \`${e.file}\``, '');
  if (e.kind === 'hook') {
    lines.push(`Hook. Returns \`${e.returnShape ?? e.returns ?? 'void'}\`.${e.name === 'useToast' ? " Call it inside `<ToastProvider>`: `const { show, dismiss } = useToast(); show({ title: 'Saved', color: 'success' })`. `show` takes `ToastOptions` (the `Toast` props plus `duration` in ms; 0 keeps it open) and returns the toast id." : ''}`, '');
    return lines.join('\n');
  }
  lines.push('| Prop | Type | Default | Description |', '|---|---|---|---|');
  for (const p of e.props) {
    lines.push(`| ${code(p.name)} | ${code(p.type)} | ${p.required ? '**required**' : p.default ? code(p.default) : '—'} | ${cell(p.doc || '')} |`);
  }
  lines.push('');
  const extra = [];
  for (const n of e.native) extra.push(`${n.el === 'element' ? 'every native HTML attribute' : `every native \`<${n.el}>\` attribute`} (${NATIVE_EXAMPLES[n.el] ?? '`id`'} …)${n.omit.length ? `, except ${n.omit.map((o) => `\`${o}\``).join(', ')}, which ${n.omit.length > 1 ? 'are' : 'is'} replaced above` : ''}`);
  if (e.ref) extra.push(`\`ref\` (forwarded to the \`<${e.ref}>\`)`);
  if (extra.length) lines.push(`Also accepts ${extra.join(', and ')}.`, '');
  else lines.push('Accepts only the props above.', '');
  for (const r of e.related) {
    if (r.kind === 'interface') {
      lines.push(`\`${r.name}\`${r.doc ? ` — ${r.doc.replace(/\.$/, '')}` : ''}:`, '', '| Field | Type | Description |', '|---|---|---|');
      for (const m of r.members) lines.push(`| ${code(m.name + (m.required ? '' : '?'))} | ${code(m.type)} | ${cell(m.doc || '')} |`);
      lines.push('');
    } else {
      const value = r.value.startsWith('|') ? '\n' + splitTop(r.value.slice(1), '|').map((v) => `  | ${v}`).join('\n') : r.value;
      lines.push(`\`${r.name}\`${r.doc ? ` — ${r.doc.replace(/\.$/, '')}` : ''}:`, '', '```ts', `type ${r.name} =${value.startsWith('\n') ? value : ' ' + value};`, '```', '');
    }
  }
  return lines.join('\n');
}

const START = '<!-- react-api:start — generated by scripts/gen-react-api.mjs from react/src/components. Do not edit by hand; run `node scripts/gen-react-api.mjs`. -->';
const END = '<!-- react-api:end -->';

function guidelineSection(file, api) {
  const spec = FILES[file] ?? {};
  const body = [];
  if (spec.exports?.length) {
    body.push(`Package \`${PKG}\`. Props mirror the Figma properties above (Figma names in the descriptions). Use only the props listed here — anything else is not part of the API.`, '');
    for (const name of spec.exports) {
      if (!api[name]) throw new Error(`gen-react-api: ${name} (mapped to guidelines/components/${file}.md) is not exported from react/src/index.ts`);
      body.push(componentMarkdown(api[name]));
    }
    if (spec.closest) body.push(`**Not in React yet:** ${spec.closest}`, '');
  } else {
    body.push(`No React component yet — do not import one from \`${PKG}\`, it does not exist.`, '');
    if (spec.closest) body.push(spec.closest, '');
  }
  return `## React API\n\n${START}\n\n${body.join('\n').trim()}\n\n${END}\n`;
}

function upsertSection(md, section) {
  const re = /## React API\n\n<!-- react-api:start[\s\S]*?<!-- react-api:end -->\n?/;
  if (re.test(md)) return md.replace(re, section);
  return md.trimEnd() + '\n\n' + section;
}

// ---------------------------------------------------------------- run

const api = parseAll();
const changed = [];
const write = (path, content) => {
  const old = existsSync(path) ? readFileSync(path, 'utf8') : null;
  if (old === content) return;
  changed.push(path.replace(root + '/', ''));
  if (!CHECK) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
  }
};

const documented = new Set();
for (const f of readdirSync(guideDir).filter((f) => f.endsWith('.md')).sort()) {
  const file = f.replace(/\.md$/, '');
  if (!FILES[file]) throw new Error(`gen-react-api: guidelines/components/${f} is not in the FILES map — add it (with exports or a closest hint).`);
  (FILES[file].exports ?? []).forEach((e) => documented.add(e));
  const path = join(guideDir, f);
  write(path, upsertSection(readFileSync(path, 'utf8'), guidelineSection(file, api)));
}
const undocumented = Object.keys(api).filter((n) => !documented.has(n) && n !== 'Icon');
if (undocumented.length) throw new Error(`gen-react-api: exports not mapped to any guideline file: ${undocumented.join(', ')}`);

// Skill references.
const json = {
  $comment: 'Generated by scripts/gen-react-api.mjs from react/src. Read by skills/atomus/scripts/validate.mjs.',
  package: PKG,
  components: Object.fromEntries(
    Object.values(api).map((e) => [e.name, {
      kind: e.kind,
      file: e.file,
      native: e.native.map((n) => n.el),
      nativeOmit: e.native.flatMap((n) => n.omit),
      ref: !!e.ref,
      props: Object.fromEntries(e.props.map((p) => [p.name, { type: p.type, required: p.required, default: p.default, ...(p.values ? { values: p.values } : {}) }])),
    }]),
  ),
};
write(join(skillRefs, 'react-api.json'), JSON.stringify(json, null, 2) + '\n');

const groups = Object.entries(FILES).filter(([, s]) => s.exports?.length);
// The catalogue, other names and decision trees come from guidelines/overview-components.md, with
// guideline paths made repo-relative (the skill is used outside the repo too).
const overview = readFileSync(join(root, 'guidelines/overview-components.md'), 'utf8')
  .replace(/^# .*\n+/, '')
  .replace(/^Use this file[^\n]*\n+/m, '')
  .replace(/`(components\/[\w-]+\.md|website-sections\.md)`/g, '`guidelines/$1`');
const components = [
  '# Atomus components',
  '',
  `Catalogue, other names and decision trees (from \`guidelines/overview-components.md\`), then the full React API generated by \`scripts/gen-react-api.mjs\` from \`react/src/components\`. Every prop, type and default below is real; anything not listed does not exist. Paths like \`guidelines/components/button.md\` refer to https://github.com/StanVisionAgency/atomus; the same content is on https://docs.atomus.io/components/.`,
  '',
  '```tsx',
  "import '@stanvision/atomus-tokens/css';        // tokens + themes (or css/atomus.css from the repo)",
  `import '${PKG}/styles.css';     // component styles`,
  `import { Button, Card, Input } from '${PKG}';`,
  '```',
  '',
  overview.trim(),
  '',
  '## React API',
  '',
  '| Export | Guideline | Figma-only neighbours |',
  '|---|---|---|',
  ...groups.map(([file, s]) => `| ${s.exports.map((e) => `\`${e}\``).join(', ')} | \`guidelines/components/${file}.md\` | ${cell(s.closest ?? '—')} |`),
  '',
  'Figma-only guideline files (no React export — never import these components): ' +
    Object.entries(FILES).filter(([, s]) => !s.exports?.length).map(([f]) => `\`${f}\``).join(', ') +
    '.',
  '',
  ...groups.flatMap(([file, s]) => [`### ${s.exports.join(', ')}`, '', ...s.exports.map((e) => componentMarkdown(api[e], '####'))]),
].join('\n');
write(join(skillRefs, 'components.md'), components.trim() + '\n');

if (CHECK && changed.length) {
  console.error(`gen-react-api: out of date — run node scripts/gen-react-api.mjs\n  ${changed.join('\n  ')}`);
  process.exit(1);
}
console.log(changed.length ? `gen-react-api: updated ${changed.length} file(s)\n  ${changed.join('\n  ')}` : 'gen-react-api: up to date');
