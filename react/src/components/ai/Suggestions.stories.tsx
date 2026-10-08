import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '../Icon';
import { Suggestions } from './Suggestions';

const meta = {
  title: 'AI/Suggestions',
  component: Suggestions,
  args: { label: 'Follow-up prompts', suggestions: ['Fix the contrast issue', 'Show the axe report', 'Audit the account page too'], mode: 'send', variant: 'chips', onSelect: () => {} },
  argTypes: { mode: { control: 'inline-radio', options: ['send', 'insert'] }, variant: { control: 'inline-radio', options: ['chips', 'cards'] } },
} satisfies Meta<typeof Suggestions>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Chips: Story = {};

export const Wrapped: Story = { args: { wrap: true, mode: 'insert' } };

export const Cards: Story = {
  args: {
    variant: 'cards',
    label: 'Prompt starters',
    suggestions: [
      { id: 'audit', label: 'Audit our checkout page', description: 'Find WCAG 2.2 issues', icon: <Icon name="shield" size={16} /> },
      { id: 'tokens', label: 'Which token for a card border?', description: 'Pick semantic tokens by role', icon: <Icon name="search" size={16} /> },
      { id: 'draft', label: 'Draft release notes', description: 'From the merged pull requests', icon: <Icon name="edit" size={16} /> },
    ],
  },
};
