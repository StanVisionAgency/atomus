// Copies the single sources (repo root) into the docs site before every build:
// tokens CSS, component CSS and the Markdown guidelines. Edit the sources, not the copies.
import { cpSync, mkdirSync, readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../../../', import.meta.url).pathname;
const docs = new URL('../src/content/docs/', import.meta.url).pathname;
const styles = new URL('../src/styles/', import.meta.url).pathname;

cpSync(join(root, 'css/atomus.css'), join(styles, 'atomus.css'));
cpSync(join(root, 'react/src/styles.css'), join(styles, 'components.css'));

function toPage(src, dest, extra = {}) {
  let md = readFileSync(src, 'utf8');
  const m = md.match(/^#\s+(.+)\n/);
  const title = (extra.title ?? (m ? m[1] : 'Untitled')).replace(/"/g, '\\"');
  if (m) md = md.slice(m[0].length);
  const fm = [`title: "${title}"`];
  if (extra.description) fm.push(`description: "${extra.description.replace(/"/g, '\\"')}"`);
  if (extra.order !== undefined) fm.push(`sidebar:\n  order: ${extra.order}`);
  writeFileSync(dest, `---\n${fm.join('\n')}\n---\n\n<!-- Generated from ${src.replace(root, '')} by scripts/sync.mjs — edit the source file. -->\n\n${md.trim()}\n`);
}

const order = ['color', 'typography', 'spacing-layout', 'radius-effects', 'icons', 'theming'];
mkdirSync(join(docs, 'foundations'), { recursive: true });
for (const f of readdirSync(join(root, 'guidelines/foundations'))) {
  const name = f.replace(/\.md$/, '');
  toPage(join(root, 'guidelines/foundations', f), join(docs, 'foundations', f), { order: order.indexOf(name) + 1 });
}
mkdirSync(join(docs, 'figma-reference'), { recursive: true });
for (const f of readdirSync(join(root, 'guidelines/components'))) {
  toPage(join(root, 'guidelines/components', f), join(docs, 'figma-reference', f));
}
toPage(join(root, 'guidelines/website-sections.md'), join(docs, 'website-sections.md'), { description: 'Responsive marketing sections and example pages in the Atomus Figma file.' });
console.log('synced tokens, component CSS and guidelines from', root);
