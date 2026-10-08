// Spawns the built stdio server (dist/stdio.js) and calls every tool through the MCP client SDK.
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const server = fileURLToPath(new URL('../dist/stdio.js', import.meta.url));
const TOOLS = ['atomus_get_started', 'atomus_list_components', 'atomus_get_component', 'atomus_find_token', 'atomus_get_pattern', 'atomus_figma_to_code', 'atomus_validate', 'atomus_init', 'atomus_brand'];
const PATTERNS = ['app-shell', 'dashboard', 'table-view', 'settings', 'auth', 'website-sections', 'ai-chat'];

let client;
const outputs = [];
async function call(name, args = {}) {
  const res = await client.callTool({ name, arguments: args });
  const text = res.content.map((c) => c.text).join('\n');
  outputs.push({ name, text });
  return { text, isError: Boolean(res.isError) };
}
const codeBlocks = (md, lang) => [...md.matchAll(new RegExp('```' + lang + '\\n([\\s\\S]*?)```', 'g'))].map((m) => m[1]);

before(async () => {
  client = new Client({ name: 'atomus-mcp-test', version: '0.0.0' });
  await client.connect(new StdioClientTransport({ command: process.execPath, args: [server], stderr: 'inherit' }));
});
after(async () => {
  await client?.close();
});

