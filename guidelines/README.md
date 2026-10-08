# Atomus 4.0 guidelines

Markdown guidelines that teach AI agents and people how to build with Atomus: Claude Code, Cursor, Copilot, Figma Make, the Figma MCP server and v0.

**Start with [`Guidelines.md`](Guidelines.md).** It explains what Atomus is, the order to read the other files in, the core rules and the forbidden list. To use the folder in Figma Make, attach it to a Make kit with `Guidelines.md` as the entry point. For coding agents, see `AGENTS.md` at the repo root and the Atomus skill in `skills/atomus/`.

| File | What it covers |
|---|---|
| `Guidelines.md` | Entry point: what Atomus is, reading order, core rules, forbidden list |
| `setup.md` | Install, CSS imports, `data-theme` / `data-brand` / `data-radius`, fonts, what not to configure |
| `overview-components.md` | Every component with its purpose, React export and other names; decision trees |
| `overview.md` | Principles and how app screens and web pages are composed |
| `foundations/*.md` | Colour (Light/Dark values), typography, spacing and layout, radius and effects, icons, theming |
| `components/*.md` | One file per Figma component page: properties, Do / Forbidden rules and the generated React API |
| `components.md` | Index of the component files and the Figma components in each |
| `website-sections.md` | Marketing sections and how to assemble pages |
| `figma-mcp-rules.md` | Rules for reading Atomus designs through the Figma MCP server and writing back to Figma |

The **React API** section at the end of each `components/*.md` file is generated from `react/src/components` by `node scripts/gen-react-api.mjs`. Don't edit it by hand. Everything else is written by hand; the docs site at https://docs.atomus.io is built from these files.
