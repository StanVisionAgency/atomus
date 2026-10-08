import type { Meta, StoryObj } from '@storybook/react-vite';
import { Approval } from './Approval';

const meta = {
  title: 'AI/Approval',
  component: Approval,
  args: { title: 'File 3 issues in Linear?', risk: 'medium', toolName: 'linear.create_issues', status: 'pending', onApprove: () => {}, onDeny: () => {} },
  argTypes: { risk: { control: 'inline-radio', options: ['low', 'medium', 'high'] }, status: { control: 'inline-radio', options: ['pending', 'approved', 'denied'] } },
  render: (args) => <Approval {...args}>Creates three issues in the <strong>Checkout</strong> project.</Approval>,
} satisfies Meta<typeof Approval>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Pending: Story = {};

export const Editable: Story = { args: { editableText: '1. Pay button contrast\n2. Card number label\n3. Error focus', alwaysAllowLabel: 'Always allow in this chat' } };

export const HighRisk: Story = { args: { risk: 'high', title: 'Delete 12 unused components?', toolName: 'figma.delete_nodes', approveLabel: 'Delete' } };

export const Approved: Story = { args: { status: 'approved' } };

export const Denied: Story = { args: { status: 'denied' } };
