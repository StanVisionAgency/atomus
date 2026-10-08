# AGENTS.md

Instructions for AI agents (and people) working **in this repository**. To build a product **with** Atomus, use `templates/consumer/AGENTS.atomus.md` and the skill in `skills/atomus/` instead.

Atomus 4.0 is a design system for product UI and marketing websites by StanVision. It is a human **and** agentic design system: everything that people read on https://docs.atomus.io is also written for agents (guidelines, skill, `llms.txt`). The code and guidelines are MIT-licensed; the Figma file is sold separately.

## Repo map

| Path | What it is | Source or generated |
|---|---|---|
| `tokens/` | W3C DTCG token files, one per collection and mode | Generated from the Figma variables |
| `css/atomus.css` | Tokens as CSS custom properties, themes, breakpoints, text-style classes | Generated from the Figma variables |
| `tailwind/atomus.tailwind.css` | Tailwind v4 theme | Generated from the Figma variables |
| `shadcn/globals.css` | shadcn/ui theme mapped to Atomus tokens | Generated from the Figma variables |
| `packages/` | npm package sources (`@stanvision/atomus-tokens` …) | See each package's README |
| `react/` | `@stanvision/atomus-react`: components, styles, Code Connect (`*.figma.tsx`) | **Source** |
| `guidelines/` | Markdown guidelines for agents, Figma Make and people. Entry point: `guidelines/Guidelines.md` | **Source**, except each `components/*.md` "React API" section |
| `skills/atomus/` | Agent Skill: SKILL.md, references, validator | **Source** for SKILL.md, `patterns.md`, `figma.md` and `scripts/`; the rest is generated |
| `templates/consumer/` | Files to copy into projects that use Atomus | **Source** |
| `scripts/` | Generators: `gen-react-api.mjs`, `gen-token-reference.mjs`, `build-skill.mjs` | **Source** |
| `sites/docs/` | docs.atomus.io (Astro 7 + Starlight) | **Source**, except the folders listed below |
| `sites/atomus-io/` | atomus.io, static files on Cloudflare Pages | **Source** |
| `sites/web/` | Draft of the new 4.0 landing page (Astro) | **Source** |
| `docs-site/` | Source of the Atomus design-system artifact | Mixed; `components/bundle.*` is generated |
| `assets/logos/` | Logo and brandmark SVGs | **Source** |

## Build and check

| Task | Command |
|---|---|
| Docs site | `cd sites/docs && npm install && npm run build` (runs `scripts/sync.mjs`, `astro build` into `dist/`, then `scripts/llms.mjs` for `/llms.txt`, `/llms-full.txt`, `/llms-small.txt` and the per-page `index.md` twins) |
| Docs dev server | `cd sites/docs && npm run dev` (http://localhost:4321) |
| React package | `cd react && npm install && npm run build` · `npm run typecheck` |
| Docs-site bundle | `cd react && npm run build:docs` |
| Landing page draft | `cd sites/web && npm install && npm run build` |
| Skill + generated guideline sections | `node scripts/build-skill.mjs` (`--check` fails when stale) |
| Validate UI code | `node skills/atomus/scripts/validate.mjs <files or folders>` |

Node 22 (Cloudflare Pages uses `NODE_VERSION=22`). Deploys: see `DEPLOY.md`.

## Edit sources, not generated copies

These files are overwritten by a script. Change the source on the right and rerun the script.

| Generated | Source | Script |
|---|---|---|
| `sites/docs/src/content/docs/foundations/`, `components/`, `website-sections.mdx`, `ai/rules.mdx`, `ai/figma-mcp-rules.mdx`, `components/choosing.mdx` | `guidelines/**/*.md` and `sites/docs/src/component-pages/*.mdx` | `sites/docs/scripts/sync.mjs` |
| `sites/docs/src/styles/atomus.css`, `components.css`, `sections-responsive.css` | `css/atomus.css`, `react/src/styles.css` | `sites/docs/scripts/sync.mjs` |
| The "React API" section (between `react-api` markers) of `guidelines/components/*.md` | `react/src/components/*.tsx`, `react/src/index.ts` | `scripts/gen-react-api.mjs` |
| `skills/atomus/references/components.md`, `react-api.json` | `react/src`, `guidelines/overview-components.md` | `scripts/gen-react-api.mjs` |
| `skills/atomus/references/tokens.md`, `tokens.json` | `tokens/*.tokens.json` | `scripts/gen-token-reference.mjs` |
| `core-rules` block in `skills/atomus/SKILL.md`, `figma-mcp-rules` block in `references/figma.md` | `guidelines/Guidelines.md`, `guidelines/figma-mcp-rules.md` | `scripts/build-skill.mjs` |
| `docs-site/components/bundle.js`, `bundle.css` | `react/src` | `cd react && npm run build:docs` |
| `tokens/`, `css/`, `tailwind/`, `shadcn/` | The Figma variables | Figma export (human-run) |
| `sites/docs/dist/`, `react/dist/`, `.astro/` | — | Build output; never commit |

Single sources: a token lives in Figma and `tokens/`; a component's API lives in `react/src`; its usage rules live in `guidelines/components/<name>.md`; the docs pages are built from those. Don't copy content between them by hand. Link to it or extend the generator.

## Contribution rules

- **Small, logical commits** with a message that says why. No `node_modules/`, `dist/` or lockfile churn unless the task is about dependencies.
- **Keep names in sync with Figma.** React props mirror Figma properties (Hierarchy → `hierarchy`); CSS names match the variables' code syntax. Never rename one side only.
- **Guidelines are plain Markdown**: no JSX or HTML except the generator markers. Write rules as imperatives; put hard rules under **Forbidden**.
- **When you add or change a component prop**, update `react/src`, run `node scripts/build-skill.mjs`, update the Code Connect file and the docs page in `sites/docs/src/component-pages/`.
- **When you add a guideline section** (`## …` in `guidelines/components/*.md`), map it to a page in `sites/docs/scripts/component-pages.mjs`. The docs build fails on unplaced sections.
- **Docs must build** without broken internal links: `cd sites/docs && npm run build`.
- **Accessibility is not optional**: labels, focus rings, keyboard support, contrast, and status never shown by colour alone.

## AI policy

Agents may change code, docs and guidelines here. These changes **always need human review** in the pull request, and an agent must not make them on its own initiative:

- **Adding, removing or changing tokens** (anything in `tokens/`, `css/`, `tailwind/`, `shadcn/`, or a new `--color-*` / `--spacing-*` / `--radius-*` value anywhere). Tokens come from the Figma file.
- **Disabling or weakening lint rules, type checks, tests or the validator** (`eslint-disable`, `@ts-ignore`, `--no-verify`, skipped tests, editing `skills/atomus/scripts/validate.mjs` to pass).
- **Changing thresholds**: contrast ratios, accessibility levels, bundle-size or coverage limits, validator severities.
- **Changing licences, package names, versions or publishing settings.**

If a task seems to need one of these, stop and explain why in the PR or to the person instead. Mark AI-generated PRs as such. Never commit secrets, and never push to `main` directly.

## Building UI in this repo

The docs and sites use Atomus itself, so the Atomus rules apply here too: read `guidelines/Guidelines.md`. In short: use Atomus components, semantic tokens only (no raw hex, no primitives), one primary button per view, slots instead of copies, and run the validator on changed UI files.
