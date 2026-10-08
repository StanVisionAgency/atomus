import { atomus, docsUrl, atomusImports, jsxAtomusName, attrStaticValue, findAttr } from '../shared.js';

const FUNCTION = new Set(['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression']);

/** The view a JSX element belongs to: the nearest Atomus Modal around it, else the enclosing component function. */
function viewOf(node, imports) {
  for (let n = node.parent; n; n = n.parent) {
    if (n.type === 'JSXElement' && n.openingElement !== node && jsxAtomusName(n.openingElement.name, imports) === 'Modal') return n;
    if (FUNCTION.has(n.type) && returnsJsxView(n)) return n;
    if (n.type === 'Program') return n;
  }
  return null;
}
/** Small helper callbacks (items.map(…)) are not views; a function whose name starts with a capital is. */
function returnsJsxView(fn) {
  const name = fn.id?.name ?? (fn.parent?.type === 'VariableDeclarator' ? fn.parent.id.name : null) ?? (fn.parent?.type === 'CallExpression' && fn.parent.parent?.type === 'VariableDeclarator' ? fn.parent.parent.id.name : null);
  return Boolean(name && /^[A-Z]/.test(name));
}
/** true when a and b sit in different branches of the same conditional (only one renders). */
function exclusive(a, b) {
  const ancestors = new Map();
  for (let n = a, child = null; n; child = n, n = n.parent) ancestors.set(n, child);
  for (let n = b, child = null; n; child = n, n = n.parent) {
    if (!ancestors.has(n)) continue;
    const fromA = ancestors.get(n);
    if (n.type === 'ConditionalExpression' || n.type === 'IfStatement') {
      const branches = n.type === 'ConditionalExpression' ? [n.consequent, n.alternate] : [n.consequent, n.alternate];
      if (fromA && child && fromA !== child && branches.includes(fromA) && branches.includes(child)) return true;
    }
    return false;
  }
  return false;
}

export default {
  meta: {
    type: 'suggestion',
    docs: { description: 'At most one hierarchy="primary" Button per view (component, or Modal inside it).', recommended: true, url: docsUrl('one-primary-per-view') },
    schema: [],
    messages: {
      extra: 'More than one primary Button in this view ({{count}}). Keep one primary for the main action; make the others outline, secondary, tertiary or link.',
    },
  },
  create(context) {
    const data = atomus(context);
    let imports = null;
    const views = new Map();
    return {
      Program(node) {
        imports = atomusImports(node, data.packages);
      },
      JSXOpeningElement(node) {
        if (jsxAtomusName(node.name, imports) !== 'Button') return;
        const h = findAttr(node, 'hierarchy');
        if (!h || String(attrStaticValue(h)).toLowerCase() !== 'primary') return; // "Primary" (a Figma value) is fixed to primary by valid-props
        const view = viewOf(node, imports);
        if (!views.has(view)) views.set(view, []);
        views.get(view).push(node);
      },
      'Program:exit'() {
        for (const list of views.values()) {
          const kept = [];
          for (const el of list) {
            if (kept.every((k) => exclusive(k, el))) kept.push(el);
            else context.report({ node: el, messageId: 'extra', data: { count: list.length } });
          }
        }
      },
    };
  },
};
