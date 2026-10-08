// Atomus 4.0 — Dashboard block. MIT licence, https://docs.atomus.io
// KPI metric cards, a recent-activity table and a plan-usage card in the app shell. Replace the sample data with yours.
import { useState } from 'react';
import { AppShell } from './app-shell';
import { Avatar } from '../avatar';
import { Badge, type BadgeColor } from '../badge';
import { Button } from '../button';
import { Card } from '../card';
import { Icon } from '../icon';
import { MetricCard } from '../metric-card';
import { ProgressBar } from '../progress-bar';
import { Table, type TableColumn } from '../table';
import { Tabs } from '../tabs';

type Order = { id: string; customer: string; email: string; plan: string; amount: number; status: 'Paid' | 'Pending' | 'Refunded'; date: string };

const ORDERS: Order[] = [
  { id: 'INV-3066', customer: 'Mila Petrova', email: 'mila@northwind.io', plan: 'Agency', amount: 790, status: 'Paid', date: '12 Oct' },
  { id: 'INV-3065', customer: 'Ivan Georgiev', email: 'ivan@lumen.dev', plan: 'Pro', amount: 290, status: 'Pending', date: '11 Oct' },
  { id: 'INV-3064', customer: 'Nora Lee', email: 'nora@kite.co', plan: 'Pro', amount: 290, status: 'Paid', date: '10 Oct' },
  { id: 'INV-3063', customer: 'Olivia Rhye', email: 'olivia@orbital.app', plan: 'Starter', amount: 90, status: 'Refunded', date: '9 Oct' },
  { id: 'INV-3062', customer: 'Lana Steiner', email: 'lana@pinecrest.com', plan: 'Agency', amount: 790, status: 'Paid', date: '8 Oct' },
];
const STATUS: Record<Order['status'], BadgeColor> = { Paid: 'success', Pending: 'warning', Refunded: 'gray' };

const columns: TableColumn<Order>[] = [
  { key: 'customer', header: 'Customer', sortable: true, render: (r) => <span className="ab-person"><Avatar name={r.customer} size="sm" /><span>{r.customer}</span></span>, supporting: (r) => r.email },
  { key: 'plan', header: 'Plan', sortable: true, supporting: (r) => r.id },
  { key: 'status', header: 'Status', render: (r) => <Badge color={STATUS[r.status]} dot>{r.status}</Badge> },
  { key: 'date', header: 'Date' },
  { key: 'amount', header: 'Amount', sortable: true, align: 'end', render: (r) => `$${r.amount.toLocaleString('en-US')}` },
];

export function Dashboard() {
  const [range, setRange] = useState('30d');
  return (
    <AppShell
      active="dashboard"
      title="Welcome back, Olivia"
      description="Track revenue, customers and plan usage across your workspace."
      actions={<><Button hierarchy="outline" iconLeading={<Icon name="arrowDown" />}>Export</Button><Button hierarchy="primary" iconLeading={<Icon name="plus" />}>New project</Button></>}
    >
      <Tabs
        aria-label="Date range"
        variant="segmented"
        value={range}
        onChange={setRange}
        items={[{ value: '12m', label: '12 months' }, { value: '30d', label: '30 days' }, { value: '7d', label: '7 days' }, { value: '24h', label: '24 hours' }]}
      />
      <div className="ab-metrics">
        <MetricCard label="Revenue" value="$48.2k" type="chart" change="12%" caption="vs last month" data={[12, 18, 15, 22, 24, 21, 30, 34]} />
        <MetricCard label="Active customers" value="1,284" type="chart" change="4.6%" caption="vs last month" data={[40, 42, 41, 45, 47, 46, 50, 52]} />
        <MetricCard label="Churn rate" value="1.9%" type="chart" change="-0.4%" trend="down" caption="vs last month" data={[30, 28, 29, 25, 26, 22, 21, 19]} />
      </div>
      <div className="ab-columns">
        <Table caption="Recent invoices" columns={columns} rows={ORDERS} rowKey={(r) => r.id} />
        <Card
          title="Plan usage"
          supportingText="Agency plan · renews 1 Nov 2026"
          headerAction={<Button hierarchy="tertiary" size="sm">Manage</Button>}
          footer={<Button hierarchy="secondary" size="sm" fullWidth>Upgrade plan</Button>}
        >
          <div className="ab-usage">
            <div className="ab-usage__row"><span>Projects</span><ProgressBar value={60} label="Projects used" /></div>
            <div className="ab-usage__row"><span>Seats</span><ProgressBar value={85} label="Seats used" /></div>
            <div className="ab-usage__row"><span>Storage</span><ProgressBar value={32} label="Storage used" /></div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

export default Dashboard;
