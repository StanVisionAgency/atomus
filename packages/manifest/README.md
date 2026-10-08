# @stanvision/atomus-manifest

The Atomus design system as one JSON file, for tools and AI agents: every component (the 28 React exports of `@stanvision/atomus-react` **and** the Figma-only component sets), with props, enums, defaults, the Figma property each prop mirrors, Do / Don't / Forbidden rules, code examples, Figma node ids and Code Connect mappings, accessibility notes and related components. Plus the tokens: semantic colours by intent with Light and Dark values and descriptions, spacing, radius, shadows, text styles and the primitives agents must not use.

```bash
npm install @stanvision/atomus-manifest
```

```js
import manifest from '@stanvision/atomus-manifest' with { type: 'json' };

const button = manifest.components.find((c) => c.name === 'Button');
button.props.hierarchy.values; // ['primary', 'secondary', 'outline', 'tertiary', 'link']
manifest.components.filter((c) => c.status === 'figma-only').map((c) => c.name); // ['Featured icon', …, 'Drawer', …]
```

| Export | File |
|---|---|
| `@stanvision/atomus-manifest` | `atomus.manifest.json` |
| `@stanvision/atomus-manifest/schema` | `schemas/manifest.schema.json` (JSON Schema 2020-12) |
| `@stanvision/atomus-manifest/schemas/component.schema.json` | One component entry |

## Entry shape

`name`, `kind` (component · hook), `status` (stable · figma-only), `since`, `category`, `import`, `purpose`, `aliases`, `alternative` (what to use in code for Figma-only components), `native` (native attributes it accepts), `props` (`type`, `values`, `default`, `required`, `figma`, `notes`), `rules` (`do`, `dont`, `forbidden`), `examples`, `figma` (`componentSet`, `nodeIds`, `nodes[].mappings`, `codeConnect`, `properties`, `docs`), `docs`, `related`, `a11y`.

Figma node ids point to the original Atomus Figma file, which is sold separately and not covered by the MIT licence. Projects that use a copy of the file have their own ids.

## How it's built

`scripts/build-manifest.mjs` at the repo root generates the manifest from the single sources: the TypeScript in `react/src` (TypeScript compiler API), the Code Connect templates (`*.figma.ts`), `guidelines/components/*.md`, `guidelines/overview-components.md`, the docs component pages and the DTCG files in `tokens/`. It validates the result against the schema. Don't edit the JSON by hand.

In git the manifest lives in parts, so a change to one component is a small diff: `src/index.json`, `src/components/<name>.json` (one per component) and `src/tokens/<section>.json`. `scripts/assemble.mjs` joins them into `atomus.manifest.json` (gitignored; built by the generator, `npm run assemble` and `prepack`).

```bash
cd packages/manifest && npm install      # TypeScript, @types/react, Ajv
node ../../scripts/build-manifest.mjs     # write src/** and atomus.manifest.json
node ../../scripts/build-manifest.mjs --check   # CI: fail when src/ is stale
```

Used by `@stanvision/eslint-plugin-atomus`, `@stanvision/stylelint-config-atomus` and `@stanvision/atomus-mcp`. Docs: https://docs.atomus.io/ai/mcp/
