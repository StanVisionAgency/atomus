# Atomus 4.0

**A design system for humans and agents.** One system for product UI and marketing websites: a Figma file, design tokens, React components, and guidelines that people and AI agents both follow.

- Docs: https://docs.atomus.io
- AI & agents: https://docs.atomus.io/ai/ · for LLMs: https://docs.atomus.io/llms.txt
- Figma file: https://stanvision.gumroad.com/l/atomus-design-system

## Why "human and agentic"

Most design systems are written for people and scraped by AI tools. In Atomus, every rule is published twice from one source: as docs for people, and in a form agents follow literally. The guidelines have imperative **Do / Forbidden** rules and decision trees, every component has a **React API** section generated from the TypeScript source, there is an Agent Skill with a validator, and the docs ship `llms.txt` plus a Markdown twin of every page. Agents pick the right component, use only real props, style with semantic tokens and keep one primary action per view.

## Packages

> **Publishing soon.** The npm packages are not released yet. Until then, use the files in this repo (see [Install today](#install-today)).

| Package | What it is |
|---|---|
| `@stanvision/atomus-tokens` | Design tokens generated from the Figma variables. Exports `@stanvision/atomus-tokens/css` (CSS custom properties, themes, breakpoints, text styles), `/tailwind` (Tailwind v4 theme), `/shadcn` (shadcn/ui theme) and `/tokens/*` (W3C DTCG JSON). |
| `@stanvision/atomus-react` | 21 accessible React components whose props mirror the Figma properties (Hierarchy → `hierarchy`, Size → `size`), with Code Connect mappings. |

```bash
npm install @stanvision/atomus-react @stanvision/atomus-tokens
```

```ts
import '@stanvision/atomus-tokens/css';        // or in Tailwind v4: @import "@stanvision/atomus-tokens/tailwind";
import '@stanvision/atomus-react/styles.css';
import { Button, Card, Input } from '@stanvision/atomus-react';
```

Theme with attributes on any element, the same switches as the Figma modes:

```html
<html data-theme="light">            <!-- light | dark | system -->
<body data-brand="violet">           <!-- omit for Atomus blue; add one block per client brand -->
<section data-radius="round">        <!-- default | sharp | round -->
```

Breakpoints are automatic: Desktop ≥ 1024px, Tablet 768–1023px, Mobile < 768px. Fonts: Inter / Inter Display and Roboto Mono (Google Fonts). Full setup: [`guidelines/setup.md`](guidelines/setup.md).

### Install today

- **Tokens:** copy `css/atomus.css`, `tailwind/atomus.tailwind.css` or `shadcn/globals.css`. Use either the Tailwind theme or the shadcn theme in one app, not both.
- **React:** `cd react && npm install && npm run build`, then `npm install ../atomus/react` in your app. See [`react/README.md`](react/README.md).

## For AI agents

| What | Where |
|---|---|
| Guidelines (entry point for agents and Figma Make) | [`guidelines/Guidelines.md`](guidelines/Guidelines.md) |
| Atomus Agent Skill (components, tokens, patterns, Figma MCP, validator) | [`skills/atomus/`](skills/atomus/SKILL.md): `npx skills add StanVisionAgency/atomus` |
| Rules to paste into a product repo | [`templates/consumer/AGENTS.atomus.md`](templates/consumer/AGENTS.atomus.md) |
| Figma MCP rules | [`guidelines/figma-mcp-rules.md`](guidelines/figma-mcp-rules.md) |
| Docs for LLMs | [`/llms.txt`](https://docs.atomus.io/llms.txt), [`/llms-full.txt`](https://docs.atomus.io/llms-full.txt), `…/index.md` per page |
| Working on this repo | [`AGENTS.md`](AGENTS.md) |

Coming next: the Figma Make kit (once the npm packages are out), an Atomus MCP server, a component registry and evals. See [AI & agents](https://docs.atomus.io/ai/).

## What's in this repo

| Folder | Use it for |
|---|---|
| `tokens/` | W3C **DTCG 2025.10** token files, one per collection and mode, plus `$themes.json`. For Tokens Studio, Style Dictionary or Terrazzo. |
| `css/atomus.css` | Plain CSS custom properties and text-style classes. Every name matches the code syntax in Figma Dev Mode. |
| `tailwind/atomus.tailwind.css` | **Tailwind CSS v4** theme: palette, radius, spacing, type scale, shadows and semantic utilities (`text-primary`, `bg-secondary`, `border-primary`, `fg-brand` …). |
| `shadcn/globals.css` | **shadcn/ui** theme mapping `--background`, `--primary`, `--ring`, `--chart-*`, `--sidebar-*` … to Atomus tokens. |
| `react/` | `@stanvision/atomus-react` source and Code Connect files. |
| `guidelines/` | Markdown guidelines for agents, Figma Make and people. |
| `skills/atomus/` | The Atomus Agent Skill. |
| `templates/consumer/` | Agent rules for projects that use Atomus. |
| `scripts/` | Generators for the React API sections and the skill references (`node scripts/build-skill.mjs`). |
| `sites/docs` | docs.atomus.io (Astro + Starlight), built from this repo. |
| `sites/atomus-io` | atomus.io as static files. `sites/web` is a draft 4.0 landing page. See `DEPLOY.md`. |
| `docs-site/` | Source of the Atomus design-system artifact; `components/bundle.*` is built from `react/` with `npm run build:docs`. |
| `assets/logos/` | `atomus-logo.svg` (229×48) and `atomus-brandmark.svg` (48×48). |

## Add a client brand

1. In Figma: add a mode to the **Brand** collection and point `brand-25 … brand-950` at the client ramp.
2. In CSS: copy the `[data-brand="violet"]` block in `atomus.css`, rename it and point it at the client ramp.

## Licence

- **Code, tokens, guidelines, skill and docs** in this repo: MIT.
- **The Atomus Figma file** is a paid product, sold separately on [Gumroad](https://stanvision.gumroad.com/l/atomus-design-system). It is not included in this repo or covered by the MIT licence.
