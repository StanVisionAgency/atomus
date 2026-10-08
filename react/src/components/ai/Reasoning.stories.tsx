import type { Meta, StoryObj } from '@storybook/react-vite';
import { Reasoning } from './Reasoning';

const STEPS = [
  { id: 'a', label: 'Load checkout.atomus.io in a headless browser', status: 'done' as const },
  { id: 'b', label: 'Run axe-core against WCAG 2.2 AA rules', detail: '68 rules · 3 violations', status: 'done' as const },
  { id: 'c', label: 'Group violations by component and draft fixes', status: 'active' as const },
];

const meta = {
  title: 'AI/Reasoning',
  component: Reasoning,
  args: { status: 'thinking', duration: 6, steps: STEPS, defaultOpen: true },
  argTypes: { status: { control: 'inline-radio', options: ['thinking', 'done'] } },
} satisfies Meta<typeof Reasoning>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Thinking: Story = {};

export const Done: Story = { args: { status: 'done', duration: 12, steps: STEPS.map((s) => ({ ...s, status: 'done' as const })), defaultOpen: false } };

export const DoneOpen: Story = { args: { status: 'done', duration: 12, steps: STEPS.map((s) => ({ ...s, status: 'done' as const })), defaultOpen: true } };
