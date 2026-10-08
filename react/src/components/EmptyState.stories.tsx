import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';
import { EmptyState } from './EmptyState';
import { Icon } from './Icon';

const meta = {
  title: 'Feedback/Empty state',
  component: EmptyState,
  args: { title: 'No projects found', description: 'Your search “Atlas” did not match any projects. Try another search.', size: 'md' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md'] }, icon: { control: false }, actions: { control: false } },
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithActions: Story = {
  args: { actions: <><Button hierarchy="outline">Clear search</Button><Button hierarchy="primary" iconLeading={<Icon name="plus" />}>New project</Button></> },
};
export const Small: Story = { args: { size: 'sm', title: 'No files yet', description: 'Upload a file to get started.', icon: <Icon name="folder" size={24} /> } };
