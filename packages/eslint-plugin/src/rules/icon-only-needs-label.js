import { atomus, docsUrl, atomusImports, jsxAtomusName, attrStaticValue, findAttr } from '../shared.js';

const LABEL_ATTRS = ['aria-label', 'aria-labelledby'];

export default {
  meta: {
    type: 'problem',
    docs: { description: 'Require an aria-label on icon-only Atomus Buttons (iconOnly, or an icon with no text).', recommended: true, url: docsUrl('icon-only-needs-label') },
    schema: [],
    messages: {
      missing: 'Icon-only <{{name}}> needs an accessible name: add aria-label="…" (a verb, e.g. "Delete project") and a tooltip.',
      empty: 'aria-label on an icon-only <{{name}}> must not be empty.',
    },
  },
  create(context) {
    const data = atomus(context);
    let imports = null;
    return {
      Program(node) {
        imports = atomusImports(node, data.packages);
      },
      JSXOpeningElement(node) {
        const name = jsxAtomusName(node.name, imports);
        if (name !== 'Button') return;
        const iconOnlyAttr = findAttr(node, 'iconOnly');
        const iconOnly = iconOnlyAttr ? attrStaticValue(iconOnlyAttr) !== false : false;
        const children = node.parent.type === 'JSXElement' ? node.parent.children.filter((c) => c.type !== 'JSXText' || c.value.trim()) : [];
        const hasIcon = findAttr(node, 'iconLeading') || findAttr(node, 'iconTrailing');
        if (!iconOnly && !(hasIcon && children.length === 0 && !findAttr(node, 'children'))) return;
        if (node.attributes.some((a) => a.type === 'JSXSpreadAttribute')) return; // may carry the label
        const label = LABEL_ATTRS.map((n) => findAttr(node, n)).find(Boolean);
        if (!label) context.report({ node: node.name, messageId: 'missing', data: { name } });
        else if (attrStaticValue(label) === '' || (typeof attrStaticValue(label) === 'string' && !attrStaticValue(label).trim())) context.report({ node: label, messageId: 'empty', data: { name } });
      },
    };
  },
};
