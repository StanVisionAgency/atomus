// Closed world: the server only ever hands out URLs on https://docs.atomus.io. Links to other hosts in the
// bundled sources (GitHub, Figma, Gumroad, font CDNs …) are rewritten to the matching docs page or dropped.
export const DOCS = 'https://docs.atomus.io';
const isDocs = (url: string) => /^https:\/\/docs\.atomus\.io(\/|$)/.test(url);

const MAP: Array<[RegExp, string]> = [
  [/^https:\/\/github\.com\/StanVisionAgency\/atomus\/(blob|tree)\/main\/templates\/consumer/, `${DOCS}/ai/coding-agents/`],
  [/^https:\/\/github\.com\/StanVisionAgency\/atomus\/(blob|tree)\/main\/guidelines\/figma-mcp-rules\.md/, `${DOCS}/ai/figma-mcp-rules/`],
  [/^https:\/\/github\.com\/StanVisionAgency\/atomus\/(blob|tree)\/main\/guidelines\/Guidelines\.md/, `${DOCS}/ai/rules/`],
  [/^https:\/\/github\.com\/StanVisionAgency\/atomus\/(blob|tree)\/main\/guidelines/, `${DOCS}/ai/rules/`],
  [/^https:\/\/github\.com\/StanVisionAgency\/atomus\/(blob|tree)\/main\/skills/, `${DOCS}/ai/coding-agents/`],
  [/^https:\/\/github\.com\/StanVisionAgency\/atomus/, `${DOCS}/getting-started/`],
  [/^https:\/\/(www\.)?figma\.com\//, `${DOCS}/figma/`],
  [/^https:\/\/stanvision\.gumroad\.com\//, `${DOCS}/figma/`],
];

function rewrite(url: string): string | null {
  const clean = url.replace(/[).,;:!?'"`>]+$/, '');
  if (isDocs(clean)) return clean;
  for (const [re, to] of MAP) if (re.test(clean)) return to;
  return null;
}

/** Rewrites every non-docs URL in a text: Markdown links keep their label, bare URLs are mapped or removed. */
export function closedWorld(text: string): string {
  let out = text.replace(/\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g, (m, label: string, url: string) => {
    const to = rewrite(url);
    return to ? `[${label}](${to})` : label;
  });
  const GONE = '\u0000';
  out = out.replace(/<(https?:\/\/[^>\s]+)>/g, (m, url: string) => rewrite(url) ?? GONE);
  out = out.replace(/https?:\/\/[^\s)\]"'`<>]+/g, (url) => {
    const trail = url.match(/[).,;:!?]+$/)?.[0] ?? '';
    const core = trail ? url.slice(0, -trail.length) : url;
    const to = rewrite(core);
    return to ? to + trail : GONE + trail;
  });
  // Tidy only where a URL was removed (code indentation elsewhere stays untouched).
  return out
    .replace(/\s*\(\s*\u0000\s*\)/g, '')
    .replace(/(from|at|see|:)\s*\u0000/gi, (m, w: string) => (w === ':' ? ':' : w))
    .replace(/ ?\u0000/g, '');
}

/** All URLs in a text (for tests). */
export const urlsIn = (text: string) => [...text.matchAll(/https?:\/\/[^\s)\]"'`<>]+/g)].map((m) => m[0].replace(/[).,;:!?]+$/, ''));
