# Atomus patterns

Screen recipes built only from Atomus components and tokens. Copy the structure, then change the content. Every prop used here is in `components.md`; every colour, gap and size is a token. Icons (`<PlusIcon />` …) come from the project's icon library. Atomus icon names follow Font Awesome.

Shared layout CSS for the patterns:

```css
.app-shell { display: grid; grid-template-columns: auto minmax(0, 1fr); min-height: 100dvh; background: var(--color-bg-secondary); color: var(--color-text-primary); }
.app-main { display: flex; flex-direction: column; gap: var(--layout-xs); padding: var(--layout-xs); min-width: 0; }
.page-header { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: var(--spacing-xl); }
.page-header__desc { color: var(--color-text-tertiary); margin-top: var(--spacing-xs); }
.page-header__actions, .toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: var(--spacing-lg); }
.grid { display: grid; gap: var(--spacing-3xl); }
.grid--metrics { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.stack { display: flex; flex-direction: column; gap: var(--spacing-xl); }
@media (max-width: 767px) { .app-shell { grid-template-columns: minmax(0, 1fr); } }
```

## App shell

Sidebar navigation on the left and the page on a `bg-secondary` canvas. Put one Page header at the top of each page.

```tsx
import { SidebarNavigation, NavItem, Avatar, Button } from '@stanvision/atomus-react';

export function AppShell({ children, path }: { children: React.ReactNode; path: string }) {
  return (
    <div className="app-shell">
      <SidebarNavigation
        aria-label="Main"
        header={<Logo />}
        footer={<NavItem href="/account" label="Ada Lovelace" icon={<Avatar name="Ada Lovelace" size="xs" />} />}
      >
        <NavItem href="/" label="Dashboard" icon={<HomeIcon />} active={path === '/'} />
        <NavItem href="/projects" label="Projects" icon={<FolderIcon />} badge="12" active={path.startsWith('/projects')} />
        <NavItem href="/settings" label="Settings" icon={<GearIcon />} active={path.startsWith('/settings')} />
      </SidebarNavigation>
      <main className="app-main">{children}</main>
    </div>
  );
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <header className="page-header">
      <div>
        <h1 className="text-headline-h5">{title}</h1>
        {description ? <p className="text-content-small page-header__desc">{description}</p> : null}
      </div>
      {actions ? <div className="page-header__actions">{actions}</div> : null}
    </header>
  );
}
```

- Use 5–8 top-level items and mark the current page with `active`. Use `collapsed` for a 72px rail on small screens.
- For apps without a sidebar use `AppHeader` (`brand`, `nav`, `actions`).
- Wrap the app once in `<ToastProvider>` so any page can call `useToast().show(…)`.

## Dashboard

Page header, up to four Metric cards, then Cards for charts and recent records.

```tsx
import { Button, Card, MetricCard, Table, Badge, Tabs } from '@stanvision/atomus-react';

export function Dashboard() {
  return (
    <>
      <PageHeader
        title="Overview"
        description="Last 30 days across all workspaces."
        actions={<><Button hierarchy="outline">Export</Button><Button hierarchy="primary" iconLeading={<PlusIcon />}>New report</Button></>}
      />
      <div className="grid grid--metrics">
        <MetricCard label="Revenue" value="$48.2k" change="12%" caption="vs last month" />
        <MetricCard label="Active users" value="2,340" change="4.1%" caption="vs last month" />
        <MetricCard label="Churn" value="1.8%" change="-0.4%" caption="vs last month" />
        <MetricCard label="Sessions" value="18.9k" type="chart" data={[4, 6, 5, 8, 7, 9, 12]} change="9%" caption="vs last month" />
      </div>
      <Card title="Revenue" supportingText="Monthly, in USD" headerAction={<Tabs variant="segmented" aria-label="Range" items={[{ value: '30d', label: '30 days' }, { value: '12m', label: '12 months' }]} />}>
        <RevenueChart />
      </Card>
      <Card title="Recent invoices" footer={<Button hierarchy="link">View all invoices</Button>}>
        <Table
          caption="Recent invoices"
          rowKey={(r) => r.id}
          columns={[
            { key: 'customer', header: 'Customer' },
            { key: 'status', header: 'Status', render: (r) => <Badge color={r.paid ? 'success' : 'warning'}>{r.paid ? 'Paid' : 'Due'}</Badge> },
            { key: 'amount', header: 'Amount', align: 'end', sortable: true },
          ]}
          rows={invoices}
        />
      </Card>
    </>
  );
}
```

