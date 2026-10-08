import { atomus, docsUrl, isClassContext, stringParts, classTokens, parseClass, locOf, findRawColors, NAMED_COLORS } from '../shared.js';

// Tailwind utilities by what their arbitrary value means.
const SPACING = /^(p|px|py|pt|pr|pb|pl|ps|pe|m|mx|my|mt|mr|mb|ml|ms|me|gap|gap-x|gap-y|space-x|space-y)$/;
const RADIUS = /^rounded(-(t|r|b|l|s|e|tl|tr|br|bl|ss|se|es|ee))?$/;
const COLOR = /^(bg|text|border|border-[trblxyse]|fill|stroke|ring|ring-offset|outline|divide|from|via|to|decoration|placeholder|accent|caret)$/;
const PROPERTY_KIND = [
  [/^(margin|padding|gap|row-gap|column-gap)(-.*)?$/, 'spacing'],
  [/^border(-.*)?-radius$/, 'radius'],
  [/^(color|background(-color)?|border(-.*)?-color|outline-color|fill|stroke|caret-color|accent-color|text-decoration-color)$/, 'color'],
];
const LENGTH = /^-?\d*\.?\d+(px|rem|em|%|vh|vw|svh|dvh|ch|ex|pt)?$/;
const KEYWORDS = new Set(['inherit', 'initial', 'unset', 'revert', 'currentcolor', 'transparent', 'auto', '0', 'none']);

/** Arbitrary values that already use a token are fine: [var(--spacing-xl)], [calc(var(--layout-md)*2)]. */
const usesToken = (v) => /var\(--|^--/.test(v);

function kindOf(cls) {
  if (cls.property) return PROPERTY_KIND.find(([re]) => re.test(cls.property))?.[1] ?? null;
  const u = cls.utility;
  if (!u) return null;
  if (SPACING.test(u)) return 'spacing';
  if (RADIUS.test(u)) return 'radius';
  if (COLOR.test(u)) {
    // text-[14px] is a font size and border-[2px] a width, not a colour.
    const v = cls.value.trim();
    if (/^(text|border|border-[trblxyse]|outline|ring|ring-offset|divide|decoration|stroke)$/.test(u) && (LENGTH.test(v) || /^(length|number|percentage):/.test(v))) return null;
    return 'color';
  }
  return null;
}

export default {
  meta: {
    type: 'suggestion',
    docs: { description: 'Disallow Tailwind arbitrary values ([...]) for colour, spacing and radius; use the Atomus theme utilities (p-xl, gap-lg, rounded-md, bg-primary).', recommended: true, url: docsUrl('no-arbitrary-value') },
    fixable: 'code',
    hasSuggestions: true,
    schema: [],
    messages: {
      arbitrary: 'Arbitrary {{kind}} value {{token}}. Use an Atomus {{kind}} token{{hint}}.',
      suggest: 'Replace with {{replacement}}',
    },
  },
  create(context) {
    const data = atomus(context);

    function check(node) {
      if (!isClassContext(node)) return;
      for (const part of stringParts(node)) {
        for (const { token, index } of classTokens(part.text)) {
          if (!token.includes('[')) continue;
          const cls = parseClass(token);
          if (cls.value == null) continue;
          const kind = kindOf(cls);
          if (!kind) continue;
          const v = cls.value.trim();
          if (usesToken(v) || KEYWORDS.has(v.toLowerCase())) continue;
          // Raw colours are reported by atomus/no-raw-color, primitives by atomus/no-primitive-token.
          if (kind === 'color' && findRawColors(v).length) continue;
          if (/--color-[a-z-]+-\d+/.test(v)) continue;

          let hint = '';
          let fix = null;
          const suggest = [];
          const range = [part.start + index, part.start + index + token.length];
          const prefix = `${cls.variants}${cls.important}${cls.negative}`;
          if (kind === 'spacing' && !cls.property) {
            const name = data.spacingByPx.get(v === '0' ? '0px' : v);
            if (name) {
              const replacement = `${prefix}${cls.utility}-${name}`;
              hint = ` (${replacement} has the same value)`;
              if (part.exact) fix = (fixer) => fixer.replaceTextRange(range, replacement);
            } else hint = ' (--spacing-* inside components, --layout-* between blocks: p-xl, gap-lg, py-layout-md)';
          } else if (kind === 'radius' && !cls.property) {
            const name = data.radiusByPx.get(v);
            if (name) {
              // Radius tokens follow the Radius mode (default / sharp / round), so this changes the result there: a suggestion, not a fix.
              const replacement = `${prefix}${cls.utility}-${name}`;
              hint = ` (${replacement} in the default Radius mode)`;
              if (part.exact) suggest.push({ messageId: 'suggest', data: { replacement }, fix: (fixer) => fixer.replaceTextRange(range, replacement) });
            } else hint = ' (rounded-sm, rounded-md, rounded-lg … follow the Radius mode)';
          } else if (kind === 'color') {
            hint = NAMED_COLORS.has(v.toLowerCase()) ? ' (bg-primary, text-secondary, border-secondary …)' : ' (semantic utilities such as bg-secondary or text-tertiary)';
          }
          context.report({ loc: locOf(context, part.start + index, token.length), messageId: 'arbitrary', data: { kind, token, hint }, fix, suggest });
        }
      }
    }

    return {
      Literal(node) { if (typeof node.value === 'string') check(node); },
      TemplateElement: check,
    };
  },
};
