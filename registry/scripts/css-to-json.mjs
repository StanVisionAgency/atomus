// Converts CSS text into the object form of a shadcn registry item's `css` field:
//   { "<selector>": { "<prop>": "<value>" }, "@media (…)": { "<selector>": { … } }, "@import \"x\"": {} }
// The shadcn CLI writes that object back as CSS into the project's Tailwind entry file.
import postcss from 'postcss';

/**
 * @param {string} css
 * @param {{ source?: string }} [opts]
 * @returns {Record<string, unknown>}
 */
export function cssToJson(css, { source = 'css' } = {}) {
  const root = postcss.parse(css);
  return walk(root, source);
}

function walk(container, source) {
  const out = {};
  container.each((node) => {
    if (node.type === 'comment') return;
    if (node.type === 'decl') {
      // Declarations directly inside an at-rule (e.g. @font-face) are handled by the caller.
      setDecl(out, node, source);
      return;
    }
    if (node.type === 'rule') {
      const sel = node.selector.replace(/\s+/g, ' ').trim();
      const body = {};
      node.each((child) => {
        if (child.type === 'decl') setDecl(body, child, source);
        else if (child.type === 'comment') return;
        else throw new Error(`${source}: nested ${child.type} inside "${sel}" is not supported`);
      });
      if (out[sel]) {
        // Same selector twice in one block: merge, but refuse conflicting values (the cascade order would change).
        for (const [k, v] of Object.entries(body)) {
          if (k in out[sel] && out[sel][k] !== v) throw new Error(`${source}: "${sel}" sets ${k} twice with different values`);
          out[sel][k] = v;
        }
      } else out[sel] = body;
      return;
    }
    if (node.type === 'atrule') {
      const key = `@${node.name}${node.params ? ` ${node.params.replace(/\s+/g, ' ').trim()}` : ''}`;
      if (!node.nodes) {
        out[key] = {};
        return;
      }
      const inner = walk(node, source);
      out[key] = out[key] ? { ...out[key], ...inner } : inner;
    }
  });
  return out;
}

function setDecl(obj, decl, source) {
  const value = `${decl.value.replace(/\s+/g, ' ').trim()}${decl.important ? ' !important' : ''}`;
  if (decl.prop in obj && obj[decl.prop] !== value) {
    throw new Error(`${source}: property ${decl.prop} is declared twice in one rule (${obj[decl.prop]} / ${value})`);
  }
  obj[decl.prop] = value;
}
