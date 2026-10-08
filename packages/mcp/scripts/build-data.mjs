#!/usr/bin/env node
// Bundles the Atomus knowledge the MCP server serves into generated/data.json, at build time:
// the manifest (components, props, tokens), the guidelines (core rules, catalogue, decision trees, setup),
// the page patterns, the consumer templates and the brand ramp. Nothing is fetched at run time.
//
//   node scripts/build-data.mjs        (run by `npm run build`)
import { readFileSync, writeFileSync, readdirSync, mkdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const pkg = join(dirname(fileURLToPath(import.meta.url)), '..');
const root = join(pkg, '..', '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
const { assemble } = await import(pathToFileURL(join(root, 'packages/manifest/scripts/assemble.mjs')).href);
const manifest = assemble(); // packages/manifest/src, built by scripts/build-manifest.mjs

/** "## Heading" sections of a Markdown file → { heading: body }. */
function sections(md, level = 2) {
  const out = {};
  const re = new RegExp(`^${'#'.repeat(level)} (.+)$`, 'gm');
  const heads = [...md.matchAll(re)];
  heads.forEach((h, i) => {
    const end = i + 1 < heads.length ? heads[i + 1].index : md.length;
    out[h[1].trim()] = md.slice(h.index + h[0].length, end).trim();
  });
  return out;
}

// ---- guidelines
const guidelines = sections(read('guidelines/Guidelines.md'));
const overview = read('guidelines/overview-components.md');
const overviewSections = sections(overview);
const decisionTrees = sections(overviewSections['Decision trees'] ?? '', 3);
const setup = sections(read('guidelines/setup.md'));

// ---- patterns (skills/atomus/references/patterns.md + messaging guideline for AI chat)
const patternsMd = read('skills/atomus/references/patterns.md');
const patternSections = sections(patternsMd);
const sharedCss = patternsMd.match(/Shared layout CSS for the patterns:\s*\n\s*```css\n([\s\S]*?)```/)?.[1]?.trim() ?? '';
const messaging = sections(read('guidelines/components/messaging.md'));
const websiteSections = read('guidelines/website-sections.md');
const PATTERN_KEYS = {
  'app-shell': 'App shell',
  dashboard: 'Dashboard',
  settings: 'Settings',
  auth: 'Auth (log in, sign up)',
  'table-view': 'Table view',
  'website-sections': 'Website sections',
};
const patterns = {};
for (const [key, heading] of Object.entries(PATTERN_KEYS)) {
  if (!patternSections[heading]) throw new Error(`patterns.md has no "## ${heading}" section`);
  patterns[key] = { title: heading, body: patternSections[heading] };
}
patterns['website-sections'].body += `\n\n### Section catalogue (guidelines/website-sections.md)\n\n${websiteSections.replace(/^# .*\n/, '').trim()}`;
// AI chat: composed from the Messaging guideline (Chat, Message bubble, Message input) — all Figma-only — and React parts.
patterns['ai-chat'] = {
  title: 'AI chat',
  body: [
    'A chat with an AI assistant: a scrolling message list, assistant and user bubbles, and a composer at the bottom. Chat, Message bubble and Message input are **Figma-only**: compose them from `Avatar`, `Button`, `Badge`, `Alert`, tokens and a native `<textarea>`. Never import `Chat` or `MessageBubble` from `@stanvision/atomus-react`.',
    '```tsx',
    "import { Avatar, Button, Alert, Badge } from '@stanvision/atomus-react';",
    '',
    'export function AssistantChat({ messages, onSend, busy, error }: ChatProps) {',
    '  return (',
    '    <section className="chat" aria-label="Assistant">',
    '      <ol className="chat__messages" aria-live="polite">',
    '        {messages.map((m) => (',
    "          <li key={m.id} className={m.role === 'user' ? 'bubble bubble--sent' : 'bubble'}>",
    "            {m.role === 'assistant' ? <Avatar name=\"Assistant\" size=\"sm\" /> : null}",
    '            <div className="bubble__body">',
    '              <p className="text-content-small bubble__meta">{m.author} · <time dateTime={m.at}>{m.time}</time></p>',
    '              <div className="text-content-body">{m.text}</div>',
    '            </div>',
    '          </li>',
    '        ))}',
    '      </ol>',
    '      {error ? <Alert color="error" title="The assistant could not answer">{error}</Alert> : null}',
    '      <form className="chat__composer" onSubmit={onSend}>',
    '        <label htmlFor="prompt" className="visually-hidden">Message</label>',
    '        <textarea id="prompt" name="prompt" rows={1} placeholder="Ask anything" />',
    '        <Button type="submit" hierarchy="primary" loading={busy}>Send</Button>',
    '      </form>',
    '    </section>',
    '  );',
    '}',
    '```',
    '```css',
    '.chat { display: flex; flex-direction: column; gap: var(--spacing-xl); height: 100%; background: var(--color-bg-primary); }',
    '.chat__messages { display: flex; flex-direction: column; gap: var(--spacing-xl); margin: 0; padding: var(--spacing-3xl); overflow-y: auto; list-style: none; }',
    '.bubble { display: flex; gap: var(--spacing-lg); max-width: 72ch; }',
    '.bubble__body { padding: var(--spacing-lg) var(--spacing-xl); border-radius: var(--radius-xl); background: var(--color-bg-secondary); color: var(--color-text-primary); }',
    '.bubble--sent { align-self: flex-end; }',
    '.bubble--sent .bubble__body { background: var(--color-bg-brand-solid); color: var(--color-text-on-brand); }',
    '.bubble__meta { color: var(--color-text-tertiary); }',
    '.chat__composer { display: flex; align-items: flex-end; gap: var(--spacing-lg); padding: var(--spacing-xl); border-top: 1px solid var(--color-border-secondary); }',
    '.chat__composer textarea { flex: 1; min-height: var(--size-md); padding: var(--spacing-md) var(--spacing-lg); border: 1px solid var(--color-border-primary); border-radius: var(--radius-md); background: var(--color-bg-primary); color: var(--color-text-primary); font: inherit; resize: vertical; }',
    '.chat__composer textarea:focus-visible { outline: none; border-color: var(--color-border-focus); box-shadow: var(--shadow-focus-ring); }',
    '```',
    '- One primary per view: **Send** is the primary; actions on messages (copy, retry, rate) are `Button hierarchy="tertiary" size="sm" iconOnly` with an `aria-label`.',
    '- Show a streaming answer in the assistant bubble and keep `aria-live="polite"` on the list; use `<Button loading>` on Send while the request runs.',
    '- Errors stay visible as an `Alert` above the composer; a `Badge` can mark an answer as a draft or as AI-generated.',
    '',
    '### Message bubble (Figma)',
    messaging['Message bubble'] ?? '',
    '',
    '### Chat (Figma)',
    messaging.Chat ?? '',
    '',
    '### Message input (Figma)',
    messaging['Message input'] ?? '',
  ].join('\n'),
};

// ---- consumer templates (every file in templates/consumer)
const templates = {};
(function walk(dir) {
  for (const f of readdirSync(join(root, dir))) {
    const p = join(dir, f);
    if (statSync(join(root, p)).isDirectory()) walk(p);
    else templates[relative('templates/consumer', p).split('\\').join('/')] = read(p);
  }
})('templates/consumer');

// ---- brand ramp and which semantic tokens use which brand step (light / dark)
function flatten(tree) {
  const list = [];
  (function walk(o, path) {
    for (const [k, v] of Object.entries(o)) {
      if (k.startsWith('$')) continue;
      if (v && typeof v === 'object' && '$value' in v) list.push({ path: [...path, k].join('.'), value: v.$value, css: v.$extensions?.['com.figma']?.codeSyntax?.WEB?.match(/var\((--[\w-]+)\)/)?.[1] });
      else if (v && typeof v === 'object') walk(v, [...path, k]);
    }
  })(tree, []);
  return list;
}
const prims = flatten(JSON.parse(read('tokens/primitives.tokens.json')));
const brandTokens = flatten(JSON.parse(read('tokens/brand.atomus.tokens.json')));
const byPath = new Map([...prims, ...brandTokens].map((t) => [t.path, t]));
const resolve = (v, d = 0) => (typeof v === 'string' && /^\{.+\}$/.test(v) && d < 10 ? resolve(byPath.get(v.slice(1, -1))?.value, d + 1) : v);
const ramp = {};
for (const t of brandTokens) {
  const step = t.css?.match(/--color-brand-(\d+)/)?.[1];
  if (step) ramp[step] = resolve(t.value);
}
const usage = {};
for (const [mode, file] of [['light', 'color.light.tokens.json'], ['dark', 'color.dark.tokens.json']]) {
  for (const t of flatten(JSON.parse(read(`tokens/${file}`)))) {
    const m = typeof t.value === 'string' && t.value.match(/^\{colors\.brand\.(\d+)\}$/);
    if (m && t.css) (usage[t.css] ??= {})[mode] = m[1];
  }
}

// ---- Figma MCP rules (for figma_to_code notes)
const figmaRules = read('guidelines/figma-mcp-rules.md');

const data = {
  version: manifest.version,
  docs: 'https://docs.atomus.io',
  manifest,
  guidelines: {
    intro: guidelines['What Atomus is'] ?? '',
    coreRules: guidelines['Core rules'] ?? '',
    forbidden: guidelines.Forbidden ?? '',
    beforeYouFinish: guidelines['Before you finish'] ?? '',
    setup: {
      install: setup.Install ?? '',
      imports: setup['Import the CSS once, at the app root'] ?? '',
      themes: setup['Theme attributes'] ?? '',
      brand: setup['Add a client brand'] ?? '',
      fonts: setup.Fonts ?? '',
      dontConfigure: setup["Don't configure"] ?? '',
    },
    catalogue: overviewSections.Catalogue ?? '',
    aliases: overviewSections['Also called'] ?? '',
    decisionTrees,
    figmaRules,
  },
  patterns: { sharedCss, items: patterns },
  templates,
  brand: { ramp, usage },
};

mkdirSync(join(pkg, 'generated'), { recursive: true });
writeFileSync(join(pkg, 'generated/data.json'), JSON.stringify(data));
console.log(`atomus-mcp: bundled data (${manifest.components.length} components, ${Object.keys(patterns).length} patterns, ${Object.keys(templates).length} template(s)) → generated/data.json`);
