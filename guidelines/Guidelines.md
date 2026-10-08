# Atomus guidelines

Start here. This folder teaches AI agents (Claude Code, Cursor, Copilot, Figma Make, the Figma MCP server, v0) and people how to build UI with **Atomus 4.0**, and what not to do.

## What Atomus is

Atomus is one design system for **product UI** and **marketing websites**, built by StanVision. It has four layers that share one set of names:

- **Figma file**: about 140 component sets, 30 responsive website sections and 13 example pages, all bound to 671 variables with Light/Dark, Brand, Radius and Desktop/Tablet/Mobile modes. The file is sold separately at https://stanvision.gumroad.com/l/atomus-design-system.
- **Design tokens** (`@stanvision/atomus-tokens`): W3C DTCG JSON, plain CSS custom properties, a Tailwind v4 theme and a shadcn/ui theme. Every CSS name matches the code syntax in Figma Dev Mode.
- **React components** (`@stanvision/atomus-react`): 21 accessible components whose props mirror the Figma properties (Hierarchy → `hierarchy`, Size → `size`, Style → `variant`).
- **These guidelines**: plain Markdown, also published at https://docs.atomus.io with an `llms.txt` index.

The code and guidelines are MIT-licensed. If something you need is not in Atomus, compose it from Atomus components and tokens, or ask a human. Never invent a new component API, token or style.

## Reading order

1. **`Guidelines.md`** (this file): the core rules and the forbidden list.
2. **`setup.md`**: install, CSS imports, theme attributes and fonts, plus what you must not configure.
3. **`overview-components.md`**: every component in one table, alternative names (dialog → Modal) and decision trees (Alert vs Toast vs Banner vs Modal …). Read it before you choose a component.
4. **`foundations/`**: `color.md` (semantic tokens, Light and Dark), `typography.md`, `spacing-layout.md`, `radius-effects.md`, `icons.md`, `theming.md`.
5. **`components/<name>.md`**: read the file of every component you use. Each one has the Figma properties, **Do** / **Forbidden** rules, and a generated **React API** section with every prop, type and default.
6. **`website-sections.md`**: marketing sections and how to assemble pages.
7. **`figma-mcp-rules.md`**: rules for reading Atomus Figma designs through the Figma MCP server.

Read files when you need them. Don't load the whole folder at once.

## Core rules

1. **Search before you write.** Before you build anything, look it up in `overview-components.md` and read the component's guideline file. Use the Atomus component when one exists.
2. **Never invent props.** Use only the props, values and defaults listed in a component's **React API** section. If you need a prop that is not there, compose around the component or ask a human.
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

## Before you finish

- Run the Atomus validator on the files you touched: `node skills/atomus/scripts/validate.mjs <files>`. It flags raw colours, primitive tokens and unknown props or values.
- Check the view in light and dark (`data-theme="dark"`) and at mobile width (< 768px).
- Count primary buttons per view: at most one.

## Where things live

| Need | File |
|---|---|
| Install and theming | `setup.md` |
| Which component? | `overview-components.md` |
| Colour tokens (Light/Dark) | `foundations/color.md` |
| Type, spacing, radius, shadows | `foundations/typography.md`, `foundations/spacing-layout.md`, `foundations/radius-effects.md` |
| Brand, Color and Radius modes | `foundations/theming.md` |
| A component's props and rules | `components/<name>.md` |
| Marketing pages | `website-sections.md` |
| Reading Figma designs | `figma-mcp-rules.md` |
| Docs for people | https://docs.atomus.io (index for agents: https://docs.atomus.io/llms.txt) |
