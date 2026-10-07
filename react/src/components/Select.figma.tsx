import figma from '@figma/code-connect';
import { Select } from './Select';

figma.connect(Select, 'https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25419-14452', {
  props: {
    label: figma.boolean('Show label', { true: figma.string('Label'), false: undefined }),
    hint: figma.boolean('Show hint', { true: 'Helper text', false: undefined }),
    size: figma.enum('Size', { sm: 'sm', md: 'md', lg: 'lg' }),
    disabled: figma.enum('State', { Disabled: true }),
    error: figma.enum('State', { Error: 'Choose an option' }),
  },
  example: (props) => (
    <Select {...props} placeholder="Select an option" options={[{ value: 'design', label: 'Design' }, { value: 'product', label: 'Product' }]} />
  ),
});
