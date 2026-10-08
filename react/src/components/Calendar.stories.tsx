import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Calendar, type DateRange } from './DatePicker';

// Fixed dates in a past month, so the stories (and their screenshots) never show "today".
const meta = {
  title: 'Forms/Calendar',
  component: Calendar,
  args: { type: 'single', value: '2024-03-12', locale: 'en-GB', weekStartsOn: 1 },
  argTypes: { type: { control: 'inline-radio', options: ['single', 'range'] }, weekStartsOn: { control: 'inline-radio', options: [0, 1] } },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
} satisfies Meta<typeof Calendar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <Calendar {...args} value={value} onChange={setValue} />;
  },
};

export const Range: Story = {
  args: { type: 'range' },
  render: (args) => {
    const [range, setRange] = useState<DateRange>({ start: '2024-03-08', end: '2024-03-15' });
    return <Calendar {...args} range={range} onRangeChange={setRange} />;
  },
};

export const MinMax: Story = { args: { min: '2024-03-05', max: '2024-03-25' } };
