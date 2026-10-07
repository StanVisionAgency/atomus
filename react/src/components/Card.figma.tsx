import figma from '@figma/code-connect';
import { Card } from './Card';
import { Button } from './Button';

figma.connect(Card, 'https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25425-172', {
  props: {
    title: figma.boolean('Header', { true: figma.string('Title'), false: undefined }),
    supportingText: figma.boolean('Header', { true: figma.string('Supporting text'), false: undefined }),
    headerAction: figma.boolean('Header action', { true: <Button hierarchy="tertiary" size="sm">Edit</Button>, false: undefined }),
    footer: figma.boolean('Footer', {
      true: (
        <>
          <Button hierarchy="outline" size="sm">Cancel</Button>
          <Button hierarchy="primary" size="sm">Save</Button>
        </>
      ),
      false: undefined,
    }),
    variant: figma.enum('Style', { Outlined: 'outlined', Elevated: 'elevated', Filled: 'filled' }),
    padding: figma.enum('Padding', { md: 'md', lg: 'lg' }),
    children: figma.slot('Content'),
  },
  example: ({ children, ...props }) => <Card {...props}>{children}</Card>,
});
