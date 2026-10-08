import { atomus, docsUrl, atomusImports, attrName, attrStaticValue, findAttr } from '../shared.js';

/** Raw element → Atomus component. Inputs depend on their type. */
function replacementFor(node) {
  const tag = node.name.type === 'JSXIdentifier' ? node.name.name : null;
  if (tag === 'button') return 'Button';
  if (tag === 'select') return 'Select';
  if (tag === 'dialog') return 'Modal';
  if (tag === 'input') {
    const typeAttr = findAttr(node, 'type');
    const type = typeAttr ? attrStaticValue(typeAttr) : 'text';
    if (type === undefined) return null; // dynamic type: can't tell
    switch (String(type).toLowerCase()) {
      case 'checkbox': return 'Checkbox (or Toggle for a setting that applies immediately)';
      case 'radio': return 'Radio';
      case 'submit': case 'reset': case 'button': return 'Button';
      case 'file': case 'hidden': case 'range': case 'color': case 'image': return null; // Figma-only in Atomus (File upload, Slider, Color picker)
      case 'date': case 'datetime-local': return 'DatePicker';
      default: return 'Input';
    }
  }
  return null;
}

export default {
  meta: {
    type: 'suggestion',
    docs: { description: 'In files that use Atomus, use Atomus components instead of raw <button>, <input>, <select> and <dialog>.', recommended: true, url: docsUrl('prefer-atomus-component') },
    schema: [{ type: 'object', properties: { allow: { type: 'array', items: { type: 'string' } } }, additionalProperties: false }],
    messages: {
      prefer: 'Use {{component}} from {{pkg}} instead of a raw <{{tag}}>: it carries the Atomus styles, sizes, states and accessibility.',
    },
  },
  create(context) {
    const data = atomus(context);
    const allow = new Set(context.options[0]?.allow ?? []);
    let uses = false;
    return {
      Program(node) {
        uses = atomusImports(node, data.packages).any;
      },
      JSXOpeningElement(node) {
        if (!uses || node.name.type !== 'JSXIdentifier') return;
        const tag = node.name.name;
        if (allow.has(tag)) return;
        const component = replacementFor(node);
        if (!component) return;
        // <button> rendered as the trigger of a native form element with a role override stays allowed.
        const role = findAttr(node, 'role');
        if (role && attrName(role) === 'role' && ['tab', 'menuitem', 'option', 'switch'].includes(attrStaticValue(role))) return;
        context.report({ node: node.name, messageId: 'prefer', data: { component, tag, pkg: data.packages[0] } });
      },
    };
  },
};
