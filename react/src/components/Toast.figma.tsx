import figma from '@figma/code-connect';
import { Toast } from './Toast';

figma.connect(Toast, 'https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25427-513', {
  props: {
    title: figma.string('Title'),
    description: figma.string('Description'),
    color: figma.enum('Color', { Brand: 'brand', Gray: 'gray', Error: 'error', Warning: 'warning', Success: 'success' }),
    onClose: figma.boolean('Close', { true: () => {}, false: undefined }),
  },
  example: (props) => <Toast {...props} />,
});
