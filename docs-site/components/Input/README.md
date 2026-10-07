# Input

A single-line text field with label, hint and error. Heights match buttons: `sm` 32 · `md` 40 · `lg` 48.

## Provide

- `label` — always, even when the design hides it visually (`aria-label` then).
- `placeholder` — an example value, never the label.
- `hint` — helper text under the field; `error` replaces it and turns the border `border-error`.
- `size`, `iconLeading`, and any native input attribute (`type`, `value`, `onChange` …).

## Do

- Write errors that say how to fix it: "Enter a date after today".
- Put inputs and buttons of the same `size` on one row.

## Don't

- Don't rely on the red border alone — the error text is required.
