// End-to-end install test: builds the registry for http://localhost, serves it, creates a fresh Vite + React +
// Tailwind v4 app, runs `shadcn add` for the theme, every component, every app block and every website section,
// renders all of them in one page and runs `tsc` + `vite build`.
//
// Usage: node scripts/test-install.mjs [--keep] [--offline-shadcn] [--with-base] [--dir <path>]
//   --keep            keep the scratch app (printed at the end)
//   --offline-shadcn  serve a stub of ui.shadcn.com/r/colors/* locally (for sandboxes without access to ui.shadcn.com)
//   --with-base       also add the `atomus` base item (needs @stanvision/atomus-react on npm)
//   --dir             where to create the scratch app (default: a temp folder)
import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const here = new URL('../', import.meta.url).pathname;
const has = (f) => process.argv.includes(f);
const argv = (name) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : undefined; };
const work = argv('--dir') ?? mkdtempSync(join(tmpdir(), 'atomus-registry-'));
const served = join(work, 'served');
const app = join(work, 'app');
const PORT = Number(process.env.PORT ?? 4599);
const base = `http://localhost:${PORT}/r`;

const run = (cmd, args, opts = {}) => {
  console.log(`$ ${cmd} ${args.join(' ')}`);
  const r = spawnSync(cmd, args, { stdio: 'inherit', ...opts, env: { ...process.env, ...opts.env } });
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')} failed (${r.status})`);
};

// 1. Build the registry with dependencies pointing at the local server.
rmSync(work, { recursive: true, force: true });
mkdirSync(served, { recursive: true });
run('node', [join(here, 'scripts/generate.mjs')]);
run('node', [join(here, 'scripts/build.mjs'), '--output', join(served, 'r'), '--base-url', base]);
run('node', [join(here, 'scripts/validate.mjs'), join(served, 'r')]);
const index = JSON.parse(readFileSync(join(served, 'r/registry.json'), 'utf8'));
if (has('--offline-shadcn')) {
  // Minimal stand-in for https://ui.shadcn.com/r/colors/neutral.json, which `shadcn add` reads for templating.
  mkdirSync(join(served, 'shadcn/colors'), { recursive: true });
  const v = { background: 'oklch(1 0 0)', foreground: 'oklch(0.145 0 0)' };
  writeFileSync(join(served, 'shadcn/colors/neutral.json'), JSON.stringify({ inlineColors: { light: {}, dark: {} }, cssVars: { light: v, dark: v }, cssVarsV4: { light: v, dark: v }, inlineColorsTemplate: '', cssVarsTemplate: '' }));
}

// 2. Serve it — in a child process, because spawnSync below blocks this process's event loop.
const server = spawn(process.execPath, ['-e', `
  const { createServer } = require('node:http'); const { readFileSync, existsSync, statSync } = require('node:fs'); const { join } = require('node:path');
  const root = ${JSON.stringify(served)};
  createServer((req, res) => {
    const p = join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!p.startsWith(root) || !existsSync(p) || statSync(p).isDirectory()) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'content-type': 'application/json' }).end(readFileSync(p));
  }).listen(${PORT}, () => console.log('serving ${base}'));
`], { stdio: ['ignore', 'inherit', 'inherit'] });
await new Promise((r) => setTimeout(r, 500));

