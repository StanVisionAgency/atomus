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

// Agent kit (react/src/components/ai)
const suggestion = (label, extra = {}) => ({ name: 'Suggestion', cc: 'Suggestion', node: '25545-252', props: { Label: label, Description: 'One line', 'Show icon': false, Icon: icon('icon/shield'), Style: 'Chip', Action: 'Send', ...extra } });
const sourceItem = (n, title) => ({ name: 'Source item', cc: 'SourceItem', node: '25547-794', props: { Number: String(n), Title: title, Domain: 'w3.org', Snippet: 'A placeholder is not a label.', 'Show snippet': true, Link: true, 'Site icon': icon('icon/globe') } });
const step = (label, status, detail) => ({ name: 'Reasoning step', cc: 'ReasoningStep', node: '25548-901', props: { Label: label, Detail: detail || 'd', 'Show detail': !!detail, Status: status } });
const modelOption = (name, state, desc, badge) => ({ name: 'Model option', cc: 'ModelOption', node: '25546-397', props: { Name: name, Description: desc, Badge: !!badge, 'Badge label': badge || 'New', Capabilities: true, State: state, 'Provider icon': icon('AI mark') } });
const attachment = (name, status) => ({ name: 'Attachment', cc: 'PromptAttachment', node: '25553-1183', props: { Name: name, Status: status, Removable: true, Thumb: icon('icon/file'), ...(status === 'Ready' ? { Size: '2.4 MB' } : {}) } });
const slotChild = (name) => ({ name, props: {} });
cases.push(
  ['25553-1955', 'PromptInput (streaming, attachments, commands)', { name: 'Prompt input', props: { Size: 'md', State: 'Streaming', Placeholder: 'Ask anything…', 'Show placeholder': false, Text: 'Audit our checkout page', 'Show text': true, 'Show attachments': true, 'Command menu': true, 'Attach button': true, Disclaimer: 'AI can make mistakes. Check important info.', 'Show disclaimer': true },
    children: [{ ...menuItem('Audit a page', { Shortcut: true, 'Shortcut text': '/audit' }), parentFrames: ['Command menu'] }],
    slots: { Attachments: [attachment('checkout-audit.pdf', 'Ready'), attachment('contrast.png', 'Uploading')], Toolbar: [slotChild('Model selector')], Actions: [slotChild('Context meter')] } }],
  ['25552-1473', 'Message (assistant, done)', { name: 'Message', props: { Role: 'Assistant', Status: 'Done', 'Actions visibility': 'Always', Name: 'Atomus Assistant', 'Show name': true, 'AI label': true, Timestamp: '2:41 PM', 'Show timestamp': true, Copy: true, Regenerate: true, Feedback: true, Branch: true, 'Branch count': '2/3', Avatar: icon('Message avatar') }, slots: { Content: [slotChild('Text')] } }],
  ['25552-1473', 'Message (user, hover)', { name: 'Message', props: { Role: 'User', Status: 'Done', 'Actions visibility': 'Hover', Name: 'Kristina', 'Show name': false, Timestamp: '2:41 PM', 'Show timestamp': true, Copy: true, Edit: true, Branch: false, 'Branch count': '1/1' }, slots: { Content: [slotChild('Text')] } }],
  ['25552-1473', 'Message (assistant, error)', { name: 'Message', props: { Role: 'Assistant', Status: 'Error', 'Actions visibility': 'Always', Name: 'Atomus Assistant', 'Show name': true, 'AI label': true, Timestamp: '2:41 PM', 'Show timestamp': false, Copy: false, Branch: false, 'Branch count': '1/1', 'Error message': 'The model is overloaded.' }, slots: { Content: [] } }],
  ['25552-1473', 'Message (system)', { name: 'Message', props: { Role: 'System', Status: 'Done', 'Actions visibility': 'Always', 'System text': 'Model switched to Atomus Fast' } }],
  ['25544-55', 'StreamingText', { name: 'Streaming text', props: { Text: 'Checking the token files', State: 'Streaming', Announce: 'Off', Caret: true } }],
  ['25544-34', 'Shimmer', { name: 'Shimmer', props: { Label: 'Thinking…', Animated: true } }],
  ['25548-978', 'Reasoning (done, open)', { name: 'Reasoning', props: { State: 'Done', Expanded: 'True', Label: 'Thought for 12s', Steps: true, Summary: 'Three issues found.', 'Show summary': true },
    children: [step('Load the page', 'Done'), step('Run axe-core', 'Done', '68 rules · 3 violations')] }],
  ['25548-978', 'Reasoning (thinking, collapsed)', { name: 'Reasoning', props: { State: 'Thinking', Expanded: 'False' } }],
  ['25548-1134', 'ToolCall (success, open)', { name: 'Tool call', props: { Status: 'Success', Expanded: 'True', Title: 'Audited checkout.atomus.io', 'Tool name': 'run_axe_audit', 'Show tool name': true, Duration: '1.5s', 'Show duration': true, Input: '{\n  "url": "https://checkout.atomus.io"\n}', Output: '{\n  "violations": 3\n}', Icon: icon('icon/wrench') } }],
  ['25548-1134', 'ToolCall (error, collapsed)', { name: 'Tool call', props: { Status: 'Error', Expanded: 'False', Title: 'Filing issues', 'Tool name': 'linear.create_issues', 'Show tool name': true, Duration: '320ms', 'Show duration': true, Icon: icon('icon/wrench') } }],
  ['25550-1196', 'Approval (high, pending)', { name: 'Approval', props: { Risk: 'High', State: 'Pending', Title: 'Delete 214 unused variables?', 'Tool name': 'figma.delete_variables', 'Show tool name': true, Summary: 'This cannot be undone.', 'Show summary': true, 'Show details': true, 'Always allow': true, Editable: false },
    children: [{ name: 'Always allow', props: { Label: 'Always allow in this chat' } }, button('Keep', 'Tertiary'), { ...button('Delete variables', 'Primary'), name: 'Approve' }, { ...button('Deny', 'Tertiary'), name: 'Deny' }], slots: { Details: [slotChild('Preview')] } }],
  ['25550-1196', 'Approval (low, approved)', { name: 'Approval', props: { Risk: 'Low', State: 'Approved', Title: 'Read 3 files?', 'Tool name': 'fs.read', 'Show tool name': true, Summary: 's', 'Show summary': false, 'Show details': false, 'Always allow': false, Editable: false }, slots: { Details: [] } }],
  ['25547-925', 'Sources (collapsible, open)', { name: 'Sources', props: { Style: 'Collapsible', Expanded: 'True', Label: '3 sources' }, children: [sourceItem(1, 'Contrast (Minimum)'), sourceItem(2, 'Labels or Instructions')] }],
  ['25547-925', 'Sources (list, no items)', { name: 'Sources', props: { Style: 'List', Expanded: 'True' } }],
  ['25547-946', 'InlineCitation', { name: 'Inline citation', props: { Number: '2', Title: 'Labels or Instructions', Domain: 'w3.org', Snippet: 'A placeholder is not a label.', Preview: true, State: 'Hover' } }],
  ['25545-453', 'Suggestions (chips, insert, wrap)', { name: 'Suggestions', props: { Style: 'Chips', Action: 'Insert', Wrap: 'True' }, children: [suggestion('Fix the contrast issue', { Action: 'Insert' }), suggestion('Show the axe report', { Action: 'Insert' })] }],
  ['25545-453', 'Suggestions (cards)', { name: 'Suggestions', props: { Style: 'Cards', Action: 'Send', Wrap: 'False' }, children: [suggestion('Audit our checkout page', { Style: 'Card', Description: 'Find WCAG 2.2 issues' })] }],
  ['25546-1208', 'ModelSelector (open, outline)', { name: 'Model selector', props: { Style: 'Outline', Size: 'md', State: 'Open', Placement: 'Down', Model: 'Atomus Pro', Label: 'Default model', 'Show label': true, 'Show provider icon': true, 'Provider icon': icon('AI mark') },
    children: [modelOption('Atomus Pro', 'Selected', 'StanVision · Best for long, careful work', 'New'), modelOption('Local 8B', 'Disabled', 'On device · Private, works offline')] }],
  ['25546-1208', 'ModelSelector (ghost, closed)', { name: 'Model selector', props: { Style: 'Ghost', Size: 'sm', State: 'Default', Placement: 'Up', Model: 'Atomus Fast', Label: 'Model', 'Show label': false, 'Show provider icon': true, 'Provider icon': icon('AI mark') } }],
  ['25545-219', 'Feedback (down, form)', { name: 'Feedback', props: { Rating: 'Down', Size: 'sm', Form: true } }],
  ['25545-219', 'Feedback (none)', { name: 'Feedback', props: { Rating: 'None', Size: 'xs' } }],
  ['25543-123', 'AILabel (chip, popover)', { name: 'AI label', props: { Size: 'xs', Style: 'Chip', Edited: 'False', Label: 'Beta', 'Explainability popover': true } }],
  ['25543-123', 'AILabel (edited, inline)', { name: 'AI label', props: { Size: 'sm', Style: 'Inline', Edited: 'True', 'Explainability popover': true } }],
  ['25543-124', 'AILabel popover', { name: 'AI label popover', props: { Title: 'About this AI content', Explanation: 'Written from merged pull requests.', Model: 'Atomus Fast', 'Show model': true, 'Revert to AI': true } }],
  ['25546-320', 'ContextMeter (bar, warning)', { name: 'Context meter', props: { Style: 'Bar', State: 'Warning', Label: 'Context window', Used: '168K', Limit: '200K', Cost: '$1.12', 'Show cost': true, Breakdown: true } }],
  ['25546-320', 'ContextMeter (compact)', { name: 'Context meter', props: { Style: 'Compact', State: 'Default', Percentage: '24%' } }],
);
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
