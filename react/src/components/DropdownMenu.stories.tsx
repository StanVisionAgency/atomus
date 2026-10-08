import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from './Button';
import { Icon } from './Icon';
import { DropdownMenu, type DropdownItem } from './Menu';

const ITEMS: DropdownItem[] = [
  { type: 'heading', label: 'Project' },
  { label: 'Rename', icon: <Icon name="settings" size={16} />, shortcut: 'R' },
  { label: 'Duplicate', icon: <Icon name="folder" size={16} />, shortcut: '⌘D' },
  { label: 'Share', icon: <Icon name="user" size={16} />, disabled: true },
  { type: 'separator' },
  { label: 'Delete', icon: <Icon name="x" size={16} />, destructive: true },
];

const meta = {
  title: 'Overlays/Dropdown menu',
  component: DropdownMenu,
  args: { trigger: <Button hierarchy="outline" iconTrailing={<Icon name="chevronDown" />}>Actions</Button>, items: ITEMS, label: 'Project actions', align: 'start', size: 'sm' },
  argTypes: { align: { control: 'inline-radio', options: ['start', 'end'] }, size: { control: 'inline-radio', options: ['sm', 'md'] }, trigger: { control: false }, items: { control: false } },
  decorators: [(Story) => <div style={{ minHeight: 300 }}><Story /></div>],
} satisfies Meta<typeof DropdownMenu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};

export const Open: Story = { args: { defaultOpen: true } };

export const KeyboardNavigation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Actions' });
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    const menu = await canvas.findByRole('menu', { name: 'Project actions' });
    await waitFor(() => expect(menu).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    await expect(menu.getAttribute('aria-activedescendant')).toMatch(/-i2$/);
    await userEvent.keyboard('{Escape}');
    await expect(canvas.queryByRole('menu')).toBeNull();
  },
};
