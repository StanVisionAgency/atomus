# @stanvision/atomus-react

Atomus 4.0 React components. Props mirror the Figma component properties (Hierarchy → `hierarchy`, Size → `size`, Style → `variant` …), so what designers set in Figma maps 1:1 to code.

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
| `npm run typecheck` | TypeScript check |
| `npm run build:docs` | Rebuilds `../docs-site/components/bundle.js` and `bundle.css` from this source, so the docs site always shows the real components |
| `npm run figma:publish` | Publishes Code Connect (see below) |

## Code Connect

`src/components/*.figma.tsx` map all 21 components to its Figma component set in the Atomus 4.0 file, including variant, boolean, text and instance-swap properties. `npx figma connect parse` validates them.

Publishing needs a **Dev or Full seat on a Figma Organization or Enterprise plan**:

```bash
FIGMA_ACCESS_TOKEN=<token with Code Connect write scope> npm run figma:publish
```

Once published, Dev Mode shows the real React snippet (with `@stanvision/atomus-react` imports) for each selected instance.

Note: Figma now recommends Code Connect *template files* over the parser-based `.figma.tsx` files used here; they still parse with CLI 1.5, and Figma's templates migration guide covers the switch.

## Icons

Components take icons as React nodes. Use the Atomus icon set (Font Awesome names) or Font Awesome itself; `Icon` ships only the few glyphs the components need internally.
