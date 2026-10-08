import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from './Icon';
import { Tag } from './Tag';

const meta = {
  title: 'Data display/Tag',
  component: Tag,
  args: { children: 'Figma', size: 'md' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] }, icon: { control: false } },
} satisfies Meta<typeof Tag>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => <div className="sb-row">{(['sm', 'md', 'lg'] as const).map((s) => <Tag key={s} {...args} size={s}>Size {s}</Tag>)}</div>,
};

export const Removable: Story = {
  render: (args) => (
    <div className="sb-row">
      <Tag {...args} onRemove={() => {}}>Tokens</Tag>
      <Tag {...args} icon={<Icon name="folder" size={14} />} onRemove={() => {}}>Web</Tag>
    </div>
  ),
};
