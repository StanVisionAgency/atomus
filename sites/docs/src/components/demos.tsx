// Live examples for docs.atomus.io. They import the real package source, so the docs always show the shipped components.
import { useState } from 'react';
import {
  Alert, Avatar, Badge, Button, Calendar, Card, Checkbox, DatePicker, DropdownMenu, EmptyState, Icon, Input, MetricCard,
  Modal, NavItem, ProgressBar, Radio, Select, SidebarNavigation, AppHeader, Table, Tabs, Tag, Toast, ToastProvider, Toggle, useToast,
  type DateRange,
} from '../../../../react/src';

export function ButtonDemo() {
  return (
    <div className="at-stack">
      <div className="at-row">
        <Button hierarchy="primary">Save changes</Button>
        <Button hierarchy="secondary">Preview</Button>
        <Button hierarchy="outline" iconLeading={<Icon name="plus" />}>New project</Button>
        <Button hierarchy="tertiary">Cancel</Button>
        <Button hierarchy="link">Learn more</Button>
      </div>
      <div className="at-row">
        {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => <Button key={s} hierarchy="primary" size={s}>{s}</Button>)}
        <Button hierarchy="outline" iconOnly aria-label="Search" iconLeading={<Icon name="search" />} />
        <Button hierarchy="primary" loading>Saving</Button>
        <Button hierarchy="primary" disabled>Disabled</Button>
      </div>
    </div>
  );
}

export function BadgeDemo() {
  return (
    <div className="at-stack">
      <div className="at-row">
        <Badge>Draft</Badge><Badge color="brand">New</Badge><Badge color="success" dot>Active</Badge>
        <Badge color="warning" dot>Pending</Badge><Badge color="error" dot>Overdue</Badge>
      </div>
      <div className="at-row">
        <Badge variant="solid">Gray</Badge><Badge variant="solid" color="brand">Brand</Badge><Badge variant="solid" color="warning">Warning</Badge>
        <Badge variant="solid" color="error">Error</Badge><Badge variant="solid" color="success">Success</Badge>
      </div>
      <div className="at-row">
        <Tag size="sm">Design</Tag><Tag onRemove={() => {}}>Figma</Tag><Tag onRemove={() => {}}>Tokens</Tag><Tag size="lg" onRemove={() => {}}>Web</Tag>
      </div>
    </div>
  );
}

export function InputDemo() {
  return (
    <div className="at-grid">
      <Input label="Email" placeholder="you@company.com" hint="We never share it." />
      <Input label="Search" placeholder="Search projects" iconLeading={<Icon name="search" />} />
      <Input label="Workspace URL" defaultValue="atomus" error="This URL is taken. Try another one." />
      <Input label="Disabled" disabled defaultValue="Read only" />
    </div>
  );
}

export function SelectDemo() {
  const [team, setTeam] = useState('design');
  return (
    <div className="at-grid" style={{ minHeight: 260, alignItems: 'start' }}>
      <Select label="Team" value={team} onChange={setTeam} options={[
        { value: 'design', label: 'Design' }, { value: 'product', label: 'Product' }, { value: 'marketing', label: 'Marketing' },
        { value: 'eng', label: 'Engineering' }, { value: 'ops', label: 'Operations', disabled: true },
      ]} />
      <Select label="Role" placeholder="Select a role" hint="You can change it later." options={[{ value: 'admin', label: 'Admin' }, { value: 'editor', label: 'Editor' }]} />
    </div>
  );
}

export function ChoiceDemo() {
  return (
    <div className="at-grid">
      <div className="at-stack">
        <Checkbox label="Email me product updates" defaultChecked />
        <Checkbox label="Select all" indeterminate />
        <Checkbox label="Share analytics" description="Anonymous usage data." />
      </div>
      <div className="at-stack" role="radiogroup" aria-label="Plan">
        <Radio name="plan" label="Starter" description="Up to 3 projects" defaultChecked />
        <Radio name="plan" label="Pro" description="Unlimited projects" />
      </div>
      <div className="at-stack">
        <Toggle label="Dark mode" defaultChecked />
        <Toggle label="Weekly digest" size="md" description="Every Monday" />
        <Toggle label="Square" shape="square" defaultChecked />
      </div>
    </div>
  );
}

