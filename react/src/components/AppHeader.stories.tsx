import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { Icon } from './Icon';
import { Input } from './Input';
import { AppHeader, NavItem } from './Navigation';

const meta = {
  title: 'Navigation/App header',
  component: AppHeader,
  args: {
    brand: <strong style={{ color: 'var(--color-text-primary)' }}>Atomus</strong>,
    nav: (
      <>
        <NavItem href="#overview" label="Overview" active />
        <NavItem href="#projects" label="Projects" />
        <NavItem href="#reports" label="Reports" />
      </>
    ),
    actions: (
      <>
        <Input size="sm" type="search" aria-label="Search" placeholder="Search" iconLeading={<Icon name="search" size={16} />} />
        <Button hierarchy="tertiary" iconOnly aria-label="Notifications" iconLeading={<Icon name="bell" />} />
        <Avatar name="Olivia Rhye" size="sm" />
      </>
    ),
  },
  argTypes: { brand: { control: false }, nav: { control: false }, actions: { control: false } },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AppHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithoutNav: Story = { args: { nav: undefined } };
