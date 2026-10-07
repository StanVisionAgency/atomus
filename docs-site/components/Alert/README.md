# Alert

An inline message about the page or a section. Use toasts for transient confirmations and modals for blocking decisions.

## Provide

- `tone` — `info` · `success` · `warning` · `error`. Each carries its own icon, so the tone never depends on colour alone.
- `title` — the point in a few words; `children` — one or two sentences.
- `actions` — up to two small buttons; `onDismiss` adds the close button.

## Don't

- Don't stack more than two alerts.
- Don't use `error` for anything the user didn't cause or can't fix.
