import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';
import { Icon } from './Icon';

const meta = {
  title: 'Actions/Button',
  component: Button,
  args: { children: 'Save changes', hierarchy: 'primary', size: 'md' },
  argTypes: {
    hierarchy: { control: 'inline-radio', options: ['primary', 'secondary', 'outline', 'tertiary', 'link'] },
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    iconLeading: { control: false },
    iconTrailing: { control: false },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Hierarchies: Story = {
  render: (args) => (
    <div className="sb-row">
      <Button {...args} hierarchy="primary">Save changes</Button>
      <Button {...args} hierarchy="secondary">Preview</Button>
      <Button {...args} hierarchy="outline">Export</Button>
      <Button {...args} hierarchy="tertiary">Cancel</Button>
      <Button {...args} hierarchy="link">Learn more</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="sb-row">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => <Button key={s} {...args} size={s}>Size {s}</Button>)}
    </div>
  ),
};

export const WithIcons: Story = {
  render: (args) => (
    <div className="sb-row">
      <Button {...args} iconLeading={<Icon name="plus" />}>New project</Button>
      <Button {...args} hierarchy="outline" iconTrailing={<Icon name="chevronRight" />}>Continue</Button>
      <Button {...args} hierarchy="outline" iconOnly aria-label="Search" iconLeading={<Icon name="search" />} />
      <Button {...args} hierarchy="tertiary" iconOnly aria-label="More actions" iconLeading={<Icon name="more" />} />
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div className="sb-stack">
      {(['primary', 'secondary', 'outline', 'tertiary', 'link'] as const).map((h) => (
        <div key={h} className="sb-row">
          <Button {...args} hierarchy={h}>Default</Button>
          <Button {...args} hierarchy={h} loading>Saving</Button>
          <Button {...args} hierarchy={h} disabled>Disabled</Button>
        </div>
      ))}
    </div>
  ),
};

export const FullWidth: Story = {
  args: { fullWidth: true, size: 'lg' },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>],
};
