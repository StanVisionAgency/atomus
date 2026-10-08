import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

const meta = {
  title: 'Data display/Avatar',
  component: Avatar,
  args: { name: 'Olivia Rhye', size: 'md', shape: 'circle' },
  argTypes: {
    size: { control: 'inline-radio', options: SIZES },
    shape: { control: 'inline-radio', options: ['circle', 'rounded'] },
    status: { control: 'inline-radio', options: [undefined, 'online', 'away', 'offline'] },
    icon: { control: false },
  },
} satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Initials: Story = {};

export const Sizes: Story = {
  render: (args) => <div className="sb-row">{SIZES.map((s) => <Avatar key={s} {...args} size={s} />)}</div>,
};

export const Status: Story = {
  render: (args) => (
    <div className="sb-row">
      <Avatar {...args} name="Mila Petrova" status="online" />
      <Avatar {...args} name="Ivan Georgiev" status="away" />
      <Avatar {...args} name="Nora Lee" status="offline" />
    </div>
  ),
};

export const ShapesAndFallback: Story = {
  render: (args) => (
    <div className="sb-row">
      <Avatar {...args} name="Atomus" shape="rounded" size="lg" />
      <Avatar {...args} name={undefined} size="lg" />
      <Avatar {...args} initials="SV" size="lg" />
    </div>
  ),
};
