# @stanvision/eslint-plugin-atomus

ESLint 9 (flat config) rules that keep UI code on the Atomus design system: semantic tokens instead of raw colours and primitives, only real Atomus props and values, Atomus components instead of raw controls, labels on icon-only buttons and one primary button per view. The rules read the Atomus manifest, so they always match the components and tokens of the release.

```bash
npm install -D eslint @stanvision/eslint-plugin-atomus
```

```js
// eslint.config.js
import atomus from '@stanvision/eslint-plugin-atomus';
import tseslint from 'typescript-eslint'; // for .ts / .tsx

export default [
  ...tseslint.configs.recommended,
  atomus.configs.recommended, // or atomus.configs.strict
];
```

| Rule | What it reports | recommended | Fix |
|---|---|---|---|
| `atomus/no-raw-color` | Hex, `rgb()`, `hsl()` (and named colours in colour properties) in JSX `style`, SVG `fill`/`stroke`, class-name arbitrary values (`bg-[#fff]`) and CSS-in-JS (`styled`, `css`) | error | suggestions: semantic tokens with the same value |
| `atomus/no-primitive-token` | `var(--color-gray-500)`, `bg-gray-500` and other primitives where a semantic token exists | error | suggestions |
| `atomus/no-arbitrary-value` | Tailwind `[…]` values for spacing, radius and colour (`p-[16px]`, `rounded-[8px]`, `bg-[red]`) | warn | autofix for spacing with an exact token (`p-[16px]` → `p-xl`); suggestion for radius |
| `atomus/valid-props` | Imports that don't exist or are Figma-only, unknown props, invalid enum values, missing required props | error | autofix for wrong-case / Figma values (`"Primary"` → `"primary"`); suggestions for Figma property names (`Style` → `variant`) |
| `atomus/prefer-atomus-component` | Raw `<button>`, `<input>`, `<select>`, `<dialog>` in files that import Atomus | warn | — |
| `atomus/icon-only-needs-label` | `<Button iconOnly>` (or an icon with no text) without `aria-label` | error | — |
| `atomus/one-primary-per-view` | More than one `hierarchy="primary"` Button in a component (a `Modal` is its own view; exclusive branches of a conditional are fine) | warn | — |

`strict` sets every rule to `error`.

### Settings

```js
{ settings: { atomus: { packages: ['@stanvision/atomus-react', '@acme/ui'] } } }
```

`packages` lists the import sources treated as Atomus (default `@stanvision/atomus-react`). `manifest` replaces the bundled manifest.

### SARIF (GitHub code scanning)

```bash
npm install -D @microsoft/eslint-formatter-sarif
npx eslint src -f @microsoft/eslint-formatter-sarif -o atomus-eslint.sarif
```

Upload the file with `github/codeql-action/upload-sarif`. Docs: https://docs.atomus.io/ai/lint/

## Development

`npm test` copies the manifest into `data/` and runs the RuleTester suites. `npm run lint:repo` lints `react/src` with the strict config (`node scripts/lint-repo.mjs <paths> [--format sarif --output file]`).
