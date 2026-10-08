import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';
import { Icon } from './Icon';
import { NavItem, SidebarNavigation } from './Navigation';

const items = (collapsed?: boolean) => (
  <>
    <NavItem href="#home" label="Dashboard" icon={<Icon name="home" />} active collapsed={collapsed} />
    <NavItem href="#projects" label="Projects" icon={<Icon name="folder" />} badge={12} collapsed={collapsed} />
    <NavItem href="#people" label="People" icon={<Icon name="user" />} collapsed={collapsed} />
    <NavItem href="#notifications" label="Notifications" icon={<Icon name="bell" />} badge={3} collapsed={collapsed} />
  </>
);

const meta = {
  title: 'Navigation/Sidebar navigation',
  component: SidebarNavigation,
  args: {
    'aria-label': 'Main',
    header: <strong style={{ color: 'var(--color-text-primary)' }}>Atomus</strong>,
    children: items(),
    footer: <NavItem href="#settings" label="Settings" icon={<Icon name="settings" />} />,
  },
  argTypes: { header: { control: false }, children: { control: false }, footer: { control: false } },
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ height: 560 }}><Story /></div>],
} satisfies Meta<typeof SidebarNavigation>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithUser: Story = {
  args: {
    footer: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
        <Avatar name="Olivia Rhye" status="online" />
        <span style={{ fontSize: 'var(--font-size-small)', lineHeight: 'var(--line-height-small)' }}>Olivia Rhye</span>
      </div>
    ),
  },
};

export const Collapsed: Story = {
  args: { collapsed: true, header: <Icon name="home" />, children: items(true), footer: <NavItem href="#settings" label="Settings" icon={<Icon name="settings" />} collapsed /> },
};
