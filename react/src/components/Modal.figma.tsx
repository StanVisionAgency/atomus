import figma from '@figma/code-connect';
import { Modal } from './Modal';
import { Button } from './Button';

figma.connect(Modal, 'https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25424-453', {
  props: {
    title: figma.string('Title'),
    description: figma.string('Description'),
    featuredIcon: figma.boolean('Featured icon'),
    closeButton: figma.boolean('Close button'),
    size: figma.enum('Size', { sm: 'sm', md: 'md', lg: 'lg' }),
    type: figma.enum('Type', { Default: 'default', Destructive: 'destructive' }),
    actions: figma.boolean('Actions', {
      true: (
        <>
          <Button hierarchy="outline">Cancel</Button>
          <Button hierarchy="primary">Confirm</Button>
        </>
      ),
      false: undefined,
    }),
    children: figma.slot('Content'),
  },
  example: ({ children, ...props }) => <Modal open onClose={() => {}} {...props}>{children}</Modal>,
});
