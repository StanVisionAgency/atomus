# Colour

Use **semantic tokens** only. Each has a Light and Dark value and follows the Brand collection. Names below are the CSS variables (Figma names in brackets).

## Text

Text colour. `primary` for headings and body, `secondary` for supporting copy, `tertiary` for hints and meta, `placeholder` in inputs, `brand` for links/highlights, `on-brand` on brand fills.

| Token | Light | Dark |
|---|---|---|
| `--color-text-primary` (Text/text-primary) | #18181b | #fafafa |
| `--color-text-secondary` (Text/text-secondary) | #3f3f46 | #d4d4d8 |
| `--color-text-white` (Text/text-white) | #ffffff | #ffffff |
| `--color-text-opacity` (Text/text-opacity) | #00000099 | #ffffff99 |
| `--color-text-link` (Text/text-link) | #4057ff | #6e96ff |
| `--color-text-tertiary` (Text/text-tertiary) | #71717a | #a1a1aa |
| `--color-text-placeholder` (Text/text-placeholder) | #71717a | #a1a1aa |
| `--color-text-disabled` (Text/text-disabled) | #d4d4d8 | #52525b |
| `--color-text-brand` (Text/text-brand) | #4057ff | #6e96ff |
| `--color-text-on-brand` (Text/text-on-brand) | #ffffff | #ffffff |
| `--color-text-error` (Text/text-error) | #be123c | #fda4af |
| `--color-text-warning` (Text/text-warning) | #b45309 | #fbbf24 |
| `--color-text-success` (Text/text-success) | #15803d | #49de80 |
| `--color-text-brand-hover` (Text/text-brand_hover) | #2335d6 | #97bdff |
| `--color-text-inverse` (Text/text-inverse) | #ffffff | #18181b |
| `--color-text-on-warning` (Text/text-on-warning) | #18181b | #18181b |

## Background

Surface fills. `primary` page and cards, `secondary` sections and table headers, `tertiary` subtle fills and image placeholders, `brand-solid` primary buttons, `brand-subtle` selected/tinted areas, `overlay` behind modals.

| Token | Light | Dark |
|---|---|---|
| `--color-bg-primary` (Background/bg-primary) | #ffffff | #18181b |
| `--color-bg-primary-hover` (Background/bg-primary_hover) | #fafafa | #27272a |
| `--color-bg-secondary` (Background/bg-secondary) | #fafafa | #27272a |
| `--color-bg-tertiary` (Background/bg-tertiary) | #f4f4f5 | #3f3f46 |
| `--color-bg-inverse` (Background/bg-inverse) | #18181b | #ffffff |
| `--color-bg-disabled` (Background/bg-disabled) | #f4f4f5 | #27272a |
| `--color-bg-brand-solid` (Background/bg-brand-solid) | #4057ff | #4057ff |
| `--color-bg-brand-solid-hover` (Background/bg-brand-solid_hover) | #2335d6 | #2335d6 |
| `--color-bg-brand-subtle` (Background/bg-brand-subtle) | #ebf5ff | #121f8c |
| `--color-bg-error-solid` (Background/bg-error-solid) | #e11d48 | #e11d48 |
| `--color-bg-error-subtle` (Background/bg-error-subtle) | #fff1f2 | #881337 |
| `--color-bg-warning-subtle` (Background/bg-warning-subtle) | #fffbeb | #78350f |
| `--color-bg-success-subtle` (Background/bg-success-subtle) | #f0fdf4 | #14532d |
| `--color-bg-tertiary-hover` (Background/bg-tertiary_hover) | #e4e4e7 | #52525b |
| `--color-bg-warning-solid` (Background/bg-warning-solid) | #f59e0b | #f59e0b |
| `--color-bg-success-solid` (Background/bg-success-solid) | #15803d | #15803d |
| `--color-bg-overlay` (Background/bg-overlay) | #18181bb2 | #000000b2 |
| `--color-bg-quaternary` (Background/bg-quaternary) | #e4e4e7 | #3f3f46 |
| `--color-bg-quaternary-hover` (Background/bg-quaternary_hover) | #d4d4d8 | #52525b |

