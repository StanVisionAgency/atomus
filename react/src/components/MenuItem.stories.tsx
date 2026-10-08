import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from './Icon';
import { MenuItem } from './Menu';

const meta = {
  title: 'Overlays/Menu item',
  component: MenuItem,
  args: { label: 'Duplicate', size: 'sm' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md'] }, icon: { control: false }, role: { control: false } },
  // Menu items live inside a menu; the static list stands in for the open DropdownMenu panel.
  decorators: [(Story) => <div role="menu" aria-label="Project actions" className="at-menu" style={{ position: 'static', width: 240 }}><Story /></div>],
} satisfies Meta<typeof MenuItem>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: (args) => (
    <>
      <MenuItem {...args} label="Default" icon={<Icon name="folder" size={16} />} />
      <MenuItem {...args} label="Active (keyboard)" icon={<Icon name="user" size={16} />} active />
      <MenuItem {...args} label="With shortcut" icon={<Icon name="search" size={16} />} shortcut="⌘K" />
      <MenuItem {...args} label="Disabled" icon={<Icon name="settings" size={16} />} disabled />
      <MenuItem {...args} label="Delete" icon={<Icon name="x" size={16} />} destructive />
    </>
  ),
};

export const Medium: Story = { args: { size: 'md', icon: <Icon name="home" size={16} />, shortcut: '⌘D' } };
