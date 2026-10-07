# Deploying atomus.io and docs.atomus.io

Both sites are static Astro builds hosted free on **Cloudflare Pages**, straight from this repo. Every push to `main` redeploys them.

| Site | Folder | Domain |
| --- | --- | --- |
| Marketing site | `sites/web` | `atomus.io` (+ `www.atomus.io`) |
| Documentation | `sites/docs` | `docs.atomus.io` |

Both read the single sources at build time (`css/atomus.css`, `react/src`, `guidelines/`, `assets/logos/`), so a token or component change shows up on both sites on the next push.

## 1. Create the two Pages projects (once)

In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git → StanVisionAgency/atomus**.

| Setting | Marketing site | Docs |
| --- | --- | --- |
| Project name | `atomus-web` | `atomus-docs` |
| Production branch | `main` | `main` |
| Framework preset | Astro | Astro |
| Root directory | `sites/web` | `sites/docs` |
| Build command | `npm run build` | `npm run build` |
| Build output directory | `dist` | `dist` |
| Environment variable | `NODE_VERSION` = `22` | `NODE_VERSION` = `22` |

Optional, under **Settings → Builds → Build watch paths**, so each site only rebuilds when its sources change:

- `atomus-web`: `sites/web/*`, `css/*`, `react/src/*`, `assets/*`
- `atomus-docs`: `sites/docs/*`, `guidelines/*`, `css/*`, `react/src/*`, `assets/*`

## 2. Point the domains (atomus.io is already on Cloudflare DNS)

1. `atomus-docs` → **Custom domains → Set up a domain → `docs.atomus.io`**. Cloudflare adds the CNAME itself.
2. `atomus-web` → **Custom domains → `atomus.io`**, then add **`www.atomus.io`** too.
   Cloudflare will ask to replace the existing Webflow records (A / CNAME to `proxy-ssl.webflow.com`). Accept. The switch is live in a minute or two, and the certificate is issued automatically.
3. Redirect `www` to the apex: **Rules → Redirect Rules → Create** · when hostname equals `www.atomus.io` · dynamic redirect to `concat("https://atomus.io", http.request.uri.path)` · 301.

## 3. After the switch

- Check `https://atomus.io` and `https://docs.atomus.io` on desktop and mobile.
- Keep the Webflow site for a week as a fallback, then cancel its hosting plan.
- Gumroad stays the store; the buy buttons point to `stanvision.gumroad.com/l/atomus-design-system`.

## Local development

```bash
cd sites/docs   # or sites/web
npm install
npm run dev     # syncs tokens/CSS/guidelines, then starts Astro on localhost:4321
```
