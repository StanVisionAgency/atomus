# DropdownMenu

A list of actions that opens from a button. `MenuItem` is exported for custom lists.

## Provide

- `trigger` — the button that opens it (it gets `aria-haspopup`, `aria-expanded` and arrow-key opening).
- `items` — `{ label, icon?, shortcut?, disabled?, destructive?, onSelect }`, `{ type: 'separator' }` or `{ type: 'heading', label }`.
- `align` `start` · `end`; `size` `sm` 36 · `md` 40; `label` names the menu.

## Do

- Put destructive actions last, after a separator.

## Don't

- Don't use it to pick a value — that's Select.
