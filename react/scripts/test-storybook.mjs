// Runs @storybook/test-runner against the static build: every story renders, play functions pass, and the
// @storybook/addon-a11y axe checks report no violations (parameters.a11y.test = 'error').
// Usage: npm run build-storybook && npm run test-storybook [-- <extra test-storybook args>]
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { serve } from './serve-static.mjs';

const dir = new URL('../storybook-static/', import.meta.url).pathname;
if (!existsSync(`${dir}index.json`)) {
  console.error('test-storybook: storybook-static/ not found — run `npm run build-storybook` first');
  process.exit(1);
}
const { url, close } = await serve(dir, Number(process.env.STORYBOOK_PORT ?? 6007));
const bin = new URL('../node_modules/.bin/test-storybook', import.meta.url).pathname;
// Async spawn: the static server runs in this process and must keep answering while the tests run.
const child = spawn(bin, ['--url', url, '--maxWorkers=2', ...process.argv.slice(2)], { stdio: 'inherit', env: { ...process.env, NO_PROXY: `127.0.0.1,localhost,${process.env.NO_PROXY ?? ''}` } });
const code = await new Promise((r) => child.on('exit', (c) => r(c ?? 1)));
await close();
process.exit(code);
