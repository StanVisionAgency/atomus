# Atomus 4.0 — guidelines for AI tools

Markdown guidelines that teach AI tools (Figma Make, the Figma MCP server, Claude, Cursor, v0) how to build with Atomus.
Point your tool at this folder, or attach the files to a Figma Make kit.

| File | What it covers |
|---|---|
| `overview.md` | Principles, file structure, how screens are composed |
| `foundations/color.md` | Every semantic colour token with Light/Dark values and when to use it |
| `foundations/typography.md` | Text styles and responsive type |
| `foundations/spacing-layout.md` | Spacing, layout, sizes, containers and breakpoints |
| `foundations/radius-effects.md` | Radius modes, shadows, focus rings, blur |
| `foundations/icons.md` | Icon sets and naming |
| `foundations/theming.md` | Brand, Color, Radius modes and how to add a client brand |
| `components/*.md` | One file per component page: purpose, properties, usage rules |
| `website-sections.md` | Marketing sections and how to assemble pages |

**Rules for agents (short version)**
1. Always use library components; never draw a button, input or card from scratch.
2. Never use raw hex or primitives — use semantic tokens (`text-primary`, `bg-secondary`, `border-primary`, `fg-brand`).
3. Spacing comes from the 8-point scale (`spacing-*` inside components, `layout-*` between blocks).
4. Controls share heights: sm 32, md 40, lg 48 (buttons, inputs, selects).
5. Put custom content into slots (Card, Modal, Drawer, Dropdown menu, Chat, Command menu) instead of detaching.
6. Set Brand / Color / Radius / Breakpoint modes on the top frame, not on individual layers.
