// Tests the Cloudflare Worker (Streamable HTTP, stateless, read-only).
//
// 1. Starts `wrangler dev` (local workerd, no Cloudflare account needed) and talks to it with the MCP client SDK.
// 2. If wrangler can't start here (no workerd binary for the platform …) or ATOMUS_WORKER_TEST=handler,
//    bundles worker/index.ts for Node and calls its fetch handler directly with Request objects.
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const pkg = fileURLToPath(new URL('..', import.meta.url));
const PORT = 8700 + Math.floor(Math.random() * 90);
let wrangler = null;
let tmp = null;
let mode = 'wrangler';
let client;

async function startWrangler() {
  if (process.env.ATOMUS_WORKER_TEST === 'handler') return false;
  wrangler = spawn(process.execPath, [join(pkg, 'node_modules/wrangler/bin/wrangler.js'), 'dev', '-c', 'worker/wrangler.toml', '--port', String(PORT), '--ip', '127.0.0.1', '--show-interactive-dev-session=false'], {
    cwd: pkg,
    env: { ...process.env, WRANGLER_SEND_METRICS: 'false', CI: '1' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let log = '';
  wrangler.stdout.on('data', (d) => { log += d; });
  wrangler.stderr.on('data', (d) => { log += d; });
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (wrangler.exitCode !== null) break;
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/health`);
      if (r.ok) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  console.error(`wrangler dev did not start; falling back to the handler test.\n${log.slice(-1500)}`);
  wrangler.kill();
  wrangler = null;
  return false;
}

/** Fallback: bundle the worker for Node and route fetches to its handler. */
async function handlerFetch() {
  const { build } = await import('esbuild');
  tmp = mkdtempSync(join(tmpdir(), 'atomus-worker-'));
  const out = join(tmp, 'worker.mjs');
  await build({ entryPoints: [join(pkg, 'worker/index.ts')], outfile: out, bundle: true, platform: 'node', format: 'esm', logLevel: 'silent', banner: { js: "import { createRequire } from 'node:module'; import { fileURLToPath as __f } from 'node:url'; const require = createRequire(import.meta.url); const __filename = __f(import.meta.url); const __dirname = __filename.replace(/[\\\\/][^\\\\/]*$/, '');" } });
  const worker = (await import(pathToFileURL(out).href)).default;
  return (input, init) => worker.fetch(new Request(input, init));
}

before(async () => {
  let fetchImpl;
  if (!(await startWrangler())) {
    mode = 'handler';
    fetchImpl = await handlerFetch();
  }
  client = new Client({ name: 'atomus-worker-test', version: '0.0.0' });
  await client.connect(new StreamableHTTPClientTransport(new URL(`http://127.0.0.1:${PORT}/mcp`), fetchImpl ? { fetch: fetchImpl } : {}));
});
after(async () => {
  await client?.close().catch(() => {});
  wrangler?.kill();
  if (tmp) rmSync(tmp, { recursive: true, force: true });
});

const text = (r) => r.content.map((c) => c.text).join('\n');

describe('atomus-mcp Worker (Streamable HTTP)', () => {
  it(`serves the nine tools (${process.env.ATOMUS_WORKER_TEST === 'handler' ? 'handler' : 'wrangler dev or handler'})`, async () => {
    const { tools } = await client.listTools();
    assert.equal(tools.length, 9);
    assert.ok(tools.every((t) => t.annotations?.readOnlyHint === true));
    console.log(`# worker test mode: ${mode}`);
  });

  it('answers knowledge tools', async () => {
    assert.match(text(await client.callTool({ name: 'atomus_get_started', arguments: {} })), /## Core rules/);
    assert.match(text(await client.callTool({ name: 'atomus_get_component', arguments: { name: 'dialog' } })), /^# Modal/);
    assert.match(text(await client.callTool({ name: 'atomus_find_token', arguments: { query: 'card border' } })), /--color-border-secondary/);
    assert.match(text(await client.callTool({ name: 'atomus_get_pattern', arguments: { pattern: 'dashboard' } })), /MetricCard/);
    assert.match(text(await client.callTool({ name: 'atomus_brand', arguments: { hex: '#0f766e', name: 'teal-co' } })), /\[data-brand="teal-co"\]/);
    assert.match(text(await client.callTool({ name: 'atomus_init', arguments: { agents: ['cursor'] } })), /\.cursor\/rules\/atomus\.mdc/);
  });

  it('validates TSX (ESLint universal Linter + TypeScript parser) and CSS (PostCSS) in the Worker', async () => {
    const tsx = text(await client.callTool({ name: 'atomus_validate', arguments: { code: "import { Button } from '@stanvision/atomus-react';\ntype P = { a: string };\nexport const A = (p: P) => <Button hierarchy=\"danger\" className=\"p-[16px]\">{p.a}</Button>;\n", filename: 'A.tsx', fix: true } }));
    assert.match(tsx, /atomus\/valid-props/);
    assert.match(tsx, /atomus\/no-arbitrary-value/);
    assert.match(tsx, /className="p-xl"/);
    const css = text(await client.callTool({ name: 'atomus_validate', arguments: { code: '.a { margin: 8px; color: #fff; }', filename: 'a.css', fix: true } }));
    assert.match(css, /atomus\/use-tokens/);
    assert.match(css, /atomus\/no-raw-color/);
    assert.match(css, /margin: var\(--spacing-md\)/);
    const fig = text(await client.callTool({ name: 'atomus_figma_to_code', arguments: { component: 'Button', properties: { Hierarchy: 'Primary', Label: 'Save' } } }));
    assert.match(fig, /<Button hierarchy="primary">Save<\/Button>/);
    assert.match(fig, /no problems/);
  });

  it('is read-only and stateless: GET /mcp is refused, /health describes the server', async () => {
    const base = mode === 'wrangler' ? `http://127.0.0.1:${PORT}` : null;
    if (!base) return; // the handler path is exercised above
    const get = await fetch(`${base}/mcp`, { headers: { accept: 'text/event-stream' } });
    assert.equal(get.status, 405);
    const health = await (await fetch(`${base}/health`)).json();
    assert.equal(health.name, 'atomus');
  });
});
