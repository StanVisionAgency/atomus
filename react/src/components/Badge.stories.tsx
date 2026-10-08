import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';
import { Icon } from './Icon';

const COLORS = ['gray', 'brand', 'error', 'warning', 'success'] as const;

const meta = {
  title: 'Data display/Badge',
  component: Badge,
  args: { children: 'Active', color: 'success', variant: 'light', size: 'md', dot: true },
  argTypes: {
    color: { control: 'inline-radio', options: COLORS },
    variant: { control: 'inline-radio', options: ['light', 'solid'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    icon: { control: false },
  },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Colors: Story = {
  render: (args) => (
    <div className="sb-stack">
      <div className="sb-row">{COLORS.map((c) => <Badge key={c} {...args} color={c} variant="light">{c}</Badge>)}</div>
      <div className="sb-row">{COLORS.map((c) => <Badge key={c} {...args} color={c} variant="solid" dot={false}>{c}</Badge>)}</div>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => <div className="sb-row">{(['sm', 'md', 'lg'] as const).map((s) => <Badge key={s} {...args} size={s}>Size {s}</Badge>)}</div>,
};

export const WithIconAndClose: Story = {
  args: { dot: false, color: 'brand' },
  render: (args) => (
    <div className="sb-row">
      <Badge {...args} icon={<Icon name="check" size={12} />}>Verified</Badge>
      <Badge {...args} color="gray" onClose={() => {}}>Design</Badge>
    </div>
  ),
};
