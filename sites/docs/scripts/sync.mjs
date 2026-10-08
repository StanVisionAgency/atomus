// Copies the single sources (repo root) into the docs site before every build:
// tokens CSS, component CSS and the Markdown guidelines. Edit the sources, not the copies.
//
// guidelines/*.md stay plain Markdown (they are also read by AI tools). This script turns them into
// .mdx pages and swaps their token tables for visual preview components (swatches, type specimens,
// spacing bars …). The components still print every token name and value as text.
import { cpSync, mkdirSync, readdirSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { COMPONENT_PAGES, CATEGORIES, figmaReferenceRedirects } from './component-pages.mjs';

const root = new URL('../../../', import.meta.url).pathname;
const site = new URL('../', import.meta.url).pathname;
const docs = join(site, 'src/content/docs/');
const styles = join(site, 'src/styles/');

cpSync(join(root, 'css/atomus.css'), join(styles, 'atomus.css'));
cpSync(join(root, 'react/src/styles.css'), join(styles, 'components.css'));

// ---------- Markdown helpers ----------

const banner = (src) => `{/* Generated from ${src} by scripts/sync.mjs — edit the source file. */}`;
const q = (s) => `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

function frontmatter({ title, description, order, src, extra = [] }) {
  const fm = [`title: ${q(title)}`];
  if (src) fm.push(`editUrl: ${q(`https://github.com/StanVisionAgency/atomus/edit/main/${src}`)}`);
  if (description) fm.push(`description: ${q(description)}`);
  if (order !== undefined) fm.push(`sidebar:\n  order: ${order}`);
  return `---\n${[...fm, ...extra].join('\n')}\n---\n`;
}

/** Splits "# Title\n…" into { title, body }. */
function splitTitle(md) {
  const m = md.match(/^#\s+(.+)\n/);
  return m ? { title: m[1].trim(), body: md.slice(m[0].length) } : { title: 'Untitled', body: md };
}

/** Escapes characters MDX would read as JSX/expressions, outside code spans and fences. */
function mdxSafe(md) {
  return md
    .split(/(```[\s\S]*?```)/g)
    .map((chunk, i) =>
      i % 2
        ? chunk
        : chunk
            .split(/(`[^`\n]*`)/g)
            .map((part, j) => (j % 2 ? part : part.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\{/g, '&#123;').replace(/\}/g, '&#125;')))
            .join(''),
    )
    .join('');
}

