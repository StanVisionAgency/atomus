import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio } from './Choice';

const meta = {
  title: 'Forms/Radio',
  component: Radio,
  args: { label: 'Starter', name: 'plan', size: 'sm' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md'] } },
} satisfies Meta<typeof Radio>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Group: Story = {
  render: (args) => (
    <div className="sb-stack" role="radiogroup" aria-label="Plan">
      <Radio {...args} name="plan-group" label="Starter" description="Up to 3 projects" defaultChecked />
      <Radio {...args} name="plan-group" label="Pro" description="Unlimited projects" />
      <Radio {...args} name="plan-group" label="Enterprise" description="Talk to sales" disabled />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="sb-stack" role="radiogroup" aria-label="Size">
      <Radio {...args} name="size-group" size="sm" label="Small" defaultChecked />
      <Radio {...args} name="size-group" size="md" label="Medium" />
    </div>
  ),
};
