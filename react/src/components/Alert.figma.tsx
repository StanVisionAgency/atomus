import figma from '@figma/code-connect';
import { Alert } from './Alert';
import { Button } from './Button';

figma.connect(Alert, 'https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25427-447', {
  props: {
    title: figma.string('Title'),
    description: figma.boolean('Show description', { true: figma.string('Description'), false: undefined }),
    variant: figma.enum('Style', { Subtle: 'subtle', Outline: 'outline' }),
    color: figma.enum('Color', { Brand: 'brand', Gray: 'gray', Error: 'error', Warning: 'warning', Success: 'success' }),
    actions: figma.boolean('Actions', {
      true: (
        <>
          <Button hierarchy="tertiary" size="sm">Dismiss</Button>
          <Button hierarchy="link" size="sm">View changes</Button>
        </>
      ),
      false: undefined,
    }),
    onClose: figma.boolean('Close', { true: () => {}, false: undefined }),
  },
  example: ({ description, ...props }) => <Alert {...props}>{description}</Alert>,
});