const cells = (line) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
const unticks = (s) => s.replace(/`/g, '').trim();

/** Replaces every Markdown table: fn(headers, rows) returns a replacement string, or null to keep the table. */
function mapTables(md, fn) {
  const lines = md.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('|') && lines[i + 1]?.match(/^\|[\s:|-]+\|$/)) {
      const start = i;
      const headers = cells(lines[i]);
      const rows = [];
      i += 2;
      while (i < lines.length && lines[i].startsWith('|')) rows.push(cells(lines[i++]));
      i--;
      const rep = fn(headers, rows);
      out.push(rep ?? lines.slice(start, i + 1).join('\n'));
    } else out.push(lines[i]);
  }
  return out.join('\n');
}

/** Inserts a snippet at the end of the "## <heading>" section (before the next H2, or at EOF). */
function appendToSection(md, headingStartsWith, snippet) {
  const lines = md.split('\n');
  const s = lines.findIndex((l) => l.startsWith('## ' + headingStartsWith));
  if (s < 0) throw new Error(`sync: section "## ${headingStartsWith}" not found`);
  let e = lines.findIndex((l, i) => i > s && l.startsWith('## '));
  if (e < 0) e = lines.length;
  lines.splice(e, 0, '', snippet, '');
  return lines.join('\n');
}

const props = (v) => `{${JSON.stringify(v)}}`;
const DO_RE = /\*\*Do\*\*\n\n((?:- .*(?:\n|$))+)/;
const DONT_RE = /\*\*(Don[’']t|Forbidden)\*\*\n\n((?:- .*(?:\n|$))+)/;
/** Drops HTML comments (generator markers) — MDX would print them as text. */
const stripComments = (md) => md.replace(/<!--[\s\S]*?-->\n?/g, '');

// ---------- Foundations: Markdown tables → visual previews ----------

const FOUNDATIONS = {
  color: {
    imports: ['ColorTable', 'Ramps'],
    transform(md) {
      md = mapTables(md, (h, rows) => {
        if (h.join('|') !== 'Token|Light|Dark') return null;
        return `<ColorTable rows=${props(rows.map(([t, light, dark]) => {
          const m = t.match(/`([^`]+)`\s*(?:\(([^)]+)\))?/);
          return { token: m ? m[1] : unticks(t), figma: m?.[2], light, dark };
        }))} />`;
      });
      return appendToSection(md, 'Primitives', '<Ramps />');
    },
  },
  typography: {
    imports: ['TypeScale', 'FontFamilies'],
    transform(md) {
      md = mapTables(md, (h, rows) => {
        if (h[0] !== 'Text style') return null;
        return `## Type scale\n\nEvery style below is rendered with its CSS class, so sizes switch at the tablet and mobile breakpoints like they do in product.\n\n<TypeScale rows=${props(rows.map(([style, cls, desktop, tablet, mobile, weight, use]) => ({ style, cls: unticks(cls), desktop, tablet, mobile, weight, use: use || undefined })))} />`;
      });
      // Font specimens go right after the intro paragraph.
      const firstBreak = md.indexOf('\n\n', md.indexOf('Families'));
      return md.slice(0, firstBreak) + '\n\n## Font families\n\n<FontFamilies />' + md.slice(firstBreak);
    },
  },
  'spacing-layout': {
    imports: ['SpacingScale'],
    transform: (md) =>
      mapTables(md, (h, rows) =>
        h[0] === 'Token' && h[4] === 'Use'
          ? `<SpacingScale rows=${props(rows.map(([t, desktop, tablet, mobile, use]) => ({ token: unticks(t), desktop, tablet, mobile, use })))} />`
          : null,
      ),
  },
  'radius-effects': {
    imports: ['RadiusScale', 'ShadowScale', 'EffectSamples'],
    transform(md) {
      md = mapTables(md, (h, rows) =>
        h.join('|') === 'Token|Default|Sharp|Round'
          ? `<RadiusScale rows=${props(rows.map(([t, d, s, r]) => ({ token: unticks(t), default: d, sharp: s, round: r })))} />`
          : null,
      );
      md = appendToSection(md, 'Shadows', '<ShadowScale />');
      md = appendToSection(md, 'Focus', '<EffectSamples kind="focus" />');
      return appendToSection(md, 'Blur', '<EffectSamples kind="blur" />');
    },
  },
  icons: {
    imports: ['IconSizes'],
    extraImports: ["import { IconGrid } from '../../../components/foundations/IconGrid';"],
    transform: (md) =>
      md.trim() +
      '\n\n## Sizes\n\n<IconSizes />\n\n## Glyphs in the React package\n\nThe React components ship a small set of internal glyphs (`<Icon name="…" />`) for checks, close buttons, status and navigation. Product icons come from the 88 `icon/*` components in Figma or Font Awesome.\n\n<IconGrid />\n',
  },
};

const foundationOrder = ['color', 'typography', 'spacing-layout', 'radius-effects', 'icons', 'theming'];
rmSync(join(docs, 'foundations'), { recursive: true, force: true });
mkdirSync(join(docs, 'foundations'), { recursive: true });
for (const f of readdirSync(join(root, 'guidelines/foundations'))) {
  const name = f.replace(/\.md$/, '');
  const src = `guidelines/foundations/${f}`;
  const { title, body } = splitTitle(readFileSync(join(root, src), 'utf8'));
  const spec = FOUNDATIONS[name];
  let md = mdxSafe(body.trim());
  const imports = [];
  if (spec) {
    md = spec.transform(md);
    for (const c of spec.imports) imports.push(`import ${c} from '../../../components/foundations/${c}.astro';`);
    imports.push(...(spec.extraImports ?? []));
  }
  writeFileSync(
    join(docs, 'foundations', `${name}.mdx`),
    `${frontmatter({ title, src, order: foundationOrder.indexOf(name) + 1 })}\n${imports.join('\n')}\n\n${banner(src)}\n\n${md.trim()}\n`,
  );
}

