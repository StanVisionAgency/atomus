# Slideout & command menu

## Slideout menu

Side drawer (400px); content is a slot.

Variants: 1

| Property | Type / options |
|---|---|
| Content | slot (any content) |
| Title | text |
| Supporting text | text |
| Actions | boolean (on) |

## Command menu

⌘K command palette; results are a slot.

Variants: 1

| Property | Type / options |
|---|---|
| Results | slot (any content) |

## Drawer

Panel from right, left or bottom (mobile sheet); content is a slot.

Variants: 3

| Property | Type / options |
|---|---|
| Title | text |
| Content | slot (any content) |
| Position | Right · Left · Bottom |

**Do**

- Use for detail views and secondary forms.
- Use Bottom on mobile.
- Put content into the Content slot.

**Don’t**

- Don’t use for critical confirmations.
- Don’t stack drawers.
- Don’t make drawers wider than half the screen.