- Keep metric cards to four per row with one comparison period. Units belong in the value.
- Colour the key chart series with `--color-fg-brand`, comparisons with `--color-fg-tertiary` and grid lines with `--color-border-secondary`.

## Settings

Page header, then one Card per group. Toggles apply immediately; forms with fields get a footer with Cancel and one primary Save.

```tsx
import { Button, Card, Input, Select, Toggle, Modal, Alert } from '@stanvision/atomus-react';

export function Settings() {
  const [confirm, setConfirm] = useState(false);
  return (
    <>
      <PageHeader title="Settings" description="Manage your workspace." />
      <Card
        title="Profile"
        supportingText="Shown to people in your workspace."
        footer={<><Button hierarchy="outline">Cancel</Button><Button hierarchy="primary" type="submit" form="profile">Save changes</Button></>}
      >
        <form id="profile" className="stack">
          <Input label="Full name" name="name" autoComplete="name" />
          <Input label="Email" name="email" type="email" hint="We send receipts here." />
          <Select label="Time zone" name="tz" options={[{ value: 'utc', label: 'UTC' }, { value: 'cet', label: 'Central European Time' }]} />
        </form>
      </Card>
      <Card title="Notifications">
        <div className="stack">
          <Toggle label="Email notifications" description="A summary of activity, once a day." defaultChecked />
          <Toggle label="Product updates" />
        </div>
      </Card>
      <Card title="Delete workspace" footer={<Button hierarchy="outline" onClick={() => setConfirm(true)}>Delete workspace</Button>}>
        <Alert color="warning" size="sm" title="This can’t be undone">All projects and files are removed for everyone.</Alert>
      </Card>
      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        type="destructive"
        featuredIcon
        title="Delete workspace?"
        description="All projects and files are removed for everyone. You can’t undo this."
        actions={<><Button hierarchy="outline" onClick={() => setConfirm(false)}>Cancel</Button><Button hierarchy="primary">Delete workspace</Button></>}
      />
    </>
  );
}
```

- The settings page has one primary (Save), and the confirmation Modal is its own view with its own primary.
- For many settings sections, add sub-navigation: a list of `NavItem`s (Vertical tabs in Figma) or `Tabs variant="underline"` under the Page header.

## Auth (log in, sign up)

A centred card on `bg-secondary`. One primary button, full width.

```tsx
import { Button, Card, Input, Checkbox } from '@stanvision/atomus-react';

export function LogIn() {
  return (
    <main className="auth">
      <Card variant="elevated" padding="lg" title="Log in to Acme" supportingText="Welcome back. Enter your details.">
        <form className="stack">
          <Input label="Email" name="email" type="email" autoComplete="email" required />
          <Input label="Password" name="password" type="password" autoComplete="current-password" required />
          <div className="auth__row">
            <Checkbox label="Remember me" name="remember" />
            <a className="text-content-small auth__link" href="/forgot">Forgot password?</a>
          </div>
          <Button hierarchy="primary" size="lg" type="submit" fullWidth>Log in</Button>
        </form>
      </Card>
    </main>
  );
}
```

```css
.auth { min-height: 100dvh; display: grid; place-items: center; padding: var(--layout-xs); background: var(--color-bg-secondary); }
.auth > * { width: min(100%, 400px); }
.auth__row { display: flex; align-items: center; justify-content: space-between; gap: var(--spacing-xl); }
.auth__link { color: var(--color-text-link); }
```

- Show field errors with the `error` prop on the Input, not with an Alert. Use an Alert only for form-level problems ("Too many attempts").
- Marketing sites use the **Auth section** (Log in, Sign up, Forgot password, Verification).

## Table view

Page header → filter bar → Table in a Card → pagination. An Empty state replaces the rows when there are none.

