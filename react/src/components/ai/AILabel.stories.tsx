import type { Meta, StoryObj } from '@storybook/react-vite';
import { AILabel } from './AILabel';

const meta = {
  title: 'AI/AI label',
  component: AILabel,
  args: { size: 'sm', variant: 'chip' },
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md'] },
    variant: { control: 'inline-radio', options: ['chip', 'inline', 'icon'] },
    explanation: { control: false },
  },
} satisfies Meta<typeof AILabel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Chip: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="sb-row">
      <AILabel {...args} size="xs" />
      <AILabel {...args} size="sm" />
      <AILabel {...args} size="md" />
      <AILabel {...args} variant="inline" />
      <AILabel {...args} variant="icon" />
    </div>
  ),
};

export const WithExplanation: Story = {
  args: { explanation: <p>Written by an assistant from your project notes. Review it before you publish.</p>, model: 'Atomus Pro' },
  render: (args) => <div className="sb-pop"><AILabel {...args} /></div>,
};

export const Edited: Story = { args: { edited: true, onRevert: () => {} } };