## Border

Strokes. `secondary` for cards and dividers, `primary` for inputs and outlined controls, `brand` / `focus` for selected and focused states.

| Token | Light | Dark |
|---|---|---|
| `--color-border-primary` (Border/border-primary) | #d4d4d8 | #3f3f46 |
| `--color-border-secondary` (Border/border-secondary) | #e4e4e7 | #27272a |
| `--color-border-disabled` (Border/border-disabled) | #e4e4e7 | #3f3f46 |
| `--color-border-brand` (Border/border-brand) | #4057ff | #6e96ff |
| `--color-border-focus` (Border/border-focus) | #4c70ff | #6e96ff |
| `--color-border-error` (Border/border-error) | #e11d48 | #fb7185 |
| `--color-border-warning` (Border/border-warning) | #f59e0b | #fbbf24 |
| `--color-border-success` (Border/border-success) | #16a34a | #49de80 |

## Foreground

Icons and graphics. Same roles as Text.

| Token | Light | Dark |
|---|---|---|
| `--color-fg-primary` (Foreground/fg-primary) | #18181b | #ffffff |
| `--color-fg-secondary` (Foreground/fg-secondary) | #52525b | #d4d4d8 |
| `--color-fg-tertiary` (Foreground/fg-tertiary) | #71717a | #a1a1aa |
| `--color-fg-disabled` (Foreground/fg-disabled) | #d4d4d8 | #52525b |
| `--color-fg-brand` (Foreground/fg-brand) | #4057ff | #6e96ff |
| `--color-fg-on-brand` (Foreground/fg-on-brand) | #ffffff | #ffffff |
| `--color-fg-error` (Foreground/fg-error) | #e11d48 | #fb7185 |
| `--color-fg-warning` (Foreground/fg-warning) | #d97706 | #fbbf24 |
| `--color-fg-success` (Foreground/fg-success) | #16a34a | #49de80 |
| `--color-fg-inverse` (Foreground/fg-inverse) | #ffffff | #18181b |
| `--color-fg-on-warning` (Foreground/fg-on-warning) | #18181b | #18181b |
| `--color-fg-contrast` (Foreground/fg-contrast) | #000000 | #ffffff |
| `--color-fg-contrast-inverse` (Foreground/fg-contrast-inverse) | #ffffff | #000000 |

`fg-contrast` is the maximum-contrast foreground (pure black in Light, pure white in Dark) for marks that must read on any surface, such as the Stop button of the Prompt input; put `fg-contrast-inverse` on top of it.

## AI

The Agent kit's layer for AI content (see `components/ai-label.md`). Each value is the brand ramp blended with purple, so AI reads as related to the brand but distinct from it, and follows the Brand mode. Hex values below are for the Atomus brand. `bg-ai-subtle` tints AI surfaces (AI label, assistant avatar, reasoning, active citations), `border-ai` is their hairline, `text-ai` their label and accent text. `--gradient-ai` (brand-500 → purple → pink-400 at 135°; 400/300 stops in Dark) fills the AI mark, the streaming caret and the focused Prompt input border.

| Token | Light | Dark |
|---|---|---|
| `--color-bg-ai-subtle` (Background/bg-ai-subtle) | #f2f5ff | #938efe1f |
| `--color-border-ai` (Border/border-ai) | #b4b9ff | #938efe66 |
| `--color-text-ai` (Text/text-ai) | #4c2cd2 | #b4b9ff |

Use the AI layer only to identify AI content. Never decorate other UI with it, and never let it be the only signal: pair it with the AI label.

## Primitives
Raw ramps (`--color-gray-25 … 950`, `--color-red-*`, … `--color-alpha-black-5 … 90`) exist only to be aliased. The brand ramp is `--color-brand-25 … 950` and changes with the Brand mode.
