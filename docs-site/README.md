Atomus is one system for product UI and marketing websites: the same tokens, type and components on both, switched by theme, brand and shape modes rather than by separate libraries.

## Voice and copy

- Write in sentence case everywhere: buttons, headings, tabs, menu items. "Save changes", never "Save Changes" or "SAVE".
- Address people as "you".
- Lead buttons with a verb ("Create project", "Invite people"). Avoid "OK", "Submit" and "Click here".
- Errors say what happened and how to fix it: "This URL is taken. Try another one."

## Color

- Build every surface from the semantic tokens; touch the `color-brand-*` and `color-gray-*` ramps directly only in charts and illustrations.
- Page and cards: `color-bg-primary`. Sidebars, section bands and panels: `color-bg-secondary`. Muted fills (table headers, tracks, chips): `color-bg-tertiary`.
- Text: `color-text-primary` for headings and body, `color-text-secondary` for labels and supporting copy, `color-text-tertiary` for hints and metadata. All three hold 4.5:1 on `color-bg-primary` and `color-bg-secondary` in both themes.
- Brand blue is the single accent. Spend `color-bg-brand-solid` on the one primary action per view, checked controls and progress; use `color-bg-brand-subtle` with `color-text-brand` for selected and informational states.
- Status colours carry meaning, never decoration: `success`, `warning`, `error`, each with `-solid`, `-subtle`, `text-` and `fg-` variants. Always pair a status colour with a word or icon.
- `color-text-white` stays white in both themes; use it only on photos and fixed dark fills. On brand fills use `color-text-on-brand`.
- Known contrast gaps in the dark theme (kept exact, flagged in the token notes): `color-text-link` on `color-bg-primary` is 3.4:1, so prefer `color-text-brand` for small dark-mode links; `color-text-on-brand` on `color-bg-brand-solid` is 4.1:1, fine for the semibold 16px+ button labels only.

## Typography

- Headlines are set in Inter Display (`title` family); everything else in Inter (`body` family). Code uses Roboto Mono.
- Product UI: `h1`–`h6` for headings, `body` for running text, `small` for dense UI and tables, `tiny` for captions and metadata.
- Websites: the `web-*` scale (`web-display`, `web-heading-xl` … `web-heading-xs`, `web-body-lg`, `web-eyebrow`, `web-quote`).
- Controls use the component styles: `button-sm|md|lg` and `input-sm|md|lg`, matched to the control size.
- Headlines step down on smaller screens: H1 is 64 px on desktop, 52 px on tablet and 40 px on mobile.
- One `h1` per page. Don't skip more than one heading level, and don't set body copy below 14 px.

## Spacing and layout

- Everything sits on the 8-point grid; 4 and 2 are allowed for fine adjustments inside components.
- Inside components use `spacing-*` (`spacing-xs` 4 → `spacing-3xl` 24). Between blocks and sections use `layout-*`, which shrink on tablet and mobile.
- Control heights are shared: `size-sm` 32, `size-md` 40, `size-lg` 48. Buttons and inputs on the same row always use the same size.
- Page container: `container-max-width` 1280 with `container-padding` 80 on desktop (32 tablet, 16 mobile). Sections are separated by `section-padding`.
- Breakpoints: desktop ≥ 1024 px, tablet 768–1023 px, mobile < 768 px.

## Radius and elevation

- Buttons and inputs use `radius-md`; cards, menus and popovers `radius-lg`; large cards and modals `radius-xl`; pills, avatars and toggles `radius-full`.
- The shape mode switches the whole scale: `data-radius="sharp"` for a squarer brand, `data-radius="round"` for a softer one. Never hard-code a corner value.
- Elevation goes up with distance from the page: `shadow-elevation-1` for inputs and cards at rest, `shadow-elevation-4` for dropdowns, `shadow-elevation-8` for modals.
- Separate content with `color-border-secondary` hairlines first, and add shadows only when something floats.
- Every focusable control shows `color-border-focus` plus `shadow-focus-ring` on keyboard focus.

## Theming

- Light/dark: set `data-theme="light"`, `"dark"` or `"system"` on `<html>` (or any container).
- Brand: `data-brand="violet"` swaps the whole brand ramp. Add a client brand by copying that block with their ramp; the semantic tokens follow automatically.
- Modes nest: a `[data-theme="dark"]` section inside a light page recomputes every semantic colour.

## Iconography

- Use the Atomus line icon set from the Figma library, sized by `icon-xs` 12 → `icon-xl` 32 (`icon-md` 20 in controls).
- Icons take the colour of their `fg-*` token: `color-fg-secondary` in controls, `color-fg-brand` for featured icons, `color-fg-error|warning|success` for status.
- The component previews here use a small set of generic stroke glyphs as stand-ins. In production, use the Atomus icon set.
- Logos, flags and payment marks are variants of the icon component, not separate assets.

## Logo

- `atomus-logo.svg` (wordmark with mark) and `atomus-brandmark.svg` (the mark alone) are single-ink files in Gray 900 (`color-gray-900`). On dark grounds, use a white version exported from Figma; never recolour the mark in the brand blue.
- For clear space, minimum sizes and co-branding, follow the Brand guidelines deck in the Figma file.

## Components

- Use the components as they are and choose a variant rather than overriding styles. Each component's card lists its props and the do's and don'ts.
- Pair one primary `Button` with outline or ghost buttons. Put form fields in `Input` with a visible label. Show status with `Badge` (read-only) or `Tag` (removable). Show page-level messages in `Alert`, KPIs in `MetricCard`, and missing content in `EmptyState`.
