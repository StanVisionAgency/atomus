import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';
import { Card } from './Card';
import { Icon } from './Icon';

const meta = {
  title: 'Layout/Card',
  component: Card,
  args: {
    title: 'Team members',
    supportingText: 'Invite colleagues to collaborate on projects.',
    children: 'Eight people have access to this workspace. Owners can change roles and remove members.',
    variant: 'outlined',
    padding: 'md',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['outlined', 'elevated', 'filled'] },
    padding: { control: 'inline-radio', options: ['md', 'lg'] },
    headerAction: { control: false },
    footer: { control: false },
  },
  decorators: [(Story) => <div style={{ maxWidth: 480 }}><Story /></div>],
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHeaderActionAndFooter: Story = {
  args: {
    headerAction: <Button hierarchy="tertiary" size="sm" iconOnly aria-label="More actions" iconLeading={<Icon name="more" />} />,
    footer: <><Button hierarchy="outline">Cancel</Button><Button hierarchy="primary">Invite</Button></>,
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="sb-stack">
      {(['outlined', 'elevated', 'filled'] as const).map((v) => <Card key={v} {...args} variant={v} title={`${v[0].toUpperCase()}${v.slice(1)}`} />)}
    </div>
  ),
};

export const LargePadding: Story = { args: { padding: 'lg' } };
