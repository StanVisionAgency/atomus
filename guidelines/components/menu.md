# Menu

## Menu item

Row for dropdowns, selects, context and command menus.

Variants: 8

| Property | Type / options |
|---|---|
| Label | text |
| Leading icon | boolean (on) |
| Leading icon swap | instance swap (icon) |
| Shortcut | boolean (off) |
| Shortcut text | text |
| Size | sm · md |
| State | Default · Hover · Selected · Disabled |

## Dropdown menu

Floating menu; items live in a slot.

Variants: 1

| Property | Type / options |
|---|---|
| Items | slot (any content) |

**Do**

- Drop Menu items into the Items slot.
- Group related items.
- Show shortcuts for power users.

**Don’t**

- Don’t exceed ~10 items — use Command menu.
- Don’t put forms inside menus.
- Don’t hide destructive actions without confirmation.

## Context menu

Right-click menu with shortcuts, separators, destructive item and submenus.

Variants: 2

| Property | Type / options |
|---|---|
| Type | Default · Submenu open |
