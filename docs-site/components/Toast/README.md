# Toast

A short, floating confirmation. Wrap the app in `ToastProvider` and call `useToast().show({...})`.

## Provide

- `title`, `description`, `color` (`brand` · `gray` · `error` · `warning` · `success`), an optional `action`.
- `duration` in ms (default 5000; errors stay until closed). Hover or focus pauses the timer.
- `ToastProvider position` — `bottom-right` (default), `top-right`, `bottom-center`; at most 4 at once.

## Don't

- Don't put the only copy of important information in a toast — it disappears.
