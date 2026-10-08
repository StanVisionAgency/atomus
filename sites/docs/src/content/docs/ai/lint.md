---
title: Lint rules (ESLint and Stylelint)
description: The Atomus ESLint plugin and Stylelint config catch raw colours, primitive tokens, arbitrary values, invented props, raw controls, unlabelled icon buttons and extra primary buttons — in the editor, in CI and in agent loops.
---

The Atomus rules are machine-checkable, so check them by machine. Two packages run them where code is written: in the editor, in CI and in the agent's own loop (the [MCP server's](/ai/mcp/) `atomus_validate` runs the same rules). Both read the Atomus manifest, so they know every component, prop, enum value and token of the release you install.

| Package | For |
|---|---|
| `@stanvision/eslint-plugin-atomus` | JSX, TSX, JS and CSS-in-JS: tokens, Tailwind classes, Atomus props and components |
| `@stanvision/stylelint-config-atomus` | CSS: tokens for colour, spacing and radius |

:::note[Publishing soon]
The packages publish to npm with `@stanvision/atomus-react`. Until then, use them from [`packages/`](https://github.com/StanVisionAgency/atomus/tree/main/packages) in the repo.
:::

## ESLint

ESLint 9 or newer, flat config.

```bash
npm install -D eslint @stanvision/eslint-plugin-atomus
```

```js
// eslint.config.js
import atomus from '@stanvision/eslint-plugin-atomus';
import tseslint from 'typescript-eslint'; // for .ts and .tsx

export default [
  ...tseslint.configs.recommended,
  atomus.configs.recommended, // or atomus.configs.strict: every rule an error
];
```

### no-raw-color

Hex, `rgb()`, `hsl()` and `oklch()` colours (and named colours in colour properties) in JSX `style`, SVG `fill` and `stroke`, Tailwind arbitrary values such as `bg-[#4057ff]`, and CSS-in-JS (`styled.div`, `css`). Custom-property definitions such as `--color-brand-600: #…` are token definitions and allowed. **Recommended: error.** Suggestions offer the semantic tokens with the same Light value, the ones that fit the property first (`fill` → foreground tokens).

```tsx
<p style={{ color: '#3f3f46' }}>            // ✗
<p style={{ color: 'var(--color-text-secondary)' }}>   // ✓
```

### no-primitive-token

Primitive tokens where a semantic token exists: `var(--color-gray-500)`, `--color-brand-600`, Tailwind `bg-gray-100`. **Recommended: error.** Suggestions: semantic tokens or utilities with the same value (`text-gray-500` → `text-tertiary`).

### no-arbitrary-value

Tailwind arbitrary values for spacing, radius and colour: `p-[16px]`, `gap-x-[24px]`, `rounded-[8px]`, `bg-[red]`, `[padding:10px]`. Values that use a token (`p-[var(--spacing-xl)]`) are fine; raw colours are left to `no-raw-color`. **Recommended: warn.** Autofix when a spacing value equals a spacing token (`p-[16px]` → `p-xl`); a suggestion for radius, because radius tokens follow the Radius mode.

### valid-props

Driven by the manifest: imports that `@stanvision/atomus-react` doesn't export (Figma-only components such as `Drawer` get a hint on what to use instead), unknown props, values outside a prop's enum, and missing required props. **Recommended: error.** Autofix for a wrong-case or Figma value (`hierarchy="Primary"` → `"primary"`); suggestions for Figma property names used as props (`Style` → `variant`) and for valid values.

```tsx
<Button hierarchy="danger">     // ✗ allowed: primary | secondary | outline | tertiary | link
<Button variant="ghost">        // ✗ <Button> has no prop "variant"
import { Drawer } from '@stanvision/atomus-react';   // ✗ Figma-only
```

### prefer-atomus-component

In files that import Atomus: raw `<button>`, `<input>` (text, checkbox, radio, date …), `<select>` and `<dialog>`. Use `Button`, `Input`, `Checkbox`, `Radio`, `Toggle`, `DatePicker`, `Select` and `Modal`. File, range, colour and hidden inputs are left alone (their Atomus components are Figma-only). **Recommended: warn.** Option: `{ allow: ['dialog'] }`.

### icon-only-needs-label

`<Button iconOnly>`, or a Button with only an icon, without `aria-label` or `aria-labelledby`. **Recommended: error.**

### one-primary-per-view

More than one `hierarchy="primary"` Button in one component. A `Modal` counts as its own view, and Buttons in the two branches of a conditional count once. **Recommended: warn.**

### Settings

```js
export default [
  atomus.configs.recommended,
  { settings: { atomus: { packages: ['@stanvision/atomus-react', '@acme/ui'] } } },
];
```

`packages` lists the import sources treated as Atomus (for a wrapper package that re-exports it).

## Stylelint

```bash
npm install -D stylelint @stanvision/stylelint-config-atomus
```

```js
// stylelint.config.js
export default {
  extends: ['@stanvision/stylelint-config-atomus'],
  ignoreFiles: ['src/styles/tokens.css'], // token files, if you keep any
};
```

### Stylelint: no-raw-color

`atomus/no-raw-color`: hex, `rgb()`, `hsl()`, `oklch()` and named colours anywhere except in token definitions (custom properties named `--color-*`, `--spacing-*` …, such as a `[data-brand="acme"]` block).

### Stylelint: no-primitive-token

`atomus/no-primitive-token`: `var(--color-gray-500)` and other primitives outside token definitions.

### Stylelint: use-tokens

`atomus/use-tokens`: `margin`, `padding`, `gap`, `border-radius` and colour properties must use `var(--…)` tokens, `calc()` with tokens, `0`, `auto` or a CSS keyword. `border-radius: 50%` and CSS system colours inside `@media (forced-colors: active)` are allowed. Autofix when a px value equals a spacing token: `padding: 16px` → `padding: var(--spacing-xl)`.

Both options take regexes: `tokenDefinitions` (custom properties that may hold raw values) and `allow` (extra allowed values).

## In CI, with SARIF

GitHub code scanning shows SARIF results inline on pull requests.

```bash
npm install -D @microsoft/eslint-formatter-sarif
npx eslint src -f @microsoft/eslint-formatter-sarif -o atomus-eslint.sarif
npx stylelint "src/**/*.css" --custom-formatter @stanvision/stylelint-config-atomus/sarif-formatter --output-file atomus-stylelint.sarif
```

```yaml
- uses: github/codeql-action/upload-sarif@v3
  if: always()
  with:
    sarif_file: atomus-eslint.sarif
```

## Ignoring a rule

Don't switch a rule off to make code pass. If a case is legitimate (a third-party embed that needs a raw colour, a forced-colors fallback), disable the one line with a comment that says why, and get it reviewed:

```tsx
// eslint-disable-next-line atomus/no-raw-color -- Stripe Elements needs a literal colour value
```

Disabling or weakening lint rules is one of the changes that always need human review. See the AI policy in `AGENTS.md`.
