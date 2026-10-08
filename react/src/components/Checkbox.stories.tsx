import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Choice';

const meta = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  args: { label: 'Email me product updates', size: 'sm' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md'] } },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: (args) => (
    <div className="sb-stack">
      <Checkbox {...args} label="Unchecked" />
      <Checkbox {...args} label="Checked" defaultChecked />
      <Checkbox {...args} label="Indeterminate" indeterminate />
      <Checkbox {...args} label="Disabled" disabled />
      <Checkbox {...args} label="Disabled and checked" disabled defaultChecked />
    </div>
  ),
};

export const WithDescription: Story = { args: { label: 'Share analytics', description: 'Anonymous usage data helps us improve Atomus.' } };

export const Sizes: Story = {
  render: (args) => (
    <div className="sb-stack">
      <Checkbox {...args} size="sm" label="Small" defaultChecked />
      <Checkbox {...args} size="md" label="Medium" defaultChecked />
    </div>
  ),
};
