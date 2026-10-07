---
title: AI guidelines
description: Markdown rules that teach AI tools to build with Atomus.
---

The [`guidelines/`](https://github.com/StanVisionAgency/atomus/tree/main/guidelines) folder teaches Figma Make, the Figma MCP server, Claude, Cursor and v0 how to build with Atomus. Point your tool at the folder or attach the files to a Figma Make kit.

| File | Covers |
| --- | --- |
| `overview.md` | Principles, file structure, how screens are composed |
| `foundations/*.md` | Colour, typography, spacing and layout, radius and effects, icons, theming |
| `components/*.md` | One file per component page: purpose, properties, usage rules |
| `website-sections.md` | Marketing sections and how to assemble pages |

## Rules for agents

1. Always use library components; never draw a button, input or card from scratch.
2. Never use raw hex or primitives — use semantic tokens (`text-primary`, `bg-secondary`, `border-primary`, `fg-brand`).
3. Spacing comes from the 8-point scale (`spacing-*` inside components, `layout-*` between blocks).
4. Controls share heights: sm 32, md 40, lg 48.
5. Put custom content into slots instead of detaching.
6. Set Brand / Color / Radius / Breakpoint modes on the top frame, not on individual layers.
