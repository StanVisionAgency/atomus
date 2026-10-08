---
title: Atomus MCP server
description: Give Claude Code, Cursor, VS Code and Codex the Atomus components, props, tokens, patterns and validator as MCP tools — locally with npx or remotely at mcp.atomus.io.
---

The Atomus MCP server turns the design system into tools an agent calls while it works: it looks up a component's real props before writing JSX, asks for the token that matches an intent instead of guessing a hex value, and validates every file before it hands over. It serves the same sources as these docs, bundled at build time, so it can't drift from the release you use.

:::note[Publishing soon]
`@stanvision/atomus-mcp` publishes to npm together with `@stanvision/atomus-react` and `@stanvision/atomus-tokens`, and the remote server goes live at `mcp.atomus.io` at the same time. Until then, build it from the [repo](https://github.com/StanVisionAgency/atomus/tree/main/packages/mcp) (`cd packages/mcp && npm install && npm run build`) and point your client at `node packages/mcp/dist/stdio.js`.
:::

## Install

The local server runs over stdio with `npx`. It needs Node 18.20 or newer.

### Claude Code

```bash
claude mcp add atomus -- npx -y @stanvision/atomus-mcp
```

Add `--scope project` to write it to `.mcp.json` for the whole team.

### Cursor

`.cursor/mcp.json` (project) or `~/.cursor/mcp.json` (all projects):

```json
{
  "mcpServers": {
    "atomus": { "command": "npx", "args": ["-y", "@stanvision/atomus-mcp"] }
  }
}
```

### VS Code (Copilot agent mode)

`.vscode/mcp.json`:

```json
{
  "servers": {
    "atomus": { "type": "stdio", "command": "npx", "args": ["-y", "@stanvision/atomus-mcp"] }
  }
}
```

### Codex

`~/.codex/config.toml`:

```toml
[mcp_servers.atomus]
command = "npx"
args = ["-y", "@stanvision/atomus-mcp"]
```

### Remote server

A read-only server with the same tools runs over Streamable HTTP at:

```text
https://mcp.atomus.io/mcp
```

```bash
claude mcp add --transport http atomus https://mcp.atomus.io/mcp
```

In Cursor and VS Code use `{ "url": "https://mcp.atomus.io/mcp" }` (VS Code: `"type": "http"`). The remote server needs no account and stores nothing. Use the local server when you work offline or want the version pinned in your `package.json`.

## Tools

| Tool | When the agent calls it |
|---|---|
| `atomus_get_started` | **First**, before writing or reviewing Atomus UI. Returns the workflow, core rules, forbidden list and setup imports. |
| `atomus_list_components` | Choosing a component. The catalogue (React export or Figma-only), other names (dialog → Modal, sheet → Drawer) and the decision trees. |
| `atomus_get_component` | Before writing JSX for a component: every prop with type, values, default and Figma name, native attributes, rules, examples, Code Connect mapping and accessibility notes. |
| `atomus_find_token` | Instead of any hex, `rgb()` or px: "supporting text" → `--color-text-secondary` with Light and Dark values. Also takes a hex, a px value or a primitive. |
| `atomus_get_pattern` | Laying out a screen: app shell, dashboard, table view, settings, auth, website sections, AI chat. |
| `atomus_figma_to_code` | Reading a Figma instance without a Code Connect snippet: component set and property values → Atomus JSX, validated. |
| `atomus_validate` | **Last**, on every changed file. Runs the [Atomus ESLint and Stylelint rules](/ai/lint/) and returns problems, suggestions and safe fixes. |
| `atomus_init` | Setting up a project: content for AGENTS.md, CLAUDE.md, the Cursor rule, Copilot instructions, CSS imports, lint and MCP configs. It writes nothing. |
| `atomus_brand` | A client brand colour: the `[data-brand]` ramp, contrast checks and the steps for code and Figma. |

Every tool is read-only, and every link it returns points to docs.atomus.io.

## Example session

> Build a team settings page with Atomus.

1. `atomus_get_started` → rules and workflow.
2. `atomus_get_pattern` `settings` → layout with Vertical tabs as `NavItem`s, Cards and one primary per card.
3. `atomus_get_component` `Toggle`, `Input`, `Select` → real props.
4. `atomus_find_token` "section divider" → `--color-border-secondary`.
5. `atomus_validate` on `Settings.tsx` and `settings.css` → fix, validate again.

## With the skill and AGENTS.md

The server complements the [Atomus skill and AGENTS.md rules](/ai/coding-agents/): the rules tell the agent to use Atomus and when to call the tools; the tools give exact answers without loading the whole reference into context. `atomus_init` returns the rules files with a short section that points agents at the server.

## Under the hood

- One manifest, `@stanvision/atomus-manifest`, generated from the TypeScript source, the Code Connect files, the guidelines and the token files. The server, the lint rules and the docs read the same data.
- The tool descriptions are imperative ("CALL THIS FIRST", "REQUIRED FINAL STEP") so agents call them at the right moment.
- The remote server is a Cloudflare Worker in stateless mode; `atomus_validate` runs the same ESLint rules there, and the CSS checks without Stylelint.
