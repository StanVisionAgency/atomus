# @stanvision/atomus-mcp

The Atomus MCP server. It gives AI agents (Claude Code, Cursor, VS Code / Copilot, Codex …) the Atomus design system as tools: the component catalogue and decision trees, every component's real props and rules, semantic tokens by intent, page patterns, Figma-to-code mappings, a validator that runs the Atomus lint rules, setup files for a project and brand ramps. Everything is bundled at build time from the Atomus sources; the server never fetches anything, and every link it returns points to https://docs.atomus.io.

## Install

Local (stdio), runs with `npx`:

```bash
claude mcp add atomus -- npx -y @stanvision/atomus-mcp
```

```json
{ "mcpServers": { "atomus": { "command": "npx", "args": ["-y", "@stanvision/atomus-mcp"] } } }
```

Remote (Streamable HTTP, read-only): `https://mcp.atomus.io/mcp`

```bash
claude mcp add --transport http atomus https://mcp.atomus.io/mcp
```

Configs for Cursor, VS Code and Codex: https://docs.atomus.io/ai/mcp/

## Tools

| Tool | What it does |
|---|---|
| `atomus_get_started` | **Call this first.** Workflow, core rules, forbidden list, setup imports, next tool to call. |
| `atomus_list_components` | Catalogue (React vs Figma-only), other names (dialog → Modal), decision trees. `query` resolves a name. |
| `atomus_get_component` | One component from the manifest: props, values, defaults, Figma names, rules, examples, Code Connect mapping, accessibility. |
| `atomus_find_token` | Intent → token with Light/Dark values and Tailwind utility. Also takes a hex, px value or primitive. |
| `atomus_get_pattern` | App shell, dashboard, table view, settings, auth, website sections, AI chat. |
| `atomus_figma_to_code` | Figma component set + property values → Atomus JSX, validated. |
| `atomus_validate` | **Required final step.** ESLint (Atomus plugin) for TSX/JS, Stylelint (Atomus config) for CSS; problems, suggestions and safe autofixes. |
| `atomus_init` | Content of AGENTS.md / CLAUDE.md / Cursor rule / Copilot instructions, CSS imports, lint and MCP configs. Writes nothing. |
| `atomus_brand` | Hex → `[data-brand]` ramp (25 … 950), contrast checks, steps for code and Figma. |

All tools are read-only (`readOnlyHint: true`).

## Development

```bash
cd packages/mcp
npm install
npm run build        # generated/data.json + dist/stdio.js (bundles ../eslint-plugin and ../stylelint-config)
npm test             # spawns dist/stdio.js and calls every tool through the MCP client; then the Worker test
npm run typecheck
```

`scripts/build-data.mjs` bundles the manifest (`packages/manifest/atomus.manifest.json`, built by `scripts/build-manifest.mjs`), `guidelines/Guidelines.md`, `guidelines/overview-components.md`, `guidelines/setup.md`, `skills/atomus/references/patterns.md`, `guidelines/components/messaging.md`, `guidelines/website-sections.md`, `templates/consumer/*` and the brand ramp from `tokens/`. Rebuild after any of them change.

## Remote server (Cloudflare Worker)

`worker/index.ts` serves the same tools over Streamable HTTP in stateless mode (a fresh server per request, JSON responses, `POST /mcp` only; `GET /health` describes the server). `atomus_validate` runs ESLint's universal `Linter` with the TypeScript parser and the Atomus CSS checks on PostCSS (Stylelint itself needs Node). The bundle is about 7.3 MB raw / 2 MB gzipped, under the Workers free-plan limit of 3 MB.

Test locally (no Cloudflare account needed, runs workerd):

```bash
npm run dev:worker          # http://localhost:8787/mcp
npm run test:worker         # wrangler dev + MCP client; falls back to calling the handler in Node
```

### Deploy (repo owner)

1. The `atomus.io` zone must be on the Cloudflare account that deploys the Worker.
2. `cd packages/mcp && npm install && npx wrangler login` (or set `CLOUDFLARE_API_TOKEN` with the *Edit Cloudflare Workers* template and `CLOUDFLARE_ACCOUNT_ID`).
3. `npm run deploy:worker`. The `routes` entry in `worker/wrangler.toml` (`mcp.atomus.io`, `custom_domain = true`) creates the DNS record and certificate; nothing else to configure.
4. Check: `curl https://mcp.atomus.io/health`, then `npx @modelcontextprotocol/inspector` → Streamable HTTP → `https://mcp.atomus.io/mcp`.
5. Redeploy after each release so the bundled data matches the published packages.

The Worker has no bindings, secrets or storage, and no tool writes anything.
