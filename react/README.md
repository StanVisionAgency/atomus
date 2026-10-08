# @stanvision/atomus-react

Atomus React components (MIT). Props mirror the Figma component properties (Hierarchy → `hierarchy`, Size → `size`, Style → `variant` …), so what designers set in Figma maps 1:1 to code.

## Install and use

```bash
npm install @stanvision/atomus-react
```

```tsx
import '@stanvision/atomus-react/atomus.css';   // tokens: colours, spacing, type, themes
import '@stanvision/atomus-react/styles.css';   // component styles
import { Button, Input, Card } from '@stanvision/atomus-react';

export function Invite() {
  return (
    <Card title="Invite people" footer={<Button hierarchy="primary">Send invite</Button>}>
      <Input label="Email" placeholder="you@company.com" />
    </Card>
  );
}
```

Theme with attributes on any element: `data-theme="dark"`, `data-brand="violet"`, `data-radius="round"`.

## Components

| Component | Figma component | Key props |
|---|---|---|
| `Button` | Button | `hierarchy` primary · secondary · outline · tertiary · link, `size` xs–xl, `iconLeading`, `iconTrailing`, `loading`, `iconOnly` |
| `Badge` | Badge | `color`, `variant` light · solid, `size` sm–lg, `dot`, `icon`, `onClose` |
| `Tag` | Tag | `size` sm–lg, `icon`, `onRemove` |
| `Input` | Input | `label`, `hint`, `error`, `size` sm · md · lg, `iconLeading`, `iconTrailing` |
| `Checkbox` | Checkbox | `label`, `description`, `size` sm · md, `indeterminate` |
| `Radio` | Radio | `label`, `description`, `size` sm · md |
| `Toggle` | Toggle | `label`, `description`, `size` sm · md, `shape` pill · square |
| `Avatar` | Avatar | `name`, `src`, `initials`, `icon`, `size` xs–2xl, `shape`, `status` |
| `Alert` | Alert | `color`, `variant` subtle · outline, `title`, `actions`, `onClose` |
| `Card` | Card | `title`, `supportingText`, `headerAction`, `footer`, `variant` outlined · elevated · filled, `padding` md · lg |
| `Tabs` | Tabs | `items`, `variant` underline · pill · segmented, `value`/`defaultValue`, `onChange` |
| `ProgressBar` | Progress bar | `value`, `label`, `labelPosition` none · right · bottom |
| `MetricCard` | Metric card | `label`, `value`, `type` simple · trend · chart, `change`, `caption`, `data` |
| `EmptyState` | Empty state | `title`, `description`, `icon`, `actions`, `size` sm · md |
| `Select` | Select + Dropdown menu | `options`, `value`/`onChange`, `label`, `hint`, `error`, `size` sm · md · lg |
| `DropdownMenu`, `MenuItem` | Dropdown menu, Menu item | `trigger`, `items` (item · separator · heading), `align`, `size` |
| `Modal` | Modal | `open`, `onClose`, `title`, `description`, `actions`, `featuredIcon`, `size` sm · md · lg, `type` |
| `Toast`, `ToastProvider`, `useToast` | Toast | `color`, `title`, `description`, `action`, `duration` |
| `Table` | Table header cell, Table cell | `columns`, `rows`, `rowKey`, `size` sm · md, `selectable`, `caption`, `empty` |
| `DatePicker`, `Calendar` | Date input, Date picker, Calendar day | `type` single · range, `value`/`range`, `min`, `max`, `locale` |
| `AppHeader`, `SidebarNavigation`, `NavItem` | App header, Sidebar navigation, Nav item | `brand`, `nav`, `actions` · `header`, `footer`, `collapsed` · `label`, `icon`, `badge`, `active` |

## Scripts

| Script | What it does |
|---|---|
| `npm run build` | Builds `dist/` (ESM, CJS, types) and copies `styles.css` + `atomus.css` |
| `npm run typecheck` | TypeScript check of the components and the Code Connect templates |
| `npm run build:docs` | Rebuilds `../docs-site/components/bundle.js` and `bundle.css` from this source, so the docs site always shows the real components |
| `npm run figma:check` | Parses the Code Connect templates and renders each one against mocked Figma instances (no token needed) |
| `npm run figma:publish` | Publishes Code Connect to the Atomus Figma file |
| `npm run figma:connect-client -- <url>` | Writes `figma.client.config.json` for a client's copy of the Figma file (see below) |
| `npm run figma:publish:client` | Publishes Code Connect to that client file |

## Code Connect

`src/components/*.figma.ts` are Code Connect **template files** (Figma retired the parser-based `.figma.tsx` format on 17 August 2026). They map 27 Figma components to the React components: variants, booleans, text and instance swaps. Nested content flows through from the instance. For example, the buttons in a Card footer, a Modal's actions or an Alert's actions render from the actual Button instances, the Content slots render as slots, Tabs build `items` from their Tab layers, and a Dropdown menu builds `items` from the Menu items in its slot. Figma's "Button icon" maps to `<Button iconOnly>`.

```bash
npm run figma:check     # parse + render every template, no Figma token needed
```

Publishing needs a **Dev or Full seat on a Figma Organization or Enterprise plan** and a token with the Code Connect write scope:

```bash
FIGMA_ACCESS_TOKEN=<token> npm run figma:publish
```

On every push to `main` that changes a template, `.github/workflows/code-connect.yml` publishes automatically. It needs the repository secret `FIGMA_ACCESS_TOKEN`.

### Client copies of the Figma file

Teams that duplicate the Atomus Figma file into their own workspace can publish the same snippets to their copy. Duplicated files keep their node IDs, so only the file key changes:

```bash
npm run figma:connect-client -- https://www.figma.com/design/<clientFileKey>/<name>
FIGMA_ACCESS_TOKEN=<token for the client org> npm run figma:publish:client
```

The first command writes `figma.client.config.json` (git-ignored) from `figma.client.config.template.json`. It adds a `documentUrlSubstitutions` entry that rewrites the master file key `bC42e82J3PYg2LMkryodIA` to the client's key in every template URL. The templates themselves stay unchanged.

## Licence

MIT (see `LICENSE` at the repo root). The Atomus Figma file is not covered by the MIT licence; it is sold separately at [stanvision.gumroad.com/l/atomus-design-system](https://stanvision.gumroad.com/l/atomus-design-system). See `NOTICE`.

## Icons

Components take icons as React nodes. Use the Atomus icon set (Font Awesome names) or Font Awesome itself; `Icon` ships only the few glyphs the components need internally.
