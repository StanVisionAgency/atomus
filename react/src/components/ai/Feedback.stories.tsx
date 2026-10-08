import type { Meta, StoryObj } from '@storybook/react-vite';
import { Feedback } from './Feedback';

const meta = {
  title: 'AI/Feedback',
  component: Feedback,
  args: { size: 'sm', onSubmit: () => {} },
  argTypes: { size: { control: 'inline-radio', options: ['xs', 'sm'] } },
} satisfies Meta<typeof Feedback>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Positive: Story = { args: { defaultValue: 'up' } };

export const NegativeWithReasons: Story = { args: { defaultValue: 'down' } };
