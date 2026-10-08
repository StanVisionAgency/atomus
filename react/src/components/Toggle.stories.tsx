import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toggle } from './Choice';

const meta = {
  title: 'Forms/Toggle',
  component: Toggle,
  args: { label: 'Dark mode', size: 'sm', shape: 'pill' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md'] }, shape: { control: 'inline-radio', options: ['pill', 'square'] } },
} satisfies Meta<typeof Toggle>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: (args) => (
    <div className="sb-stack">
      <Toggle {...args} label="Off" />
      <Toggle {...args} label="On" defaultChecked />
      <Toggle {...args} label="Disabled" disabled />
      <Toggle {...args} label="Disabled and on" disabled defaultChecked />
    </div>
  ),
};

export const ShapesAndSizes: Story = {
  render: (args) => (
    <div className="sb-stack">
      <Toggle {...args} size="md" label="Weekly digest" description="Every Monday" defaultChecked />
      <Toggle {...args} shape="square" label="Square" defaultChecked />
    </div>
  ),
};
