# Atomus agent skills

[Agent Skills](https://agentskills.io/) that teach coding agents (Claude Code, Cursor, Copilot, Codex and other skills-compatible agents) to build UI with Atomus.

| Skill | What it does |
|---|---|
| [`atomus/`](atomus/SKILL.md) | Builds product UI and marketing pages with `@stanvision/atomus-react` and `@stanvision/atomus-tokens`: picks components with decision trees, uses only real props, styles with semantic tokens, follows the Figma MCP workflow, and validates the result. |

## Install

With the [skills CLI](https://github.com/vercel-labs/skills), which works for most agents:

```bash
npx skills add StanVisionAgency/atomus
```

By hand, for Claude Code (all projects):

```bash
git clone --depth 1 https://github.com/StanVisionAgency/atomus.git /tmp/atomus
mkdir -p ~/.claude/skills && cp -R /tmp/atomus/skills/atomus ~/.claude/skills/
```

For one project only, copy it to `.claude/skills/atomus` in that repo and commit it. Update by repeating the copy.

The agent loads the skill when a task involves Atomus (the `description` in `SKILL.md` says when). You can also ask for it directly: "use the atomus skill".

## What's inside

```
atomus/
  SKILL.md                 workflow, setup, core rules and forbidden list
  references/
    components.md          catalogue, other names, decision trees, full React API
    tokens.md              semantic tokens by intent with Light/Dark values
    patterns.md            app shell, dashboard, settings, auth, table view, website sections
    figma.md               the Figma file, modes, slots, Code Connect, Figma MCP rules
    react-api.json         machine-readable props and enums (for the validator)
    tokens.json            semantic and primitive token names (for the validator)
  scripts/
    validate.mjs           flags raw colours, primitive tokens, unknown exports, props and values
```

The validator needs only Node 18+:

```bash
node ~/.claude/skills/atomus/scripts/validate.mjs src/            # a folder or files
node ~/.claude/skills/atomus/scripts/validate.mjs src/App.tsx --json
```

It exits with 1 when it finds errors, so it can run in CI or a pre-commit hook.

## Keeping it in sync (maintainers)

Most of the skill is generated from the repo's single sources. After changing `react/src`, `tokens/` or `guidelines/`, run:

```bash
node scripts/build-skill.mjs          # regenerates references/*, the rules in SKILL.md and the React API sections in guidelines/
node scripts/build-skill.mjs --check  # fails if anything is stale
```

Edit `SKILL.md` outside the `core-rules` markers, `references/patterns.md`, and `references/figma.md` outside the `figma-mcp-rules` markers by hand.
