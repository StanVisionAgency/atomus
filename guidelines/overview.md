# Atomus 4.0 — overview

New here? Read [`Guidelines.md`](Guidelines.md) first. It has the reading order and the rules. To pick a component, use [`overview-components.md`](overview-components.md).

Atomus is one design system for **product UI** and **marketing websites**. Both share the same tokens, so an app and its website stay on-brand automatically.

## Structure
- **Foundations** — variables (colour, spacing, radius, typography, effects), text styles, grid styles, icons.
- **Components** — 96 component sets for app UI: buttons, inputs, menus, navigation, tables, charts, modals, drawers, notifications …
- **Website sections** — 30 responsive sections (Desktop 1440 / Tablet 768 / Mobile 375) and 13 example pages.
- **App examples** — dashboard, table view, settings and empty state screens built only from components.
- **Utility** — brand guidelines, UX research and persona templates, social media sizes, device frames.

## Principles
1. **Tokens first.** Every fill, stroke, gap, padding, radius and text size is bound to a variable.
2. **Roles, not hues.** Colours are named by job (`text-secondary`, `bg-brand-solid`), so themes and dark mode just work.
3. **8-point grid.** Sizes are multiples of 8; 4 and 2 only for fine detail.
4. **Slots over detaching.** Open content areas are slots; icons are instance swaps named like Font Awesome.
5. **Responsive by mode.** Switch the Spacing & Layout and Typography modes to Desktop, Tablet or Mobile and layouts reflow.

## Composing an app screen
`Sidebar navigation` (280) + main column (padding `layout-xs`, gap `layout-xs`):
`Page header` → `Metric card` row → `Card` (with `Card header`, content, `Section footer`) → table built from `Table header cell` + `Table cell`, with `Filter bar` above and `Pagination` below.

## Composing a web page
`Header navigation` → hero (`Hero section`) → content sections → `CTA section` → `Footer`. Use the same Breakpoint variant for every section on a frame and set the frame's Spacing & Layout and Typography modes to match.
