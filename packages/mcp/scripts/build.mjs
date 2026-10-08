#!/usr/bin/env node
// Builds dist/stdio.js: the server, the Atomus data (generated/data.json) and the Atomus lint rules
// (../eslint-plugin, ../stylelint-config) in one file. eslint, stylelint, the TypeScript parser, PostCSS,
// zod and the MCP SDK stay real dependencies.
import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { chmodSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const pkg = join(dirname(fileURLToPath(import.meta.url)), '..');
for (const dir of ['eslint-plugin', 'stylelint-config']) execFileSync(process.execPath, [join(pkg, '..', dir, 'scripts/copy-data.mjs')], { stdio: 'inherit' });
execFileSync(process.execPath, [join(pkg, 'scripts/build-data.mjs')], { stdio: 'inherit' });

const { dependencies = {} } = JSON.parse(readFileSync(join(pkg, 'package.json'), 'utf8'));
await build({
  entryPoints: [join(pkg, 'src/stdio.ts')],
  outfile: join(pkg, 'dist/stdio.js'),
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node18',
  external: Object.keys(dependencies).flatMap((d) => [d, `${d}/*`]),
  banner: { js: '#!/usr/bin/env node' },
  legalComments: 'none',
  logLevel: 'info',
});
chmodSync(join(pkg, 'dist/stdio.js'), 0o755);
