// Post-build: writes the docs for agents into dist/, as plain Markdown converted from the built pages.
//
//   /llms.txt                 index (llmstxt.org): what Atomus is, rules for agents, every page with a link
//   /llms-full.txt            every page in full
//   /llms-small.txt           every page without notes, tips and collapsed details
//   /_llms-txt/<set>.txt      topic subsets (components, foundations and tokens, AI and agents)
//   /<page>/index.md          a Markdown twin of every page
//
// Why not the starlight-llms-txt plugin: it renders each MDX entry in an Astro container that has no React
// renderer, and the component pages embed live React demos, so its build fails (NoMatchingRenderer).
// Converting the built HTML instead keeps the React API tables, token tables and code samples, drops the
// live demos, and follows the sidebar order people see.
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';
import { select, selectAll } from 'hast-util-select';
import { toString } from 'hast-util-to-string';

const site = 'https://docs.atomus.io';
const dist = new URL('../dist/', import.meta.url).pathname;

const PROJECT = 'Atomus';
const SUMMARY =
  'Atomus 4.0 is a design system for product UI and marketing websites by StanVision, built for humans and agents: a Figma file, design tokens (`@stanvision/atomus-tokens`: CSS, Tailwind v4, shadcn/ui, DTCG JSON) and React components (`@stanvision/atomus-react`) whose props mirror the Figma properties.';
const DETAILS = `Rules for agents building with Atomus:

- Search before you write: pick components with "Choosing a component" and use only the props in each component page's "React API" section. Never invent props or import components that are not listed.
- Use semantic tokens only (\`var(--color-text-primary)\`, \`var(--spacing-xl)\`, Tailwind \`text-primary\`), never raw hex or primitives such as \`--color-gray-500\`.
- One primary button per view; put custom content in slots instead of copying component markup.
- Theme with \`data-theme\`, \`data-brand\` and \`data-radius\` attributes; never override token values.

Every page is also available as Markdown at its URL plus \`index.md\` (for example ${site}/components/button/index.md). The source guidelines and the Atomus agent skill (\`npx skills add StanVisionAgency/atomus\`) are at https://github.com/StanVisionAgency/atomus.`;

const SETS = [
  { slug: 'components', label: 'Components', description: 'every component page: Figma properties, usage rules and React API', match: (p) => p.startsWith('/components/') },
  { slug: 'foundations-and-tokens', label: 'Foundations and tokens', description: 'colour, type, spacing, radius, icons, theming and the code token formats', match: (p) => p.startsWith('/foundations/') || p.startsWith('/code/') },
  { slug: 'ai-and-agents', label: 'AI and agents', description: 'rules for agents, the skill, the Atomus MCP server, lint rules, the shadcn registry, evals, Figma MCP and llms.txt', match: (p) => p.startsWith('/ai/') },
];

// ---------------------------------------------------------------- read pages

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) {
      if (!f.startsWith('_') && f !== 'pagefind') walk(p, out);
    } else if (f === 'index.html') out.push(p);
  }
  return out;
}

const parse = unified().use(rehypeParse);
const toMarkdown = unified()
  .use(rehypeRemark, {
    handlers: {
      // Starlight's <br> in table cells etc. stays a space; keep everything else default.
    },
  })
  .use(remarkGfm)
  .use(remarkStringify, { bullet: '-', fences: true, rule: '-', emphasis: '_', listItemIndent: 'one' });

/** Removes nodes matching a selector from a hast tree. */
function strip(tree, selector) {
  for (const node of selectAll(selector, tree)) node.__strip = true;
  (function prune(n) {
    if (!n.children) return;
    n.children = n.children.filter((c) => !c.__strip);
    n.children.forEach(prune);
  })(tree);
}

