import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToolCall } from './ToolCall';

const meta = {
  title: 'AI/Tool call',
  component: ToolCall,
  args: { name: 'run_axe_audit', title: 'Audited checkout.atomus.io', status: 'success', duration: 1480, input: { url: 'https://checkout.atomus.io', standard: 'wcag22aa' }, output: { violations: 3, passes: 65 } },
  argTypes: { status: { control: 'inline-radio', options: ['pending', 'running', 'success', 'error'] }, icon: { control: false } },
} satisfies Meta<typeof ToolCall>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {};

export const Expanded: Story = { args: { defaultOpen: true } };

export const Statuses: Story = {
  render: (args) => (
    <div className="sb-stack">
      <ToolCall {...args} status="pending" title="Waiting to run" output={undefined} duration={undefined} />
      <ToolCall {...args} status="running" title="Auditing checkout.atomus.io" output={undefined} duration={undefined} />
      <ToolCall {...args} status="success" />
      <ToolCall {...args} status="error" title="Audit failed" output={undefined} error="Navigation timeout after 30s" />
    </div>
  ),
};
