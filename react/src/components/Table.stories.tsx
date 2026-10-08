import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Avatar } from './Avatar';
import { Badge, type BadgeColor } from './Badge';
import { EmptyState } from './EmptyState';
import { Table, type TableColumn, type TableProps } from './Table';

type Member = { id: string; name: string; email: string; role: string; status: 'Active' | 'Invited' | 'Suspended'; projects: number };
const ROWS: Member[] = [
  { id: 'm1', name: 'Olivia Rhye', email: 'olivia@atomus.io', role: 'Owner', status: 'Active', projects: 12 },
  { id: 'm2', name: 'Mila Petrova', email: 'mila@atomus.io', role: 'Designer', status: 'Active', projects: 8 },
  { id: 'm3', name: 'Ivan Georgiev', email: 'ivan@atomus.io', role: 'Engineer', status: 'Invited', projects: 0 },
  { id: 'm4', name: 'Nora Lee', email: 'nora@atomus.io', role: 'Viewer', status: 'Suspended', projects: 3 },
];
const STATUS: Record<Member['status'], BadgeColor> = { Active: 'success', Invited: 'brand', Suspended: 'error' };
const COLUMNS: TableColumn<Member>[] = [
  { key: 'name', header: 'Name', sortable: true, render: (r) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}><Avatar name={r.name} size="sm" />{r.name}</span>, supporting: (r) => r.email },
  { key: 'role', header: 'Role', sortable: true },
  { key: 'status', header: 'Status', render: (r) => <Badge color={STATUS[r.status]} dot>{r.status}</Badge> },
  { key: 'projects', header: 'Projects', sortable: true, align: 'end' },
];

// Table is generic; Storybook's meta typing needs a concrete row type.
const MemberTable = (props: TableProps<Member>) => <Table<Member> {...props} />;

const meta = {
  title: 'Data display/Table',
  component: MemberTable,
  args: { columns: COLUMNS, rows: ROWS, rowKey: (r: Member) => r.id, caption: 'Team members', size: 'sm' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md'] }, columns: { control: false }, rows: { control: false }, rowKey: { control: false }, empty: { control: false } },
} satisfies Meta<typeof MemberTable>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selectable: Story = { args: { selectable: true, selected: ['m2'] } };

export const Medium: Story = { args: { size: 'md' } };

export const Empty: Story = {
  args: { rows: [], empty: <EmptyState size="sm" title="No members yet" description="Invite people to collaborate." /> },
};

export const Sorting: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Projects/ }));
    await expect(canvas.getByRole('columnheader', { name: /Projects/ })).toHaveAttribute('aria-sort', 'ascending');
  },
};
