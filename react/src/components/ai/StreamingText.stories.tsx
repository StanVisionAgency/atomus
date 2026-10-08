import type { Meta, StoryObj } from '@storybook/react-vite';
import { Shimmer, StreamingText } from './StreamingText';

const meta = {
  title: 'AI/Streaming text',
  component: StreamingText,
  args: { text: 'I audited the checkout page and found 3 issues that block WCAG 2.2 AA. The Pay button label has a contrast of 3.1:1', streaming: true, caret: true },
  argTypes: { announce: { control: 'inline-radio', options: ['polite', 'end', 'off'] }, render: { control: false } },
} satisfies Meta<typeof StreamingText>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Streaming: Story = {};

export const Done: Story = { args: { streaming: false, text: 'I audited the checkout page and found 3 issues that block WCAG 2.2 AA.' } };

export const ShimmerStatus: Story = {
  render: () => (
    <div className="sb-stack">
      <Shimmer>Searching the documentation…</Shimmer>
      <Shimmer active={false}>Searched the documentation</Shimmer>
    </div>
  ),
};
