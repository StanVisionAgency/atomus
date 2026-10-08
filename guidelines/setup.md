# Setup

How to add Atomus to a project. Follow it exactly. Every step exists for a reason, and the last section lists what you must not configure.

## Install

```bash
npm install @stanvision/atomus-react @stanvision/atomus-tokens
```

Both packages are MIT-licensed. **They are not on npm yet (publishing soon).** Until then:

- **Tokens:** copy `css/atomus.css` (plain CSS), `tailwind/atomus.tailwind.css` or `shadcn/globals.css` from https://github.com/StanVisionAgency/atomus.
- **React:** clone the repo, run `cd react && npm install && npm run build`, then `npm install ../atomus/react` in your app.

React 18 or newer is a peer dependency. The components have no other runtime dependencies.

## Import the CSS once, at the app root

Pick **one** of these token setups.

**Plain CSS** (any stack):

```ts
import '@stanvision/atomus-tokens/css';        // tokens, themes, breakpoints and text-style classes
import '@stanvision/atomus-react/styles.css';  // component styles (only if you use the React components)
```

**Tailwind CSS v4**: the theme imports the tokens itself:

```css
@import "tailwindcss";
@import "@stanvision/atomus-tokens/tailwind";
```

```ts
import '@stanvision/atomus-react/styles.css';
```

**shadcn/ui**: maps `--background`, `--primary`, `--ring`, `--chart-*` and `--sidebar-*` to Atomus tokens:

```css
@import "tailwindcss";
@import "@stanvision/atomus-tokens/shadcn";
```

Raw DTCG token files are at `@stanvision/atomus-tokens/tokens/*` (for Style Dictionary, Terrazzo or Tokens Studio).

Load the token CSS before `styles.css`. Use either the Atomus Tailwind theme or the shadcn theme in one app, never both: both define `bg-primary` with different meanings.

## Theme attributes

Atomus themes with three HTML attributes. They work on any element and nest, so an attribute on a section re-themes everything inside it.

| Attribute | Values | Default | Figma collection |
|---|---|---|---|
| `data-theme` | `light` · `dark` · `system` | light | Color (Light · Dark) |
| `data-brand` | `violet` or your brand name | Atomus blue (omit the attribute) | Brand |
| `data-radius` | `default` · `sharp` · `round` | default | Radius |

```html
<html data-theme="system">           <!-- follows the OS setting -->
<body data-brand="violet">
<section data-radius="round">
```

The `.dark` class also switches to dark (for libraries that toggle a class). Tailwind's `dark:` variant works with both.

**Breakpoints are automatic.** Layout spacing, container padding and headline sizes change with media queries: Desktop ≥ 1024px, Tablet 768–1023px, Mobile < 768px. You don't set an attribute for them.

## Add a client brand

1. In CSS, copy the `[data-brand="violet"]` block from the token CSS, rename it (`[data-brand="acme"]`) and point `--color-brand-25 … 950` at the client ramp.
2. In Figma, add a mode to the **Brand** collection and point `brand-25 … brand-950` at the same ramp.

A new brand block is a token change, so a person must review it (see `AGENTS.md`).

## Fonts

| Role | Family | Token |
|---|---|---|
| Headlines | Inter Display | `--font-family-title` |
| Body and UI | Inter | `--font-family-body`, `--font-family-component` |
| Code | Roboto Mono | via `.text-components-code` |

Load them yourself; the CSS does not fetch fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..700&family=Roboto+Mono:wght@400;500&display=swap">
```

Inter's optical-size axis covers the display cut. To match Figma exactly, self-host Inter Display from https://rsms.me/inter/.

Set type with the text-style classes (`.text-headline-h2`, `.text-content-body`, `.text-web-heading-lg` …) or the matching tokens. Don't set font sizes by hand.

## Use a component

```tsx
import { Button, Card, Input } from '@stanvision/atomus-react';

export function Invite() {
  return (
    <Card
      title="Invite people"
      footer={<><Button hierarchy="outline">Cancel</Button><Button hierarchy="primary">Send invite</Button></>}
    >
      <Input label="Email" type="email" placeholder="you@company.com" />
    </Card>
  );
}
```

For toasts, wrap the app once in `<ToastProvider>` and call `useToast().show({ title })`.

## Don't configure

- **Don't** redefine or override token values (`:root { --color-text-primary: … }`) to restyle the app. Switch `data-theme`, `data-brand` or `data-radius` instead.
- **Don't** add colours, spacing or radius values to the Tailwind theme, or extend it with raw hex. The Atomus theme is complete.
- **Don't** load both the Atomus Tailwind theme and the shadcn theme.
- **Don't** add a CSS reset that changes `font-family`, `box-sizing` or focus outlines on Atomus components.
- **Don't** wrap Atomus components to change their look. Pick a variant prop, or compose.
- **Don't** set `data-theme` on many small elements to fake contrast. Use the semantic token for the job (`bg-inverse`, `text-inverse`).
- **Don't** copy component CSS into your app; import `styles.css` so updates arrive.
