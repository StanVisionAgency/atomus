import type { Meta, StoryObj } from '@storybook/react-vite';
import { InlineCitation, Sources } from './Sources';

const SOURCES = [
  { id: 'contrast', title: 'Understanding SC 1.4.3: Contrast (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum', snippet: 'Text has a contrast ratio of at least 4.5:1.' },
  { id: 'labels', title: 'Understanding SC 3.3.2: Labels or Instructions', url: 'https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions', snippet: 'A placeholder is not a label.' },
  { id: 'focus', title: 'Understanding SC 2.4.3: Focus Order', url: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-order' },
];

const meta = {
  title: 'AI/Sources',
  component: Sources,
  args: { sources: SOURCES, variant: 'collapsible', defaultOpen: true },
  argTypes: { variant: { control: 'inline-radio', options: ['collapsible', 'list'] } },
} satisfies Meta<typeof Sources>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Collapsible: Story = {};

export const List: Story = { args: { variant: 'list' } };

export const WithInlineCitations: Story = {
  render: (args) => (
    <div className="sb-stack">
      <p>The Pay button has a contrast of 3.1:1, below the minimum <InlineCitation index={1} source={SOURCES[0]} />. The card field uses its placeholder as its label <InlineCitation index={2} source={SOURCES[1]} />.</p>
      <Sources {...args} defaultOpen={false} />
    </div>
  ),
};
