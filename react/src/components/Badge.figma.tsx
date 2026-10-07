import figma from '@figma/code-connect';
import { Badge } from './Badge';

figma.connect(Badge, 'https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25421-1073', {
  props: {
    label: figma.string('Label'),
    size: figma.enum('Size', { sm: 'sm', md: 'md', lg: 'lg' }),
    variant: figma.enum('Style', { Light: 'light', Solid: 'solid' }),
    color: figma.enum('Color', { Gray: 'gray', Brand: 'brand', Error: 'error', Warning: 'warning', Success: 'success' }),
    dot: figma.boolean('Dot'),
    icon: figma.boolean('Leading icon', { true: figma.instance('Leading icon swap'), false: undefined }),
    onClose: figma.boolean('Close', { true: () => {}, false: undefined }),
  },
  example: ({ label, ...props }) => <Badge {...props}>{label}</Badge>,
});
