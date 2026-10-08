// Build-time readers for the single-source tokens (repo root). Used by the foundation preview components,
// so swatches, ramps and shadows always show the values that ship in css/atomus.css and tokens/*.json.
import primitives from '../../../../tokens/primitives.tokens.json';
import atomusCss from '../../../../css/atomus.css?raw';

type Token = { $value: string };
const colors = (primitives as unknown as { colors: Record<string, Record<string, Token>> }).colors;

const STEP_ORDER = ['25', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

export interface Ramp { name: string; cssName: string; steps: { step: string; hex: string; cssVar: string }[] }

/** A primitive ramp, ordered 25 → 950. `brand` in the JSON is the Atomus blue ramp (--color-atomus-blue-*). */
export function ramp(name: string): Ramp {
  const cssName = name === 'brand' ? 'atomus-blue' : name;
  const group = colors[name] ?? {};
  return {
    name,
    cssName,
    steps: STEP_ORDER.filter((s) => group[s]).map((s) => ({ step: s, hex: group[s].$value, cssVar: `--color-${cssName}-${s}` })),
  };
}

export const NEUTRAL_RAMPS = ['gray', 'blue-gray', 'cool-gray', 'true-gray', 'warm-gray'];
export const HUE_RAMPS = ['red', 'rose', 'pink', 'fuschia', 'purple', 'violet', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'emerald', 'green', 'lime', 'yellow', 'amber', 'orange'];

export function alphaRamp(kind: 'black' | 'white') {
  const group = colors.alpha ?? {};
  return Object.entries(group)
    .filter(([k]) => k.startsWith(kind + '-'))
    .map(([k, v]) => ({ step: k.split('-')[1], hex: v.$value, cssVar: `--color-alpha-${k}` }))
    .sort((a, b) => +a.step - +b.step);
}

/** Declarations of one top-level block of atomus.css, e.g. ':root {' or '[data-theme="dark"], .dark'. */
function block(startsWith: string): Record<string, string> {
  const i = atomusCss.indexOf('\n' + startsWith);
  if (i < 0) return {};
  const body = atomusCss.slice(atomusCss.indexOf('{', i) + 1, atomusCss.indexOf('\n}', i));
  const out: Record<string, string> = {};
  for (const m of body.matchAll(/(--[\w-]+):\s*([^;]+);/g)) out[m[1]] = m[2].trim();
  return out;
}

export function shadows() {
  const light = block(':root {');
  const dark = block('[data-theme="dark"], .dark');
  return Object.keys(light)
    .filter((k) => /^--shadow-elevation-\d+$/.test(k))
    .sort((a, b) => +a.split('-').pop()! - +b.split('-').pop()!)
    .map((k) => ({ token: k, level: +k.split('-').pop()!, light: light[k], dark: dark[k] ?? light[k] }));
}