export function AvatarDemo() {
  return (
    <div className="at-row">
      <Avatar name="Kristina Stan" size="xs" /><Avatar name="Mila Petrova" size="sm" status="online" />
      <Avatar name="Ivan Georgiev" size="md" status="away" /><Avatar name="Nora Lee" size="lg" status="offline" />
      <Avatar name="Olivia Rhye" size="xl" /><Avatar name="Atomus" size="2xl" shape="rounded" /><Avatar size="md" />
    </div>
  );
}

export function AlertDemo() {
  return (
    <div className="at-stack">
      <Alert color="brand" title="New tokens available" onClose={() => {}} actions={<><Button hierarchy="tertiary" size="sm">Dismiss</Button><Button hierarchy="link" size="sm">View changes</Button></>}>Atomus 4.0 adds brand and radius modes.</Alert>
      <Alert color="success" title="Changes saved">Your workspace settings are up to date.</Alert>
      <Alert color="warning" variant="outline" title="Trial ends in 3 days">Add a payment method to keep your projects.</Alert>
      <Alert color="error" title="Payment failed">Check the card details and try again.</Alert>
    </div>
  );
}

function ToastButtons() {
  const t = useToast();
  return (
    <div className="at-row">
      <Button hierarchy="outline" size="sm" onClick={() => t.show({ color: 'success', title: 'Changes saved', description: 'Your workspace is up to date.' })}>Success toast</Button>
      <Button hierarchy="outline" size="sm" onClick={() => t.show({ color: 'error', title: 'Upload failed', description: 'The file is larger than 25 MB.' })}>Error toast</Button>
    </div>
  );
}
export function ToastDemo() {
  return (
    <ToastProvider>
      <div className="at-stack">
        <Toast color="brand" title="New version" description="Atomus 4.0 is ready." onClose={() => {}} />
        <ToastButtons />
      </div>
    </ToastProvider>
  );
}

export function CardDemo() {
  return (
    <div className="at-grid">
      <Card title="Team members" supportingText="Invite people and manage roles." headerAction={<Button hierarchy="outline" size="sm">Invite</Button>}
        footer={<><Button hierarchy="tertiary" size="sm">Cancel</Button><Button hierarchy="primary" size="sm">Save</Button></>}>
        <div className="at-row"><Avatar name="Kristina Stan" size="sm" /><Avatar name="Mila Petrova" size="sm" /><span>2 members</span></div>
      </Card>
      <Card variant="elevated" title="Elevated" supportingText="Floats above the page.">For overlapping or draggable cards.</Card>
      <Card variant="filled" title="Filled" supportingText="Sits on bg-secondary.">For cards inside white panels.</Card>
    </div>
  );
}

export function TabsDemo() {
  return (
    <div className="at-stack">
      <Tabs aria-label="Sections" items={[{ value: 'o', label: 'Overview' }, { value: 'a', label: 'Analytics', count: 12 }, { value: 's', label: 'Settings' }]} />
      <Tabs variant="pill" aria-label="Views" items={[{ value: 'o', label: 'Overview' }, { value: 'a', label: 'Analytics' }]} />
      <Tabs variant="segmented" aria-label="Range" defaultValue="w" items={[{ value: 'd', label: 'Day' }, { value: 'w', label: 'Week' }, { value: 'm', label: 'Month' }]} />
    </div>
  );
}

export function ProgressDemo() {
  return (
    <div className="at-stack" style={{ maxWidth: 420 }}>
      <ProgressBar value={64} label="Storage used" />
      <ProgressBar value={25} label="Onboarding" labelPosition="bottom" />
    </div>
  );
}

export function MetricDemo() {
  return (
    <div className="at-grid">
      <MetricCard type="simple" label="Active projects" value="128" />
      <MetricCard label="Monthly revenue" value="$48.2k" change="12%" caption="vs last month" />
      <MetricCard type="chart" label="Churn" value="1.8%" change="-0.4%" caption="vs last month" data={[5, 6, 5.5, 4.8, 4.2, 3.9, 3.4]} />
    </div>
  );
}

export function EmptyDemo() {
  return (
    <EmptyState icon={<Icon name="folder" size={24} />} title="No projects yet" description="Create your first project to start designing with Atomus."
      actions={<><Button hierarchy="outline">Import</Button><Button hierarchy="primary" iconLeading={<Icon name="plus" />}>New project</Button></>} />
  );
}

