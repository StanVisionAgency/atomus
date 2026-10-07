# Input

Single-line text field with label, hint and error. Heights match Button: `sm` 32 · `md` 40 · `lg` 48.

## Provide

- `label` — always (Figma: Label); use `aria-label` when the design hides it.
- `placeholder` — an example value, never the label.
- `hint` (Figma: Hint); `error` replaces it and turns the border `border-error` (Figma: State=Error).
- `size`, `iconLeading`, `iconTrailing` and any native input attribute.

## Do

- Write errors that say how to fix it: "Enter a date after today".

## Don't

- Don't rely on the red border alone — the error text is required.
