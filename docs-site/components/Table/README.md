# Table

Rows of records with sortable columns and optional row selection. Pair with Filter bar above and Pagination below.

## Provide

- `columns` — `{ key, header, sortable?, render?, supporting?, align?, width? }`; `rows`; `rowKey`.
- `size` `sm` (52px rows) · `md` (72px rows); `selectable` + `selected` / `onSelectedChange`; `caption`; `empty` (e.g. an EmptyState).
- Use Avatar, Badge and tertiary Buttons inside `render` for the Figma cell types.

## Don't

- Don't put more than one primary action per row; group the rest in a DropdownMenu.
