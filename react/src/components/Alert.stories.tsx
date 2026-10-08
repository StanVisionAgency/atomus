import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './Alert';
import { Button } from './Button';

const TONES = ['brand', 'gray', 'error', 'warning', 'success'] as const;
const COPY = {
  brand: ['New tokens available', 'Atomus 4.0 adds brand and radius modes.'],
  gray: ['Scheduled maintenance', 'The editor is read-only on Sunday 02:00–03:00 UTC.'],
  error: ['Payment failed', 'We couldn’t charge the card ending 4242.'],
  warning: ['Trial ends in 3 days', 'Add a payment method to keep your workspace.'],
  success: ['Changes saved', 'Your workspace settings are up to date.'],
} as const;

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  args: { color: 'brand', variant: 'subtle', size: 'md', title: COPY.brand[0], children: COPY.brand[1] },
  argTypes: {
    color: { control: 'inline-radio', options: TONES },
    variant: { control: 'inline-radio', options: ['subtle', 'outline', 'solid'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    actions: { control: false },
    icon: { control: false },
  },
  decorators: [(Story) => <div style={{ maxWidth: 640 }}><Story /></div>],
} satisfies Meta<typeof Alert>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const all = (variant: 'subtle' | 'outline' | 'solid'): Story => ({
  render: (args) => (
    <div className="sb-stack">
      {TONES.map((t) => <Alert key={t} {...args} variant={variant} color={t} title={COPY[t][0]} onClose={() => {}}>{COPY[t][1]}</Alert>)}
    </div>
  ),
});
export const Subtle = all('subtle');
export const Outline = all('outline');
export const Solid = all('solid');

export const WithActions: Story = {
  args: {
    color: 'warning',
    title: COPY.warning[0],
    children: COPY.warning[1],
    actions: <><Button hierarchy="tertiary" size="sm">Dismiss</Button><Button hierarchy="link" size="sm">Add payment method</Button></>,
  },
};

export const Small: Story = { args: { size: 'sm', color: 'error', title: COPY.error[0], children: COPY.error[1] } };

export const Flush: Story = { args: { flush: true, color: 'gray', title: COPY.gray[0], children: COPY.gray[1] } };
