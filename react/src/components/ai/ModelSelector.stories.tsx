import type { Meta, StoryObj } from '@storybook/react-vite';
import { ModelSelector } from './ModelSelector';

const MODELS = [
  { value: 'atomus-pro', label: 'Atomus Pro', provider: 'StanVision', description: 'Best for long, careful work', capabilities: ['Reasoning', 'Tools'], badge: 'New' },
  { value: 'atomus-fast', label: 'Atomus Fast', provider: 'StanVision', description: 'Quick answers and drafts', capabilities: ['Fast'] },
  { value: 'local-8b', label: 'Local 8B', provider: 'On device', description: 'Private, works offline', disabled: true },
];

const meta = {
  title: 'AI/Model selector',
  component: ModelSelector,
  args: { models: MODELS, defaultValue: 'atomus-pro', variant: 'ghost', size: 'md', placement: 'down' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['ghost', 'outline'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    placement: { control: 'inline-radio', options: ['down', 'up'] },
  },
  parameters: { layout: 'padded' },
  render: (args) => <div className="sb-pop"><ModelSelector {...args} /></div>,
} satisfies Meta<typeof ModelSelector>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Ghost: Story = {};

export const OutlineWithLabel: Story = { args: { variant: 'outline', showLabel: true } };

export const Open: Story = { args: { defaultOpen: true } };