export function DropdownDemo() {
  return (
    <div style={{ minHeight: 240 }}>
      <DropdownMenu label="Project actions" trigger={<Button hierarchy="outline" iconTrailing={<Icon name="chevronDown" />}>Actions</Button>} items={[
        { type: 'heading', label: 'Project' },
        { label: 'Rename', icon: <Icon name="settings" size={16} />, shortcut: '⌘R' },
        { label: 'Duplicate', icon: <Icon name="plus" size={16} />, shortcut: '⌘D' },
        { label: 'Archive', disabled: true },
        { type: 'separator' },
        { label: 'Delete project', icon: <Icon name="x" size={16} />, destructive: true },
      ]} />
    </div>
  );
}

export function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button hierarchy="outline" onClick={() => setOpen(true)}>Delete project…</Button>
      <Modal open={open} onClose={() => setOpen(false)} featuredIcon type="destructive" size="sm" title="Delete project?"
        description="This deletes Atomus Website and its 24 files. You can’t undo this."
        actions={<><Button hierarchy="outline" onClick={() => setOpen(false)}>Cancel</Button><Button hierarchy="primary" onClick={() => setOpen(false)}>Delete</Button></>} />
    </div>
  );
}

type Member = { id: string; name: string; role: string; status: string; projects: number };
export function TableDemo() {
  const rows: Member[] = [
    { id: '1', name: 'Kristina Stan', role: 'Design lead', status: 'Active', projects: 12 },
    { id: '2', name: 'Mila Petrova', role: 'Product designer', status: 'Active', projects: 8 },
    { id: '3', name: 'Ivan Georgiev', role: 'Developer', status: 'Invited', projects: 3 },
  ];
  return (
    <Table<Member> caption="Team members" selectable rowKey={(r) => r.id} rows={rows} columns={[
      { key: 'name', header: 'Name', sortable: true, render: (r) => <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Avatar name={r.name} size="sm" />{r.name}</span> },
      { key: 'role', header: 'Role', sortable: true },
      { key: 'status', header: 'Status', render: (r) => <Badge size="sm" dot color={r.status === 'Active' ? 'success' : 'gray'}>{r.status}</Badge> },
      { key: 'projects', header: 'Projects', sortable: true, align: 'end' },
    ]} />
  );
}

export function DateDemo() {
  const [d, setD] = useState<string | null>('2026-10-14');
  const [r, setR] = useState<DateRange>({ start: '2026-10-07', end: '2026-10-16' });
  return (
    <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start', minHeight: 420 }}>
      <DatePicker label="Due date" value={d} onChange={setD} />
      <div style={{ border: '1px solid var(--color-border-secondary)', borderRadius: 12 }}>
        <Calendar type="range" range={r} onRangeChange={setR} />
      </div>
    </div>
  );
}

export function NavDemo() {
  return (
    <div className="at-stack">
      <AppHeader brand={<strong>Atomus</strong>} nav={<><NavItem label="Dashboard" href="#" active /><NavItem label="Projects" href="#" /><NavItem label="Reports" href="#" /></>}
        actions={<><Button hierarchy="tertiary" iconOnly aria-label="Notifications" iconLeading={<Icon name="bell" />} /><Avatar name="Kristina Stan" size="sm" /></>} />
      <div style={{ display: 'flex', gap: 24, height: 300 }}>
        <SidebarNavigation header={<strong>Atomus</strong>} footer={<NavItem label="Settings" href="#" icon={<Icon name="settings" />} />}>
          <NavItem label="Home" href="#" active icon={<Icon name="home" />} />
          <NavItem label="Projects" href="#" badge={12} icon={<Icon name="folder" />} />
          <NavItem label="Reports" href="#" chevron icon={<Icon name="menu" />} />
        </SidebarNavigation>
        <SidebarNavigation collapsed aria-label="Rail">
          <NavItem label="Home" href="#" active collapsed icon={<Icon name="home" />} />
          <NavItem label="Projects" href="#" collapsed icon={<Icon name="folder" />} />
        </SidebarNavigation>
      </div>
    </div>
  );
}
