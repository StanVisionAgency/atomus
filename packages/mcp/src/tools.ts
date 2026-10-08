// Atomus MCP tools: pure functions from input to Markdown. Transport-agnostic (stdio and the Worker share them).
import { data, manifest, type Component, type ColorToken, type ModeToken, type FigmaMapping } from './data.js';
import { brandRamp, contrast } from './brand.js';
import { DOCS } from './closed-world.js';

export interface Problem {
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
  rule: string;
  severity: 'error' | 'warning';
  message: string;
  fixable?: boolean;
  suggestions?: string[];
}
export interface ValidationResult {
  language: 'tsx' | 'css';
  engine: string;
  problems: Problem[];
  output?: string;
}
export interface Validator {
  validate(code: string, filename: string, fix: boolean): Promise<ValidationResult>;
}
export interface ToolResult {
  text: string;
  isError?: boolean;
}

const PKG = manifest.package;
const norm = (s: string) => s.toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9]/g, '');
const code = (s: string, lang = 'tsx') => `\`\`\`${lang}\n${s.trim()}\n\`\`\``;
const esc = (s: string) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const table = (head: string[], rows: string[][]) => [`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...rows.map((r) => `| ${r.map(esc).join(' | ')} |`)].join('\n');
const components = manifest.components;
const react = components.filter((c) => c.status !== 'figma-only');

// ------------------------------------------------------------------ lookup

export interface Lookup {
  match: Component | null;
  candidates: Component[];
}

/** Finds a component by React name, Figma component set name or another name people use ("dialog"). */
export function findComponent(name: string): Lookup {
  const q = norm(name);
  if (!q) return { match: null, candidates: [] };
  const exact = components.filter((c) => norm(c.name) === q);
  if (exact.length) return { match: exact[0], candidates: exact };
  const bySet = components.filter((c) => c.figma.componentSet.some((s) => norm(s) === q));
  if (bySet.length) return { match: bySet[0], candidates: bySet };
  const byAlias = components.filter((c) => c.aliases.some((a) => norm(a) === q));
  if (byAlias.length === 1) return { match: byAlias[0], candidates: byAlias };
  if (byAlias.length > 1) return { match: null, candidates: byAlias };
  const partial = components.filter((c) => norm(c.name).includes(q) || c.aliases.some((a) => norm(a).includes(q)) || (q.length > 3 && norm(c.purpose).includes(q)));
  return { match: partial.length === 1 ? partial[0] : null, candidates: partial.slice(0, 8) };
}

const statusLabel = (c: Component) => (c.status === 'figma-only' ? 'Figma only, no React export' : c.kind === 'hook' ? `hook, ${PKG}` : `React, ${PKG}`);
const docsLine = (c: Component) => (c.docs ? `Docs: ${c.docs}` : `Docs: ${DOCS}/components/`);

// ------------------------------------------------------------------ atomus_get_started

export function getStarted(task?: string): ToolResult {
  const figma = task && /figma|design|frame|node-id/i.test(task);
  const css = task && /\b(css|scss|stylesheet|tailwind|token|colou?r|theme|brand)\b/i.test(task);
  const g = data.guidelines;
  const next = [
    '1. **Pick components:** `atomus_list_components` (catalogue, other names, decision trees). Use `query` for names like "dialog" or "sheet".',
    '2. **Read each component before you use it:** `atomus_get_component` with its name. Use only the props and values it lists.',
    figma ? '3. **From a Figma design:** prefer the Code Connect snippet from the Figma MCP server; otherwise call `atomus_figma_to_code` with the component set name and its property values.' : '3. **Need a layout?** `atomus_get_pattern` (app shell, dashboard, table view, settings, auth, website sections, AI chat).',
    `4. **Style with tokens only:** \`atomus_find_token\` with the intent ("supporting text", "card border", "gap between sections"). Never write hex, rgb() or px for colour, spacing or radius.${css ? ' For a client brand colour use `atomus_brand`.' : ''}`,
    '5. **REQUIRED FINAL STEP:** run `atomus_validate` on every file you created or changed and fix every error before you hand over.',
    '6. Setting up a new project? `atomus_init` returns AGENTS.md / CLAUDE.md / Cursor rules, CSS imports and lint configs to create.',
  ];
  const text = [
    `# Atomus ${data.version}: start here`,
    'Atomus is one design system for product UI and marketing websites by StanVision: a Figma file, design tokens (`@stanvision/atomus-tokens`) and React components (`@stanvision/atomus-react`) whose props mirror the Figma properties. Follow these rules literally.',
    '## Workflow (follow in order)',
    next.join('\n'),
    '## Core rules',
    g.coreRules.replace(/`overview-components\.md`/g, '`atomus_list_components`').replace(/component's guideline file/g, 'component (`atomus_get_component`)').replace(/\*\*React API\*\* section/g, 'API returned by `atomus_get_component`'),
    '## Forbidden',
    g.forbidden,
    '## Setup (once per project)',
    code(["import '@stanvision/atomus-tokens/css';        // tokens + themes (Tailwind v4: @import \"@stanvision/atomus-tokens/tailwind\";)", "import '@stanvision/atomus-react/styles.css';  // component styles", "import { Button, Card, Input } from '@stanvision/atomus-react';"].join('\n'), 'ts'),
    'Theme with attributes on any element: `data-theme="light | dark | system"`, `data-brand="<brand>"`, `data-radius="default | sharp | round"`. Breakpoints (Desktop ≥ 1024, Tablet 768–1023, Mobile < 768) are automatic. The npm packages are publishing soon; until then install from the Atomus repo (see the docs).',
    '## Before you finish',
    g.beforeYouFinish.replace(/Run the Atomus validator[^\n]*/, 'Run `atomus_validate` on every file you touched and fix all errors (REQUIRED).'),
    `Docs: ${DOCS}/ · for agents: ${DOCS}/llms.txt`,
  ].join('\n\n');
  return { text };
}

// ------------------------------------------------------------------ atomus_list_components

