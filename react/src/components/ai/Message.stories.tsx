import type { Meta, StoryObj } from '@storybook/react-vite';
import { Message } from './Message';
import { Feedback } from './Feedback';

const meta = {
  title: 'AI/Message',
  component: Message,
  args: { role: 'assistant', name: 'Atomus Assistant', time: '2:40 PM', status: 'done', copyText: 'Use border-secondary.' },
  argTypes: {
    role: { control: 'inline-radio', options: ['user', 'assistant', 'system', 'tool'] },
    status: { control: 'inline-radio', options: ['streaming', 'done', 'error', 'stopped'] },
    actionsVisibility: { control: 'inline-radio', options: ['always', 'hover'] },
    avatar: { control: false },
    actions: { control: false },
  },
  render: (args) => (
    <Message {...args}>
      <p>Use <code>--color-border-secondary</code> for card borders. It switches with Light and Dark mode.</p>
    </Message>
  ),
} satisfies Meta<typeof Message>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Assistant: Story = { args: { onRegenerate: () => {}, actions: <Feedback /> } };

export const User: Story = {
  args: { role: 'user', name: 'Kristina', onEdit: () => {} },
  render: (args) => <Message {...args}><p>Which token should I use for a card border?</p></Message>,
};

export const System: Story = {
  args: { role: 'system', name: undefined, time: undefined, copyText: undefined },
  render: (args) => <Message {...args}>Kristina added the <strong>QA agent</strong> to this chat · Today</Message>,
};

export const WithBranches: Story = { args: { branch: { index: 2, count: 3, onPrevious: () => {}, onNext: () => {} }, onRegenerate: () => {} } };

export const Streaming: Story = { args: { status: 'streaming', copyText: undefined } };

export const Error: Story = { args: { status: 'error', errorMessage: 'The model is overloaded. Try again in a minute.', onRegenerate: () => {} } };
