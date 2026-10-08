import { atomus, docsUrl, atomusImports, jsxAtomusName, attrName, attrStaticValue, attrValueNode, isNativeAttr } from '../shared.js';

const lowerFirst = (s) => s.charAt(0).toLowerCase() + s.slice(1);
const camel = (s) => lowerFirst(s.replace(/[^A-Za-z0-9]+(\w)/g, (_, c) => c.toUpperCase()).replace(/[^A-Za-z0-9]/g, ''));

export default {
  meta: {
    type: 'problem',
    docs: { description: 'Allow only real Atomus exports, props and enum values (driven by the Atomus manifest).', recommended: true, url: docsUrl('valid-props') },
    fixable: 'code',
    hasSuggestions: true,
    schema: [{ type: 'object', properties: { checkRequired: { type: 'boolean' } }, additionalProperties: false }],
    messages: {
      unknownExport: '{{name}} is not exported by {{pkg}}. {{hint}}',
      figmaOnly: '{{name}} is a Figma-only Atomus component with no React export. {{alternative}}',
      unknownProp: '<{{component}}> has no prop "{{prop}}". Props: {{props}}{{native}}.',
      invalidValue: '<{{component}} {{prop}}="{{value}}"> is not a valid value. Allowed: {{allowed}}.',
      missingProp: '<{{component}}> is missing the required prop "{{prop}}".',
      suggestProp: 'Rename to {{prop}}',
      suggestValue: 'Use {{prop}}="{{value}}"',
    },
  },
  create(context) {
    const data = atomus(context);
    const checkRequired = context.options[0]?.checkRequired ?? true;
    let imports = { locals: new Map(), namespaces: new Set(), any: false };

    /** A Figma value or a wrong-case value that maps to exactly one allowed value. */
    function valueFix(c, prop, value) {
      const p = c.props[prop];
      const ci = p.values.filter((v) => String(v).toLowerCase() === String(value).toLowerCase());
      if (ci.length === 1) return ci[0];
      for (const node of c.figma?.nodes ?? []) {
        for (const m of node.mappings) if (m.prop === prop && m.kind === 'enum' && m.values?.[value] != null && p.values.includes(m.values[value])) return m.values[value];
      }
      return null;
    }

    /** A prop the author probably meant: Figma property name (Style → variant) or a case slip (IconOnly → iconOnly). */
    function propGuess(c, name) {
      const props = Object.keys(c.props);
      const byCase = props.find((p) => p.toLowerCase() === name.toLowerCase());
      if (byCase) return byCase;
      const byFigma = props.find((p) => c.props[p].figma && (c.props[p].figma === name || camel(c.props[p].figma) === name || c.props[p].figma.toLowerCase() === name.toLowerCase()));
      if (byFigma) return byFigma;
      const byCamel = props.find((p) => p === camel(name));
      return byCamel ?? null;
    }

    return {
      Program(node) {
        imports = atomusImports(node, data.packages);
      },
      ImportDeclaration(node) {
        if (!data.packages.includes(node.source.value)) return;
        for (const s of node.specifiers) {
          if (s.type !== 'ImportSpecifier') continue;
          const name = s.imported.name ?? s.imported.value;
          if (data.exportsValues.has(name) || data.exportsTypes.has(name)) continue;
          const fo = data.figmaOnly.get(name.toLowerCase());
          if (fo) context.report({ node: s, messageId: 'figmaOnly', data: { name, alternative: fo.alternative ?? 'Compose it from Atomus components and tokens.' } });
          else context.report({ node: s, messageId: 'unknownExport', data: { name, pkg: node.source.value, hint: 'Check the catalogue: https://docs.atomus.io/components/choosing/' } });
        }
      },
      JSXOpeningElement(node) {
        const name = jsxAtomusName(node.name, imports);
        if (!name) return;
        const c = data.components.get(name);
        if (!c) {
          // Namespace use of something that doesn't exist (Atomus.Drawer).
          if (imports.namespaces.size && node.name.type === 'JSXMemberExpression') {
            const fo = data.figmaOnly.get(name.toLowerCase());
            context.report({ node: node.name, ...(fo ? { messageId: 'figmaOnly', data: { name, alternative: fo.alternative ?? '' } } : { messageId: 'unknownExport', data: { name, pkg: data.packages[0], hint: 'Check the catalogue: https://docs.atomus.io/components/choosing/' } }) });
          }
          return;
        }
        if (c.kind !== 'component') return;
        const native = c.native ?? { elements: [], omit: [], ref: false };
        let spread = false;
        const present = new Set();
        for (const attr of node.attributes) {
          if (attr.type === 'JSXSpreadAttribute') { spread = true; continue; }
          const prop = attrName(attr);
          present.add(prop);
          if (prop === 'key') continue;
          if (prop === 'ref') {
            if (native.ref) continue;
          }
          const p = c.props[prop];
          if (!p) {
            if (prop !== 'ref' && native.elements.length && isNativeAttr(prop, native.elements, native.omit)) continue;
            const guess = propGuess(c, prop);
            context.report({
              node: attr.name,
              messageId: 'unknownProp',
              data: {
                component: name,
                prop,
                props: Object.keys(c.props).join(', ') || '(none)',
                native: native.elements.length ? ` (+ native ${native.elements.map((e) => (e === 'element' ? 'HTML' : `<${e}>`)).join('/')} attributes)` : '',
              },
              suggest: guess ? [{ messageId: 'suggestProp', data: { prop: guess }, fix: (fixer) => fixer.replaceText(attr.name, guess) }] : [],
            });
            continue;
          }
          if (!p.values) continue;
          const value = attrStaticValue(attr);
          if (value === undefined || value === true || p.values.includes(value)) continue;
          const better = valueFix(c, prop, value);
          const valueNode = attrValueNode(attr);
          context.report({
            node: attr,
            messageId: 'invalidValue',
            data: { component: name, prop, value: String(value), allowed: p.values.map((v) => `"${v}"`).join(' | ') },
            // A wrong-case or Figma value ("Primary") has exactly one meaning: safe to fix.
            fix: better != null && valueNode && typeof better === 'string' ? (fixer) => fixer.replaceText(valueNode, valueNode.type === 'Literal' ? JSON.stringify(better) : `\`${better}\``) : null,
            suggest: better == null ? p.values.slice(0, 6).filter((v) => typeof v === 'string' && valueNode).map((v) => ({ messageId: 'suggestValue', data: { prop, value: v }, fix: (fixer) => fixer.replaceText(valueNode, JSON.stringify(v)) })) : [],
          });
        }
        if (checkRequired && !spread) {
          const hasChildren = node.parent.type === 'JSXElement' && node.parent.children.some((ch) => ch.type !== 'JSXText' || ch.value.trim());
          for (const [prop, p] of Object.entries(c.props)) {
            if (!p.required || present.has(prop)) continue;
            if (prop === 'children' && hasChildren) continue;
            context.report({ node: node.name, messageId: 'missingProp', data: { component: name, prop } });
          }
        }
      },
    };
  },
};
