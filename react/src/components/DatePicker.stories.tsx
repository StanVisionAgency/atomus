import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DatePicker, type DateRange } from './DatePicker';

const meta = {
  title: 'Forms/Date picker',
  component: DatePicker,
  args: { label: 'Start date', locale: 'en-GB', size: 'md' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] }, type: { control: 'inline-radio', options: ['single', 'range'] } },
  decorators: [(Story) => <div style={{ maxWidth: 320, minHeight: 420 }}><Story /></div>],
} satisfies Meta<typeof DatePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = { args: { hint: 'The project starts on this day.' } };

export const WithValue: Story = { args: { value: '2024-03-12' } };

export const Open: Story = {
  args: { defaultOpen: true },
  render: (args) => {
    const [value, setValue] = useState<string | null>('2024-03-12');
    return <DatePicker {...args} value={value} onChange={setValue} />;
  },
};

export const RangeOpen: Story = {
  args: { label: 'Campaign dates', type: 'range', defaultOpen: true },
  render: (args) => {
    const [range, setRange] = useState<DateRange>({ start: '2024-03-08', end: '2024-03-15' });
    return <DatePicker {...args} range={range} onRangeChange={setRange} />;
  },
};

export const WithError: Story = { args: { error: 'Pick a date after today.', value: '2024-03-12' } };

export const Disabled: Story = { args: { disabled: true, value: '2024-03-12' } };
