import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from './Tabs';

const ITEMS = [
  { value: 'overview', label: 'Overview' },
  { value: 'activity', label: 'Activity', count: 4 },
  { value: 'settings', label: 'Settings' },
  { value: 'billing', label: 'Billing', disabled: true },
];

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  args: { items: ITEMS, variant: 'underline', defaultValue: 'overview', 'aria-label': 'Project sections' },
  argTypes: { variant: { control: 'inline-radio', options: ['underline', 'pill', 'segmented'] } },
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Underline: Story = {};
export const Pill: Story = { args: { variant: 'pill' } };
export const Segmented: Story = { args: { variant: 'segmented', defaultValue: 'activity' } };