export function listComponents(args: { query?: string; category?: string; includeFigmaOnly?: boolean; decisionTrees?: boolean }): ToolResult {
  const out: string[] = [];
  const includeFigmaOnly = args.includeFigmaOnly ?? true;
  if (args.query) {
    const { match, candidates } = findComponent(args.query);
    const hits = match ? [match] : candidates;
    out.push(`# Atomus components matching "${args.query}"`);
    if (!hits.length) out.push(`Nothing in Atomus is called "${args.query}". Compose it from Atomus components and tokens, or ask a human. Never invent a component.`);
    for (const c of hits) out.push(`- **${c.name}** (${statusLabel(c)}): ${c.purpose}${c.status === 'figma-only' && c.alternative ? `\n  In code: ${c.alternative}` : ''}${c.aliases.length ? `\n  Also called: ${c.aliases.join(', ')}` : ''}\n  Next: \`atomus_get_component\` with name "${c.name}".`);
    const names = hits.flatMap((c) => [c.name, ...c.figma.componentSet]).map((n) => n.toLowerCase());
    const trees = Object.entries(data.guidelines.decisionTrees).filter(([title, body]) => names.some((n) => title.toLowerCase().includes(n) || body.toLowerCase().includes(`**${n}**`)));
    if (trees.length && (args.decisionTrees ?? true)) out.push('## Relevant decision trees', ...trees.map(([t, b]) => `### ${t}\n\n${b}`));
    return { text: out.join('\n\n') };
  }
  out.push(`# Atomus components (${react.length} React exports from \`${PKG}\`, ${components.length - react.length} Figma-only)`);
  out.push('Use the React export when there is one. **Figma-only** components have no React export: never import them; use what the "In code" column says. Call `atomus_get_component` before you use any of them.');
  const cats = [...new Set(components.map((c) => c.category ?? 'Other'))];
  for (const cat of cats) {
    if (args.category && norm(cat) !== norm(args.category)) continue;
    const list = components.filter((c) => (c.category ?? 'Other') === cat && (includeFigmaOnly || c.status !== 'figma-only'));
    if (!list.length) continue;
    out.push(`## ${cat}`, table(['Component', 'Use it for', 'In code'], list.map((c) => [c.name, c.purpose, c.status === 'figma-only' ? `Figma only. ${c.alternative ?? ''}` : c.kind === 'hook' ? `\`${c.name}()\`` : `\`<${c.name}>\``])));
  }
  out.push('## Also called', 'If a request uses one of these names, use the Atomus component on the right.', data.guidelines.aliases.replace(/^If a request uses one of these names, use the Atomus component on the right\.\s*/m, ''));
  if (args.decisionTrees ?? true) out.push('## Decision trees', ...Object.entries(data.guidelines.decisionTrees).map(([t, b]) => `### ${t}\n\n${b}`));
  out.push(`Docs: ${DOCS}/components/choosing/`);
  return { text: out.join('\n\n') };
}

// ------------------------------------------------------------------ atomus_get_component

export function renderComponent(c: Component, format: 'markdown' | 'json' = 'markdown'): string {
  if (format === 'json') return code(JSON.stringify(c, null, 2), 'json');
  const out: string[] = [`# ${c.name}`, `**${statusLabel(c)}** · since ${c.since}${c.category ? ` · ${c.category}` : ''}`, c.purpose];
  if (c.description && c.description !== c.purpose) out.push(`Figma: ${c.description}`);
  if (c.status === 'figma-only') {
    out.push(`> **Do not import ${c.name}.** It exists only in the Figma file; \`${PKG}\` has no such export.${c.alternative ? `\n> In code: ${c.alternative}` : ''}`);
  } else {
    out.push(code(c.import ?? ''));
  }
  const props = Object.entries(c.props);
  if (props.length) {
    out.push(c.status === 'figma-only' ? '## Figma properties' : '## Props', 'Use only these. Any other prop or value is invalid.');
    out.push(table(['Prop', 'Type / values', 'Default', 'Required', 'Figma', 'Notes'], props.map(([n, p]) => [`\`${n}\``, p.values ? p.values.map((v) => (typeof v === 'string' ? `"${v}"` : String(v))).join(' · ') : p.type, p.default == null ? '—' : String(p.default), p.required ? 'yes' : '', p.figma ?? '', p.notes && !/^Figma: [^.—]*$/.test(p.notes) ? p.notes : ''])));
  }
  if (c.native?.elements.length) {
    const els = c.native.elements.map((e) => (e === 'element' ? 'HTML element' : `<${e}>`)).join(' / ');
    out.push(`Also accepts every native ${els} attribute (\`aria-*\`, \`data-*\`, event handlers …)${c.native.omit.length ? `, except ${c.native.omit.map((o) => `\`${o}\``).join(', ')}` : ''}${c.native.ref ? '. `ref` is forwarded.' : '. No `ref`.'}`);
  } else if (c.status !== 'figma-only' && c.kind === 'component') out.push('Accepts only the props above (no native attributes, no `ref`).');
  const r = c.rules;
  if (r.do.length || r.dont.length || r.forbidden.length) {
    out.push('## Rules');
    if (r.do.length) out.push('**Do**', r.do.map((x) => `- ${x}`).join('\n'));
    if (r.dont.length) out.push("**Don't**", r.dont.map((x) => `- ${x}`).join('\n'));
    if (r.forbidden.length) out.push('**Forbidden**', r.forbidden.map((x) => `- ${x}`).join('\n'));
  }
  if (c.examples.length) out.push('## Examples', ...c.examples.map((e) => `**${e.title}**\n\n${code(e.code, e.language)}`));
  const f = c.figma;
  if (f.componentSet.length) {
    out.push('## Figma', `Component set${f.componentSet.length > 1 ? 's' : ''}: ${f.componentSet.join(', ')}${f.variants ? ` · ${f.variants} variants` : ''}${f.codeConnect ? ' · Code Connect: yes (Dev Mode and the Figma MCP server return the React snippet)' : ''}`);
    if (f.nodes.length) out.push(`Node ids in the original Atomus file${f.fileKey ? ` (file key ${f.fileKey})` : ''}: ${f.nodes.map((n) => `${n.componentSet} → ${n.nodeId}`).join(', ')}. Your project's copy of the file has its own ids.`);
    const mappings = f.nodes.flatMap((n) => n.mappings.map((m) => ({ set: n.componentSet, ...m })));
    if (mappings.length) out.push(table(['Figma set', 'Figma property', 'Prop', 'How'], mappings.map((m) => [m.set, m.figma, `\`${m.prop}\``, describeMapping(m)])));
    else if (f.properties?.length && c.status !== 'figma-only') out.push(table(['Figma property', 'Type / options'], f.properties.map((p) => [p.name, p.options ? p.options.join(' · ') : p.type])));
  }
  if (c.a11y.notes.length || c.a11y.element) out.push('## Accessibility', [c.a11y.element ? `- Renders: ${c.a11y.element}` : '', c.a11y.requiresLabel ? '- Needs a visible label or an `aria-label`.' : '', ...c.a11y.notes.map((n) => `- ${n}`)].filter(Boolean).join('\n'));
  if (c.related.length) out.push(`**Related:** ${c.related.join(', ')}`);
  out.push(docsLine(c));
  return out.join('\n\n');
}

