# Message & Alert

## Alert

Inline alert. Subtle or Outline; Brand, Gray, Error, Warning, Success.

Variants: 10

| Property | Type / options |
|---|---|
| Title | text |
| Description | text |
| Show description | boolean (on) |
| Actions | boolean (on) |
| Close | boolean (on) |
| Style | Subtle · Outline |
| Color | Brand · Gray · Error · Warning · Success |

**Do**

- Pick the colour by meaning.
- Use Outline on white pages, Subtle inside cards.
- Give a clear next step.

**Don’t**

- Don’t stack several alerts.
- Don’t use alerts for marketing.
- Don’t auto-dismiss errors — use Toast for transient messages.

## Toast

Floating notification; auto-dismiss in code.

Variants: 5

| Property | Type / options |
|---|---|
| Title | text |
| Description | text |
| Close | boolean (on) |
| Color | Brand · Gray · Error · Warning · Success |

## Notification item

Row for notification panels and inboxes; unread rows get a tint and dot.

Variants: 2

| Property | Type / options |
|---|---|
| Name | text |
| Message | text |
| Actions | boolean (off) |
| Type | Default · Unread |

## Notifications panel

Dropdown panel for the bell icon: header, tabs, rows, footer link.

Variants: 1