try {
  // 3. A fresh Vite + React + Tailwind v4 app, as `npm create vite` + the shadcn Vite guide would leave it.
  mkdirSync(join(app, 'src'), { recursive: true });
  const files = {
    'package.json': JSON.stringify({
      name: 'atomus-registry-install-test', private: true, type: 'module',
      scripts: { build: 'tsc -b && vite build' },
      dependencies: { react: '19.2.0', 'react-dom': '19.2.0' },
      devDependencies: { '@types/node': '22.18.0', '@types/react': '19.2.2', '@types/react-dom': '19.2.2', '@vitejs/plugin-react': '5.1.0', '@tailwindcss/vite': '4.1.16', tailwindcss: '4.1.16', typescript: '5.9.3', vite: '7.1.12' },
    }, null, 2),
    'vite.config.ts': `import path from 'node:path';\nimport { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nimport tailwindcss from '@tailwindcss/vite';\nexport default defineConfig({ plugins: [react(), tailwindcss()], resolve: { alias: { '@': path.resolve(__dirname, './src') } } });\n`,
    'tsconfig.json': JSON.stringify({ compilerOptions: { target: 'ES2022', lib: ['ES2022', 'DOM', 'DOM.Iterable'], module: 'ESNext', moduleResolution: 'bundler', jsx: 'react-jsx', strict: true, noEmit: true, skipLibCheck: true, noUnusedLocals: true, types: ['node'], baseUrl: '.', paths: { '@/*': ['./src/*'] } }, include: ['src', 'vite.config.ts'] }, null, 2),
    'index.html': '<!doctype html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>Atomus registry test</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>\n',
    'src/index.css': '@import "tailwindcss";\n',
    'src/main.tsx': "import { createRoot } from 'react-dom/client';\nimport './index.css';\nimport App from './App';\ncreateRoot(document.getElementById('root')!).render(<App />);\n",
    'src/App.tsx': 'export default function App() { return null; }\n',
    'components.json': JSON.stringify({
      $schema: 'https://ui.shadcn.com/schema.json', style: 'new-york', rsc: false, tsx: true,
      tailwind: { config: '', css: 'src/index.css', baseColor: 'neutral', cssVariables: true, prefix: '' },
      iconLibrary: 'lucide',
      aliases: { components: '@/components', utils: '@/lib/utils', ui: '@/components/ui', lib: '@/lib', hooks: '@/hooks' },
      registries: { '@atomus': `${base}/{name}.json` },
    }, null, 2),
  };
  for (const [f, c] of Object.entries(files)) writeFileSync(join(app, f), c);
  run('npm', ['install', '--no-audit', '--no-fund', '--loglevel=error'], { cwd: app });

  // 4. shadcn add: theme by URL, everything else by the @atomus namespace.
  const shadcn = join(here, 'node_modules/.bin/shadcn');
  const env = has('--offline-shadcn') ? { REGISTRY_URL: `http://localhost:${PORT}/shadcn` } : {};
  const byType = (t) => index.items.filter((i) => i.type === t).map((i) => i.name);
  run(shadcn, ['add', `${base}/atomus-theme.json`, '--yes'], { cwd: app, env });
  if (has('--with-base')) run(shadcn, ['add', `${base}/atomus.json`, '--yes'], { cwd: app, env });
  run(shadcn, ['add', ...byType('registry:ui').map((n) => `@atomus/${n}`), '--yes', '--overwrite'], { cwd: app, env });
  const blocks = index.items.filter((i) => i.type === 'registry:block');
  run(shadcn, ['add', ...blocks.map((b) => `@atomus/${b.name}`), '--yes', '--overwrite'], { cwd: app, env });

  // 5. Render every block (app screens and website sections) in one page, then type-check and build.
  const imports = blocks.map((b) => {
    const dir = b.meta?.kind === 'app' ? 'blocks' : 'sections';
    return `import ${b.meta.component} from '@/components/atomus/${dir}/${b.name}';`;
  });
  writeFileSync(join(app, 'src/App.tsx'), `${imports.join('\n')}\nimport { Button } from '@/components/atomus/button';\n\nexport default function App() {\n  return (\n    <>\n      <Button hierarchy="primary" className="m-4">Tailwind utilities still apply</Button>\n${blocks.map((b) => `      <div data-block="${b.name}"><${b.meta.component} /></div>`).join('\n')}\n    </>\n  );\n}\n`);
  run('npm', ['run', 'build'], { cwd: app });

  const css = readFileSync(join(app, 'src/index.css'), 'utf8');
  for (const needle of ['--color-bg-primary', '--background: var(--color-bg-primary)', '.at-btn--primary', '.ws-section', '.ab-shell', '@fontsource/inter']) {
    if (!css.includes(needle)) throw new Error(`src/index.css is missing ${needle}`);
  }
  console.log(`\ntest-install: OK — ${byType('registry:ui').length} components and ${blocks.length} blocks installed into a Vite + Tailwind v4 app, type-checked and built.`);
  if (has('--keep')) console.log(`scratch app: ${app}`);
} finally {
  server.kill();
  if (!has('--keep')) rmSync(work, { recursive: true, force: true });
}