function describeMapping(m: FigmaMapping): string {
  switch (m.kind) {
    case 'enum': return Object.entries(m.values ?? {}).map(([k, v]) => `${k} → "${v}"`).join(', ');
    case 'flag': return `true when ${m.figma}=${m.when}`;
    case 'text': return `text${m.visibleWhen ? ` (when "${m.visibleWhen}" is on)` : ''}`;
    case 'boolean': return m.whenTrue ? `on → ${m.whenTrue}` : m.whenFalse ? `off → ${m.whenFalse}` : 'boolean';
    case 'instance': return `nested instance / icon${m.visibleWhen ? ` (when "${m.visibleWhen}" is on)` : ''}`;
    default: return m.notes ? `computed: ${m.notes}` : 'computed';
  }
}

export function getComponent(args: { name: string; format?: 'markdown' | 'json' }): ToolResult {
  const { match, candidates } = findComponent(args.name);
  if (match) return { text: renderComponent(match, args.format ?? 'markdown') };
  if (candidates.length) {
    return { text: `"${args.name}" could mean several Atomus components. Call \`atomus_get_component\` again with one of:\n\n${candidates.map((c) => `- **${c.name}** (${statusLabel(c)}): ${c.purpose}`).join('\n')}` };
  }
  return {
    isError: true,
    text: `Atomus has no component called "${args.name}". Do not invent it. Call \`atomus_list_components\` (optionally with query) to find the right one, or compose it from Atomus components and tokens. React exports: ${react.map((c) => c.name).join(', ')}.`,
  };
}

// ------------------------------------------------------------------ atomus_find_token

type TokenKind = 'color' | 'spacing' | 'size' | 'radius' | 'shadow' | 'text-style';
interface TokenHit { kind: TokenKind; name: string; score: number; light?: string; dark?: string | null; values?: Record<string, string>; tailwind: string[]; description: string; intents: string[] }

