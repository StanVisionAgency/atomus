# Button

Triggers an action. Use **primary** once per view for the main action, **outline** or **secondary** for the rest, **ghost** inside toolbars and dense rows, **destructive** only to confirm deletion.

## Provide

- `children` — the label, a verb in sentence case: "Save changes", not "SAVE" or "OK".
- `variant` — `primary` · `secondary` · `outline` · `ghost` · `destructive` (default `secondary`).
- `size` — `sm` 32px · `md` 40px · `lg` 48px. Match the height of the inputs on the same row.
- `iconLeading` / `iconTrailing` — icon name; `iconOnly` with an `aria-label` for icon buttons.
- `loading` — shows a spinner and disables the button.

## Do

- Put the primary action on the right of a button group, after Cancel.
- Use `lg` on marketing pages and hero sections, `md` in product UI, `sm` in tables and toolbars.

## Don't

- Don't place two primary buttons side by side.
- Don't use a button for navigation to another page — use a link.
