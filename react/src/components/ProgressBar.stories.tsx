import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from './ProgressBar';

const meta = {
  title: 'Feedback/Progress bar',
  component: ProgressBar,
  args: { value: 64, label: 'Storage used', labelPosition: 'right' },
  argTypes: { value: { control: { type: 'range', min: 0, max: 100 } }, labelPosition: { control: 'inline-radio', options: ['none', 'right', 'bottom'] } },
  decorators: [(Story) => <div style={{ maxWidth: 400 }}><Story /></div>],
} satisfies Meta<typeof ProgressBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const LabelRight: Story = {};
export const LabelBottom: Story = { args: { labelPosition: 'bottom' } };
export const NoLabel: Story = { args: { labelPosition: 'none' } };
export const Values: Story = {
  render: (args) => <div className="sb-stack">{[0, 25, 50, 75, 100].map((v) => <ProgressBar key={v} {...args} value={v} label={`Step ${v / 25 + 1} of 5`} />)}</div>,
};