const SYNONYMS: Record<string, string[]> = {
  background: ['bg', 'surface', 'fill'], bg: ['background'], surface: ['bg', 'background'], fill: ['bg'],
  foreground: ['fg', 'icon'], icon: ['fg'], fg: ['icon', 'foreground'], graphic: ['fg'],
  stroke: ['border'], outline: ['border'], divider: ['border'], line: ['border'], separator: ['border'], hairline: ['border'],
  danger: ['error'], destructive: ['error'], negative: ['error'], red: ['error'], invalid: ['error'],
  positive: ['success'], green: ['success'], valid: ['success'], caution: ['warning'], yellow: ['warning'], orange: ['warning'],
  info: ['brand'], accent: ['brand'], primary: ['primary', 'brand'], main: ['primary'], cta: ['brand', 'solid'], action: ['brand', 'solid'],
  muted: ['tertiary', 'secondary'], subtle: ['subtle', 'tertiary'], supporting: ['secondary'], hint: ['tertiary'], meta: ['tertiary'], caption: ['tertiary'], helper: ['tertiary'],
  heading: ['primary', 'headline'], title: ['primary', 'headline'], body: ['primary', 'body'], label: ['secondary'],
  gap: ['spacing'], padding: ['spacing'], margin: ['spacing', 'layout'], space: ['spacing'], spacing: ['spacing'], between: ['layout'], section: ['layout', 'section'], page: ['layout', 'container'],
  corner: ['radius'], rounded: ['radius'], round: ['radius'], radius: ['radius'],
  elevation: ['shadow'], shadow: ['shadow'], dropshadow: ['shadow'], lift: ['shadow'], focus: ['focus'],
  font: ['text-style'], typography: ['text-style'], type: ['text-style'], headline: ['headline'],
  disabled: ['disabled'], hover: ['hover'], selected: ['brand', 'subtle'], overlay: ['overlay'], scrim: ['overlay'], backdrop: ['overlay'], modal: ['overlay'],
  inverse: ['inverse'], tooltip: ['inverse'], dark: ['inverse'], link: ['link'], placeholder: ['placeholder'], card: ['card', 'secondary'],
};
const STOP = new Set(['the', 'a', 'an', 'for', 'of', 'on', 'in', 'to', 'and', 'or', 'with', 'color', 'colour', 'token', 'tokens', 'use', 'my', 'is', 'what', 'which', 'css', 'var']);
const words = (s: string) => s.toLowerCase().replace(/[^a-z0-9#.\s-]/g, ' ').split(/[\s-]+/).filter(Boolean);

function tokenIndex(): TokenHit[] {
  const intentsFor = (name: string) => manifest.tokens.intents.filter((i) => i.tokens.includes(name)).map((i) => i.intent);
  const list: TokenHit[] = [];
  for (const t of manifest.tokens.semantic as ColorToken[]) list.push({ kind: 'color', name: t.name, score: 0, light: t.light, dark: t.dark, tailwind: t.tailwind, description: t.description, intents: intentsFor(t.name) });
  for (const t of manifest.tokens.spacing as ModeToken[]) list.push({ kind: /^--(size|icon)-/.test(t.name) ? 'size' : 'spacing', name: t.name, score: 0, values: t.values, tailwind: t.tailwind ?? [], description: t.description ?? '', intents: [] });
  for (const t of manifest.tokens.radius as ModeToken[]) list.push({ kind: 'radius', name: t.name, score: 0, values: t.values, tailwind: t.tailwind ?? [], description: t.description ?? '', intents: [] });
  for (const t of manifest.tokens.shadows as ModeToken[]) list.push({ kind: 'shadow', name: t.name, score: 0, values: t.values, tailwind: t.tailwind ?? [], description: t.description ?? '', intents: [] });
  for (const s of manifest.tokens.textStyles) list.push({ kind: 'text-style', name: `.${s}`, score: 0, tailwind: [], description: `Text style class ${s} (font family, size, line height, weight and letter spacing together).`, intents: [] });
  return list;
}
const INDEX = tokenIndex();

const near = (a: string, b: string) => {
  if (a === b) return true;
  if (a.length >= 4 && b.startsWith(a)) return true;
  if (a.length < 5 || Math.abs(a.length - b.length) > 1) return false;
  let diff = 0;
  for (let i = 0, j = 0; i < a.length && j < b.length; i++, j++) {
    if (a[i] !== b[j]) {
      if (++diff > 1) return false;
      if (a.length > b.length) j--;
      else if (b.length > a.length) i--;
    }
  }
  return true;
};

export function findToken(args: { query: string; kind?: TokenKind | 'any'; limit?: number }): ToolResult {
  const q = args.query.trim();
  const limit = Math.min(Math.max(args.limit ?? 6, 1), 25);
  const kind = args.kind && args.kind !== 'any' ? args.kind : null;
  let hits: TokenHit[] = [];
  const hex = q.match(/#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})\b/i)?.[0]?.toLowerCase();
  const px = q.match(/^(-?\d+(?:\.\d+)?)px$/i)?.[0];
  const primitive = q.match(/--color-[a-z-]+-\d+/)?.[0];
  if (hex || primitive) {
    const value = primitive ? manifest.tokens.primitives[primitive] : hex!.length === 4 ? `#${[...hex!.slice(1)].map((c) => c + c).join('')}` : hex!;
    hits = INDEX.filter((t) => t.kind === 'color' && (t.light?.toLowerCase() === value?.toLowerCase() || t.dark?.toLowerCase() === value?.toLowerCase())).map((t) => ({ ...t, score: t.light?.toLowerCase() === value?.toLowerCase() ? 2 : 1 }));
    if (!hits.length) return { text: `No semantic token has the value ${primitive ?? hex}${primitive && value ? ` (${value})` : ''}. Don't use the raw value or a primitive: describe the intent instead (e.g. "supporting text", "card border") and call \`atomus_find_token\` again.` };
  } else if (px) {
    hits = INDEX.filter((t) => (t.kind === 'spacing' || t.kind === 'size' || t.kind === 'radius') && t.values && Object.values(t.values).includes(px))
      .map((t) => ({ ...t, score: (t.values!.desktop === px || t.values!.default === px ? 2 : 1) + (/^--spacing-/.test(t.name) ? 1 : 0) + (new Set(Object.values(t.values!)).size === 1 ? 0.5 : 0) }));
  } else {
    const terms = words(q).filter((w) => !STOP.has(w));
    const expanded = terms.flatMap((w) => [w, ...(SYNONYMS[w] ?? [])]);
    const phrase = q.toLowerCase();
    hits = INDEX.map((t) => {
      const nameParts = t.name.replace(/^[.-]+/, '').split('-');
      const desc = words(t.description);
      const intentWords = t.intents.flatMap(words);
      let score = 0;
      for (const w of expanded) {
        const weight = terms.includes(w) ? 1 : 0.6;
        if (nameParts.includes(w)) score += 3 * weight;
        else if (nameParts.some((p) => near(w, p))) score += 2 * weight;
        if (intentWords.includes(w)) score += 2.5 * weight;
        if (desc.some((d) => near(w, d))) score += 1 * weight;
      }
      if (t.intents.some((i) => i.toLowerCase() === phrase)) score += 8;
      else if (t.intents.some((i) => i.toLowerCase().includes(phrase) && phrase.length > 3)) score += 4;
      if (t.kind === 'color' && t.name.includes('-components-')) score -= 1;
      if (/hover|disabled/.test(t.name) && !/hover|disabled/.test(phrase)) score -= 1;
      return { ...t, score };
    }).filter((t) => t.score > 0);
  }
  if (kind) hits = hits.filter((t) => t.kind === kind);
  hits.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  hits = hits.slice(0, limit);
  if (!hits.length) {
    return { text: `No Atomus token matches "${q}". Try the intent in plain words ("page background", "supporting text", "card border", "gap inside a card", "space between sections", "button radius"), or set kind. Never fall back to raw values.\n\n**Pick by intent:**\n\n${table(['Intent', 'Token'], manifest.tokens.intents.map((i) => [i.intent, i.tokens.map((t) => `\`${t}\``).join(' · ')]))}` };
  }
  const best = hits[0];
  const use = best.kind === 'text-style' ? `class="${best.name.slice(1)}"` : `var(${best.name})`;
  const rows = hits.map((t) => {
    const value = t.kind === 'color' ? `${t.light} / ${t.dark ?? '—'}` : t.values ? Object.entries(t.values).map(([k, v]) => `${k} ${v}`).join(', ') : '—';
    return [`\`${t.name}\``, t.kind, value, t.tailwind.length ? t.tailwind.map((x) => `\`${x}\``).join(' ') : '—', [t.intents.join('; '), t.description].filter(Boolean).join(' — ')];
  });
  return {
    text: [
      `# Atomus tokens for "${q}"`,
      `Best match: \`${use}\`${best.tailwind[0] ? ` (Tailwind \`${best.tailwind[0]}\`)` : ''}. Check the description: pick by intent, not by value.`,
      table(['Token', 'Kind', best.kind === 'color' ? 'Light / Dark' : 'Values', 'Tailwind', 'Use it for'], rows),
      'Rules: semantic tokens only; never raw hex, rgb() or primitives (`--color-gray-500`, `bg-gray-500`). `--spacing-*` inside components, `--layout-*` between blocks and sections (responsive). Radius follows the Radius mode.',
      `Docs: ${DOCS}/foundations/color/`,
    ].join('\n\n'),
  };
}

// ------------------------------------------------------------------ atomus_get_pattern

export const PATTERNS = ['app-shell', 'dashboard', 'table-view', 'settings', 'auth', 'website-sections', 'ai-chat'] as const;
const PATTERN_DOCS: Record<string, string> = {
  'app-shell': `${DOCS}/components/navigation/`,
  dashboard: `${DOCS}/components/metric-card/`,
  'table-view': `${DOCS}/components/table/`,
  settings: `${DOCS}/components/tabs/`,
  auth: `${DOCS}/components/input/`,
  'website-sections': `${DOCS}/website-sections/`,
  'ai-chat': `${DOCS}/components/messaging/`,
};

export function getPattern(args: { pattern: string }): ToolResult {
  const key = norm(args.pattern);
  const id = PATTERNS.find((p) => norm(p) === key) ?? PATTERNS.find((p) => norm(p).includes(key) || key.includes(norm(p))) ?? (/(chat|assistant|ai|copilot|llm)/.test(key) ? 'ai-chat' : /(login|signin|signup|register|auth)/.test(key) ? 'auth' : /(landing|marketing|website|hero|homepage)/.test(key) ? 'website-sections' : /(table|list|records|grid)/.test(key) ? 'table-view' : /(layout|shell|sidebar|nav)/.test(key) ? 'app-shell' : /(preferences|account|profile)/.test(key) ? 'settings' : /(overview|kpi|analytics|stats)/.test(key) ? 'dashboard' : null);
  if (!id) return { isError: true, text: `Unknown pattern "${args.pattern}". Available: ${PATTERNS.join(', ')}.` };
  const p = data.patterns.items[id];
  const shared = id === 'website-sections' || id === 'ai-chat' ? '' : `Shared layout CSS (used by the app patterns):\n\n${code(data.patterns.sharedCss, 'css')}`;
  return {
    text: [
      `# Pattern: ${p.title}`,
      'Copy the structure, then change the content. Every prop is real and every value is a token. Icons (`<PlusIcon />` …) come from the project\'s icon library. Run `atomus_validate` on the result.',
      shared,
      p.body,
      `Docs: ${PATTERN_DOCS[id]}`,
    ].filter(Boolean).join('\n\n'),
  };
}

