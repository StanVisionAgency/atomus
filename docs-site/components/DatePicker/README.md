# DatePicker

A date field that opens a calendar. `Calendar` is exported on its own for inline use.

## Provide

- `type` `single` (with `value` / `onChange`) or `range` (with `range` / `onRangeChange`); dates are ISO strings like `2026-10-14`.
- `label`, `hint`, `error`, `placeholder`, `min`, `max`, `weekStartsOn` (Monday by default), `locale`.
- Keyboard: arrow keys move by day and week, PageUp / PageDown by month, Enter picks, Esc closes.

## Don't

- Don't use for birthdays or dates far away — a typed Date input is faster.
