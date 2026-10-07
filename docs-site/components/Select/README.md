# Select

Pick one value from a list of 5–15 options. Uses the Input heights (`sm` 32 · `md` 40 · `lg` 48) and the Menu item rows for the list.

## Provide

- `options` — `[{ value, label, icon?, disabled? }]`; `value` + `onChange` or `defaultValue`.
- `label` (always), `placeholder`, `hint`, `error`, `size`, `disabled`, `name` for forms.
- Keyboard: ↑ ↓ Home End to move, Enter to pick, Esc to close, letters jump to a match.

## Don't

- Don't use for 2–4 options — use Radio or Tabs (segmented).
- Don't use for more than ~15 options — add search (Combobox, coming next).