// ---------- Components: one page per component (demo → In Figma → Usage) ----------
// See scripts/component-pages.mjs for the map from guideline sections to pages.
syncComponents();

// ---------- Website sections ----------
// The section table becomes one heading + live preview per section (src/components/sections/).
{
  const src = 'guidelines/website-sections.md';
  const { title, body } = splitTitle(readFileSync(join(root, src), 'utf8'));
  let md = mapTables(mdxSafe(body.trim()), (h, rows) => {
    if (h[0] !== 'Section') return null;
    return [
      `${rows.length} sections, each previewed live with Atomus CSS and React components. Switch a preview between Desktop (1280), Tablet (768) and Mobile (375) — layout, type and spacing follow the same breakpoints as the Figma variants.`,
      ...rows.map(([name, variants, description]) =>
        `## ${name}\n\n${description}\n\n<SectionExample name=${q(name)} variants=${q(variants.replace(/&lt;/g, '<').replace(/&gt;/g, '>'))} />`),
    ].join('\n\n');
  });
  rmSync(join(docs, 'website-sections.md'), { force: true });
  writeFileSync(
    join(docs, 'website-sections.mdx'),
    `${frontmatter({ title, src, description: 'Responsive marketing sections and example pages in the Atomus Figma file, with live previews.' })}\nimport SectionExample from '../../components/SectionExample.astro';\n\n${banner(src)}\n\n${md}\n`,
  );

  // Breakpoint tokens for the preview canvas: the @media blocks of atomus.css as container queries.
  const css = readFileSync(join(root, 'css/atomus.css'), 'utf8');
  const decls = (text) => Object.fromEntries([...text.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
  const rootBlock = decls(css.slice(css.indexOf(':root {'), css.indexOf('\n}', css.indexOf(':root {'))));
  const media = [...css.matchAll(/@media \(max-width: (\d+)px\) \{\s*:root \{([\s\S]*?)\}\s*\}/g)].map((m) => ({ max: m[1], vars: decls(m[2]) }));
  const keys = [...new Set(media.flatMap((m) => Object.keys(m.vars)))];
  const block = (vars) => Object.entries(vars).map(([k, v]) => `    ${k}: ${v};`).join('\n');
  writeFileSync(
    join(styles, 'sections-responsive.css'),
    `/* Generated from css/atomus.css by scripts/sync.mjs — the breakpoint tokens as container queries for the website-section previews. */\n.ws-root {\n${block(Object.fromEntries(keys.filter((k) => rootBlock[k]).map((k) => [k, rootBlock[k]])))}\n}\n${media
      .map((m) => `@container ws (max-width: ${m.max}px) {\n  .ws-root {\n${block(m.vars)}\n  }\n}`)
      .join('\n')}\n`.replace(/^    /gm, (x, off, str) => x),
  );
}

// ---------- Agent-facing guidelines as docs pages ----------
// Guidelines.md, figma-mcp-rules.md and overview-components.md are written for agents first; the docs show
// them as pages too, so people and agents read the same rules. File references become links.
{
  const pageForFile = Object.fromEntries(
    Object.entries(figmaReferenceRedirects())
      .filter(([from]) => from.startsWith('/figma-reference/'))
      .map(([from, to]) => [from.replace('/figma-reference/', ''), to]),
  );
  const gh = (path) => `https://github.com/StanVisionAgency/atomus/blob/main/${path}`;
  const DOC_LINKS = {
    'Guidelines.md': '/ai/rules/',
    'overview-components.md': '/components/choosing/',
    'figma-mcp-rules.md': '/ai/figma-mcp-rules/',
    'website-sections.md': '/website-sections/',
    'foundations/color.md': '/foundations/color/',
    'foundations/typography.md': '/foundations/typography/',
    'foundations/spacing-layout.md': '/foundations/spacing-layout/',
    'foundations/radius-effects.md': '/foundations/radius-effects/',
    'foundations/icons.md': '/foundations/icons/',
    'foundations/theming.md': '/foundations/theming/',
  };
  /** `components/button.md` → [`components/button.md`](/components/button/); other guideline files → GitHub. */
  const linkFiles = (md) =>
    md.replace(/`((?:components|foundations)\/[\w-]+\.md|[\w-]+\.md|AGENTS\.md)`/g, (m, file) => {
      const comp = file.match(/^components\/([\w-]+)\.md$/);
      const href = comp ? pageForFile[comp[1]] : DOC_LINKS[file] ?? (existsSync(join(root, 'guidelines', file)) ? gh(`guidelines/${file}`) : file === 'AGENTS.md' ? gh('AGENTS.md') : null);
      return href ? `[\`${file}\`](${href})` : m;
    });
  const pages = [
    { src: 'guidelines/Guidelines.md', out: 'ai/rules.mdx', title: 'Rules for agents', description: 'The entry point agents read: what Atomus is, the reading order, the core rules and the forbidden list.', intro: 'This page is [`guidelines/Guidelines.md`](https://github.com/StanVisionAgency/atomus/blob/main/guidelines/Guidelines.md), the entry point for AI agents and Figma Make. The Atomus skill, `AGENTS.md` and the Cursor and Copilot rules all use these rules.' },
    { src: 'guidelines/figma-mcp-rules.md', out: 'ai/figma-mcp-rules.mdx', title: 'Figma MCP rules', description: 'Rules for agents that read Atomus designs through the Figma MCP server and turn them into code.', intro: 'Generated from [`guidelines/figma-mcp-rules.md`](https://github.com/StanVisionAgency/atomus/blob/main/guidelines/figma-mcp-rules.md). Add the file to your agent\'s rules, or install the [Atomus skill](/ai/coding-agents/), which includes it.' },
    { src: 'guidelines/overview-components.md', out: 'components/choosing.mdx', title: 'Choosing a component', description: 'Every Atomus component with its purpose and React export, other names, and decision trees.', order: 0.5, intro: 'Generated from [`guidelines/overview-components.md`](https://github.com/StanVisionAgency/atomus/blob/main/guidelines/overview-components.md). Agents read the same file before they pick a component.' },
  ];
  for (const p of pages) {
    const { body } = splitTitle(stripComments(readFileSync(join(root, p.src), 'utf8')));
    mkdirSync(join(docs, dirname(p.out)), { recursive: true });
    writeFileSync(
      join(docs, p.out),
      `${frontmatter({ title: p.title, description: p.description, src: p.src, order: p.order })}\n${banner(p.src)}\n\n${p.intro}\n\n${linkFiles(mdxSafe(body.trim()))}\n`,
    );
  }
}

console.log('synced tokens, component CSS and guidelines from', root);

function syncComponents() {
  const outDir = join(docs, 'components');
  const srcDir = join(site, 'src/component-pages');
  rmSync(outDir, { recursive: true, force: true });
  rmSync(join(docs, 'figma-reference'), { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  // Figma links from the Code Connect template files (react/src/components/*.figma.ts). Each starts with
  // `// url=<Figma node URL>` and `// component=<React component>` header comments; when several files map the
  // same component (Button + ButtonIcon), the first file in name order wins.
  const figmaUrls = {};
  const ccDir = join(root, 'react/src/components');
  const ccFiles = readdirSync(ccDir).filter((f) => f.endsWith('.figma.ts')).sort();
  if (!ccFiles.length) throw new Error('sync: no Code Connect files (react/src/components/*.figma.ts) found');
  for (const f of ccFiles) {
    const head = readFileSync(join(ccDir, f), 'utf8').split('\n').slice(0, 10).join('\n');
    const url = head.match(/^\/\/ url=(\S+)/m)?.[1];
    const component = head.match(/^\/\/ component=(\w+)/m)?.[1];
    if (!url || !component) throw new Error(`sync: react/src/components/${f} has no "// url=" or "// component=" header`);
    figmaUrls[component] ??= url;
  }
  for (const page of COMPONENT_PAGES) {
    for (const n of page.figma ?? []) if (!figmaUrls[n]) throw new Error(`sync: page ${page.slug} lists Figma component ${n}, but no react/src/components/*.figma.ts maps it`);
  }

  // Guideline files → sections.
  const guidelines = {};
  for (const f of readdirSync(join(root, 'guidelines/components'))) {
    const name = f.replace(/\.md$/, '');
    const { title, body } = splitTitle(stripComments(readFileSync(join(root, 'guidelines/components', f), 'utf8')));
    const sections = new Map();
    for (const chunk of body.split(/^## /m).slice(1)) {
      const nl = chunk.indexOf('\n');
      sections.set(chunk.slice(0, nl).trim(), chunk.slice(nl + 1).trim());
    }
    // "## React API" (generated by scripts/gen-react-api.mjs) is not a Figma section: split it into one
    // entry per export ("### `Button`") so each page shows the exports it covers.
    const api = { intro: '', exports: new Map(), used: new Set() };
    const apiMd = sections.get('React API');
    sections.delete('React API');
    if (apiMd) {
      const [intro, ...subs] = apiMd.split(/^### /m);
      api.intro = intro.trim();
      for (const sub of subs) {
        const nl = sub.indexOf('\n');
        const name = sub.slice(0, nl).replace(/`/g, '').trim();
        api.exports.set(name, sub.slice(nl + 1).replace(/\n\*\*Not in React yet:\*\*[^\n]*\n?/, '\n').trim());
      }
    }
    guidelines[name] = { title, sections, used: new Set(), api };
  }

  const pages = [];
  COMPONENT_PAGES.forEach((page, index) => {
    const parts = page.sections.map(([file, name]) => {
      const g = guidelines[file];
      if (!g) throw new Error(`sync: guidelines/components/${file}.md not found (page ${page.slug})`);
      if (!g.sections.has(name)) throw new Error(`sync: "## ${name}" not found in guidelines/components/${file}.md (page ${page.slug})`);
      g.used.add(name);
      const { content, guidance } = extractGuidance(mdxSafe(g.sections.get(name)));
      return { file, name, content, guidance };
    });
    // Figma-only pages use the first section's description as the page intro; don't repeat it below.
    const intro = page.react ? '' : page.intro ?? firstParagraph(parts[0].content);
    if (intro && !page.intro) parts[0].content = parts[0].content.replace(intro, '').trim();
    const sourceFiles = [...new Set(page.sections.map(([f]) => `guidelines/components/${f}.md`))];

    // "In Figma": properties, variants and anatomy of every mapped Figma component.
    const links = (page.figma ?? []).filter((n) => figmaUrls[n]).map((n) => `[${n}](${figmaUrls[n]})`);
    const figma = [
      '## In Figma',
      '',
      `<p class="cmp-source">From ${sourceFiles.map((f) => `<code>${f}</code>`).join(', ')}${links.length ? ` · Open in Figma: ${links.join(' · ')}` : ''}</p>`,
      '',
      page.react ? 'Properties, variants and anatomy of the Figma components. React props use the same names.' : 'Properties, variants and anatomy of the Figma components.',
      '',
      ...parts.map((p) => `### ${p.name}\n\n${p.content}\n`),
    ].join('\n');

    // Design Do / Don't from the guidelines, at the end of Usage.
    const withGuidance = parts.filter((p) => p.guidance);
    const guidance = withGuidance.length
      ? withGuidance.map((p) => (withGuidance.length > 1 || !page.react ? `#### ${p.name}\n\n${p.guidance}` : p.guidance)).join('\n\n')
      : '';

    // "React API": generated tables for the exports this page covers.
    const apiParts = [];
    for (const file of new Set(page.sections.map(([f]) => f))) {
      const { api } = guidelines[file];
      for (const name of page.api ?? page.figma ?? []) {
        if (!api.exports.has(name)) continue;
        api.used.add(name);
        apiParts.push(`### \`${name}\`\n\n${mdxSafe(api.exports.get(name))}`);
      }
    }
    if (page.react && !apiParts.length) throw new Error(`sync: page ${page.slug} has no React API section — run node scripts/gen-react-api.mjs`);
    const apiSection = apiParts.length
      ? `## React API\n\n<p class="cmp-source">Generated from <code>react/src/components</code> by <code>scripts/gen-react-api.mjs</code> — the same tables agents read in <code>${sourceFiles.join('</code>, <code>')}</code>.</p>\n\nUse only these props; anything else is not part of the API.\n\n<div class="react-api">\n\n${apiParts.join('\n\n')}\n\n</div>\n`
      : '';

    let title, description, mdx;
    if (page.react) {
      const src = readFileSync(join(srcDir, `${page.slug}.mdx`), 'utf8');
      const fm = src.match(/^---\n([\s\S]*?)\n---\n/);
      title = fm[1].match(/^title:\s*"(.*)"$/m)?.[1] ?? page.slug;
      description = fm[1].match(/^description:\s*"(.*)"$/m)?.[1] ?? '';
      let body = src.slice(fm[0].length).replace(/^\{\/\* Source for[^\n]*\*\/\}\n/m, '');
      if (!body.includes('{/* @figma')) throw new Error(`sync: ${page.slug}.mdx has no {/* @figma */} marker`);
      body = body.replace(/\{\/\* @figma[^\n]*\*\/\}/, figma);
      // Drop hand-written Do/Don't items that repeat the design guidance word for word.
      const norm = (t) => t.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9' ]/g, '').trim();
      const seen = new Set([...guidance.matchAll(/^- (.*)$/gm)].map((m) => norm(m[1])));
      body = body.replace(/^- (.*)\n/gm, (line, item) => (seen.has(norm(item)) ? '' : line));
      body = body.replace(/\*\*(Do|Don[’']t)\*\*\n\n(?!- )/g, '');
      body = body.replace(/\{\/\* @guidance[^\n]*\*\/\}/, guidance ? `### Design guidance\n\nFrom the Figma guidelines.\n\n${guidance}` : '');
      mdx = `${frontmatter({ title, description, order: index + 1, src: `sites/docs/src/component-pages/${page.slug}.mdx` })}\n${banner(`sites/docs/src/component-pages/${page.slug}.mdx + ${sourceFiles.join(', ')}`)}\n${styleDoDont(body.trim())}\n\n${apiSection}`;
    } else {
      title = page.title;
      description = intro;
      mdx = [
        frontmatter({ title, description, order: index + 1, src: sourceFiles[0], extra: ['sidebar_badge_placeholder'] }).replace('sidebar_badge_placeholder\n', '').replace(`  order: ${index + 1}`, `  order: ${index + 1}\n  badge:\n    text: Figma\n    variant: note`),
        banner(sourceFiles.join(', ')),
        '',
        description,
        '',
        ':::note[Figma only — no React component yet]',
        `Use the Figma components below. In code, build it from Atomus [tokens](/code/tokens/) and [CSS](/code/css/) until a React component ships.`,
        ':::',
        '',
        figma,
        '## Usage',
        '',
        guidance || 'Follow the descriptions above; there are no extra rules for this component yet.',
        '',
      ].join('\n');
      mdx = styleDoDont(mdx);
    }
    writeFileSync(join(outDir, `${page.slug}.mdx`), mdx);
    pages.push({ ...page, title, description });
  });

  // Every guideline section and every React API entry must appear on some page.
  for (const [file, g] of Object.entries(guidelines)) {
    for (const name of g.sections.keys()) if (!g.used.has(name)) throw new Error(`sync: "## ${name}" in guidelines/components/${file}.md is not on any page — add it to scripts/component-pages.mjs`);
    for (const name of g.api.exports.keys()) if (!g.api.used.has(name)) throw new Error(`sync: React API "${name}" in guidelines/components/${file}.md is not on any page — add it to a page's figma/api list in scripts/component-pages.mjs`);
  }

  // Components overview.
  const overview = CATEGORIES.map((cat) => {
    const items = pages.filter((p) => p.category === cat);
    return `## ${cat}\n\n<div class="cmp-grid not-content">\n${items
      .map((p) => `<a class="cmp-card" href="/components/${p.slug}/"><span class="cmp-card__title">${esc(p.title)}</span><span class="cmp-card__desc">${esc(p.description)}</span><span class="cmp-card__tag${p.react ? ' cmp-card__tag--react' : ''}">${p.react ? 'React + Figma' : 'Figma only'}</span></a>`)
      .join('\n')}\n</div>`;
  }).join('\n\n');
  writeFileSync(
    join(outDir, 'index.mdx'),
    `${frontmatter({ title: 'Components', description: 'Every Atomus component: live React demos, the Figma properties and variants, and usage guidance on one page.', order: 0 })}\n${banner('scripts/component-pages.mjs')}\n\nEach page shows the component live, then its Figma properties and variants, then how to use it in code, with the full React API at the end. ${pages.filter((p) => p.react).length} components ship in React; the rest are Figma-only for now. Not sure which one you need? See [Choosing a component](/components/choosing/).\n\n${overview}\n`,
  );
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
}

function firstParagraph(md) {
  return (md.split(/\n\n/).find((p) => p.trim() && !p.startsWith('|') && !p.startsWith('Variants')) ?? '').replace(/\n/g, ' ').trim();
}

/** Pulls the **Do** / **Don’t** lists out of a guideline section. */
function extractGuidance(md) {
  const d = md.match(DO_RE);
  const n = md.match(DONT_RE);
  let content = md;
  if (d) content = content.replace(d[0], '');
  if (n) content = content.replace(n[0], '');
  const label = n?.[1] === 'Forbidden' ? 'Forbidden' : 'Don’t';
  const guidance = d || n ? `${d ? `**Do**\n\n${d[1].trim()}\n\n` : ''}${n ? `**${label}**\n\n${n[2].trim()}\n` : ''}` : '';
  return { content: content.replace(/\n{3,}/g, '\n\n').trim(), guidance: guidance.trim() };
}

/** Wraps **Do** / **Don’t** lists in a two-column Do/Don't grid (Markdown stays inside, so the text is plain HTML). */
function styleDoDont(md) {
  const card = (kind, label, list) => `<div class="dd dd--${kind}">\n\n**${label}**\n\n${list.trim()}\n\n</div>`;
  return md.replace(
    /\*\*Do\*\*\n\n((?:- .*(?:\n|$))+)\s*(?:\*\*(Don[’']t|Forbidden)\*\*\n\n((?:- .*(?:\n|$))+))?|\*\*(Don[’']t|Forbidden)\*\*\n\n((?:- .*(?:\n|$))+)/g,
    (_, doList, dontLabel, dontList, onlyLabel, onlyDont) =>
      `<div class="dd-grid not-content">\n${doList ? card('do', 'Do', doList) : ''}${dontList || onlyDont ? `\n${card('dont', (dontLabel || onlyLabel) === 'Forbidden' ? 'Forbidden' : 'Don’t', dontList || onlyDont)}` : ''}\n</div>\n\n`,
  );
}
