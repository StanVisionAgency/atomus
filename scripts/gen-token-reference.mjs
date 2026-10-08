#!/usr/bin/env node
// Generates the token reference of the Atomus agent skill from the DTCG files in tokens/:
//
//   skills/atomus/references/tokens.md    semantic tokens by intent, with Light and Dark values
//   skills/atomus/references/tokens.json  semantic + primitive names (read by skills/atomus/scripts/validate.mjs)
//
// Run after the tokens change:   node scripts/gen-token-reference.mjs   (--check fails when stale)
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tokDir = join(root, 'tokens');
const out = join(root, 'skills/atomus/references');
const CHECK = process.argv.includes('--check');

const load = (f) => JSON.parse(readFileSync(join(tokDir, f), 'utf8'));

/** Flattens a DTCG tree into [{ path, value, type, cssVar, figma }]. */
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

const primitives = flatten(load('primitives.tokens.json'));
const brand = flatten(load('brand.atomus.tokens.json'));
const light = flatten(load('color.light.tokens.json'));
const dark = flatten(load('color.dark.tokens.json'));

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
const resolveLight = resolver(primitives, brand, light);
const resolveDark = resolver(primitives, brand, dark);
const darkByVar = new Map(dark.map((t) => [t.cssVar, t]));

// Tailwind utilities that exist for a token (tailwind/atomus.tailwind.css).
const twCss = existsSync(join(root, 'tailwind/atomus.tailwind.css')) ? readFileSync(join(root, 'tailwind/atomus.tailwind.css'), 'utf8') : '';
const tw = new Map();
for (const m of twCss.matchAll(/@utility ([\w-]+) \{[^}]*var\((--[\w-]+)\)/g)) tw.set(m[2], [...(tw.get(m[2]) ?? []), m[1]]);

const GROUPS = [
  { key: 'text', title: 'Text', intent: 'Text colour. `primary` for headings and body, `secondary` for supporting copy, `tertiary` for hints and meta, `placeholder` in inputs, `brand` / `link` for links and highlights, `on-brand` on brand fills, `error` · `warning` · `success` for status text.' },
  { key: 'background', title: 'Background', intent: 'Surface fills. `primary` for the page and cards, `secondary` for sections and table headers, `tertiary` / `quaternary` for subtle fills and placeholders, `brand-solid` for primary buttons, `brand-subtle` for selected and tinted areas, `*-subtle` / `*-solid` for status, `overlay` behind modals, `inverse` for tooltips.' },
  { key: 'border', title: 'Border', intent: 'Strokes. `secondary` for cards and dividers, `primary` for inputs and outlined controls, `brand` for selected, `focus` for focus rings, `error` · `warning` · `success` for status.' },
  { key: 'foreground', title: 'Foreground', intent: 'Icons and graphics. Same roles as Text.' },
  { key: 'gradient', title: 'Gradient', intent: 'Gradient stops for marketing surfaces.' },
  { key: 'components', title: 'Component tokens', intent: 'Used inside Atomus components (buttons, badges, alerts). Use them only when you build the matching component yourself — otherwise use the component.' },
];

// The tokens to reach for first, by intent.
const INTENTS = [
  ['Page background', '--color-bg-primary'],
  ['Section / table header / sidebar background', '--color-bg-secondary'],
  ['Subtle fill, image placeholder, hover row', '--color-bg-tertiary'],
  ['Selected / highlighted area', '--color-bg-brand-subtle'],
  ['Primary action fill', '--color-bg-brand-solid'],
  ['Scrim behind a modal', '--color-bg-overlay'],
  ['Heading and body text', '--color-text-primary'],
  ['Supporting text', '--color-text-secondary'],
  ['Hint, meta, caption', '--color-text-tertiary'],
  ['Link', '--color-text-link'],
  ['Text on a brand fill', '--color-text-on-brand'],
  ['Error text', '--color-text-error'],
  ['Success text', '--color-text-success'],
  ['Warning text', '--color-text-warning'],
  ['Card and divider stroke', '--color-border-secondary'],
  ['Input and outlined-control stroke', '--color-border-primary'],
  ['Focus ring colour', '--color-border-focus'],
  ['Default icon', '--color-fg-secondary'],
  ['Brand icon / key chart series', '--color-fg-brand'],
  ['Error / warning / success background', '--color-bg-error-subtle · --color-bg-warning-subtle · --color-bg-success-subtle'],
];

