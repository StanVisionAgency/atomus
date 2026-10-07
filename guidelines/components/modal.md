# Modal

## Modal

Dialog with header, Content slot and actions. Sizes 400 / 544 / 720px.

Variants: 6

| Property | Type / options |
|---|---|
| Content | slot (any content) |
| Title | text |
| Description | text |
| Featured icon | boolean (on) |
| Close button | boolean (on) |
| Actions | boolean (on) |
| Size | sm · md · lg |
| Type | Default · Destructive |

**Do**

- Use for focused tasks that need a decision.
- Put content into the Content slot.
- Keep the primary action on the right.

**Don’t**

- Don’t open modals on top of modals.
- Don’t use for long forms — use a page or Drawer.
- Don’t hide the close button.
