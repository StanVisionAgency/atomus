import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const OPTIONS = [
  { value: 'design', label: 'Design' },
  { value: 'product', label: 'Product' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'eng', label: 'Engineering' },
  { value: 'ops', label: 'Operations', disabled: true },
];

const meta = {
  title: 'Forms/Select',
  component: Select,
  args: { label: 'Team', options: OPTIONS, placeholder: 'Select a team', size: 'md' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] }, options: { control: false } },
  decorators: [(Story) => <div style={{ maxWidth: 320, minHeight: 300 }}><Story /></div>],
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Placeholder: Story = {};
export const WithValue: Story = { args: { defaultValue: 'product', hint: 'You can change it later.' } };
export const Open: Story = { args: { defaultValue: 'design', defaultOpen: true } };
export const WithError: Story = { args: { error: 'Choose a team to continue.' } };
export const Disabled: Story = { args: { defaultValue: 'design', disabled: true } };
