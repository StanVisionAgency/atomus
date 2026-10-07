import figma from '@figma/code-connect';
import { Tabs } from './Tabs';

figma.connect(Tabs, 'https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25423-513', {
  props: {
    variant: figma.enum('Style', { Underline: 'underline', Pill: 'pill', Segmented: 'segmented' }),
  },
  example: (props) => (
    <Tabs
      {...props}
      aria-label="Project sections"
      items={[
        { value: 'overview', label: 'Overview' },
        { value: 'analytics', label: 'Analytics' },
        { value: 'reports', label: 'Reports' },
        { value: 'settings', label: 'Settings' },
      ]}
    />
  ),
});
