import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from './Icon';
import { NavItem } from './Navigation';

const meta = {
  title: 'Navigation/Nav item',
  component: NavItem,
  args: { label: 'Projects', href: '#projects', icon: <Icon name="folder" /> },
  argTypes: { icon: { control: false }, badge: { control: 'text' } },
  decorators: [(Story) => <nav aria-label="Story" style={{ width: 248 }}><Story /></nav>],
} satisfies Meta<typeof NavItem>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Active: Story = { args: { active: true } };
export const WithBadge: Story = { args: { badge: 12 } };
export const WithChevron: Story = { args: { chevron: true, label: 'Reports', icon: <Icon name="sort" /> } };
export const Collapsed: Story = { args: { collapsed: true } };
