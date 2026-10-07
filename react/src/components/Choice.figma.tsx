import figma from '@figma/code-connect';
import { Checkbox, Radio, Toggle } from './Choice';

figma.connect(Checkbox, 'https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25419-14605', {
  props: {
    label: figma.boolean('Show label', { true: figma.string('Label'), false: undefined }),
    description: figma.boolean('Show description', { true: figma.string('Description'), false: undefined }),
    size: figma.enum('Size', { sm: 'sm', md: 'md' }),
    defaultChecked: figma.enum('Checked', { True: true }),
    indeterminate: figma.enum('Checked', { Indeterminate: true }),
    disabled: figma.enum('State', { Disabled: true }),
  },
  example: (props) => <Checkbox {...props} />,
});

figma.connect(Radio, 'https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25419-14694', {
  props: {
    label: figma.boolean('Show label', { true: figma.string('Label'), false: undefined }),
    description: figma.boolean('Show description', { true: figma.string('Description'), false: undefined }),
    size: figma.enum('Size', { sm: 'sm', md: 'md' }),
    defaultChecked: figma.enum('Checked', { True: true }),
    disabled: figma.enum('State', { Disabled: true }),
  },
  example: (props) => <Radio name="group" {...props} />,
});

figma.connect(Toggle, 'https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25420-988', {
  props: {
    label: figma.boolean('Show label', { true: figma.string('Label'), false: undefined }),
    description: figma.boolean('Show description', { true: figma.string('Description'), false: undefined }),
    size: figma.enum('Size', { sm: 'sm', md: 'md' }),
    shape: figma.enum('Shape', { Pill: 'pill', Square: 'square' }),
    defaultChecked: figma.enum('Checked', { True: true }),
    disabled: figma.enum('State', { Disabled: true }),
  },
  example: (props) => <Toggle {...props} />,
});
