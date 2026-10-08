---
name: atomus
description: Build product UI and marketing pages with the Atomus design system by StanVision (@stanvision/atomus-react components, @stanvision/atomus-tokens semantic tokens, Atomus Figma file). Use when a project imports @stanvision/atomus-*, uses Atomus tokens such as --color-text-primary or data-brand/data-theme attributes, or when the user mentions Atomus, StanVision or an Atomus Figma file. Covers choosing components, real props and enums, semantic tokens by intent, page patterns, the Figma MCP workflow and a validator for raw colours, primitive tokens and unknown props.
license: MIT
metadata:
  version: "1.0.0"
  homepage: https://docs.atomus.io
  repository: https://github.com/StanVisionAgency/atomus
---

# Atomus

Atomus 4.0 is one design system for product UI and marketing websites. It ships a Figma file, design tokens (`@stanvision/atomus-tokens`: CSS, Tailwind v4, shadcn/ui, DTCG JSON) and React components (`@stanvision/atomus-react`) whose props mirror the Figma properties. Everything here is generated from or checked against that source, so follow it literally.

## Workflow

1. **Search before you write.** Before building any UI, find the component:
   - Pick it with the catalogue and decision trees in [references/components.md](references/components.md) (exports, props, enums, defaults).
   - Look for existing usage in the project (`grep -r "@stanvision/atomus-react" src`) and copy its patterns.
   - For page layouts read [references/patterns.md](references/patterns.md).
   - For anything else, read the docs index: https://docs.atomus.io/llms.txt (full text: `/llms-full.txt`).
2. **Never invent props.** Use only the props and values in references/components.md. `hierarchy="danger"`, `variant="ghost"` or `<Drawer>` do not exist. If you need something that isn't there, compose existing components or ask the user. Don't guess.
3. **Style with semantic tokens only.** Pick tokens by intent from [references/tokens.md](references/tokens.md): `var(--color-text-secondary)`, `var(--spacing-xl)`, `var(--layout-md)`, `var(--radius-md)` or Tailwind `text-secondary`, `bg-primary`, `border-secondary`.
4. **Working from Figma?** Follow [references/figma.md](references/figma.md): modes on the top frame, slots instead of detaching, Code Connect snippets first, variables mapped to tokens.
5. **Validate before you finish.** Run the validator on every file you touched and fix all errors:
   ```bash
   node <skill-dir>/scripts/validate.mjs src/components/Settings.tsx src/styles/app.css
   ```
   It flags raw hex/rgb colours, primitive tokens (`--color-gray-500`, `bg-gray-500`), unknown Atomus exports, unknown props, invalid enum values and more than one primary button per file.

## Setup (once per project)

```ts
import '@stanvision/atomus-tokens/css';        // tokens + themes (or: @import "@stanvision/atomus-tokens/tailwind" in Tailwind v4)
import '@stanvision/atomus-react/styles.css';  // component styles
import { Button, Card, Input } from '@stanvision/atomus-react';
```

The npm packages are publishing soon. Until then, use `css/atomus.css` and `react/` from https://github.com/StanVisionAgency/atomus. Theme with attributes on any element: `data-theme="light|dark|system"`, `data-brand="<brand>"`, `data-radius="default|sharp|round"`. Breakpoints (Desktop ≥ 1024, Tablet 768–1023, Mobile < 768) are automatic. Fonts: Inter / Inter Display and Roboto Mono, loaded by the app.

<!-- core-rules:start — copied from guidelines/Guidelines.md by scripts/build-skill.mjs -->
## Core rules

1. **Search before you write.** Before you build anything, look it up in `references/components.md` (catalogue, decision trees and React API). Use the Atomus component when one exists.
2. **Never invent props.** Use only the props, values and defaults listed in the **React API** in `references/components.md`. If you need a prop that is not there, compose around the component or ask a human.
3. **Tokens, not values.** Every colour, space, radius, shadow and text size comes from a semantic token: `var(--color-text-primary)`, `var(--spacing-xl)`, `var(--radius-md)`, or Tailwind `text-primary`, `bg-secondary`, `border-primary`. Never raw hex, `rgb()` or a primitive such as `--color-gray-500`.
4. **Roles, not hues.** Pick colours by job: `text-secondary` for supporting copy, `bg-brand-solid` for the main action, `border-secondary` for cards. Dark mode and brands then work automatically.
5. **One primary per view.** A screen, modal or card has at most one `hierarchy="primary"` button: the main action. Put it last in a group, after Cancel.
6. **8-point spacing.** Inside components use `--spacing-*` (2–24px); between blocks and sections use `--layout-*` (24–240px, responsive).
7. **Shared control heights.** Buttons, inputs and selects share sm 32, md 40 and lg 48. Match sizes in one row.
8. **Slots, not detaching.** Put custom content into a component's slot (`children`, `footer`, `actions`, the Content slot in Figma). Never copy a component's markup to change it.
9. **Theme with attributes.** Switch `data-theme`, `data-brand` and `data-radius` on an element (code) or the mode on the top frame (Figma). Never on single layers, and never by overriding token values.
10. **Accessible by default.** Every control has a visible label or `aria-label`. Status is never colour alone: alerts and toasts carry an icon and badges keep their word. Keep the focus ring.
11. **Sentence case, verbs on buttons.** Write "Save changes", not "OK" or "SAVE CHANGES".
12. **Ask instead of guessing.** If the guidelines don't cover a case, say so and propose an option built from existing components.

## Forbidden

- Never put two primary buttons in one view.
- Never use raw hex, `rgb()`, `hsl()` or named colours. Use tokens.
- Never use primitive tokens (`--color-gray-500`, `bg-gray-500`, `--color-brand-600`) where a semantic token exists.
- Never invent component props, prop values, tokens or text-style classes.
- Never import a component that is not in the React API. Figma-only components (Drawer, Command menu, Breadcrumb …) have no React export.
- Never restyle Atomus components with `className` or `style` to change colour, size, radius or font. Pick a variant.
- Never nest cards inside cards, or modals on top of modals.
- Never use placeholder text as a label.
- Never detach a Figma instance to change content. Use slots and instance swaps.
- Never set Light/Dark, Brand, Radius or breakpoint modes on individual layers.
- Never add or change tokens, disable lint rules or change thresholds without human review.
<!-- core-rules:end -->

## References

| File | Read it when |
|---|---|
| [references/components.md](references/components.md) | Choosing a component, or writing any Atomus JSX (catalogue, other names, decision trees, full React API) |
| [references/tokens.md](references/tokens.md) | Styling anything: semantic tokens by intent with Light/Dark values, spacing, radius, shadows, text-style classes |
| [references/patterns.md](references/patterns.md) | Building a screen: app shell, dashboard, settings, auth, table view, website sections |
| [references/figma.md](references/figma.md) | Reading or writing an Atomus Figma file through the Figma MCP server |
| `references/react-api.json`, `references/tokens.json` | Machine-readable API and tokens (used by the validator) |