/** Dimension objects ({ value, unit }) print as "4px". */
const fmt = (v) => (v && typeof v === 'object' && 'value' in v ? `${v.value}${v.unit ?? ''}` : String(v));
const semantic = light.filter((t) => t.cssVar).map((t) => {
  const d = darkByVar.get(t.cssVar);
  return {
    group: t.path.split('.')[0],
    cssVar: t.cssVar,
    figma: t.figma,
    light: fmt(resolveLight(t.value)),
    dark: d ? fmt(resolveDark(d.value)) : null,
    tailwind: tw.get(t.cssVar) ?? [],
  };
});
const semanticVars = new Set(semantic.map((t) => t.cssVar));
const primitiveColors = [...primitives, ...brand].filter((t) => t.type === 'color' && t.cssVar && !semanticVars.has(t.cssVar));

// Non-colour tokens: one row per name with the values per mode.
function modeTable(files, modes) {
  const sets = files.map((f) => flatten(load(f)));
  const res = sets.map((s) => resolver(primitives, s));
  return sets[0].filter((t) => t.cssVar).map((t) => ({
    cssVar: t.cssVar,
    values: sets.map((s, i) => {
      const v = res[i](s.find((x) => x.cssVar === t.cssVar)?.value);
      if (v && typeof v === 'object' && 'value' in v) return `${v.value}${v.unit ?? ''}`;
      return typeof v === 'object' ? JSON.stringify(v) : String(v);
    }),
    modes,
  }));
}
const spacing = modeTable(['spacing-layout.desktop.tokens.json', 'spacing-layout.tablet.tokens.json', 'spacing-layout.mobile.tokens.json'], ['Desktop', 'Tablet', 'Mobile']);
const radius = modeTable(['radius.default.tokens.json', 'radius.sharp.tokens.json', 'radius.round.tokens.json'], ['Default', 'Sharp', 'Round']);
// Shadows carry no code syntax in the export; their CSS names are --shadow-<name>.
const effects = flatten(load('effects.light.tokens.json')).map((t) => t.cssVar ?? `--${t.path.replace(/\./g, '-')}`);
const textStyles = existsSync(join(root, 'css/atomus.css')) ? [...new Set([...readFileSync(join(root, 'css/atomus.css'), 'utf8').matchAll(/^\.(text-[\w-]+)\s*\{/gm)].map((m) => m[1]))] : [];

const px = (v) => (/^\d+(\.\d+)?$/.test(v) ? `${v}` : v);
const row = (cells) => `| ${cells.join(' | ')} |`;

const md = [
  '# Atomus tokens — by intent',
  '',
  'Generated by `scripts/gen-token-reference.mjs` from `tokens/*.tokens.json` (W3C DTCG). Values are the Atomus brand; other brands change every `brand`-based value.',
  '',
  '**Rules:** use semantic tokens only (`var(--color-text-primary)`, Tailwind `text-primary`). Never write raw hex, `rgb()` or primitives such as `--color-gray-500` / `bg-gray-500` — primitives exist only to be aliased. Never add a token; ask a human (see AGENTS.md).',
  '',
  '## Pick by intent',
  '',
  row(['Intent', 'Token']),
  row(['---', '---']),
  ...INTENTS.map(([i, t]) => row([i, t.split(' · ').map((x) => `\`${x}\``).join(' · ')])),
  '',
  'Spacing: `--spacing-*` (2–24px) inside components, `--layout-*` (24–240px, responsive) between blocks and sections. Radius: `--radius-*` follows the Radius mode. Shadows: `--shadow-elevation-*`, focus `--shadow-focus-ring`.',
  '',
  ...GROUPS.flatMap((g) => {
    const items = semantic.filter((t) => t.group === g.key);
    if (!items.length) return [];
    return [
      `## ${g.title}`,
      '',
      g.intent,
      '',
      row(['Token', 'Light', 'Dark', 'Tailwind', 'Figma']),
      row(['---', '---', '---', '---', '---']),
      ...items.map((t) => row([`\`${t.cssVar}\``, t.light, t.dark ?? '—', t.tailwind.map((c) => `\`${c}\``).join(' ') || '—', t.figma ?? ''])),
      '',
    ];
  }),
  '## Spacing, layout and sizes',
  '',
  'Layout tokens change at the breakpoints (Desktop ≥ 1024px, Tablet 768–1023px, Mobile < 768px) automatically.',
  '',
  row(['Token', 'Desktop', 'Tablet', 'Mobile']),
  row(['---', '---', '---', '---']),
  ...spacing.map((t) => row([`\`${t.cssVar}\``, ...t.values.map(px)])),
  '',
  '## Radius',
  '',
  'Switch with `data-radius="default | sharp | round"` on any element.',
  '',
  row(['Token', 'Default', 'Sharp', 'Round']),
  row(['---', '---', '---', '---']),
  ...radius.map((t) => row([`\`${t.cssVar}\``, ...t.values.map(px)])),
  '',
  '## Shadows',
  '',
  effects.map((e) => `\`${e}\``).join(' · '),
  '',
  '## Text styles',
  '',
  'Use the classes from `atomus.css` instead of setting font size, weight and line height by hand:',
  '',
  textStyles.map((c) => `\`.${c}\``).join(' · '),
  '',
  '## Primitives (do not use directly)',
  '',
  `${primitiveColors.length} colour primitives — ramps such as \`--color-gray-25 … 950\`, \`--color-rose-*\`, \`--color-brand-*\` (follows the Brand mode). They are listed in \`tokens.json\` so the validator can flag them; map them to the semantic token with the same job.`,
  '',
].join('\n');

const json = {
  $comment: 'Generated by scripts/gen-token-reference.mjs from tokens/. Read by skills/atomus/scripts/validate.mjs.',
  semantic: Object.fromEntries(semantic.map((t) => [t.cssVar, { light: t.light, dark: t.dark, group: t.group, tailwind: t.tailwind }])),
  primitives: Object.fromEntries(primitiveColors.map((t) => [t.cssVar, String(resolveLight(t.value))])),
  other: [...spacing.map((t) => t.cssVar), ...radius.map((t) => t.cssVar), ...effects],
};

// One token per line: readable diffs, small file.
const compact = (o) => `{\n${Object.entries(o).map(([k, v]) => `  ${JSON.stringify(k)}: ${v && typeof v === 'object' && !Array.isArray(v) ? `{\n${Object.entries(v).map(([n, t]) => `    ${JSON.stringify(n)}: ${JSON.stringify(t)}`).join(',\n')}\n  }` : JSON.stringify(v)}`).join(',\n')}\n}\n`;

const changed = [];
for (const [file, content] of [['tokens.md', md], ['tokens.json', compact(json)]]) {
  const path = join(out, file);
  if (existsSync(path) && readFileSync(path, 'utf8') === content) continue;
  changed.push(`skills/atomus/references/${file}`);
  if (!CHECK) {
    mkdirSync(out, { recursive: true });
    writeFileSync(path, content);
  }
}
if (CHECK && changed.length) {
  console.error(`gen-token-reference: out of date — run node scripts/gen-token-reference.mjs\n  ${changed.join('\n  ')}`);
  process.exit(1);
}
console.log(changed.length ? `gen-token-reference: updated\n  ${changed.join('\n  ')}` : 'gen-token-reference: up to date');
