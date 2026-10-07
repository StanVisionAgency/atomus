# Tabs

Switch between views of the same object. Arrow, Home and End keys move between tabs.

## Provide

- `items` — `[{ value, label, count?, disabled? }]`, two to six; `aria-label`.
- `variant` — `underline` (page sections) · `pill` (sub-navigation) · `segmented` (filters, chart ranges).
- `value` + `onChange` (controlled) or `defaultValue`.

## Don't

- Don't use tabs for sequential steps — use Progress steps.
