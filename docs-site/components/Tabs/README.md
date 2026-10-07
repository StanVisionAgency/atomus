# Tabs

Switches between views of the same object without leaving the page. Arrow keys move between tabs.

## Provide

- `items` — `[{ value, label, count? }]`, two to six.
- `variant` — `underline` for page sections, `segmented` for filters and chart ranges.
- `value` + `onChange` (controlled) or `defaultValue`.

## Don't

- Don't use tabs for sequential steps — use a Progress steps component.
