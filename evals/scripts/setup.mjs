#!/usr/bin/env node
// One-time setup: installs the Atomus lint packages the scorers load (packages/eslint-plugin,
// packages/stylelint-config) and writes their manifest data. Run after `npm install` in evals/.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../src/context.mjs';

const run = (cwd, cmd, args) => {
  console.log(`$ (${cwd.replace(`${ROOT}/`, '')}) ${cmd} ${args.join(' ')}`);
  const r = spawnSync(cmd, args, { cwd, stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
};
for (const pkg of ['packages/eslint-plugin', 'packages/stylelint-config']) {
  const dir = join(ROOT, pkg);
  if (!existsSync(join(dir, 'node_modules'))) run(dir, 'npm', ['install', '--no-audit', '--no-fund']);
  run(dir, 'node', ['scripts/copy-data.mjs']);
}
console.log('evals: ready. Score a run with `npm run score -- runs/<folder>`; test the scorers with `npm test`.');
