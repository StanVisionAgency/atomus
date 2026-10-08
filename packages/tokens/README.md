# @stanvision/atomus-tokens

The Atomus design tokens as one MIT-licensed package: DTCG JSON with a 2025.10 resolver, CSS custom properties, and Tailwind CSS v4 and shadcn/ui presets. Every semantic token carries a `$description` that says when to use it (and when not to), so AI agents and humans pick the right one.

```bash
npm install @stanvision/atomus-tokens
```

| Import | What you get |
|---|---|
| `@stanvision/atomus-tokens/css` | `atomus.css`: all tokens as CSS variables, with themes, brands, radius modes and breakpoints |
| `@stanvision/atomus-tokens/tailwind` | Tailwind v4 theme (`@theme`) on top of `atomus.css` |
| `@stanvision/atomus-tokens/shadcn` | shadcn/ui variables mapped to Atomus semantic tokens |
| `@stanvision/atomus-tokens/resolver` | `atomus.resolver.json`, the DTCG 2025.10 resolver (theme, brand, radius, breakpoint) |
| `@stanvision/atomus-tokens/tokens/<file>` | Any token file, e.g. `tokens/color.light.tokens.json` |

```css
/* Plain CSS */
@import "@stanvision/atomus-tokens/css";

/* Tailwind v4 */
@import "tailwindcss";
@import "@stanvision/atomus-tokens/tailwind";

/* shadcn/ui (after @import "tailwindcss") */
@import "@stanvision/atomus-tokens/shadcn";
```

Switch modes with attributes on any element: `data-theme="dark"`, `data-brand="violet"`, `data-radius="round"` or `"sharp"`.

## Resolver

`tokens/atomus.resolver.json` follows the [DTCG 2025.10 resolver module](https://www.designtokens.org/tr/2025.10/resolver/). Its modifiers are `theme` (light, dark), `brand` (atomus, violet), `radius` (default, round, sharp) and `breakpoint` (desktop, tablet, mobile). The defaults match `atomus.css` `:root`. It works with resolver-aware tools such as [Terrazzo](https://terrazzo.app/docs/guides/resolvers):

```js
// terrazzo.config.js
export default { tokens: ['./node_modules/@stanvision/atomus-tokens/tokens/atomus.resolver.json'] };
```

`tokens/$themes.json` is a Tokens Studio theme map, kept for Tokens Studio users. It is not a DTCG file.

## Source

This package is built from `/tokens`, `/css`, `/tailwind` and `/shadcn` in the [Atomus repo](https://github.com/StanVisionAgency/atomus). `npm run build` copies them in; edit the originals, not the copies.

## Licence

The code is MIT-licensed (see LICENSE). The Atomus Figma file is not covered by that licence. It is sold separately at [stanvision.gumroad.com/l/atomus-design-system](https://stanvision.gumroad.com/l/atomus-design-system); see NOTICE.
