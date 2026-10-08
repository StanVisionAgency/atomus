import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from './Icon';
import { Input } from './Input';

const meta = {
  title: 'Forms/Input',
  component: Input,
  args: { label: 'Email', placeholder: 'you@company.com', size: 'md' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] }, iconLeading: { control: false }, iconTrailing: { control: false } },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>],
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = { args: { hint: 'We never share your email.' } };

export const WithError: Story = { args: { label: 'Workspace URL', defaultValue: 'atomus', error: 'This URL is taken. Try another one.' } };

export const Disabled: Story = { args: { label: 'Plan', defaultValue: 'Agency', disabled: true } };

export const WithIcon: Story = { args: { label: 'Search', placeholder: 'Search projects', iconLeading: <Icon name="search" size={16} /> } };

export const Sizes: Story = {
  render: (args) => (
    <div className="sb-stack">
      {(['sm', 'md', 'lg'] as const).map((s) => <Input key={s} {...args} size={s} label={`Size ${s}`} />)}
    </div>
  ),
};
