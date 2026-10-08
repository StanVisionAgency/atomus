import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '../Icon';
import { PromptInput } from './PromptInput';
import { ModelSelector } from './ModelSelector';
import { ContextMeter } from './ContextMeter';

const meta = {
  title: 'AI/Prompt input',
  component: PromptInput,
  args: { placeholder: 'Ask anything… type / for commands', status: 'ready', size: 'md', disclaimer: 'AI can make mistakes. Check important information.' },
  argTypes: {
    status: { control: 'inline-radio', options: ['ready', 'submitted', 'streaming', 'error'] },
    size: { control: 'inline-radio', options: ['md', 'lg'] },
    toolbar: { control: false },
    actions: { control: false },
  },
} satisfies Meta<typeof PromptInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Streaming: Story = { args: { defaultValue: 'Summarize the latest release notes', status: 'streaming', onStop: () => {} } };

export const WithAttachmentsAndToolbar: Story = {
  args: {
    size: 'lg',
    onAttach: () => {},
    onRemoveAttachment: () => {},
    attachments: [
      { id: '1', name: 'checkout-flow.fig', size: '4.2 MB' },
      { id: '2', name: 'audit-report.pdf', size: '820 KB' },
    ],
    triggers: [{ char: '/', label: 'Commands', items: [{ value: 'audit', label: 'Audit a page', icon: <Icon name="shield" size={16} /> }] }],
  },
  render: (args) => (
    <PromptInput
      {...args}
      toolbar={<ModelSelector models={[{ value: 'pro', label: 'Atomus Pro' }, { value: 'fast', label: 'Atomus Fast' }]} defaultValue="pro" />}
      actions={<ContextMeter used={48210} limit={200000} />}
    />
  ),
};

export const Disabled: Story = { args: { placeholder: 'Upgrade to keep chatting', disabled: true } };
