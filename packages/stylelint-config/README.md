# @stanvision/stylelint-config-atomus

Stylelint config and plugin rules for CSS that uses Atomus tokens.

```bash
npm install -D stylelint @stanvision/stylelint-config-atomus
```

```js
// stylelint.config.js
export default { extends: ['@stanvision/stylelint-config-atomus'] };
```

| Rule | What it reports | Fix |
|---|---|---|
| `atomus/no-raw-color` | Hex, `rgb()`, `hsl()`, `oklch()` and named colours, except in token definitions (custom properties named `--color-*`, `--spacing-*` …, e.g. a `[data-brand]` block) | — |
| `atomus/no-primitive-token` | `var(--color-gray-500)` and other primitives outside token definitions | — |
| `atomus/use-tokens` | `margin`, `padding`, `gap`, `border-radius` and pure colour properties whose values aren't `var(--…)` tokens, `calc()` with tokens, `0`, `auto` or a CSS keyword. `50%` radii and CSS system colours inside `@media (forced-colors: active)` are allowed | autofix when a px value equals a spacing token (`16px` → `var(--spacing-xl)`) |

Options (second argument of each rule): `tokenDefinitions` (regexes of custom properties that may hold raw values), `allow` (regexes of extra allowed values). Token files themselves (`atomus.css`, a shadcn theme) belong in `ignoreFiles`.

### SARIF

```bash
npx stylelint "src/**/*.css" --custom-formatter @stanvision/stylelint-config-atomus/sarif-formatter --output-file atomus-stylelint.sarif
```

`@stanvision/stylelint-config-atomus/core` exposes the checks without Stylelint (`checkDeclaration(prop, value)`), used by the Atomus MCP server's remote worker. Docs: https://docs.atomus.io/ai/lint/
