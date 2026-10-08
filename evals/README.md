# Atomus evals — agent compatibility

How well do coding agents build UI with Atomus, with and without the Atomus skill and MCP server? This folder holds a fixed set of prompts, deterministic scorers and a runner that turns a folder of generated files into a scorecard. Roadmap item X7. Docs: https://docs.atomus.io/ai/evals/

## What's here

| Path | What it is |
| --- | --- |
| `prompts/*.yaml` | 50 prompts with expectations: 35 component tasks (Button, Input, Select, Checkbox/Toggle/Radio, Modal, Table, Tabs, Alert, Badge/Tag, Card, Toast, Dropdown menu, Empty state, Metric card, Sidebar), 5 app screens, 5 website pages, 5 AI chat UIs |
| `src/scorers/` | The six scorers (below) |
| `src/score.mjs`, `src/report.mjs` | Scores a run folder; JSON + Markdown scorecard |
| `src/adapters.mjs`, `scripts/generate.mjs` | Generates outputs with an agent CLI (`claude -p`), any other CLI (`--cmd`), or writes prompts to paste (Cursor, Copilot) |
| `fixtures/good`, `fixtures/bad` | Six hand-written outputs that prove the scorers work (`npm test`) |
| `runs/` | Generated outputs and scorecards, one folder per run |

## Scorers

Every scorer returns a score from 0 to 1 and a list of issues (error or warning). A prompt is **clean** when no scorer reports an error. The overall score of a prompt is the mean of the six.

| Scorer | What it checks | Score |
| --- | --- | --- |
| `imports` | Imports come from `@stanvision/atomus-react` (real exports only, no deep imports, no Figma-only names), tokens from `@stanvision/atomus-tokens`, no other UI kit (shadcn/ui, MUI, Chakra …), and the components the prompt expects are imported | −0.25 per problem, −0.5 per foreign UI kit, 0 without any Atomus import |
| `props` | Every prop on an Atomus component exists and every literal enum value is allowed — the Atomus manifest (`packages/manifest`) through the ESLint rule `valid-props` | 1 − invalid ÷ max(props written, 5) |
| `lint` | The Atomus ESLint rules (recommended config, `valid-props` excluded) on the TSX and the Atomus Stylelint config on the CSS | −0.2 per error, −0.05 per warning |
| `axe` | React SSR of the default export into a page with the Atomus CSS, hydrated in Chromium; axe-core WCAG 2.2 A/AA in Light and Dark | −0.4 critical, −0.25 serious, −0.1 moderate, −0.05 minor per rule; 0 if it doesn't build or render |
| `styles` | `style={…}` attributes, and hex / `rgb()` / `hsl()` colours in strings, class names and CSS | −0.1 per inline style, −0.2 per raw colour |
| `expectations` | The prompt's `expect:` block: components rendered, prop values, at most N primary buttons, raw HTML elements that should be Atomus components, required text and patterns | passed ÷ checks |

`@stanvision/atomus-react` resolves to `react/src`, so a run is always scored against the current source.

## Run it

```bash
cd evals
npm install
npm run setup          # installs packages/eslint-plugin and packages/stylelint-config, writes their manifest data
npm test               # the scorers against the fixtures (needs Chromium, see below)
npm run check:prompts  # every expected component and prop value is real
```

Chromium: the `axe` scorer uses Playwright. It picks `CHROMIUM_PATH` if set, then `/opt/pw-browsers`, then Playwright's own download (`npx playwright install chromium` on a fresh machine).

### Generate outputs

```bash
# Claude Code, with the Atomus skill (.claude/skills/atomus) and the Atomus MCP server (local packages/mcp build)
npm run generate -- --agent claude-code --variant atomus
# Claude Code without either: the agent only gets the package names from the instruction
npm run generate -- --agent claude-code --variant baseline
# Options: --ids a,b · --model <model> · --remote-mcp (use https://mcp.atomus.io/mcp) · --concurrency 2 · --force
```

Each prompt runs in a fresh, empty workspace, so the agent can't read this repo. The instruction is the same for every agent and variant (`src/adapters.mjs`): build the task with Atomus and reply with one `tsx` block (default export, no required props) and an optional `css` block. Outputs land in `runs/<agent>-<variant>-<date>/`.

Other CLIs: `npm run generate -- --agent command --name codex --cmd 'codex exec "$(cat {prompt_file})"'` (the reply is read from stdout).

**Cursor, GitHub Copilot and other editor agents** have no batch CLI. Run them by hand:

1. `npm run generate -- --agent manual --name cursor --variant atomus` writes one instruction per prompt to `runs/cursor-atomus-<date>/prompts/<id>.md`.
2. Set the agent up for the variant: for **atomus**, add the Atomus MCP server and the skill or `templates/consumer/AGENTS.atomus.md` rules (see docs.atomus.io/ai/coding-agents/); for **baseline**, neither.
3. For each prompt, open a new chat in an empty project, paste the instruction, and save the code block as `<id>.tsx` (and the CSS block as `<id>.css`) in the run folder. Note the model in `run.json`.

### Score a run

```bash
npm run score -- runs/claude-code-atomus-2026-10-08
```

Writes `scorecard.json` and `scorecard.md` into the run folder. Missing outputs count as 0.

## Scorecard format

`scorecard.json` (version 1):

```jsonc
{
  "version": 1, "run": "claude-code-atomus-2026-10-08",
  "agent": "claude-code", "variant": "atomus", "model": null, "date": "2026-10-08",   // from run.json
  "scoredAt": "…", "atomus": { "manifest": "4.1.0", "components": 42 },
  "totals": { "prompts": 50, "outputs": 50, "missing": 0, "passed": 41, "score": 0.93,
              "errors": 12, "warnings": 30, "inlineStyles": 3, "rawColors": 0, "axeViolations": 4 },
  "byScorer": { "imports": 0.98, "props": 0.95, "lint": 0.9, "axe": 0.92, "styles": 0.99, "expectations": 0.88 },
  "byCategory": { "component": { "prompts": 35, "score": 0.94, "passed": 30 }, "app-screen": { … }, … },
  "items": [{ "id": "button-save-cancel", "category": "component", "score": 1, "pass": true,
              "results": { "imports": { "score": 1, "issues": [], "stats": { … } }, … } }]
}
```

`scorecard.md` has the totals, the per-scorer and per-category tables, a row per prompt and every issue with its line.

## Adding a prompt

Add `prompts/<id>.yaml` (the id is the file name):

```yaml
id: modal-delete-confirm
category: component        # component | app-screen | website | ai-chat
prompt: >-
  A destructive confirmation dialog: "Delete project?" with a description, Cancel and Delete actions. Show it open.
expect:
  components: ["Modal", "Button"]                                  # imported and rendered
  props:
    - { component: "Modal", prop: "type", value: "destructive" }   # value is optional
  max_primary: 1                                                   # at most one <Button hierarchy="primary">
  forbid_elements: ["dialog"]                                      # raw elements an Atomus component replaces
  text: ["Delete project?"]                                        # case-insensitive
  patterns: ['role="log"']                                         # regular expressions
```

Run `npm run check:prompts`. Changing the prompts or the scoring makes earlier scorecards incomparable: bump `VERSION` in `src/score.mjs`.
