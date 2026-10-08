import { atomus, docsUrl, sameValueTokens, isClassContext, stringParts, classTokens, parseClass, locOf, cssPropertyAt, propertyKeyOf } from '../shared.js';

const TW_COLOR_UTILS = 'bg|text|border|border-[trblxy]|border-[se]|fill|stroke|ring|ring-offset|outline|divide|from|via|to|decoration|placeholder|accent|caret|shadow|inset-shadow|inset-ring';

export default {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow primitive colour tokens (var(--color-gray-500), bg-gray-500) where a semantic token exists.', recommended: true, url: docsUrl('no-primitive-token') },
    hasSuggestions: true,
    schema: [],
    messages: {
      primitive: 'Primitive token {{name}}. Primitives exist only to be aliased; use the semantic token for the job. {{hint}}',
      primitiveClass: 'Tailwind primitive colour class {{name}}. Use the semantic utility for the job. {{hint}}',
      suggest: 'Replace with {{replacement}}',
    },
  },
  create(context) {
    const data = atomus(context);
    if (!data.rampRe) return {};
    const varRe = /--color-[a-z]+(?:-[a-z]+)*-\d+\b/g;
    const twRe = new RegExp(`^(${TW_COLOR_UTILS})-(${data.rampRe})-(\\d{2,3})(?:\\/(\\d+|\\[[^\\]]+\\]))?$`);

    const hintFor = (hex, tailwind, property) => {
      const same = sameValueTokens(data, hex, property);
      if (!same.length) return 'Pick the semantic token by intent (https://docs.atomus.io/foundations/color/).';
      const names = tailwind ? same.flatMap((t) => t.tailwind) : same.map((t) => `var(${t.name})`);
      return names.length ? `Same Light value: ${names.slice(0, 3).join(', ')} (pick by intent).` : 'Pick the semantic token by intent (https://docs.atomus.io/foundations/color/).';
    };

    function checkVars(part) {
      for (const m of part.text.matchAll(varRe)) {
        const name = m[0];
        if (!data.primitives.has(name)) continue;
        // `--color-brand-600: var(--color-violet-600)` defines a token (a brand block); stylelint covers token files.
        if (/^\s*:/.test(part.text.slice(m.index + name.length))) continue;
        const declStart = Math.max(part.text.lastIndexOf(';', m.index), part.text.lastIndexOf('{', m.index), part.text.lastIndexOf('\n', m.index)) + 1;
        if (/^\s*--color-[\w-]+\s*:/.test(part.text.slice(declStart, m.index))) continue;
        const hex = data.primitives.get(name);
        const isVarCall = part.text.slice(Math.max(0, m.index - 4), m.index) === 'var(';
        const property = cssPropertyAt(part.text, m.index) ?? propertyKeyOf(part.node);
        const suggest = part.exact
          ? sameValueTokens(data, hex, property).slice(0, 3).map((t) => ({
              messageId: 'suggest',
              data: { replacement: isVarCall ? `var(${t.name})` : t.name },
              fix: (fixer) => fixer.replaceTextRange([part.start + m.index, part.start + m.index + name.length], t.name),
            }))
          : [];
        context.report({ loc: locOf(context, part.start + m.index, name.length), messageId: 'primitive', data: { name, hint: hintFor(hex, false, property) }, suggest });
      }
    }

    function checkClasses(part) {
      for (const { token, index } of classTokens(part.text)) {
        const cls = parseClass(token);
        const m = cls.base.match(twRe);
        if (!m) continue;
        const name = `--color-${m[2]}-${m[3]}`;
        if (!data.primitives.has(name)) continue;
        const hex = data.primitives.get(name);
        const util = m[1];
        const suggest = part.exact
          ? sameValueTokens(data, hex)
              .flatMap((t) => t.tailwind.filter((u) => u.startsWith(`${util}-`)))
              .slice(0, 3)
              .map((u) => {
                const replacement = `${cls.variants}${cls.important}${u}${m[4] ? `/${m[4]}` : ''}`;
                return { messageId: 'suggest', data: { replacement }, fix: (fixer) => fixer.replaceTextRange([part.start + index, part.start + index + token.length], replacement) };
              })
          : [];
        context.report({ loc: locOf(context, part.start + index, token.length), messageId: 'primitiveClass', data: { name: token, hint: hintFor(hex, true) }, suggest });
      }
    }

    function check(node) {
      const cls = isClassContext(node);
      for (const part of stringParts(node)) {
        checkVars(part);
        if (cls) checkClasses(part);
      }
    }

    return {
      Literal(node) { if (typeof node.value === 'string') check(node); },
      TemplateElement: check,
    };
  },
};
