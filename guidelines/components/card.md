# Card

## Card

Container for product and marketing layouts. Content is a slot. Styles: Outlined, Elevated, Filled. Padding md (16) / lg (24).

Variants: 6

| Property | Type / options |
|---|---|
| Content | slot (any content) |
| Title | text |
| Supporting text | text |
| Header | boolean (on) |
| Header action | boolean (on) |
| Footer | boolean (off) |
| Style | Outlined · Elevated · Filled |
| Padding | md · lg |

**Do**

- Put any content into the Content slot.
- Use Header and Footer booleans instead of building your own.
- Use Outlined on white, Filled on grey backgrounds.

**Don’t**

- Don’t nest cards inside cards.
- Don’t add shadows by hand — pick the Elevated style.
- Don’t detach to change padding — use the Padding variant.

## Inline CTA

Call-to-action block inside app pages or articles.

Variants: 3

| Property | Type / options |
|---|---|
| Title | text |
| Text | text |
| Style | Subtle · Brand · Outline |

## Section footer

Footer row for cards, tables and settings sections: actions, pagination or a link.

Variants: 3

| Property | Type / options |
|---|---|
| Type | Actions · Pagination · Link |

## Card header

Header for cards, tables and settings sections: title, badge, supporting text and actions.

Variants: 3

| Property | Type / options |
|---|---|
| Title | text |
| Badge | boolean (on) |
| Actions | boolean (on) |
| Type | Default · Avatar · Icon |
