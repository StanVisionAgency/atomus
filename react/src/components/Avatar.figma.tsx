import figma from '@figma/code-connect';
import { Avatar } from './Avatar';

figma.connect(Avatar, 'https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25422-267', {
  props: {
    size: figma.enum('Size', { xs: 'xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl', '2xl': '2xl' }),
    shape: figma.enum('Shape', { Circle: 'circle', Rounded: 'rounded' }),
    initials: figma.enum('Type', { Initials: figma.string('Initials') }),
    src: figma.enum('Type', { Image: '/avatar.jpg' }),
    icon: figma.enum('Type', { Icon: figma.instance('Icon swap') }),
    status: figma.boolean('Status', { true: 'online', false: undefined }),
  },
  example: (props) => <Avatar name="Olivia Rhye" {...props} />,
});
