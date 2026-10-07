# Modal

A dialog that blocks the page until the person decides. Built on the native `<dialog>`: focus moves in, Esc and the backdrop close it, the page behind is inert.

## Provide

- `open` + `onClose`; `title` and `description`; `children` for the Content slot.
- `actions` — buttons, the primary last; `featuredIcon` (`true` or an icon); `closeButton` (default on).
- `size` `sm` 400 · `md` 544 · `lg` 720; `type` `destructive` tints the icon red.

## Don't

- Don't open a modal on page load or stack two.
- Don't use for long forms — use a Drawer or a page.
