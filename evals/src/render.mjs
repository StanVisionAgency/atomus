// Renders a generated TSX file the way a product would: React SSR to HTML, then hydration in Chromium,
// with the Atomus CSS (css/atomus.css + react/src/styles.css) and the output's own CSS on the page.
// @stanvision/atomus-react resolves to react/src, so the evals always test the current source.
import { mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { EVALS, PACKAGE, ROOT } from './context.mjs';

const req = createRequire(join(EVALS, 'package.json'));
const pkgDir = (name) => dirname(req.resolve(`${name}/package.json`));

const stubCss = {
  name: 'atomus-evals-stubs',
  setup(b) {
    // CSS imports and the tokens package: the page already carries the Atomus CSS.
    b.onResolve({ filter: /\.css$|^@stanvision\/atomus-tokens(\/|$)/ }, (a) => ({ path: a.path, namespace: 'stub' }));
    b.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({ contents: '', loader: 'js' }));
  },
};

function bundle(file, kind) {
  const entry = kind === 'server'
    ? `import * as mod from ${JSON.stringify(file)};
       import { createElement } from 'react';
       import { renderToString } from 'react-dom/server.browser';
       const C = mod.default ?? Object.values(mod).find((v) => typeof v === 'function');
       if (!C) throw new Error('The output exports no component (default export expected).');
       export const html = renderToString(createElement(C));`
    : `import * as mod from ${JSON.stringify(file)};
       import { createElement } from 'react';
       import { hydrateRoot, createRoot } from 'react-dom/client';
       const C = mod.default ?? Object.values(mod).find((v) => typeof v === 'function');
       const root = document.getElementById('root');
       window.__atomusErrors = [];
       if (root.hasChildNodes()) hydrateRoot(root, createElement(C), { onRecoverableError: (e) => window.__atomusErrors.push(String(e)) });
       else createRoot(root).render(createElement(C));`;
  return build({
    stdin: { contents: entry, resolveDir: EVALS, loader: 'tsx', sourcefile: `${kind}-entry.tsx` },
    bundle: true,
    write: false,
    platform: kind === 'server' ? 'node' : 'browser',
    format: kind === 'server' ? 'esm' : 'iife',
    jsx: 'automatic',
    logLevel: 'silent',
    define: { 'process.env.NODE_ENV': '"production"' },
    alias: { [PACKAGE]: join(ROOT, 'react/src/index.ts'), react: pkgDir('react'), 'react-dom': pkgDir('react-dom') },
    plugins: [stubCss],
  }).then((r) => r.outputFiles[0].text);
}

let atomusCss;
const pageCss = () => (atomusCss ??= [readFileSync(join(ROOT, 'css/atomus.css'), 'utf8'), readFileSync(join(ROOT, 'react/src/styles.css'), 'utf8')].join('\n'));

/** → { html, ssrError?, buildError? } — a full HTML document, or the reason it could not be built. */
export async function renderPage(file, css = '') {
  let server;
  let client;
  try {
    [server, client] = await Promise.all([bundle(file, 'server'), bundle(file, 'client')]);
  } catch (err) {
    return { buildError: (err.errors?.map((e) => `${e.text}${e.location ? ` (${e.location.file}:${e.location.line})` : ''}`).join('; ')) || err.message };
  }
  let body = '';
  let ssrError;
  const dir = mkdtempSync(join(tmpdir(), 'atomus-evals-'));
  try {
    const out = join(dir, 'server.mjs');
    writeFileSync(out, server);
    body = (await import(pathToFileURL(out).href)).html;
  } catch (err) {
    ssrError = String(err?.message ?? err).split('\n')[0];
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  const html = `<!doctype html>
<html lang="en" data-theme="light">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Atomus eval</title>
<style>${pageCss()}</style>
<style>body { margin: 0; font-family: var(--font-family-body); background: var(--color-bg-primary); color: var(--color-text-secondary); }</style>
${css ? `<style>${css}</style>` : ''}
</head>
<body><div id="root">${body}</div><script>${client.replace(/<\/script/gi, '<\\/script')}</script></body>
</html>`;
  return { html, ssrError };
}

/** Chromium for Playwright: CHROMIUM_PATH, else the sandbox's /opt/pw-browsers, else Playwright's own download. */
export function browserLaunchOptions() {
  if (process.env.CHROMIUM_PATH) return { executablePath: process.env.CHROMIUM_PATH };
  if (!process.env.PLAYWRIGHT_BROWSERS_PATH && existsSync('/opt/pw-browsers')) process.env.PLAYWRIGHT_BROWSERS_PATH = '/opt/pw-browsers';
  return {};
}
