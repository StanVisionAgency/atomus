import figma from '@figma/code-connect';
import { EmptyState } from './EmptyState';
import { Button } from './Button';

figma.connect(EmptyState, 'https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25433-71', {
  props: {
    title: figma.string('Title'),
    description: figma.string('Description'),
    size: figma.enum('Size', { sm: 'sm', md: 'md' }),
    actions: figma.boolean('Actions', {
      true: (
        <>
          <Button hierarchy="outline">Clear search</Button>
          <Button hierarchy="primary">New project</Button>
        </>
      ),
      false: undefined,
    }),
  },
  example: (props) => <EmptyState {...props} />,
});
