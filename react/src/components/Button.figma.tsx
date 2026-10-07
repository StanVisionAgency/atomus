import figma from '@figma/code-connect';
import { Button } from './Button';

figma.connect(Button, 'https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25416-2898', {
  props: {
    label: figma.string('Label'),
    hierarchy: figma.enum('Hierarchy', { Primary: 'primary', Secondary: 'secondary', Outline: 'outline', Tertiary: 'tertiary', Link: 'link' }),
    size: figma.enum('Size', { xs: 'xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' }),
    disabled: figma.enum('State', { Disabled: true }),
    loading: figma.enum('State', { Loading: true }),
    iconLeading: figma.boolean('Leading icon', { true: figma.instance('Leading icon swap'), false: undefined }),
    iconTrailing: figma.boolean('Trailing icon', { true: figma.instance('Trailing icon swap'), false: undefined }),
  },
  example: ({ label, ...props }) => <Button {...props}>{label}</Button>,
});
