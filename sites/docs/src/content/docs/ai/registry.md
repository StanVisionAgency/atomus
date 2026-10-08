---
title: shadcn registry, MCP and v0
description: Install Atomus components, the Agent kit, app screens and website sections as source with the shadcn CLI, let agents browse them through the shadcn MCP server, and open them in v0.
---

Atomus is published as a [shadcn registry](https://ui.shadcn.com/docs/registry) at `https://docs.atomus.io/r/`. The shadcn CLI, the shadcn MCP server and v0 can install any Atomus item **as source you own**: the component code, the CSS it needs and the Atomus tokens. You don't need the npm package for it.

| What | Items | Installs to |
| --- | --- | --- |
| The whole system | `atomus` (base) | Tokens, shadcn/ui theme, fonts, base styles, `@stanvision/atomus-react` and `@stanvision/atomus-tokens` |
| Theme | `atomus-theme`, `atomus-tokens` | Your CSS file: Atomus tokens, and the shadcn/ui variables (`--background`, `--primary` …) mapped to them |
| Components | `button`, `input`, `select`, `checkbox-radio-toggle`, `date-picker`, `table`, `modal`, `toast` … (20) | `components/atomus/<name>.tsx` + CSS in `@layer components` |
| Agent kit | `ai-prompt-input`, `ai-message`, `ai-streaming-text`, `ai-reasoning`, `ai-tool-call`, `ai-approval`, `ai-sources`, `ai-suggestions`, `ai-model-selector`, `ai-feedback`, `ai-label`, `ai-context-meter` (12, plus the `ai-internal` helpers) | `components/atomus/ai-<name>.tsx` + CSS in `@layer components` |
| App screens | `dashboard`, `settings`, `auth`, `table-view`, `ai-chat` (and `app-shell`) | `components/atomus/blocks/<name>.tsx` |
| Website sections | `hero-section`, `pricing-section`, `faq-section`, `footer` … (30) | `components/atomus/sections/<name>.tsx` |

The index of every item is [`/r/registry.json`](https://docs.atomus.io/r/registry.json). Each item has a description and install notes (`docs`), and pulls in what it depends on, so `button` also brings the tokens, fonts and shared helpers.

Atomus components install into `components/atomus/`, not `components/ui/`, so they never overwrite shadcn/ui's own `button.tsx` or `card.tsx`. The two can live side by side: the theme makes shadcn/ui components use Atomus colours and radius too.

## Install with the shadcn CLI

You need a project with Tailwind CSS v4 and a `components.json` (run `npx shadcn@latest init` once). Then add the theme and the components you want:

```bash
npx shadcn@latest add https://docs.atomus.io/r/atomus-theme.json
npx shadcn@latest add https://docs.atomus.io/r/button.json https://docs.atomus.io/r/input.json
npx shadcn@latest add https://docs.atomus.io/r/dashboard.json
```

```tsx
import { Button } from '@/components/atomus/button';
import { Dashboard } from '@/components/atomus/blocks/dashboard';
import HeroSection from '@/components/atomus/sections/hero-section';
```

Every component and website-section page on this site has the command for its item, with a copy button and **Open in v0**.

### Use the `@atomus` namespace

Add the registry to `components.json` once, and refer to items by name:

```json title="components.json"
{
  "registries": {
    "@atomus": "https://docs.atomus.io/r/{name}.json"
  }
}
```

```bash
npx shadcn@latest add @atomus/atomus-theme @atomus/button @atomus/hero-section
npx shadcn@latest view @atomus/button
npx shadcn@latest search @atomus -q "date"
```

### Theme, dark mode and brand

The theme writes the Atomus tokens into your CSS file and maps the shadcn/ui variables to them. Switch modes with attributes on `<html>` (or any element), exactly as in Figma:

```html
<html data-theme="dark" data-brand="violet" data-radius="round">
```

`shadcn init` adds `@custom-variant dark (&:is(.dark *));`. To make Tailwind's `dark:` variant follow `data-theme` as well, replace that line with:

```css
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *, .dark, .dark *));
```

### Source or package?

- **Registry (source)**: you own the code and can change it. Updates are a re-run of `shadcn add` (it asks before it overwrites a file).
- **npm package**: `npm i @stanvision/atomus-react @stanvision/atomus-tokens`, `import "@stanvision/atomus-react/styles.css"` once, and import components from `@stanvision/atomus-react`. Updates are a version bump. The `atomus` base item installs both packages.

Both are generated from the same source (`react/src`), so props and markup are identical. Don't mix both for the same component in one app.

## Let agents use it: the shadcn MCP server

The [shadcn MCP server](https://ui.shadcn.com/docs/mcp) lets Claude Code, Cursor, VS Code and other MCP clients browse, search and install registry items from a prompt. With the `@atomus` registry in `components.json` (above), set it up once per project:

```bash
npx shadcn@latest mcp init --client claude   # or: cursor, vscode, codex, opencode
```

That writes the client's MCP config, for example `.mcp.json` for Claude Code:

```json title=".mcp.json"
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  }
}
```

Restart the client, then ask in plain language:

- "Show me the components in the @atomus registry."
- "Add the Atomus dashboard block and the date picker."
- "Build a pricing page from @atomus/pricing-section and @atomus/faq-section."

The MCP server reads each item's description and `docs`, so the agent knows where files land and how to import them. Pair it with the [Atomus skill and rules](/ai/coding-agents/) so the agent also follows the usage rules: semantic tokens only, one primary button per view, props from the React API.

## Open in v0

**Open in v0** on a component or section page sends that registry item to [v0](https://v0.app) as the starting point of a new chat, with its dependencies, CSS and tokens. You can also build the link yourself:

```text
https://v0.app/chat/api/open?url=https://docs.atomus.io/r/hero-section.json
```

Ask v0 to compose pages from Atomus items ("a landing page with the Atomus hero, features, pricing and FAQ sections"), then install the result in your project with the command v0 gives you.

## Storybook

Every React component also has stories in the [Atomus Storybook](https://docs.atomus.io/storybook/) with light/dark, brand and radius switches. Storybook publishes a component manifest at [`/storybook/manifests/components.json`](https://docs.atomus.io/storybook/manifests/components.json) with the props of every component. When you run Storybook locally (`cd react && npm run storybook`), its MCP server at `http://localhost:6006/mcp` lets agents list the documented components and their stories:

```bash
npx mcp-add --type http --url "http://localhost:6006/mcp" --scope project
```

## For maintainers

The registry source is `registry/` in the [Atomus repository](https://github.com/StanVisionAgency/atomus/tree/main/registry):

- `scripts/items.mjs` lists what ships; `atomus/blocks/` holds the app screens. Everything else is generated from the single sources: `npm run generate` copies the components from `react/src` and the website sections from the docs, cuts each component's CSS out of `react/src/styles.css`, converts `css/atomus.css` and `shadcn/globals.css`, and writes `registry.json` (the committed item index; `npm run check` fails when it is stale) and `.build/registry.json` (the same items with their CSS).
- `npm run build` runs `shadcn build` into `sites/docs/public/r/`; `npm run validate` checks every item against the shadcn schema and checks that dependencies and imports resolve.
- `npm run test:install` installs the theme, every component and every block into a fresh Vite + Tailwind v4 app and builds it.
