import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon, type IconName } from './Icon';

const NAMES: IconName[] = ['check', 'minus', 'x', 'info', 'alert', 'success', 'plus', 'search', 'folder', 'user', 'arrowUp', 'arrowDown', 'chevronDown', 'chevronUp', 'chevronLeft', 'chevronRight', 'calendar', 'sort', 'menu', 'home', 'settings', 'bell', 'more'];

const meta = {
  title: 'Foundations/Icon',
  component: Icon,
  args: { name: 'search', size: 20 },
  argTypes: { name: { control: 'select', options: NAMES }, size: { control: 'inline-radio', options: [12, 16, 20, 24, 32] } },
} satisfies Meta<typeof Icon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllGlyphs: Story = {
  render: (args) => (
    <div className="sb-row" style={{ color: 'var(--color-fg-secondary)' }}>
      {NAMES.map((n) => (
        <span key={n} title={n} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: 88, fontSize: 'var(--font-size-tiny)', color: 'var(--color-text-tertiary)' }}>
          <Icon {...args} name={n} size={24} />
          {n}
        </span>
      ))}
    </div>
  ),
};
