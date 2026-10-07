# Atomus 4.0

Docs: https://docs.atomus.io · Figma file: https://stanvision.gumroad.com/l/atomus-design-system

## Code tokens

Generated from the Atomus 4.0 Figma variables (October 2026). Every CSS variable name matches the
**code syntax** shown in Figma Dev Mode, so what developers inspect is what they type.

## What's inside

| Folder | Use it for |
|---|---|
| `tokens/` | W3C **DTCG 2025.10** token files — one file per collection and mode, plus `$themes.json` and `text-styles.tokens.json`. Import into Tokens Studio, Style Dictionary or Terrazzo. |
| `css/atomus.css` | Plain CSS custom properties + text-style classes. Works with any stack. |
| `tailwind/atomus.tailwind.css` | **Tailwind CSS v4** theme: palette, radius, spacing, type scale, shadows and semantic utilities (`text-primary`, `bg-secondary`, `border-primary`, `fg-brand` …). |
| `shadcn/globals.css` | **shadcn/ui** theme: maps `--background`, `--primary`, `--ring`, `--chart-*`, `--sidebar-*` … to Atomus tokens. |

Use **either** the Atomus Tailwind theme **or** the shadcn theme in one app — both define `bg-primary`
with different meanings.

## Theming — same switches as the Figma modes

```html
<html data-theme="light">            <!-- light | dark | system -->
<body data-brand="violet">           <!-- omit for Atomus blue; add one block per client brand -->
<section data-radius="round">        <!-- default | sharp | round -->
```

Switches nest: a `data-brand` or `data-theme` on any element re-themes everything inside it.

Breakpoints follow the Spacing & Layout and Typography modes: **Desktop ≥ 1024px**, **Tablet 768–1023px**,
**Mobile < 768px**. Layout spacing, container padding and headline sizes change automatically.

## Add a client brand

1. In Figma: add a mode to the **Brand** collection and point `brand-25 … brand-950` at the client ramp.
2. In CSS: copy the `[data-brand="violet"]` block in `atomus.css`, rename it and paste the client hex values.

## Tailwind v4

```css
@import "tailwindcss";
@import "./tailwind/atomus.tailwind.css";
```

```html
<button class="bg-brand-solid text-on-brand rounded-md px-xl h-10 shadow-e2">Save</button>
<p class="text-secondary text-body">…</p>
<section class="px-layout-md py-layout-xl">…</section>
```

Dark variant: `dark:` works with `data-theme="dark"` or `.dark`.

## Logos

`assets/logos/` — `atomus-logo.svg` (229×48) and `atomus-brandmark.svg` (48×48), single ink #18181B.

## Websites

`sites/atomus-io` is atomus.io: the current Webflow page as plain static files, hosted on Cloudflare Pages. `sites/docs` is docs.atomus.io, an Astro site built from this repo. `sites/web` is a draft of a new 4.0 landing page. See `DEPLOY.md`.

## React components

`react/` — `@stanvision/atomus-react`: 21 components whose props mirror the Figma properties, plus Code Connect files. See `react/README.md`.

## Docs site

`docs-site/` — source of the Atomus 4.0 design-system artifact (tokens.json, brand book, previews). Its `components/bundle.js` and `bundle.css` are built from `react/` with `npm run build:docs`.

## Fonts

Inter Display (headlines), Inter (body, UI), Roboto Mono (code) — all on Google Fonts.
