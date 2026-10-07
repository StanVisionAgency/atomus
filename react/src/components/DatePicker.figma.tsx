import figma from '@figma/code-connect';
import { Calendar, DatePicker } from './DatePicker';

figma.connect(Calendar, 'https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25430-2200', {
  props: { type: figma.enum('Type', { Single: 'single', Range: 'range' }) },
  example: (props) => <Calendar {...props} value="2026-10-14" onChange={() => {}} />,
});

figma.connect(DatePicker, 'https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25430-2256', {
  props: {
    label: figma.string('Label'),
    disabled: figma.enum('State', { Disabled: true }),
    error: figma.enum('State', { Error: 'Pick a date after today' }),
  },
  example: (props) => <DatePicker {...props} value={null} onChange={() => {}} />,
});
