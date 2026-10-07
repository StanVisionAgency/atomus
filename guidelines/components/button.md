# Button

## Button

Hierarchy: Primary (main action, one per view), Secondary, Outline, Tertiary (low emphasis), Link. Sizes xs–xl (24–56px). Icons via instance swap. Loading shows a spinner.

Variants: 125

| Property | Type / options |
|---|---|
| Label | text |
| Leading icon | boolean (off) |
| Leading icon swap | instance swap (icon) |
| Trailing icon | boolean (off) |
| Trailing icon swap | instance swap (icon) |
| Hierarchy | Primary · Secondary · Outline · Tertiary · Link |
| Size | xs · sm · md · lg · xl |
| State | Default · Hover · Focused · Disabled · Loading |

**Do**

- One primary button per view — it is the main action.
- Use verbs in labels: “Save changes”, not “OK”.
- Match sizes in a row; inputs and buttons share 32/40/48 heights.

**Don’t**

- Don’t place two primary buttons side by side.
- Don’t use Link style for destructive actions.
- Don’t detach to change the icon — use Leading/Trailing icon swap.

## Button icon

Icon-only button. Same hierarchies, sizes and states as Button; square 24–56px. Always give it a tooltip or aria-label in code.

Variants: 100

| Property | Type / options |
|---|---|
| Icon | instance swap (icon) |
| Hierarchy | Primary · Secondary · Outline · Tertiary |
| Size | xs · sm · md · lg · xl |
| State | Default · Hover · Focused · Disabled · Loading |
