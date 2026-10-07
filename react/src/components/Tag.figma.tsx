import figma from '@figma/code-connect';
import { Tag } from './Tag';

figma.connect(Tag, 'https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25421-1092', {
  props: {
    label: figma.string('Label'),
    size: figma.enum('Size', { sm: 'sm', md: 'md', lg: 'lg' }),
    icon: figma.boolean('Leading icon', { true: figma.instance('Leading icon swap'), false: undefined }),
    onRemove: figma.boolean('Close', { true: () => {}, false: undefined }),
  },
  example: ({ label, ...props }) => <Tag {...props}>{label}</Tag>,
});
