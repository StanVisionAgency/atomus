import type { Meta, StoryObj } from '@storybook/react-vite';
import { ContextMeter } from './ContextMeter';

const meta = {
  title: 'AI/Context meter',
  component: ContextMeter,
  args: { used: 48210, limit: 200000, cost: 0.184, variant: 'compact', placement: 'down', breakdown: [{ label: 'Input', tokens: 39200 }, { label: 'Output', tokens: 6810 }, { label: 'Tools', tokens: 2200 }] },
  argTypes: { variant: { control: 'inline-radio', options: ['compact', 'bar'] }, placement: { control: 'inline-radio', options: ['up', 'down'] } },
} satisfies Meta<typeof ContextMeter>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Compact: Story = {};

export const Bar: Story = { args: { variant: 'bar' } };

export const NearlyFull: Story = { args: { used: 194000, variant: 'bar' } };

export const Open: Story = { args: { defaultOpen: true }, render: (args) => <div className="sb-pop"><ContextMeter {...args} /></div> };
