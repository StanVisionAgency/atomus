---
title: Agent compatibility (evals)
description: How Atomus measures whether coding agents build correct Atomus UI — 50 prompts, six deterministic scorers (imports, props, lint, axe, inline styles and raw colours, expectations), with and without the Atomus skill and MCP server.
---

Atomus claims that agents with the skill and the [MCP server](/ai/mcp/) pick the right component, use only real props and tokens, and ship accessible UI. The evals turn that claim into numbers: a fixed set of prompts, deterministic scorers and a scorecard per agent and setup. They live in [`evals/`](https://github.com/StanVisionAgency/atomus/tree/main/evals) in the repo.

## Method

**Prompts.** 50 tasks, each with expectations in `evals/prompts/<id>.yaml`:

| Category | Prompts | Examples |
| --- | --- | --- |
| Components | 35 | Button, Input, Select, Checkbox, Toggle and Radio, Modal, Table, Tabs, Alert, Badge and Tag, Card (3 each), plus Toast, Dropdown menu, Empty state, Metric card, Sidebar navigation |
| App screens | 5 | Dashboard, settings, sign-in, users list, billing |
| Website pages | 5 | Landing page, pricing, contact, blog index, newsletter section |
| AI chat UIs | 5 | Basic chat, welcome state, agent with tool calls, approval, cited answer |

**Setups.** Each agent runs every prompt twice, in a fresh empty workspace:

- **atomus**: the [Atomus skill](/ai/coding-agents/) and the Atomus MCP server are installed;
- **baseline**: neither. The agent only gets the package names in the instruction.

The instruction is the same for every agent: build the task with `@stanvision/atomus-react` and `@stanvision/atomus-tokens`, and reply with one TSX file (a default-exported component, no required props) and optional CSS.

**Scorers.** Six deterministic checks, no LLM judge. Each gives a score from 0 to 1 and a list of issues; a prompt is **clean** when no scorer reports an error.

| Scorer | Checks |
| --- | --- |
| Import match | Imports come from `@stanvision/atomus-react` (real exports, no deep imports, no Figma-only components) and the tokens package; no other UI kit; the expected components are imported. |
| Props and enums | Every prop on an Atomus component exists and every enum value is allowed, checked against the [component manifest](/ai/mcp/) with the `valid-props` [lint rule](/ai/lint/). |
| Lint | The Atomus ESLint rules on the TSX and the Atomus Stylelint config on the CSS: raw colours, primitive tokens, arbitrary values, raw controls, unlabelled icon buttons, extra primary buttons. |
| Accessibility | The output is server-rendered with React, hydrated in Chromium with the Atomus CSS, and checked with axe-core (WCAG 2.2 A and AA) in Light and Dark. An output that doesn't build or render scores 0. |
| Inline styles and raw colours | `style={…}` attributes and hex, `rgb()` or `hsl()` colours in the code and CSS. |
| Expectations | The prompt's own checks: components rendered, prop values, at most one primary button, raw HTML elements an Atomus component replaces, required text. |

The scorers are tested against six hand-written outputs (three good, three bad) in `evals/fixtures/`, so a scorer change that stops catching a known mistake fails CI.

## How to run

```bash
cd evals
npm install && npm run setup
npm test                                                     # scorers against the fixtures
npm run generate -- --agent claude-code --variant atomus     # claude -p with the skill and MCP server
npm run generate -- --agent claude-code --variant baseline   # without them
npm run score -- runs/claude-code-atomus-2026-10-08          # writes scorecard.json + scorecard.md
```

Other CLI agents work through `--agent command --cmd '…{prompt_file}…'`. Cursor and GitHub Copilot have no batch mode: `--agent manual` writes the 50 instructions to paste one by one, and you save each reply as `<prompt-id>.tsx` in the run folder. The [README](https://github.com/StanVisionAgency/atomus/blob/main/evals/README.md) has the details. In CI, the **Evals** workflow runs on demand only.

## Scorecard format

Each run folder gets `scorecard.json` and `scorecard.md`:

- **Totals**: overall score (mean of all prompts), prompts clean, errors and warnings, axe violations, inline styles, raw colours, missing outputs.
- **By scorer** and **by category**: mean scores.
- **Per prompt**: the six scores and every issue with its line, so a low score points at the exact mistake.

The JSON carries the agent, setup, model and date of the run, and a scorecard version; scores from different versions are not compared.

## Results

| Agent | Setup | Model | Overall | Clean prompts | Date |
| --- | --- | --- | --- | --- | --- |
| Claude Code | atomus | — | Coming with the first run | — | — |
| Claude Code | baseline | — | Coming with the first run | — | — |
| Cursor | atomus | — | Coming with the first run | — | — |
| GitHub Copilot | atomus | — | Coming with the first run | — | — |

Results are published here with the run folder in the repo, so anyone can rescore them.
