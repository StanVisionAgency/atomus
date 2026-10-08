# Building UI with Atomus

<!-- Paste this file into your product repo: append it to AGENTS.md (or save it as AGENTS.atomus.md and
     link it from AGENTS.md / CLAUDE.md / .cursor/rules / .github/copilot-instructions.md).
     Source: https://github.com/StanVisionAgency/atomus/blob/main/templates/consumer/AGENTS.atomus.md -->

This project's UI uses the **Atomus** design system: `@stanvision/atomus-react` components and `@stanvision/atomus-tokens` semantic tokens. Follow these rules for every screen, component and style you write.

## Before you write UI

1. **Search before you write.**
   - Check whether this project already has the screen or pattern: `grep -r "@stanvision/atomus-react" src`.
   - Pick the component with the catalogue and decision trees: https://docs.atomus.io/components/choosing/
   - Read the component's page for props and rules: https://docs.atomus.io/components/
   - Agent-readable index of all docs: https://docs.atomus.io/llms.txt (full text: https://docs.atomus.io/llms-full.txt)
2. **If the Atomus skill is installed, use it** (`npx skills add StanVisionAgency/atomus`). Its `references/components.md` has every prop and `scripts/validate.mjs` checks your code.

## Imports

```ts
// Once, at the app root:
import '@stanvision/atomus-tokens/css';        // tokens + themes   (Tailwind v4: @import "@stanvision/atomus-tokens/tailwind";)
import '@stanvision/atomus-react/styles.css';  // component styles

// In components:
import { Button, Card, Input, Select, Modal, Table, useToast } from '@stanvision/atomus-react';
```

Theme with attributes, never with overrides: `data-theme="light | dark | system"`, `data-brand="<brand>"`, `data-radius="default | sharp | round"` on `<html>` or any element.

## Rules

1. **Never invent props.** Use only the props and values documented for the component. There is no `hierarchy="danger"`, no `variant="ghost"`, no `<Drawer>` export. If the API doesn't cover what you need, compose existing components or ask.
2. **Never import what doesn't exist.** Some Atomus components are Figma-only (Drawer, Command menu, Breadcrumb, Pagination, Tooltip, Skeleton …). Their docs page says what to use in code instead.
3. **Tokens, not hex.** Every colour, spacing, radius, shadow and font size is a semantic token: `var(--color-text-secondary)`, `var(--color-bg-secondary)`, `var(--color-border-secondary)`, `var(--spacing-xl)`, `var(--layout-md)`, `var(--radius-md)`, or Tailwind `text-secondary`, `bg-primary`, `border-secondary`. Never raw hex, `rgb()`, or primitives like `--color-gray-500` / `bg-gray-500`.
4. **One primary per view.** At most one `<Button hierarchy="primary">` per screen, modal or card: the main action, placed last after Cancel. Others are `outline`, `secondary`, `tertiary` or `link`.
5. **Slots, not detaching.** Put custom content into `children`, `footer`, `actions`, `items`. Don't copy an Atomus component's markup or restyle it with `className`/`style`. Pick a variant prop.
6. **Spacing:** `--spacing-*` inside components, `--layout-*` between blocks and sections. Controls in one row share a size (sm 32, md 40, lg 48).
7. **Type:** use the text-style classes (`.text-headline-h4`, `.text-content-body`, `.text-web-heading-lg`), not hand-set font sizes.
8. **Accessibility:** every control has a label (`label` prop or `aria-label` for icon-only buttons); field errors go in the field's `error` prop; status is never colour alone.
9. **Feedback:** field problem → `error` prop · persistent page/section message → `Alert` · "Saved" confirmations → `useToast().show()` · decisions → `Modal` · nothing to show yet → `EmptyState`.
10. **Figma designs:** set modes from the top frame as attributes on the root, use Code Connect snippets when the Figma MCP server returns them, and map variables to tokens by their code syntax. Never paste hex values from the design context.

## Before you finish

- Validate changed files: `node ~/.claude/skills/atomus/scripts/validate.mjs <files>` (or the skill's path in your setup).
- Check the screen in light and dark, and at mobile width.
- Don't add tokens, override token values, or disable lint/type rules to make something pass. Ask a person.
