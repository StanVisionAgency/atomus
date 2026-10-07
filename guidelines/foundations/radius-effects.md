# Radius and effects

## Radius (modes: Default · Sharp · Round)

| Token | Default | Sharp | Round |
|---|---|---|---|
| `--radius-none` | 0 | 0 | 0 |
| `--radius-xxs` | 2 | 0 | 4 |
| `--radius-xs` | 4 | 2 | 6 |
| `--radius-sm` | 6 | 2 | 8 |
| `--radius-md` | 8 | 4 | 12 |
| `--radius-lg` | 10 | 4 | 16 |
| `--radius-xl` | 12 | 6 | 20 |
| `--radius-2xl` | 16 | 8 | 24 |
| `--radius-3xl` | 20 | 10 | 32 |
| `--radius-4xl` | 24 | 12 | 40 |
| `--radius-full` | 9999 | 9999 | 9999 |
| `--radius-5xl` | 32 | 16 | 48 |
| `--radius-6xl` | 40 | 20 | 64 |

Controls (buttons, inputs) use `radius-md`; cards `radius-xl`/`2xl`; badges and avatars `radius-full`.

## Shadows (Effects: Light · Dark)

`--shadow-elevation-1 … 24`. Use 1–2 for cards, 3–4 for dropdowns and popovers, 6–8 for drawers and modals, 9+ for marketing visuals. Dark mode uses stronger, neutral shadows.

## Focus
Focused controls get a 4px ring in `bg-brand-subtle` (`--shadow-focus-ring`) and a `border-brand` stroke; errors use `bg-error-subtle` / `border-error`.

## Blur
Effect styles `Blur/Backdrop sm 8 · md 16 · lg 24 · xl 40` for glass overlays.
