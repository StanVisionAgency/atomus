// Pure checks behind the Atomus Stylelint rules: (property, value) → problems. No Stylelint import, so the same
// logic runs anywhere PostCSS runs (the Atomus MCP server's remote worker uses it directly).
//
// Each check returns [{ rule, index, endIndex, message, fix? }] where index/endIndex are offsets in `value`
// and `fix` (when present) is the whole corrected value.
import defaultManifest from '../data/atomus.manifest.json' with { type: 'json' };

export const RULES = {
  noRawColor: 'atomus/no-raw-color',
  noPrimitiveToken: 'atomus/no-primitive-token',
  useTokens: 'atomus/use-tokens',
};
export const DOCS = 'https://docs.atomus.io/ai/lint/';

const cache = new WeakMap();
export function index(manifest = defaultManifest) {
  let d = cache.get(manifest);
  if (d) return d;
  const semanticByHex = new Map();
  for (const t of manifest.tokens.semantic) {
    if (t.group === 'components' || t.group === 'gradient') continue;
    const hex = normalizeHex(t.light);
    if (hex) semanticByHex.set(hex, [...(semanticByHex.get(hex) ?? []), t]);
  }
  const spacingByPx = new Map();
  for (const t of manifest.tokens.spacing) {
    if (!t.name.startsWith('--spacing-')) continue;
    const vals = new Set(Object.values(t.values));
    if (vals.size === 1 && !spacingByPx.has([...vals][0])) spacingByPx.set([...vals][0], t.name);
  }
  const radiusByPx = new Map();
  for (const t of manifest.tokens.radius) {
    const v = t.values.default ?? Object.values(t.values)[0];
    if (!radiusByPx.has(v)) radiusByPx.set(v, t.name);
  }
  d = { semanticByHex, primitives: new Map(Object.entries(manifest.tokens.primitives)), spacingByPx, radiusByPx };
  cache.set(manifest, d);
  return d;
}

