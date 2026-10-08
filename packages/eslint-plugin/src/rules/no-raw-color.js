import {
  atomus, docsUrl, findRawColors, COLOR_PROPS, sameValueTokens, tokenHint, isClassContext, attrName, calleeName,
  stringParts, classTokens, parseClass, locOf, cssPropertyAt, propertyKeyOf,
} from '../shared.js';

const STYLE_ATTRS = new Set(['style', 'sx', 'css']);
const SVG_COLOR_ATTRS = new Set(['fill', 'stroke', 'color', 'stopColor', 'floodColor', 'lightingColor']);
const CSS_TAGS = new Set(['css', 'styled', 'keyframes', 'createGlobalStyle', 'injectGlobal', 'global', 'styledComponents']);

/** Where a string sits: 'class' | 'style' | 'color-prop' | 'css-in-js' | 'svg-attr' | null. */
function contextOf(node) {
  if (isClassContext(node)) return 'class';
  let n = node;
  let colorProp = false;
  for (let depth = 0; n.parent && depth < 12; depth++) {
    const p = n.parent;
    if (p.type === 'Property' && p.value === n && p.parent.type === 'ObjectExpression') {
      const key = p.key.type === 'Identifier' ? p.key.name : p.key.value;
      if (typeof key === 'string' && COLOR_PROPS.has(key)) colorProp = true;
    }
    if (p.type === 'TaggedTemplateExpression' && CSS_TAGS.has(calleeName(p.tag))) return 'css-in-js';
    if (p.type === 'JSXAttribute') {
      const name = attrName(p);
      if (STYLE_ATTRS.has(name)) return colorProp ? 'color-prop' : 'style';
      // fill="#fff" on <path>/<svg>; on a component (Badge color="gray") the value is a prop enum, checked by valid-props.
      const el = p.parent.name;
      if (SVG_COLOR_ATTRS.has(name) && el.type === 'JSXIdentifier' && /^[a-z]/.test(el.name)) return 'svg-attr';
      return colorProp ? 'color-prop' : null;
    }
    if (p.type === 'CallExpression' && p.arguments.includes(n) && CSS_TAGS.has(calleeName(p.callee))) return colorProp ? 'color-prop' : 'style';
    n = p;
  }
  return colorProp ? 'color-prop' : null;
}

/** true when the colour at `index` sits in a custom-property definition (`--color-brand-600: #…`) — a token definition. */
function inCustomPropertyDefinition(text, index) {
  const start = Math.max(text.lastIndexOf(';', index), text.lastIndexOf('{', index), text.lastIndexOf('\n', index)) + 1;
  return /^\s*--[\w-]+\s*:/.test(text.slice(start, index));
}

export default {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow raw hex, rgb(), hsl() and named colours in JSX styles, class names and CSS-in-JS; use Atomus semantic tokens.', recommended: true, url: docsUrl('no-raw-color') },
    hasSuggestions: true,
    schema: [{ type: 'object', properties: { allowNamed: { type: 'boolean' } }, additionalProperties: false }],
    messages: {
      raw: 'Raw colour {{color}}. Use an Atomus semantic token. {{hint}}',
      suggestVar: 'Replace with var({{token}})',
      suggestClass: 'Replace with {{replacement}}',
    },
  },
  create(context) {
    const data = atomus(context);
    const allowNamed = context.options[0]?.allowNamed ?? false;

    function report(start, c, suggest, property) {
      context.report({
        loc: locOf(context, start + c.index, c.length),
        messageId: 'raw',
        data: { color: c.text, hint: tokenHint(data, c.hex, property) },
        suggest,
      });
    }

    function checkCss(part, named) {
      for (const c of findRawColors(part.text, { named: named && !allowNamed })) {
        if (inCustomPropertyDefinition(part.text, c.index)) continue;
        const property = cssPropertyAt(part.text, c.index) ?? propertyKeyOf(part.node);
        const suggest = part.exact
          ? sameValueTokens(data, c.hex, property).slice(0, 3).map((t) => ({
              messageId: 'suggestVar',
              data: { token: t.name },
              fix: (fixer) => fixer.replaceTextRange([part.start + c.index, part.start + c.index + c.length], `var(${t.name})`),
            }))
          : [];
        report(part.start, c, suggest, property);
      }
    }

    function checkClasses(part) {
      for (const { token, index } of classTokens(part.text)) {
        if (!token.includes('[')) continue;
        const cls = parseClass(token);
        if (cls.rawValue == null) continue;
        const valueAt = index + token.indexOf(cls.rawValue, token.indexOf('['));
        // Tailwind writes spaces as "_"; colours never contain "_", so offsets stay exact.
        for (const c of findRawColors(cls.rawValue, { named: false })) {
          const suggest = [];
          if (part.exact) {
            for (const t of sameValueTokens(data, c.hex).slice(0, 3)) {
              const util = cls.utility && t.tailwind.find((u) => u.startsWith(`${cls.utility}-`));
              const replacement = util && cls.rawValue === c.text ? `${cls.variants}${cls.important}${util}` : null;
              if (replacement) suggest.push({ messageId: 'suggestClass', data: { replacement }, fix: (fixer) => fixer.replaceTextRange([part.start + index, part.start + index + token.length], replacement) });
              else suggest.push({ messageId: 'suggestVar', data: { token: t.name }, fix: (fixer) => fixer.replaceTextRange([part.start + valueAt + c.index, part.start + valueAt + c.index + c.length], `var(${t.name})`) });
            }
          }
          report(part.start + valueAt, c, suggest);
        }
      }
    }

    function check(node) {
      const where = contextOf(node);
      if (!where) return;
      for (const part of stringParts(node)) {
        if (where === 'class') checkClasses(part);
        else checkCss(part, where === 'color-prop' || where === 'svg-attr');
      }
    }

    return {
      Literal(node) { if (typeof node.value === 'string') check(node); },
      TemplateElement: check,
    };
  },
};
