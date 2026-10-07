import figma from '@figma/code-connect';
import { AppHeader, NavItem, SidebarNavigation } from './Navigation';

figma.connect(NavItem, 'https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25431-67', {
  props: {
    label: figma.string('Label'),
    icon: figma.instance('Icon swap'),
    badge: figma.boolean('Badge', { true: 12, false: undefined }),
    chevron: figma.boolean('Chevron'),
    collapsed: figma.enum('Collapsed', { True: true, False: false }),
    active: figma.enum('State', { Active: true }),
  },
  example: (props) => <NavItem href="/" {...props} />,
});

figma.connect(SidebarNavigation, 'https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25431-195', {
  props: { collapsed: figma.enum('Collapsed', { True: true, False: false }) },
  example: (props) => (
    <SidebarNavigation {...props}>
      <NavItem label="Home" href="/" active />
      <NavItem label="Projects" href="/projects" />
    </SidebarNavigation>
  ),
});

figma.connect(AppHeader, 'https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25431-196', {
  example: () => <AppHeader brand="Atomus" nav={<NavItem label="Dashboard" href="/" active />} />,
});