export function normalizeHex(v) {
  const m = String(v ?? '').trim().toLowerCase().match(/^#([0-9a-f]{3,8})$/);
  if (!m) return null;
  let h = m[1];
  if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('');
  if (h.length !== 6 && h.length !== 8) return null;
  if (h.length === 8 && h.endsWith('ff')) h = h.slice(0, 6);
  return `#${h}`;
}

const NAMED = new Set(
  'aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen'.split(' '),
);
const COLOR_PROPS = /^(color|background(-color|-image)?|border(-(top|right|bottom|left|block|inline|block-start|block-end|inline-start|inline-end))?(-color)?|outline(-color)?|fill|stroke|box-shadow|text-shadow|caret-color|accent-color|text-decoration(-color)?|column-rule(-color)?|stop-color|flood-color|lighting-color|scrollbar-color|-webkit-text-fill-color)$/i;
const PURE_COLOR_PROPS = /^(color|background-color|border(-(top|right|bottom|left|block|inline|block-start|block-end|inline-start|inline-end))?-color|outline-color|fill|stroke|caret-color|accent-color|text-decoration-color|column-rule-color|stop-color|flood-color|lighting-color)$/i;
const SPACING_PROPS = /^(margin|padding)(-(top|right|bottom|left|block|inline|block-start|block-end|inline-start|inline-end))?$|^(gap|row-gap|column-gap)$/i;
const RADIUS_PROPS = /^border(-(top|bottom|start|end)-(left|right|start|end))?-radius$/i;
const KEYWORDS = /^(inherit|initial|unset|revert|revert-layer|auto|none|0|transparent|currentcolor)$/i;
// CSS system colours are what forced-colors (Windows High Contrast) mode requires; tokens can't express them.
const SYSTEM_COLORS = /^(AccentColor|AccentColorText|ActiveText|ButtonBorder|ButtonFace|ButtonText|Canvas|CanvasText|Field|FieldText|GrayText|Highlight|HighlightText|LinkText|Mark|MarkText|SelectedItem|SelectedItemText|VisitedText)$/i;

/** Replace url(...) and strings with spaces so offsets stay valid but their content is ignored. */
function blankUrls(value) {
  return value.replace(/url\((?:[^()"']|"[^"]*"|'[^']*')*\)/gi, (m) => m.replace(/./g, ' '));
}

export function findRawColors(value, { named = false } = {}) {
  const text = blankUrls(value);
  const out = [];
  for (const m of text.matchAll(/(^|[^\w&#-])#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/g)) {
    const at = m.index + m[1].length;
    out.push({ index: at, length: m[2].length + 1, text: `#${m[2]}`, hex: normalizeHex(`#${m[2]}`) });
  }
  for (const m of text.matchAll(/\b(rgba?|hsla?|hwb|oklch|oklab|lab|lch)\(\s*([^)]*)\)/gi)) {
    if (/var\(/.test(m[2])) continue;
    out.push({ index: m.index, length: m[0].length, text: m[0], hex: null });
  }
  if (named) {
    for (const m of text.matchAll(/(^|[\s,(])([a-zA-Z]+)(?=$|[\s,)!])/g)) {
      if (NAMED.has(m[2].toLowerCase())) out.push({ index: m.index + m[1].length, length: m[2].length, text: m[2], hex: null });
    }
  }
  return out.sort((a, b) => a.index - b.index);
}

const groupFor = (prop) => (/^(color|caret|text-decoration)/.test(prop) ? 'text' : /^(fill|stroke|stop|flood|lighting)/.test(prop) ? 'foreground' : /^background/.test(prop) ? 'background' : /^(border|outline|column-rule)/.test(prop) ? 'border' : null);
function sameValue(d, hex, prop) {
  const list = hex ? d.semanticByHex.get(normalizeHex(hex)) ?? [] : [];
  const g = groupFor(prop);
  return g ? [...list.filter((t) => t.group === g), ...list.filter((t) => t.group !== g)] : list;
}
const hint = (d, hex, prop) => {
  const s = sameValue(d, hex, prop);
  return s.length ? ` Same Light value as ${s.slice(0, 3).map((t) => `var(${t.name})`).join(', ')}; pick by intent.` : ' Pick the semantic token by intent (https://docs.atomus.io/foundations/color/).';
};

/** Custom properties that define tokens may hold raw values: `--color-*` (brand blocks, token files). */
export const DEFAULT_TOKEN_DEFINITIONS = [/^--color-/, /^--(spacing|layout|radius|shadow|size|icon|font|line-height|letter-spacing|container|section|focus)-/];
const isDefinition = (prop, patterns) => prop.startsWith('--') && patterns.some((re) => re.test(prop));

export function checkNoRawColor(prop, value, { manifest, tokenDefinitions = DEFAULT_TOKEN_DEFINITIONS } = {}) {
  if (isDefinition(prop, tokenDefinitions)) return [];
  const d = index(manifest);
  return findRawColors(value, { named: COLOR_PROPS.test(prop) }).map((c) => ({
    rule: RULES.noRawColor,
    index: c.index,
    endIndex: c.index + c.length,
    message: `Raw colour ${c.text} in "${prop}". Use an Atomus semantic token (var(--color-…)).${hint(d, c.hex, prop)}`,
  }));
}

export function checkNoPrimitiveToken(prop, value, { manifest, tokenDefinitions = DEFAULT_TOKEN_DEFINITIONS } = {}) {
  if (isDefinition(prop, tokenDefinitions)) return [];
  const d = index(manifest);
  const out = [];
  for (const m of value.matchAll(/--color-[a-z]+(?:-[a-z]+)*-\d+\b/g)) {
    if (!d.primitives.has(m[0])) continue;
    out.push({
      rule: RULES.noPrimitiveToken,
      index: m.index,
      endIndex: m.index + m[0].length,
      message: `Primitive token ${m[0]} in "${prop}". Primitives exist only to be aliased; use the semantic token for the job.${hint(d, d.primitives.get(m[0]), prop)}`,
    });
  }
  return out;
}

/** Splits a value at top-level spaces and commas (not inside parentheses). */
function parts(value) {
  const out = [];
  let depth = 0, start = 0;
  for (let i = 0; i <= value.length; i++) {
    const c = value[i];
    if (c === '(') depth++;
    else if (c === ')') depth--;
    else if ((c === undefined || ((c === ' ' || c === ',' || c === '/') && depth === 0))) {
      if (i > start) out.push({ text: value.slice(start, i), index: start });
      start = i + 1;
    }
  }
  return out;
}

export function checkUseTokens(prop, value, { manifest, allow = [], forcedColors = false } = {}) {
  const p = prop.toLowerCase();
  const kind = SPACING_PROPS.test(p) ? 'spacing' : RADIUS_PROPS.test(p) ? 'radius' : PURE_COLOR_PROPS.test(p) ? 'color' : null;
  if (!kind) return [];
  const v = value.replace(/\s*!important\s*$/i, '');
  const d = index(manifest);
  const bad = [];
  for (const part of parts(v)) {
    const t = part.text.trim();
    if (!t || KEYWORDS.test(t) || /^-?var\(--/.test(t) || allow.some((re) => re.test(t))) continue;
    if (/^[a-z-]+\(/i.test(t) && /var\(--/.test(t)) continue; // calc(var(--spacing-xs) * -1), color-mix(… var(--…) …)
    if (kind === 'color' && findRawColors(t, { named: true }).length) continue; // reported by atomus/no-raw-color
    if (kind === 'color' && forcedColors && SYSTEM_COLORS.test(t)) continue;
    if (kind === 'color' && /^url\(/i.test(t)) continue; // fill: url(#gradient) is a paint server
    if (kind === 'radius' && /^\d+(\.\d+)?%$/.test(t)) continue; // 50% circles: shape, not a radius token
    bad.push(part);
  }
  if (!bad.length) return [];
  let fix;
  if (kind === 'spacing' && bad.every((b) => d.spacingByPx.has(b.text === '0' ? '0px' : b.text))) {
    let out = v;
    for (const b of [...bad].reverse()) out = out.slice(0, b.index) + `var(${d.spacingByPx.get(b.text)})` + out.slice(b.index + b.text.length);
    fix = out + value.slice(v.length);
  }
  const example = kind === 'spacing' ? 'var(--spacing-xl), or var(--layout-md) between blocks' : kind === 'radius' ? 'var(--radius-md) (follows the Radius mode)' : 'var(--color-text-secondary)';
  const tokenFor = (b) => (kind === 'spacing' ? d.spacingByPx.get(b.text) : kind === 'radius' ? d.radiusByPx.get(b.text) : null);
  return [{
    rule: RULES.useTokens,
    index: bad[0].index,
    endIndex: bad[bad.length - 1].index + bad[bad.length - 1].text.length,
    message: `"${prop}: ${value.trim()}" uses ${bad.map((b) => b.text).join(', ')}. ${kind[0].toUpperCase()}${kind.slice(1)} values must be Atomus tokens, e.g. ${example}.${bad.map(tokenFor).some(Boolean) ? ` Same value: ${bad.map((b) => tokenFor(b) && `${b.text} → var(${tokenFor(b)})`).filter(Boolean).join(', ')}.` : ''}`,
    ...(fix ? { fix } : {}),
  }];
}

/** All checks for one declaration. */
export function checkDeclaration(prop, value, options = {}) {
  return [...checkNoRawColor(prop, value, options), ...checkNoPrimitiveToken(prop, value, options), ...checkUseTokens(prop, value, options)];
}
