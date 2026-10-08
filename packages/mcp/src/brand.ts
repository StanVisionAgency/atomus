// Brand ramp generator: one hex → the 12 Atomus brand steps (25 … 950), shaped like the Atomus blue ramp in OKLCH.
const STEPS = ['25', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

type Lch = { l: number; c: number; h: number };

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const fromLinear = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

export function parseHex(hex: string): [number, number, number] | null {
  const m = hex.trim().toLowerCase().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/);
  if (!m) return null;
  const h = m[1].length === 3 ? [...m[1]].map((c) => c + c).join('') : m[1];
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];
}
export const toHex = (rgb: [number, number, number]) => `#${rgb.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, '0')).join('')}`;

export function rgbToOklch([r, g, b]: [number, number, number]): Lch {
  const [lr, lg, lb] = [r, g, b].map(toLinear);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { l: L, c: Math.hypot(A, B), h: ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360 };
}

function oklchToLinear({ l, c, h }: Lch): [number, number, number] {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];
}

/** OKLCH → sRGB, reducing chroma until the colour fits the gamut. */
export function oklchToRgb(c: Lch): [number, number, number] {
  let chroma = c.c;
  for (let i = 0; i < 40; i++) {
    const lin = oklchToLinear({ ...c, c: chroma });
    if (lin.every((v) => v >= -0.0005 && v <= 1.0005)) return lin.map((v) => fromLinear(Math.min(1, Math.max(0, v)))) as [number, number, number];
    chroma *= 0.92;
  }
  return oklchToLinear({ ...c, c: 0 }).map((v) => fromLinear(Math.min(1, Math.max(0, v)))) as [number, number, number];
}

export function luminance(rgb: [number, number, number]) {
  const [r, g, b] = rgb.map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrast(a: string, b: string) {
  const la = luminance(parseHex(a)!);
  const lb = luminance(parseHex(b)!);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/**
 * Builds a ramp around `hex`. The colour lands on `anchor` (or the step whose lightness is closest in the Atomus ramp);
 * the other steps follow the Atomus ramp's lightness curve (stretched so the anchor matches) and its chroma profile.
 */
export function brandRamp(hex: string, reference: Record<string, string>, anchor: string | 'auto' = 'auto') {
  const input = parseHex(hex);
  if (!input) throw new Error(`"${hex}" is not a hex colour (#rrggbb).`);
  const target = rgbToOklch(input);
  const ref = Object.fromEntries(STEPS.map((s) => [s, rgbToOklch(parseHex(reference[s])!)])) as Record<string, Lch>;
  const at = anchor === 'auto'
    ? STEPS.slice(2, 10).reduce((best, s) => (Math.abs(ref[s].l - target.l) < Math.abs(ref[best].l - target.l) ? s : best), '500')
    : anchor;
  if (!STEPS.includes(at)) throw new Error(`anchor must be one of ${STEPS.join(', ')} or "auto".`);
  const ai = STEPS.indexOf(at);
  const first = ref[STEPS[0]].l;
  const last = ref[STEPS[STEPS.length - 1]].l;
  const chromaScale = ref[at].c > 0.01 ? target.c / ref[at].c : 1;
  const ramp: Record<string, string> = {};
  STEPS.forEach((s, i) => {
    if (i === ai) { ramp[s] = toHex(input); return; }
    // Piecewise-linear remap of the reference lightness so that ref[at] → target.l, ends unchanged.
    const lRef = ref[s].l;
    const l = i < ai
      ? first + ((lRef - first) * (target.l - first)) / (ref[at].l - first || 1)
      : target.l + ((lRef - ref[at].l) * (last - target.l)) / (last - ref[at].l || 1);
    const c = Math.min(0.37, ref[s].c * chromaScale);
    ramp[s] = toHex(oklchToRgb({ l, c: target.c < 0.02 ? target.c : c, h: target.h }));
  });
  return { ramp, anchor: at, steps: STEPS };
}
