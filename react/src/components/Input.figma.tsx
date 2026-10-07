import figma from '@figma/code-connect';
import { Input } from './Input';

figma.connect(Input, 'https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25418-1714', {
  props: {
    label: figma.boolean('Show label', { true: figma.string('Label'), false: undefined }),
    hint: figma.boolean('Show hint', { true: figma.string('Hint'), false: undefined }),
    size: figma.enum('Size', { sm: 'sm', md: 'md', lg: 'lg' }),
    disabled: figma.enum('State', { Disabled: true }),
    error: figma.enum('State', { Error: 'Describe how to fix the error' }),
  },
  example: (props) => <Input placeholder="Placeholder" {...props} />,
});