/** Expressive Code renders one <div class="ec-line"> per line; turn it into a plain <pre><code class="language-x">. */
function cleanCode(tree) {
  for (const fig of selectAll('.expressive-code', tree)) {
    const pre = select('pre', fig);
    if (!pre) continue;
    const lines = selectAll('.ec-line', pre).map((l) => toString(l).replace(/\n$/, ''));
    const text = lines.length ? lines.join('\n') : toString(pre);
    const lang = pre.properties?.dataLanguage;
    fig.tagName = 'pre';
    fig.properties = {};
    fig.children = [{ type: 'element', tagName: 'code', properties: lang && lang !== 'plaintext' ? { className: [`language-${lang}`] } : {}, children: [{ type: 'text', value: text }] }];
  }
}

const BLOCK = new Set(['address', 'article', 'aside', 'blockquote', 'br', 'dd', 'details', 'div', 'dl', 'dt', 'figcaption', 'figure', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'li', 'main', 'nav', 'ol', 'p', 'pre', 'section', 'summary', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul']);
/** Inline elements that touch ("<code>a</code><span>b</span>") would run together in Markdown; add a space. */
function spaceInline(node) {
  if (!node.children) return;
  const out = [];
  node.children.forEach((c, i) => {
    const prev = node.children[i - 1];
    if (prev?.type === 'element' && c.type === 'element' && !BLOCK.has(prev.tagName) && !BLOCK.has(c.tagName) && node.tagName !== 'pre' && node.tagName !== 'code') out.push({ type: 'text', value: ' ' });
    out.push(c);
  });
  node.children = out;
  node.children.forEach(spaceInline);
}

/** Absolute links, so the Markdown works outside the site. */
function absolutise(tree) {
  for (const a of selectAll('a[href]', tree)) {
    const href = String(a.properties.href);
    if (href.startsWith('/')) a.properties.href = site + href;
    else if (href.startsWith('#')) a.properties.href = href; // keep in-page anchors
  }
}

function pageToMarkdown(html, { small }) {
  const tree = parse.parse(html);
  const main = select('main', tree);
  const content = main && select('.sl-markdown-content', main);
  if (!content) return null;
  const root = { type: 'root', children: [structuredClone(content)] };
  strip(root, 'script, style, link, svg, template, [aria-hidden="true"], .sr-only, .sl-anchor-link, .atomus-demo, .ws-frame, astro-island, starlight-tabs [role="tablist"], .expressive-code .copy');
  if (small) strip(root, '.starlight-aside--note, .starlight-aside--tip, details');
  cleanCode(root);
  spaceInline(root);
  absolutise(root);
  let md = String(toMarkdown.stringify(toMarkdown.runSync(root)));
  // Adjacent inline code spans ("`a``b`") read as one; separate them outside code fences.
  md = md
    .split(/(^```[\s\S]*?^```)/m)
    .map((part, i) => (i % 2 ? part : part.replace(/([^`\n])``(?=[^`\s])/g, '$1` `')))
    .join('');
  md = md.replace(/\n{3,}/g, '\n\n').trim();
  return md;
}

const meta = (html, name) => html.match(new RegExp(`<meta (?:name|property)="${name}" content="([^"]*)"`))?.[1]?.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&') ?? '';

const pages = [];
for (const file of walk(dist)) {
  const html = readFileSync(file, 'utf8');
  if (/<meta http-equiv="refresh"/.test(html)) continue; // redirects
  const path = '/' + dirname(file.slice(dist.length)).replace(/^\.$/, '').replace(/\\/g, '/');
  const url = path.endsWith('/') ? path : path + '/';
  if (url.startsWith('/404')) continue;
  const title = (html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '').replace(/ \| Atomus$/, '').replace(/&amp;/g, '&').replace(/&#39;/g, "'").trim();
  const description = meta(html, 'description');
  const full = pageToMarkdown(html, { small: false });
  if (full === null) continue;
  pages.push({ url, title, description, full, small: pageToMarkdown(html, { small: true }) });
}

// Pages without their own description inherit the site description; don't repeat it on every page.
const descCount = {};
pages.forEach((p) => (descCount[p.description] = (descCount[p.description] ?? 0) + 1));
pages.forEach((p) => { if (descCount[p.description] > 2) p.description = ''; });

// Order and groups: the sidebar as people see it (the splash home page has none, so read a regular page).
const sidebarTree = parse.parse(readFileSync(join(dist, 'getting-started/index.html'), 'utf8'));
const groups = selectAll('ul.top-level > li > details', sidebarTree).map((d) => ({
  label: toString(select('summary .large', d)).trim(),
  urls: selectAll('a[href]', d).map((a) => String(a.properties.href)),
}));
const order = groups.flatMap((g) => g.urls);
const rank = (u) => (order.indexOf(u) === -1 ? -1 : order.indexOf(u));
pages.sort((a, b) => rank(a.url) - rank(b.url) || a.url.localeCompare(b.url));

// ---------------------------------------------------------------- write

const write = (rel, text) => {
  const p = join(dist, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, text.trim() + '\n');
};
const twin = (p) => `${site}${p.url}index.md`;
const pageDoc = (p, body) => [`# ${p.title}`, p.description ? `> ${p.description}` : '', `URL: ${site}${p.url}`, body].filter(Boolean).join('\n\n');

for (const p of pages) {
  write(`${p.url}index.md`, [pageDoc(p, p.full), `---\nAll Atomus docs for agents: ${site}/llms.txt`].join('\n\n'));
}

const bundle = (list, kind, intro) =>
  [`<SYSTEM>${intro}</SYSTEM>`, ...list.map((p) => pageDoc(p, kind === 'small' ? p.small : p.full))].join('\n\n---\n\n');
write('llms-full.txt', bundle(pages, 'full', `This is the full documentation for ${PROJECT}. ${SUMMARY}`));
write('llms-small.txt', bundle(pages, 'small', `This is the abridged documentation for ${PROJECT} (notes, tips and collapsed details removed). ${SUMMARY}`));
for (const set of SETS) {
  write(`_llms-txt/${set.slug}.txt`, bundle(pages.filter((p) => set.match(p.url)), 'full', `This is the ${set.label} part of the ${PROJECT} documentation: ${set.description}.`));
}

const placed = new Set();
const line = (p) => {
  placed.add(p.url);
  return `- [${p.title}](${twin(p)})${p.description ? `: ${p.description}` : ''}`;
};
const byUrl = new Map(pages.map((p) => [p.url, p]));
const sections = groups
  .map((g) => {
    const items = g.urls.map((u) => byUrl.get(u)).filter((p) => p && !placed.has(p.url));
    return items.length ? `## ${g.label}\n\n${items.map(line).join('\n')}` : '';
  })
  .filter(Boolean);
const rest = pages.filter((p) => !placed.has(p.url));
if (rest.some((p) => p.url !== '/')) console.warn(`llms: pages not in the sidebar: ${rest.map((p) => p.url).join(', ')}`);
const index = [
  `# ${PROJECT}`,
  `> ${SUMMARY}`,
  DETAILS,
  '## Documentation sets',
  [
    `- [Full documentation](${site}/llms-full.txt): every page in one file`,
    `- [Abridged documentation](${site}/llms-small.txt): every page without notes, tips and collapsed details`,
    ...SETS.map((s) => `- [${s.label}](${site}/_llms-txt/${s.slug}.txt): ${s.description}`),
  ].join('\n'),
  rest.length ? `## Start here\n\n${rest.map(line).join('\n')}` : '',
  ...sections,
  '## Optional',
  [
    '- [Guidelines (Markdown source)](https://github.com/StanVisionAgency/atomus/tree/main/guidelines): the plain-Markdown guidelines these docs are built from',
    '- [Atomus agent skill](https://github.com/StanVisionAgency/atomus/tree/main/skills/atomus): install with `npx skills add StanVisionAgency/atomus`',
  ].join('\n'),
]
  .filter(Boolean)
  .join('\n\n');
write('llms.txt', index);

console.log(`llms: wrote llms.txt, llms-full.txt, llms-small.txt, ${SETS.length} sets and ${pages.length} Markdown twins`);