// ------------------------------------------------------------------ atomus_figma_to_code

const pascal = (s: string) => s.replace(/^icon\//i, '').split(/[^a-zA-Z0-9]+/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join('');
const jsxAttr = (name: string, v: unknown) => (v === true ? name : typeof v === 'string' && !v.startsWith('{') ? `${name}=${JSON.stringify(v)}` : `${name}={${typeof v === 'string' ? v.slice(1, -1) : JSON.stringify(v)}}`);
const ci = (obj: Record<string, unknown>, key: string) => {
  const k = Object.keys(obj).find((x) => norm(x) === norm(key));
  return k === undefined ? undefined : obj[k];
};
const truthy = (v: unknown) => v === true || (typeof v === 'string' && /^(true|on|yes)$/i.test(v));
const falsy = (v: unknown) => v === false || (typeof v === 'string' && /^(false|off|no)$/i.test(v));
const PLACEHOLDER: Record<string, string> = { onClose: '{() => {}}', onChange: '{() => {}}', open: 'true', items: '{[]}', rows: '{[]}', columns: '{[]}', options: '{[]}', rowKey: '{(row) => String(row.id)}' };

export async function figmaToCode(args: { component: string; properties?: Record<string, string | boolean | number>; text?: string }, validator?: Validator): Promise<ToolResult> {
  const props = args.properties ?? {};
  const { match, candidates } = findComponent(args.component);
  if (!match) {
    return { isError: !candidates.length, text: candidates.length ? `"${args.component}" matches several components: ${candidates.map((c) => c.name).join(', ')}. Pass the Figma component set name exactly.` : `No Atomus component set is called "${args.component}". Check the layer's main component name in Figma (atomus_list_components lists them all).` };
  }
  const c = match;
  if (c.status === 'figma-only') {
    return { text: [`# ${args.component} → code`, `**${c.name} is Figma-only**: there is no React export to map it to. Don't import it or recreate its markup.`, c.alternative ? `In code: ${c.alternative}` : '', `Figma properties: ${Object.keys(c.props).join(', ') || '—'}.`, docsLine(c)].filter(Boolean).join('\n\n') };
  }
  const node = c.figma.nodes.find((n) => norm(n.componentSet) === norm(args.component)) ?? c.figma.nodes.find((n) => norm(n.componentSet) === norm(c.name)) ?? c.figma.nodes[0];
  const attrs = new Map<string, unknown>();
  const notes: string[] = [];
  const used = new Set<string>();
  let children: string | null = null;
  for (const m of node?.mappings ?? []) {
    const v = ci(props, m.figma);
    if (m.visibleWhen !== undefined) {
      const vis = ci(props, m.visibleWhen);
      used.add(norm(m.visibleWhen));
      if (falsy(vis)) { used.add(norm(m.figma)); continue; }
    }
    if (v === undefined) {
      if (m.prop === 'children' && args.text) children = args.text;
      continue;
    }
    used.add(norm(m.figma));
    switch (m.kind) {
      case 'enum': {
        const key = Object.keys(m.values ?? {}).find((k) => norm(k) === norm(String(v)));
        if (key) attrs.set(m.prop, m.values![key]);
        else notes.push(`${m.figma}=${v} has no code equivalent for \`${m.prop}\` (allowed: ${Object.keys(m.values ?? {}).join(', ')}).`);
        break;
      }
      case 'flag':
        if (norm(String(v)) === norm(m.when ?? '')) attrs.set(m.prop, true);
        break;
      case 'text':
        if (m.prop === 'children') children = String(v);
        else attrs.set(m.prop, String(v));
        break;
      case 'boolean':
        if (truthy(v)) {
          if (m.whenTrue) { const [n, val] = m.whenTrue.split(/=(.*)/s); attrs.set(n, val ? `{${val.replace(/^\{|\}$/g, '')}}` : true); }
          else attrs.set(m.prop, true);
        } else if (falsy(v) && m.whenFalse) { const [n, val] = m.whenFalse.split(/=(.*)/s); attrs.set(n, val ? `{${val.replace(/^\{|\}$/g, '')}}` : true); }
        break;
      case 'instance':
        if (typeof v === 'string' && v && !falsy(v)) { attrs.set(m.prop, `{<${pascal(v)}Icon />}`); notes.push(`\`${m.prop}\`: <${pascal(v)}Icon /> is a placeholder — use the project's icon library (Atomus icon names follow Font Awesome).`); }
        break;
      default:
        notes.push(`${m.figma} → \`${m.prop}\` is computed in Code Connect (${m.notes ?? 'see the Code Connect file'}); set it by hand.`);
    }
  }
  // Properties without a Code Connect mapping: use the prop whose JSDoc names the Figma property (Card Style → variant).
  for (const [k, v] of Object.entries(props)) {
    if (/^state$/i.test(k) && /^(default|hover|focused|focus|pressed|active)$/i.test(String(v))) { notes.push(`State=${v} is an interaction state, not a prop: the browser handles it.`); continue; }
    if (used.has(norm(k))) continue;
    const entry = Object.entries(c.props).find(([, p]) => p.figma && norm(p.figma.split(/[=+]/)[0]) === norm(k));
    if (entry) {
      const [pname, p] = entry;
      if (p.values) {
        const val = p.values.find((x) => norm(String(x)) === norm(String(v)));
        if (val !== undefined) { attrs.set(pname, val); continue; }
      } else if (p.type === 'boolean' && (truthy(v) || falsy(v))) { if (truthy(v)) attrs.set(pname, true); continue; }
      else if (/string|ReactNode/.test(p.type) && typeof v === 'string') { attrs.set(pname, v); continue; }
    }
    notes.push(`Figma property "${k}" (${v}) has no React prop on ${c.name}; it's ignored.`);
  }
  // Attributes the Code Connect template always renders (iconOnly …).
  const staticAttrs = node?.staticProps ? ` ${node.staticProps}` : '';
  if (/aria-label=/.test(staticAttrs) === false && /iconOnly/.test(staticAttrs)) attrs.set('aria-label', args.text ?? 'Describe the action');
  for (const [pname, p] of Object.entries(c.props)) {
    if (!p.required || attrs.has(pname) || staticAttrs.includes(`${pname}=`) || new RegExp(`\\b${pname}\\b`).test(staticAttrs)) continue;
    if (pname === 'children') { children ??= args.text ?? 'Label'; continue; }
    if (pname === 'title' || pname === 'label' || pname === 'caption') { attrs.set(pname, args.text ?? (pname === 'title' ? 'Title' : 'Label')); continue; }
    attrs.set(pname, PLACEHOLDER[pname] ? (PLACEHOLDER[pname] === 'true' ? true : PLACEHOLDER[pname]) : '{/* TODO */}');
    notes.push(`\`${pname}\` is required; a placeholder was added.`);
  }
  if (children == null && Object.keys(c.props).includes('children') && args.text) children = args.text;
  const attrText = [...attrs].map(([k, v]) => ` ${jsxAttr(k, v)}`).join('');
  const jsx = children != null ? `<${c.name}${staticAttrs}${attrText}>${children}</${c.name}>` : `<${c.name}${staticAttrs}${attrText} />`;
  const snippet = `${c.import}\n\n${jsx}`;
  let check = '';
  if (validator) {
    const r = await validator.validate(`${c.import}\nexport const Example = () => (\n  ${jsx}\n);\n`, 'Example.tsx', false);
    const errs = r.problems.filter((p) => p.rule !== 'atomus/no-unused');
    check = errs.length ? `**atomus_validate:** ${errs.map((p) => `${p.rule}: ${p.message}`).join(' · ')}` : '**atomus_validate:** no problems.';
  }
  return {
    text: [
      `# ${args.component} → <${c.name}>`,
      code(snippet),
      check,
      notes.length ? `**Notes**\n\n${notes.map((n) => `- ${n}`).join('\n')}` : '',
      node ? `Mapping from the Code Connect template for "${node.componentSet}" (node ${node.nodeId}). When the Figma MCP server returns a Code Connect snippet, use that instead.` : 'No Code Connect template: mapped from the props\' Figma names.',
      docsLine(c),
    ].filter(Boolean).join('\n\n'),
  };
}

// ------------------------------------------------------------------ atomus_validate

export async function validate(args: { code: string; filename?: string; fix?: boolean }, validator: Validator): Promise<ToolResult> {
  const filename = args.filename ?? (/^\s*[.#@:a-z[][^{]*\{/.test(args.code) && !/import |export |<[A-Z]/.test(args.code) ? 'styles.css' : 'Component.tsx');
  const r = await validator.validate(args.code, filename, args.fix ?? false);
  const errors = r.problems.filter((p) => p.severity === 'error');
  const warnings = r.problems.filter((p) => p.severity === 'warning');
  const out = [`# atomus_validate: ${filename}`, `${errors.length} error(s), ${warnings.length} warning(s) · ${r.engine}`];
  if (!r.problems.length) out.push('No problems found. This file follows the Atomus rules the linters check (tokens, props, components, labels, one primary per view). Still check light/dark and mobile width yourself.');
  else {
    out.push(r.problems.map((p) => `- **${p.severity}** ${p.line}:${p.column} \`${p.rule}\`: ${p.message}${p.fixable ? ' _(auto-fixable)_' : ''}${p.suggestions?.length ? `\n  Suggestions: ${p.suggestions.join(' · ')}` : ''}`).join('\n'));
    out.push(errors.length ? 'Fix every error, then call `atomus_validate` again. Don\'t silence rules (eslint-disable, stylelint-disable) to pass: that needs human review.' : 'Only warnings: fix them unless you have a reason, and say why in your summary.');
  }
  if (args.fix && r.output !== undefined && r.output !== args.code) out.push('## Fixed code (safe autofixes applied)', code(r.output, r.language === 'css' ? 'css' : 'tsx'));
  return { text: out.join('\n\n') };
}

// ------------------------------------------------------------------ atomus_init

type Agent = 'agents-md' | 'claude' | 'cursor' | 'copilot' | 'codex';
export function init(args: { agents?: Agent[]; styling?: 'css' | 'tailwind' | 'shadcn'; lint?: boolean; mcp?: boolean }): ToolResult {
  const agents = new Set<Agent>(args.agents?.length ? args.agents : ['agents-md', 'claude', 'cursor', 'copilot', 'codex']);
  const styling = args.styling ?? 'css';
  const rules = data.templates['AGENTS.atomus.md'] ?? Object.values(data.templates)[0] ?? '';
  const files: Array<{ path: string; content: string; note: string }> = [];
  const mcpNote = '\n\n## Atomus MCP server\n\nThis repo has the Atomus MCP server configured (`atomus`). Call `atomus_get_started` first, `atomus_get_component` before using a component, `atomus_find_token` for every colour, spacing and radius, and `atomus_validate` on every file you change (required final step).\n';
  if (agents.has('agents-md') || agents.has('codex')) files.push({ path: 'AGENTS.atomus.md', content: rules + (args.mcp === false ? '' : mcpNote), note: 'Atomus rules for every agent. Link it from AGENTS.md (Codex, Copilot, Cursor, Claude Code all read AGENTS.md).' });
  if (agents.has('agents-md') || agents.has('codex')) files.push({ path: 'AGENTS.md', content: '# AGENTS.md\n\nThis project builds its UI with the Atomus design system. Follow [AGENTS.atomus.md](AGENTS.atomus.md) for every screen, component and style.\n', note: 'Create it, or append the line to your existing AGENTS.md.' });
  if (agents.has('claude')) files.push({ path: 'CLAUDE.md', content: 'See @AGENTS.md and @AGENTS.atomus.md.\n', note: 'Claude Code reads CLAUDE.md; append the line if the file exists.' });
  if (agents.has('cursor')) files.push({ path: '.cursor/rules/atomus.mdc', content: `---\ndescription: Atomus design system rules — components, props, semantic tokens, validation\nglobs: "**/*.{tsx,jsx,ts,js,css,scss,mdx}"\nalwaysApply: false\n---\n\n${rules}${args.mcp === false ? '' : mcpNote}`, note: 'Cursor project rule, applied to UI files.' });
  if (agents.has('copilot')) files.push({ path: '.github/copilot-instructions.md', content: `# Copilot instructions\n\nFollow AGENTS.atomus.md (Atomus design system) for every UI change.\n\n${rules}`, note: 'GitHub Copilot repository instructions; merge with an existing file.' });
  const cssEntry = styling === 'css'
    ? { path: 'src/main.tsx (top of the entry file)', lang: 'ts', content: "import '@stanvision/atomus-tokens/css';        // tokens, themes, breakpoints, text styles\nimport '@stanvision/atomus-react/styles.css';  // component styles\n" }
    : { path: 'src/app.css', lang: 'css', content: `@import "tailwindcss";\n@import "@stanvision/atomus-tokens/${styling === 'tailwind' ? 'tailwind' : 'shadcn'}";\n` };
  files.push({ path: cssEntry.path, content: cssEntry.content, note: `Load the tokens once, before component styles.${styling !== 'css' ? " Also import '@stanvision/atomus-react/styles.css' in the entry file. Never load both the Atomus Tailwind theme and the shadcn theme." : ''}` });
  files.push({ path: 'index.html (root element)', content: '<html lang="en" data-theme="system">\n<!-- optional: data-brand="<brand>" on <body>, data-radius="default | sharp | round" on any element -->\n', note: 'Theme with attributes, never by overriding token values. Load Inter and Roboto Mono yourself (the CSS does not fetch fonts).' });
  if (args.lint !== false) {
    files.push({ path: 'eslint.config.js', content: "import atomus from '@stanvision/eslint-plugin-atomus';\n// import tseslint from 'typescript-eslint';  // for .ts/.tsx: add the TypeScript parser\n\nexport default [\n  // ...tseslint.configs.recommended,\n  atomus.configs.recommended,\n];\n", note: 'npm i -D eslint @stanvision/eslint-plugin-atomus (merge into an existing flat config).' });
    files.push({ path: 'stylelint.config.js', content: "export default {\n  extends: ['@stanvision/stylelint-config-atomus'],\n};\n", note: 'npm i -D stylelint @stanvision/stylelint-config-atomus' });
  }
  if (args.mcp !== false) {
    const server = { command: 'npx', args: ['-y', '@stanvision/atomus-mcp'] };
    if (agents.has('claude')) files.push({ path: '.mcp.json', content: `${JSON.stringify({ mcpServers: { atomus: server } }, null, 2)}\n`, note: 'Claude Code project MCP config (or run: claude mcp add atomus -- npx -y @stanvision/atomus-mcp).' });
    if (agents.has('cursor')) files.push({ path: '.cursor/mcp.json', content: `${JSON.stringify({ mcpServers: { atomus: server } }, null, 2)}\n`, note: 'Cursor MCP config.' });
    if (agents.has('copilot')) files.push({ path: '.vscode/mcp.json', content: `${JSON.stringify({ servers: { atomus: { type: 'stdio', ...server } } }, null, 2)}\n`, note: 'VS Code (Copilot agent mode) MCP config.' });
    if (agents.has('codex')) files.push({ path: '~/.codex/config.toml (append)', content: '[mcp_servers.atomus]\ncommand = "npx"\nargs = ["-y", "@stanvision/atomus-mcp"]\n', note: 'Codex reads MCP servers from its user config.' });
  }
  const text = [
    '# Atomus setup files',
    'This tool returns content only and writes nothing. Create or merge each file yourself, then install: `npm install @stanvision/atomus-react @stanvision/atomus-tokens` (publishing soon; until then see the setup docs).',
    ...files.map((f) => `## ${f.path}\n\n${f.note}\n\n${code(f.content, f.path.endsWith('.json') ? 'json' : f.path.endsWith('.toml') || f.path.includes('.toml') ? 'toml' : f.path.endsWith('.md') || f.path.endsWith('.mdc') ? 'md' : f.path.includes('.css') ? 'css' : f.path.includes('index.html') ? 'html' : 'js')}`),
    `Docs: ${DOCS}/getting-started/ · ${DOCS}/ai/coding-agents/ · ${DOCS}/ai/mcp/`,
  ];
  return { text: text.join('\n\n') };
}

// ------------------------------------------------------------------ atomus_brand

export function brand(args: { hex: string; name: string; anchor?: string }): ToolResult {
  const name = args.name.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
  if (!name) return { isError: true, text: 'name must contain letters or digits (it becomes data-brand="<name>").' };
  if (['atomus', 'violet'].includes(name)) return { isError: true, text: `"${name}" is a built-in brand. Pick another name.` };
  let result;
  try {
    result = brandRamp(args.hex, data.brand.ramp, (args.anchor ?? 'auto') as string);
  } catch (e) {
    return { isError: true, text: (e as Error).message };
  }
  const { ramp, anchor, steps } = result;
  const css = [`/* Brand "${name}" from ${args.hex.toLowerCase()} (anchored at ${anchor}). Generated by atomus_brand — a token change: get a human review. */`, `[data-brand="${name}"] {`, ...steps.map((s) => `  --color-brand-${s}: ${ramp[s]};`), '}'].join('\n');
  const white = '#ffffff';
  const darkBg = manifest.tokens.semantic.find((t) => t.name === '--color-bg-primary')?.dark ?? '#09090b';
  const step = (token: string, mode: 'light' | 'dark') => data.brand.usage[token]?.[mode];
  const checks: Array<[string, string, string, number]> = [];
  const solid = step('--color-bg-brand-solid', 'light') ?? '600';
  checks.push(['White text on the primary button (light)', `text-on-brand on brand-${solid}`, ramp[solid], contrast(white, ramp[solid])]);
  const solidDark = step('--color-bg-brand-solid', 'dark') ?? solid;
  checks.push(['White text on the primary button (dark)', `text-on-brand on brand-${solidDark}`, ramp[solidDark], contrast(white, ramp[solidDark])]);
  const link = step('--color-text-brand', 'light') ?? '600';
  checks.push(['Brand text and links on white (light)', `text-brand = brand-${link}`, ramp[link], contrast(ramp[link], white)]);
  const linkDark = step('--color-text-brand', 'dark') ?? '400';
  checks.push([`Brand text and links on ${darkBg} (dark)`, `text-brand = brand-${linkDark}`, ramp[linkDark], contrast(ramp[linkDark], darkBg)]);
  const failing = checks.filter((c) => c[3] < 4.5);
  const usage = Object.entries(data.brand.usage).slice(0, 14).map(([t, m]) => [`\`${t}\``, m.light ? `brand-${m.light}` : '—', m.dark ? `brand-${m.dark}` : '—']);
  return {
    text: [
      `# Brand "${name}"`,
      `Ramp built around ${args.hex.toLowerCase()} (placed at brand-${anchor}), following the lightness and chroma curve of the Atomus blue ramp in OKLCH.`,
      code(css, 'css'),
      '## Contrast (WCAG 2.2 AA needs 4.5:1 for text)',
      table(['Check', 'Pair', 'Colour', 'Ratio', 'Result'], checks.map(([label, pair, hex, ratio]) => [label, pair, hex, `${ratio.toFixed(2)}:1`, ratio >= 4.5 ? 'pass' : '**fail**'])),
      failing.length ? `**${failing.length} check(s) fail.** Try \`anchor\` "700" (darker solid) or a darker brand colour, and run atomus_brand again. Don't ship a brand that fails AA, and don't change the semantic mapping to fix it.` : 'All checks pass.',
      '## Use it',
      [
        '1. Add the block to your global CSS, after the Atomus token import. It defines tokens, so a person must review it (AGENTS.md: token changes need human review).',
        `2. Switch it on with \`data-brand="${name}"\` on \`<html>\`, \`<body>\` or any section. Every brand-based semantic token (\`--color-bg-brand-solid\`, \`--color-text-brand\`, \`--color-border-brand\` …) follows automatically, in light and dark.`,
        '3. Don\'t use `--color-brand-*` directly in components: keep using the semantic tokens.',
        '4. In Figma: add a mode to the **Brand** collection and point `brand-25 … brand-950` at the same values, so design and code match.',
        '5. Check the result with `atomus_validate` (the brand block itself is allowed: custom properties named `--color-*` are token definitions).',
      ].join('\n'),
      '## Which semantic tokens use the brand ramp',
      table(['Token', 'Light', 'Dark'], usage),
      `Docs: ${DOCS}/foundations/theming/`,
    ].join('\n\n'),
  };
}
