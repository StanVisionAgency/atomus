// Smoke-tests the Code Connect templates without a Figma token: runs `figma connect parse`, then executes every
// parsed template against mocked Figma instances and prints the snippets Dev Mode would show.
// The mock only approximates Figma's template runtime; it catches logic errors, not rendering details.
// Usage: npm run figma:check   (or: node scripts/code-connect-smoke.cjs [parse-output.json])
const fs = require('fs');
const { execSync } = require('child_process');
const docs = JSON.parse(
  process.argv[2]
    ? fs.readFileSync(process.argv[2], 'utf8')
    : execSync('npx figma connect parse --exit-on-unreadable-files --skip-update-check', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'], maxBuffer: 1 << 26 }),
);
const byNode = Object.fromEntries(docs.map((d) => [d.figmaNode.split('node-id=')[1], d]));

const flat = (v) => {
  if (v === undefined || v === null || v === false) return v === false ? [{ type: 'CODE', code: 'false' }] : [];
  if (Array.isArray(v)) return v.flatMap(flat);
  if (typeof v === 'object' && v.type === 'SECTIONS') return v.sections;
  if (typeof v === 'object' && (v.type === 'CODE' || v.type === 'INSTANCE' || v.type === 'SLOT' || v.type === 'ERROR')) return [v];
  if (typeof v === 'object') throw new Error('Unrenderable value interpolated: ' + JSON.stringify(v).slice(0, 80));
  return [{ type: 'CODE', code: String(v) }];
};
const tag = (strings, ...vals) => {
  const sections = [];
  strings.forEach((s, i) => { sections.push({ type: 'CODE', code: s }); if (i < vals.length) sections.push(...flat(vals[i])); });
  return { type: 'SECTIONS', sections, language: 'jsx' };
};
const isArr = (p) => Array.isArray(p) && p.every((x) => ['INSTANCE', 'SLOT', 'CODE', 'ERROR'].includes(x.type));
const renderProp = (name, prop) => {
  if (isArr(prop)) return prop.length > 1 ? tag` ${name}={<>${prop}</>}` : tag` ${name}={${prop}}`;
  if (typeof prop === 'boolean') return prop ? ` ${name}` : '';
  if (typeof prop === 'string') return prop === '' ? '' : ` ${name}="${prop.replaceAll('"', '\\"')}"`;
  if (typeof prop === 'number') return ` ${name}={${prop}}`;
  if (prop === undefined) return '';
  if (prop && prop.$value !== undefined) return ` ${name}={${prop.$value}}`;
  if (prop && prop.type === 'SECTIONS') throw new Error(`renderProp(${name}) got a TemplateStringResult`);
  return '';
};
const toText = (secs) => secs.map((s) => (s.type === 'CODE' ? s.code : s.type === 'SLOT' ? `{/* slot: ${s.propertyName} */}` : s.type === 'ERROR' ? `<<ERROR ${s.message}>>` : '<<INSTANCE>>')).join('');

function handle(spec, ancestors = [], slotName) {
  const h = {
    type: 'INSTANCE', name: spec.name, id: spec.name + Math.random(), __containingSlotName__: slotName,
    children: [],
    codeConnectId: () => spec.cc ?? null,
    hasCodeConnect: () => !!spec.cc,
    getString: (n) => { if (!(n in spec.props)) throw new Error(`${spec.name}: no prop ${n}`); return spec.props[n]; },
    getBoolean: (n, o) => { const v = h.getString(n); if (typeof v !== 'boolean') throw new Error(`${n} not boolean`); return o ? o[v] : v; },
    getEnum: (n, o) => o[h.getString(n)],
    getInstanceSwap: (n) => { h.getString(n); return handle(spec.props[n]); },
    getSlot: (n) => { const items = (spec.slots?.[n] || []).map((c) => handle(c, [], n)); const r = [{ type: 'SLOT', propertyName: n }]; r.connectedInstances = items.filter((i) => i.hasCodeConnect()); return r; },
    findInstance: (n) => all().find((x) => x.name === n) || { type: 'ERROR' },
    findConnectedInstances: (fn, opts = {}) => all().filter((x) => x.hasCodeConnect() && (!opts.path || opts.path.every((p) => x._anc.includes(p))) && fn(x)),
    findLayers: (fn) => all().filter(fn),
    executeTemplate: () => run(spec.node, h),
  };
  h._anc = ancestors;
  const all = () => {
    const out = [];
    const walk = (s, anc, slot) => (s.children || []).forEach((c) => { const ch = handle(c, [...anc, ...(c.parentFrames || [])], slot); out.push(ch); walk(c, [...anc, ...(c.parentFrames || [])], slot); });
    walk(spec, [], undefined);
    Object.entries(spec.slots || {}).forEach(([n, items]) => items.forEach((c) => { const ch = handle(c, [], n); out.push(ch); walk(c, [], n); }));
    return out;
  };
  return h;
}

function run(node, selected) {
  if (!node) return { example: [{ type: 'CODE', code: '<UnconnectedIcon />' }], metadata: {} };
  const doc = byNode[node];
  const figma = { selectedInstance: selected, currentLayer: selected, tsx: tag, code: tag, helpers: { react: { renderProp } } };
  const body = doc.template.replace(/export default/, 'return');
  const res = new Function('require', body)(() => figma);
  return { example: res.example.sections, metadata: res.metadata, imports: res.imports };
}

const icon = (name) => ({ name, props: {} });
const button = (label, hierarchy, extra = {}) => ({ name: 'Button', cc: 'Button', node: '25416-2898', props: { Label: label, Hierarchy: hierarchy, Size: 'sm', State: 'Default', 'Leading icon': false, 'Trailing icon': false, 'Leading icon swap': icon('icon/plus'), 'Trailing icon swap': icon('icon/arrow'), ...extra } });
const buttonIcon = { name: 'Action', cc: 'ButtonIcon', node: '25416-17407', props: { Icon: icon('icon/pen'), Hierarchy: 'Tertiary', Size: 'sm', State: 'Default' } };
const menuItem = (label, extra = {}) => ({ name: 'Menu item', cc: 'MenuItem', node: '25419-933', props: { Label: label, 'Leading icon': false, 'Leading icon swap': icon('icon/x'), Shortcut: false, 'Shortcut text': '⌘K', Size: 'sm', State: 'Default', ...extra } });
const navItem = (label, state) => ({ name: 'Nav item', cc: 'NavItem', node: '25431-67', props: { Label: label, 'Icon swap': icon('icon/home'), Badge: false, Chevron: false, Collapsed: 'False', State: state } });
const tab = (label, state, count) => ({ name: 'Tab', props: { Label: label, State: state, Count: !!count, 'Count number': String(count || 3) } });

const cases = [
  ['25425-172', 'Card (custom footer, header action)', { name: 'Card', props: { Header: true, 'Header action': true, Footer: true, Title: 'Billing', 'Supporting text': 'Manage your plan', Style: 'Outlined', Padding: 'lg' },
    children: [buttonIcon, { ...button('Discard', 'Tertiary'), parentFrames: ['Footer'] }, { ...button('Upgrade plan', 'Primary', { 'Leading icon': true }), parentFrames: ['Footer'] }],
    slots: { Content: [button('Inside content', 'Link')] } }],
  ['25425-172', 'Card (no header/footer)', { name: 'Card', props: { Header: false, 'Header action': false, Footer: false, Title: 'x', 'Supporting text': 'y', Style: 'Elevated', Padding: 'md' }, children: [], slots: { Content: [] } }],
  ['25424-453', 'Modal (Delete/Keep)', { name: 'Modal', props: { Title: 'Delete project?', Description: 'This cannot be undone.', 'Featured icon': true, 'Close button': false, Actions: true, Size: 'sm', Type: 'Destructive' },
    children: [{ ...buttonIcon, name: 'Close' }, { ...button('Keep', 'Outline'), parentFrames: ['Actions'] }, { ...button('Delete', 'Primary'), parentFrames: ['Actions'] }], slots: { Content: [] } }],
  ['25427-447', 'Alert', { name: 'Alert', props: { Title: 'Update available', Description: 'Restart to apply.', 'Show description': true, Actions: true, Close: true, Style: 'Subtle', Color: 'Brand' },
    children: [button('Later', 'Tertiary'), button('Restart', 'Link'), { ...buttonIcon, name: 'Close' }] }],
  ['25433-71', 'EmptyState (single action)', { name: 'Empty state', props: { Title: 'No invoices', Description: 'Create your first invoice.', Actions: true, Size: 'md' }, children: [button('New invoice', 'Primary')] }],
  ['25419-934', 'DropdownMenu', { name: 'Dropdown menu', props: {}, slots: { Items: [menuItem('Duplicate', { Shortcut: true }), menuItem('Archive', { State: 'Disabled' }), menuItem('Delete')] } }],
  ['25431-195', 'Sidebar', { name: 'Sidebar navigation', props: { Collapsed: 'False' }, children: [navItem('Home', 'Active'), navItem('Reports', 'Default')] }],
  ['25431-196', 'AppHeader', { name: 'App header', props: {}, children: [{ ...buttonIcon, name: 'Button icon' }, { name: 'Avatar', cc: 'Avatar', node: '25422-267', props: { Size: 'sm', Shape: 'Circle', Type: 'Initials', Initials: 'OR', Status: true, 'Icon swap': icon('icon/user') } }] }],
  ['25423-513', 'Tabs', { name: 'Tabs', props: { Style: 'Pill' }, children: [tab('Overview', 'Default'), tab('Billing & plans', 'Active', 2), tab('Danger zone', 'Disabled')] }],
  ['25426-419', 'Table header cell', { name: 'Table header cell', props: { Label: 'Email', Checkbox: true, Sortable: false } }],
  ['25430-2200', 'Calendar range', { name: 'Calendar', props: { Type: 'Range' } }],
  ['25419-14605', 'Checkbox indeterminate', { name: 'Checkbox', props: { 'Show label': true, Label: 'Accept', 'Show description': false, Description: 'd', Size: 'md', Checked: 'Indeterminate', State: 'Default' } }],
];
let fail = 0;
for (const [node, title, spec] of cases) {
  try {
    const r = run(node, handle(spec));
    console.log(`\n=== ${title}\n${toText(r.example)}`);
    if (/<<ERROR|undefined|\[object/.test(toText(r.example))) { fail++; console.log('!! suspicious output'); }
  } catch (e) { fail++; console.log(`\n=== ${title}\n!! ${e.stack}`); }
}
console.log(`\n${fail} failing case(s)`);
process.exit(fail ? 1 : 0);
