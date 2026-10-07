# Card

A container that groups related content and actions.

## Provide

- `title`, `supportingText`, `headerAction` (Figma: Title, Supporting text, Header action).
- `children` — the Content slot; `footer` — buttons aligned right.
- `variant` — `outlined` · `elevated` · `filled`; `padding` — `md` 16 · `lg` 24.

## Don't

- Don't nest cards; use dividers or a filled card instead.
- Don't add a coloured left border to signal status — use Alert or Badge.