describe('atomus-mcp over stdio', () => {
  it('lists the nine tools with imperative descriptions and read-only annotations', async () => {
    const { tools } = await client.listTools();
    assert.deepEqual(tools.map((t) => t.name).sort(), [...TOOLS].sort());
    const by = Object.fromEntries(tools.map((t) => [t.name, t]));
    assert.match(by.atomus_get_started.description, /^CALL THIS FIRST/);
    assert.match(by.atomus_validate.description, /^REQUIRED FINAL STEP/);
    assert.match(by.atomus_get_component.description, /ALWAYS call this before writing JSX/);
    for (const t of tools) assert.equal(t.annotations?.readOnlyHint, true, `${t.name} is read-only`);
    assert.match(client.getInstructions() ?? '', /CALL atomus_get_started FIRST/);
  });

  it('atomus_get_started', async () => {
    const { text } = await call('atomus_get_started', { task: 'Build a settings page from a Figma frame' });
    assert.match(text, /## Core rules/);
    assert.match(text, /## Forbidden/);
    assert.match(text, /atomus_figma_to_code/);
    assert.match(text, /REQUIRED FINAL STEP/);
  });

  it('atomus_list_components: catalogue, aliases, decision trees, alias query', async () => {
    const all = await call('atomus_list_components');
    assert.match(all.text, /\| Modal \|/);
    assert.match(all.text, /Figma only/);
    assert.match(all.text, /## Also called/);
    assert.match(all.text, /### Alert, Toast, Banner, Modal/);
    const dialog = await call('atomus_list_components', { query: 'dialog' });
    assert.match(dialog.text, /\*\*Modal\*\*/);
    const sheet = await call('atomus_list_components', { query: 'side sheet' });
    assert.match(sheet.text, /\*\*Drawer\*\* \(Figma only/);
    const forms = await call('atomus_list_components', { category: 'Forms and inputs', decisionTrees: false, includeFigmaOnly: false });
    assert.match(forms.text, /`<Input>`/);
    assert.doesNotMatch(forms.text, /Textarea/);
  });

  it('atomus_get_component: React, Figma-only, alias, JSON, unknown', async () => {
    const button = await call('atomus_get_component', { name: 'Button' });
    assert.match(button.text, /import \{ Button \} from '@stanvision\/atomus-react';/);
    assert.match(button.text, /`hierarchy` \| "primary" · "secondary" · "outline" · "tertiary" · "link" \| secondary/);
    assert.match(button.text, /Never put two primary buttons in one view/);
    assert.match(button.text, /Button icon → 25416:17407/);
    const drawer = await call('atomus_get_component', { name: 'Drawer' });
    assert.match(drawer.text, /Do not import Drawer/);
    const viaAlias = await call('atomus_get_component', { name: 'snackbar' });
    assert.match(viaAlias.text, /^# Toast/);
    const viaFigma = await call('atomus_get_component', { name: 'Date picker' });
    assert.match(viaFigma.text, /^# DatePicker/);
    const json = await call('atomus_get_component', { name: 'Modal', format: 'json' });
    const entry = JSON.parse(codeBlocks(json.text, 'json')[0]);
    assert.equal(entry.name, 'Modal');
    assert.equal(entry.props.open.required, true);
    const unknown = await call('atomus_get_component', { name: 'Hyperdrive' });
    assert.equal(unknown.isError, true);
  });

  it('atomus_find_token: intents, hex, px, primitive, kind filter', async () => {
    const t = await call('atomus_find_token', { query: 'supporting text' });
    assert.match(t.text, /Best match: `var\(--color-text-secondary\)`/);
    assert.match(t.text, /#3f3f46 \/ #d4d4d8/);
    const border = await call('atomus_find_token', { query: 'card border' });
    assert.match(border.text, /Best match: `var\(--color-border-secondary\)`/);
    const page = await call('atomus_find_token', { query: 'page background' });
    assert.match(page.text, /Best match: `var\(--color-bg-primary\)`/);
    const hex = await call('atomus_find_token', { query: '#4057ff' });
    assert.match(hex.text, /--color-bg-brand-solid/);
    const px = await call('atomus_find_token', { query: '16px', kind: 'spacing' });
    assert.match(px.text, /Best match: `var\(--spacing-xl\)`/);
    const section = await call('atomus_find_token', { query: 'space between sections', kind: 'spacing' });
    assert.match(section.text, /--layout-|--section-padding/);
    const prim = await call('atomus_find_token', { query: '--color-gray-500' });
    assert.match(prim.text, /--color-text-tertiary/);
    const radius = await call('atomus_find_token', { query: 'button corner radius', kind: 'radius' });
    assert.match(radius.text, /--radius-/);
    const none = await call('atomus_find_token', { query: 'zzqx' });
    assert.match(none.text, /No Atomus token matches/);
  });

  for (const pattern of PATTERNS) {
    it(`atomus_get_pattern ${pattern}: returns code that passes atomus_validate`, async () => {
      const { text, isError } = await call('atomus_get_pattern', { pattern });
      assert.equal(isError, false);
      const blocks = [...codeBlocks(text, 'tsx').map((c) => ['P.tsx', c]), ...codeBlocks(text, 'css').map((c) => ['p.css', c])];
      assert.ok(blocks.length > 0, 'has code');
      for (const [filename, code] of blocks) {
        const v = await call('atomus_validate', { code, filename });
        assert.match(v.text, /\n0 error\(s\)/, `${pattern} ${filename}:\n${v.text}`);
      }
    });
  }

  it('atomus_figma_to_code: Button, Button icon, Alert, Card (JSDoc mapping), Figma-only', async () => {
    const b = await call('atomus_figma_to_code', { component: 'Button', properties: { Hierarchy: 'Primary', Size: 'lg', State: 'Loading', Label: 'Save changes', 'Leading icon': false } });
    assert.match(b.text, /<Button hierarchy="primary" size="lg" loading>Save changes<\/Button>/);
    assert.match(b.text, /atomus_validate:\*\* no problems/);
    const hover = await call('atomus_figma_to_code', { component: 'Button', properties: { Hierarchy: 'Secondary', State: 'Hover', Label: 'Cancel' } });
    assert.match(hover.text, /State=Hover is an interaction state/);
    const icon = await call('atomus_figma_to_code', { component: 'Button icon', properties: { Hierarchy: 'Tertiary', Size: 'sm', Icon: 'trash' }, text: 'Delete project' });
    assert.match(icon.text, /<Button iconOnly hierarchy="tertiary" size="sm" iconLeading=\{<TrashIcon \/>\} aria-label="Delete project" \/>/);
    const alert = await call('atomus_figma_to_code', { component: 'Alert', properties: { Color: 'Error', Style: 'Subtle', Title: 'Payment failed', 'Show description': true, Description: 'Update your card.', Close: true } });
    assert.match(alert.text, /<Alert title="Payment failed" variant="subtle" color="error" onClose=\{\(\) => \{\}\}>Update your card\.<\/Alert>/);
    const card = await call('atomus_figma_to_code', { component: 'Card', properties: { Style: 'Filled', Padding: 'lg', Title: 'Billing' } });
    assert.match(card.text, /variant="filled"/);
    assert.match(card.text, /padding="lg"/);
    const drawer = await call('atomus_figma_to_code', { component: 'Drawer', properties: { Position: 'Right' } });
    assert.match(drawer.text, /Figma-only/);
  });

  it('atomus_validate: TSX errors, suggestions, fixes; CSS; clean code', async () => {
    const bad = `import { Button, Drawer } from '@stanvision/atomus-react';
export function Page() {
  return (
    <div className="p-[16px] text-gray-500" style={{ color: '#4057ff' }}>
      <Button hierarchy="Primary">Save</Button>
      <Button hierarchy="primary">Publish</Button>
      <Button iconOnly iconLeading={<TrashIcon />} />
      <button>Raw</button>
    </div>
  );
}`;
    const v = await call('atomus_validate', { code: bad, filename: 'Page.tsx', fix: true });
    for (const rule of ['atomus/valid-props', 'atomus/no-raw-color', 'atomus/no-primitive-token', 'atomus/no-arbitrary-value', 'atomus/icon-only-needs-label', 'atomus/prefer-atomus-component', 'atomus/one-primary-per-view']) assert.match(v.text, new RegExp(rule.replace('/', '\\/')), rule);
    assert.match(v.text, /Drawer is a Figma-only Atomus component/);
    const fixed = codeBlocks(v.text, 'tsx')[0];
    assert.match(fixed, /className="p-xl text-gray-500"/);
    assert.match(fixed, /hierarchy="primary">Save/);
    const css = await call('atomus_validate', { code: '.card { padding: 16px; color: #333; border-radius: 8px; border-color: var(--color-gray-200); }', filename: 'card.css', fix: true });
    assert.match(css.text, /atomus\/use-tokens/);
    assert.match(css.text, /atomus\/no-raw-color/);
    assert.match(css.text, /atomus\/no-primitive-token/);
    assert.match(codeBlocks(css.text, 'css')[0], /padding: var\(--spacing-xl\)/);
    const clean = await call('atomus_validate', { code: `import { Button } from '@stanvision/atomus-react';\nexport const A = () => <Button hierarchy="primary">Save</Button>;\n` });
    assert.match(clean.text, /No problems found/);
  });

  it('atomus_init: returns files, writes nothing', async () => {
    const { text } = await call('atomus_init', { styling: 'tailwind' });
    for (const f of ['AGENTS.atomus.md', 'CLAUDE.md', '.cursor/rules/atomus.mdc', '.github/copilot-instructions.md', 'eslint.config.js', 'stylelint.config.js', '.mcp.json', '.vscode/mcp.json', '.cursor/mcp.json']) assert.match(text, new RegExp(`## ${f.replace(/[.]/g, '\\.')}`), f);
    assert.match(text, /@import "@stanvision\/atomus-tokens\/tailwind";/);
    assert.match(text, /writes nothing/);
    const only = await call('atomus_init', { agents: ['claude'], lint: false, mcp: false });
    assert.doesNotMatch(only.text, /eslint\.config\.js/);
    assert.match(only.text, /## CLAUDE\.md/);
  });

  it('atomus_brand: ramp, contrast, instructions', async () => {
    const { text } = await call('atomus_brand', { hex: '#FF6600', name: 'Acme Corp' });
    assert.match(text, /\[data-brand="acme-corp"\] \{/);
    const css = codeBlocks(text, 'css')[0];
    assert.equal((css.match(/--color-brand-\d+: #[0-9a-f]{6};/g) ?? []).length, 12);
    assert.match(css, /#ff6600/);
    assert.match(text, /## Contrast/);
    assert.match(text, /Brand.*collection/);
    const bad = await call('atomus_brand', { hex: '#123456', name: 'violet' });
    assert.equal(bad.isError, true);
    const v = await call('atomus_validate', { code: css, filename: 'brand.css' });
    assert.match(v.text, /\n0 error\(s\)/);
  });

  it('closed world: every URL in every tool result is on docs.atomus.io', () => {
    assert.ok(outputs.length > 30);
    for (const { name, text } of outputs) {
      for (const url of text.match(/https?:\/\/[^\s)\]"'`<>]+/g) ?? []) assert.match(url, /^https:\/\/docs\.atomus\.io(\/|$)/, `${name} returned ${url}`);
    }
  });
});
