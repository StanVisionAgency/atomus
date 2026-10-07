// Builds the docs-site bundle (one classic script that assigns window.Atomus) from the same source as the package.
import { build } from 'esbuild';
import { readFileSync, writeFileSync } from 'node:fs';

const components = ['Button', 'Badge', 'Tag', 'Input', 'Checkbox', 'Radio', 'Toggle', 'Avatar', 'Alert', 'Card', 'Tabs', 'ProgressBar', 'MetricCard', 'EmptyState', 'Select', 'DropdownMenu', 'Modal', 'Toast', 'Table', 'DatePicker', 'Navigation'];
const header = `/* @ds-bundle: ${JSON.stringify({ format: 4, namespace: 'Atomus', components: components.map((name) => ({ name })) })} */\n`;

const reactGlobal = {
  name: 'react-global',
  setup(b) {
    b.onResolve({ filter: /^react(\/jsx-runtime)?$|^react-dom$/ }, (a) => ({ path: a.path, namespace: 'rg' }));
    b.onLoad({ filter: /.*/, namespace: 'rg' }, (a) => ({
      contents: a.path === 'react/jsx-runtime'
        ? 'const R = window.React; export const Fragment = R.Fragment; export function jsx(t, p, k) { return R.createElement(t, k === undefined ? p : Object.assign({}, p, { key: k })); } export const jsxs = jsx;'
        : a.path === 'react-dom' ? 'module.exports = window.ReactDOM;' : 'module.exports = window.React;',
      loader: 'js',
    }));
  },
};

const out = await build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  format: 'iife',
  globalName: '__atomus',
  write: false,
  minify: false,
  target: 'es2018',
  plugins: [reactGlobal],
});
const js = header + out.outputFiles[0].text + 'window.Atomus = Object.assign(window.Atomus || {}, __atomus);\n';
if (/<\/script|<!--/i.test(js)) throw new Error('bundle contains </script or <!--');
writeFileSync('../docs-site/components/bundle.js', js);

const previewBase = 'html, body { margin: 0; background: var(--color-bg-primary); color: var(--color-text-primary); font-family: var(--font-family-body); -webkit-font-smoothing: antialiased; }\nbody { padding: var(--spacing-3xl); }\n.at-row { display: flex; flex-wrap: wrap; align-items: center; gap: var(--spacing-lg); }\n.at-stack { display: flex; flex-direction: column; gap: var(--spacing-xl); }\n.at-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--spacing-xl); }\n';
const fonts = "@import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..700&family=Roboto+Mono:wght@400;500&display=swap');\n\n";
writeFileSync('../docs-site/components/bundle.css', fonts + '/* Docs-site preview helpers */\n' + previewBase + '\n' + readFileSync('src/styles.css', 'utf8'));
console.log('docs-site bundle.js + bundle.css written');
