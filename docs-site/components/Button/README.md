# Button

Triggers an action. One **primary** per view for the main action; **secondary** or **outline** for the rest; **tertiary** in toolbars and dense rows; **link** for inline, low-emphasis actions.

## Provide

- `children` — the label: a verb in sentence case ("Save changes").
- `hierarchy` — `primary` · `secondary` · `outline` · `tertiary` · `link` (Figma: Hierarchy; default `secondary`).
- `size` — `xs` 24 · `sm` 32 · `md` 40 · `lg` 48 · `xl` 56 (Figma: Size). Match the inputs on the same row.
- `iconLeading` / `iconTrailing` — an icon element (Figma: Leading/Trailing icon swap). `iconOnly` + `aria-label` for icon buttons.
- `loading` — spinner, disabled while busy (Figma: State=Loading).

## Do

- Put the primary action last in a button group, after Cancel.
- Use `lg`/`xl` on marketing pages, `md` in product UI, `sm`/`xs` in tables and toolbars.

## Don't

- Don't place two primary buttons side by side.
- Don't use a button to navigate — use a link.
