import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';
import { Icon } from './Icon';
import { MetricCard } from './MetricCard';

const meta = {
  title: 'Data display/Metric card',
  component: MetricCard,
  args: { label: 'Revenue', value: '$48.2k', type: 'trend', change: '12%', caption: 'vs last month' },
  argTypes: { type: { control: 'inline-radio', options: ['simple', 'trend', 'chart'] }, trend: { control: 'inline-radio', options: [undefined, 'up', 'down'] }, action: { control: false } },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>],
} satisfies Meta<typeof MetricCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Trend: Story = {};
export const Simple: Story = { args: { type: 'simple', label: 'Active projects', value: '24' } };
export const Chart: Story = { args: { type: 'chart', data: [12, 18, 15, 22, 24, 21, 30, 34] } };
export const Down: Story = { args: { type: 'chart', label: 'Churn rate', value: '1.9%', change: '-0.4%', data: [30, 28, 29, 25, 26, 22, 21, 19] } };
export const WithAction: Story = {
  args: { action: <Button hierarchy="tertiary" size="sm" iconOnly aria-label="More options" iconLeading={<Icon name="more" />} /> },
};
