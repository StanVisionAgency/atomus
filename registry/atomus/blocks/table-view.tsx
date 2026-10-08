// Atomus 4.0 — Table view block. MIT licence, https://docs.atomus.io
// A list screen: search and filters, a selectable, sortable table with status badges and row actions, and pagination.
import { useMemo, useState } from 'react';
import { AppShell } from './app-shell';
import { Avatar } from '../avatar';
import { Badge, type BadgeColor } from '../badge';
import { Button } from '../button';
import { EmptyState } from '../empty-state';
import { Icon } from '../icon';
import { Input } from '../input';
import { Select } from '../select';
import { Table, type TableColumn } from '../table';

type Project = { id: string; name: string; client: string; owner: string; status: 'Active' | 'In review' | 'Blocked' | 'Done'; updated: string; budget: number };

const PROJECTS: Project[] = [
  { id: 'p1', name: 'Website relaunch', client: 'Northwind', owner: 'Mila Petrova', status: 'Active', updated: '2 hours ago', budget: 24000 },
  { id: 'p2', name: 'Mobile banking app', client: 'Lumen', owner: 'Ivan Georgiev', status: 'In review', updated: 'Yesterday', budget: 58000 },
  { id: 'p3', name: 'Design system audit', client: 'Kite & Co', owner: 'Nora Lee', status: 'Blocked', updated: '3 days ago', budget: 9500 },
  { id: 'p4', name: 'Checkout redesign', client: 'Orbital', owner: 'Olivia Rhye', status: 'Active', updated: '4 days ago', budget: 31000 },
  { id: 'p5', name: 'Brand refresh', client: 'Pinecrest', owner: 'Lana Steiner', status: 'Done', updated: '2 weeks ago', budget: 12000 },
  { id: 'p6', name: 'Analytics dashboard', client: 'Vela', owner: 'Mila Petrova', status: 'Active', updated: '3 weeks ago', budget: 42000 },
];
const STATUS: Record<Project['status'], BadgeColor> = { Active: 'success', 'In review': 'brand', Blocked: 'error', Done: 'gray' };

const columns: TableColumn<Project>[] = [
  { key: 'name', header: 'Project', sortable: true, supporting: (r) => r.client },
  { key: 'owner', header: 'Owner', sortable: true, render: (r) => <span className="ab-owner"><Avatar name={r.owner} size="xs" /><span>{r.owner}</span></span> },
  { key: 'status', header: 'Status', sortable: true, render: (r) => <Badge color={STATUS[r.status]} dot>{r.status}</Badge> },
  { key: 'updated', header: 'Last updated' },
  { key: 'budget', header: 'Budget', sortable: true, align: 'end', render: (r) => `$${r.budget.toLocaleString('en-US')}` },
  { key: 'actions', header: <span className="ab-sr-only">Actions</span>, align: 'end', width: 56, render: (r) => <Button hierarchy="tertiary" size="sm" iconOnly aria-label={`Open ${r.name}`} iconLeading={<Icon name="chevronRight" />} /> },
];

export function TableView() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [selected, setSelected] = useState<string[]>([]);
  const rows = useMemo(
    () => PROJECTS.filter((p) => (status === 'all' || p.status === status) && `${p.name} ${p.client} ${p.owner}`.toLowerCase().includes(query.toLowerCase())),
    [query, status],
  );
  return (
    <AppShell
      active="projects"
      title="Projects"
      description="Every client project in your workspace."
      actions={<><Button hierarchy="outline" disabled={!selected.length}>Archive {selected.length || ''}</Button><Button hierarchy="primary" iconLeading={<Icon name="plus" />}>New project</Button></>}
    >
      <div className="ab-filters">
        <Input className="ab-filters__search" label="Search" type="search" placeholder="Search projects" value={query} onChange={(e) => setQuery(e.target.value)} iconLeading={<Icon name="search" size={16} />} />
        <Select
          className="ab-filters__select"
          label="Status"
          value={status}
          onChange={setStatus}
          options={[{ value: 'all', label: 'All statuses' }, ...(['Active', 'In review', 'Blocked', 'Done'] as const).map((s) => ({ value: s, label: s }))]}
        />
      </div>
      <Table
        caption="Projects"
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        selectable
        selected={selected}
        onSelectedChange={setSelected}
        empty={<EmptyState size="sm" title="No projects found" description="Try another search or clear the filters." actions={<Button hierarchy="outline" onClick={() => { setQuery(''); setStatus('all'); }}>Clear filters</Button>} />}
      />
      <nav className="ab-pagination" aria-label="Pagination">
        <Button hierarchy="outline" size="sm" iconLeading={<Icon name="chevronLeft" />} disabled>Previous</Button>
        <span className="ab-pagination__label">Page 1 of 1</span>
        <Button hierarchy="outline" size="sm" iconTrailing={<Icon name="chevronRight" />} disabled>Next</Button>
      </nav>
    </AppShell>
  );
}

export default TableView;
