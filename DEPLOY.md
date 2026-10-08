# Deploying atomus.io and docs.atomus.io

Both sites are hosted free on **Cloudflare Pages**, straight from this repo. Every push to `main` redeploys them; pull requests get a preview deployment. The Atomus MCP server runs as a Cloudflare Worker at `mcp.atomus.io` (section 4).

| Site | Folder | Domain |
| --- | --- | --- |
| Marketing site (the current Webflow page, as static files) | `sites/atomus-io` | `atomus.io` (+ `www.atomus.io`) |
| Documentation | `sites/docs` | `docs.atomus.io` |
| New 4.0 landing page (draft, not deployed) | `sites/web` | — |

The docs read the single sources at build time (`css/atomus.css`, `react/src`, `guidelines/`, `tokens/`, `registry/`), so a token or component change shows up on the next push. The marketing site is the Webflow page exported as plain files: edit `sites/atomus-io/public/index.html` to change copy.

## 1. Create the two Pages projects (once)

In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git → StanVisionAgency/atomus**.

| Setting | Marketing site | Docs |
| --- | --- | --- |
| Project name | `atomus-web` | `atomus-docs` |
| Production branch | `main` | `main` |
| Framework preset | None | Astro |
| Root directory | `sites/atomus-io` | `sites/docs` |
| Build command | (leave empty) | `npm run build` |
| Build output directory | `public` | `dist` |
| Environment variable | — | `NODE_VERSION` = `22` |

Optional, under **Settings → Builds → Build watch paths**, so each site only rebuilds when its sources change:

- `atomus-web`: `sites/atomus-io/*`
- `atomus-docs`: `sites/docs/*`, `guidelines/*`, `css/*`, `react/*`, `registry/*`, `tokens/*`, `assets/*`, `packages/*`, `skills/*`, `scripts/*` (add `shadcn/*` too: the registry theme item is generated from `shadcn/globals.css`)

The docs read more than `sites/docs/`: the guidelines and CSS, the React source (component demos and the API sections), the tokens, the registry sources, the lint and MCP docs in `packages/`, the skill and the generators in `scripts/`. Leave a path out and a change there won't redeploy the docs.

### What `npm run build` in `sites/docs` does

1. `npm run sync` — copies tokens, CSS and guidelines into the site and writes the component pages.
2. `npm run registry` — installs `registry/` and builds the shadcn registry into `sites/docs/public/r/` (served at **`/r/`**, index at `/r/registry.json`).
3. `npm run storybook` — installs `react/` and builds Storybook into `sites/docs/public/storybook/` (served at **`/storybook/`**).
4. `astro build` into `dist/`, then `scripts/llms.mjs` writes `/llms.txt`, `/llms-full.txt`, `/llms-small.txt` and the per-page Markdown twins.

So the Cloudflare build installs three dependency trees (`sites/docs`, `registry`, `react`) and takes a few minutes. `public/r/` and `public/storybook/` are build output and never committed. For a quick local build without the registry and Storybook, run `npm run build:site`.

## 2. Point the domains (atomus.io is already on Cloudflare DNS)

1. `atomus-docs` → **Custom domains → Set up a domain → `docs.atomus.io`**. Cloudflare adds the CNAME itself.
2. `atomus-web` → **Custom domains → `atomus.io`**, then add **`www.atomus.io`** too.
   Cloudflare will ask to replace the existing Webflow records (A / CNAME to `proxy-ssl.webflow.com`). Accept. The switch is live in a minute or two, and the certificate is issued automatically.
3. Redirect `www` to the apex: **Rules → Redirect Rules → Create** · when hostname equals `www.atomus.io` · dynamic redirect to `concat("https://atomus.io", http.request.uri.path)` · 301.

## 3. After the switch

- Check `https://atomus.io` and `https://docs.atomus.io` on desktop and mobile.
- Keep the Webflow site for a week as a fallback, then cancel its hosting plan.
- Gumroad stays the store; the buy buttons point to `stanvision.gumroad.com/l/atomus-design-system`.

## 4. Atomus MCP server (mcp.atomus.io)

The remote MCP server is a Cloudflare **Worker** (not Pages) in `packages/mcp/worker/`. It is deployed by hand, not on push.

1. The `atomus.io` zone must be on the Cloudflare account that deploys the Worker.
2. `cd packages/mcp && npm install && npx wrangler login` (or set `CLOUDFLARE_API_TOKEN`, created from the *Edit Cloudflare Workers* template, and `CLOUDFLARE_ACCOUNT_ID`).
3. `npm run deploy:worker`. The `routes` entry in `worker/wrangler.toml` (`mcp.atomus.io`, `custom_domain = true`) creates the DNS record and the certificate; nothing else to configure.
4. Check: `curl https://mcp.atomus.io/health`, then `npx @modelcontextprotocol/inspector` → Streamable HTTP → `https://mcp.atomus.io/mcp`.
5. Redeploy after each release so the bundled manifest, guidelines and patterns match the published packages.

The Worker has no bindings, secrets or storage, and no tool writes anything. Details: `packages/mcp/README.md`.

## Local development

```bash
cd sites/docs   # or sites/web
npm install
npm run dev     # syncs tokens/CSS/guidelines, then starts Astro on localhost:4321
```