```tsx
import { Button, Card, Input, Select, Table, Badge, Avatar, EmptyState, DropdownMenu } from '@stanvision/atomus-react';

export function Projects({ rows }: { rows: Project[] }) {
  return (
    <>
      <PageHeader title="Projects" actions={<Button hierarchy="primary" iconLeading={<PlusIcon />}>New project</Button>} />
      <Card padding="md" footer={<Pagination />}>
        <div className="toolbar">
          <Input aria-label="Search projects" placeholder="Search" iconLeading={<SearchIcon />} size="sm" />
          <Select label="Status" size="sm" options={[{ value: 'all', label: 'All statuses' }, { value: 'active', label: 'Active' }, { value: 'archived', label: 'Archived' }]} defaultValue="all" />
        </div>
        <Table
          caption="Projects"
          selectable
          rowKey={(r) => r.id}
          rows={rows}
          columns={[
            { key: 'name', header: 'Project', sortable: true, supporting: (r) => r.client },
            { key: 'owner', header: 'Owner', render: (r) => <Avatar name={r.owner} size="sm" /> },
            { key: 'status', header: 'Status', render: (r) => <Badge color={r.active ? 'success' : 'gray'} dot>{r.active ? 'Active' : 'Archived'}</Badge> },
            { key: 'updated', header: 'Updated', align: 'end', sortable: true },
            { key: 'menu', header: '', align: 'end', render: () => (
              <DropdownMenu
                label="Project actions"
                align="end"
                trigger={<Button hierarchy="tertiary" size="sm" iconOnly aria-label="Project actions" iconLeading={<EllipsisIcon />} />}
                items={[{ label: 'Rename' }, { label: 'Duplicate' }, { type: 'separator' }, { label: 'Delete', destructive: true }]}
              />
            ) },
          ]}
          empty={<EmptyState size="sm" title="No projects yet" description="Create a project to start tracking work." actions={<Button hierarchy="outline" iconLeading={<PlusIcon />}>New project</Button>} />}
        />
      </Card>
    </>
  );
}
```

- Right-align numbers and dates; keep 7–8 columns at most on desktop; truncate long text.
- Pagination is Figma-only. Compose it from `Button hierarchy="tertiary" size="sm"` items with "Previous" / "Next" and at most seven page numbers.
- One primary per view: the page header already has "New project", so the empty state inside the table uses an `outline` button. When an empty state replaces the whole page, it gets the primary instead.

## Website sections

Marketing pages are stacks of full-width sections: **Header navigation → Hero section → 2–4 content sections → CTA section → Footer**. All sections share the breakpoint tokens, so they reflow at 1024 and 768px.

```html
<body data-theme="light">
  <header class="site-header">…logo, links, <a class="at-btn at-btn--primary at-btn--md" href="/signup">Get started</a></header>
  <main>
    <section class="section section--hero">
      <div class="container">
        <p class="text-web-eyebrow eyebrow">New in 4.0</p>
        <h1 class="text-web-display">One design system for product and web</h1>
        <p class="text-web-body-lg lead">Figma, tokens and React components that share one set of names.</p>
        <div class="actions">
          <a class="at-btn at-btn--outline at-btn--lg" href="/docs">Read the docs</a>
          <a class="at-btn at-btn--primary at-btn--lg" href="/buy">Get Atomus</a>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <h2 class="text-web-heading-xl">Everything in one file</h2>
        <div class="features"><!-- 6 features: 3 / 2 / 1 columns --></div>
      </div>
    </section>
    <section class="section section--cta" data-theme="dark">…</section>
  </main>
  <footer class="site-footer">…</footer>
</body>
```

```css
.section { padding-block: var(--section-padding); background: var(--color-bg-primary); color: var(--color-text-primary); }
.container { max-width: var(--container-max-width); margin-inline: auto; padding-inline: var(--container-padding); box-sizing: content-box; display: flex; flex-direction: column; gap: var(--layout-xs); }
.eyebrow { color: var(--color-text-brand); }
.lead { color: var(--color-text-secondary); max-width: 640px; }
.actions { display: flex; flex-wrap: wrap; gap: var(--spacing-lg); }
.features { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--layout-xs); }
@media (max-width: 1023px) { .features { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 767px) { .features { grid-template-columns: 1fr; } }
```

- Sections available in Figma: Header navigation, Footer, Hero (Centered, Split image, Email capture), Features, Feature split, Bento, Logo cloud, Testimonial(s), Metrics, Pricing, FAQ, CTA, Newsletter, Blog, Team, Contact, Careers, Comparison table, Integrations, 404, Blog post content, Content, Press mentions, Legal content, Auth. See the live previews at https://docs.atomus.io/website-sections/.
- One primary call to action per section. The hero's primary and the header's "Get started" go to the same place.
- Use `text-web-*` classes on marketing pages and `text-headline-*` / `text-content-*` in product UI.
- A dark band (`data-theme="dark"` on the section) re-themes everything inside it. Don't hand-pick dark colours.
- Outside React, the component CSS classes (`at-btn at-btn--primary at-btn--lg`) give the same buttons. Use them only on links and buttons, with the same hierarchy rules.
