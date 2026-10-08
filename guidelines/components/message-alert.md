# Message & Alert

## Alert

Inline alert about a page, section or form. Tinted fill, hairline border, coloured title and icon. Colours: Brand, Gray, Error, Warning, Success.

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

Code adds two options that are not Figma variants yet: Style **Solid** (`variant="solid"`) and Size **sm · md** (`size="sm"`, default md). Colours come from the `--color-alert-<color>-bg · border · title · icon` component tokens.

**Style**

- **Subtle** (default) — tinted background, hairline border. Use it almost everywhere.
- **Outline** — white surface, coloured border and a soft shadow. Use it on tinted or grey surfaces (bg-secondary, filled cards) where a tint would disappear.
- **Solid** — full-colour fill. Only for blocking, page-level issues (account suspended, payment failed, data loss).

**Size**

- **md** (default) for pages and cards; **sm** for dense UI, forms, table toolbars and side panels.

**Do**

- Pick the colour by meaning: Brand = info, Gray = neutral, Error, Warning, Success.
- Lead with a short title; put detail in the description.
- Give a clear next step (one link or up to two small buttons).

**Don’t**

- Don’t stack several alerts.
- Don’t use alerts for marketing.
- Don’t use Solid for routine messages — it shouts.
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
