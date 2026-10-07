import figma from '@figma/code-connect';
import { ProgressBar } from './ProgressBar';

figma.connect(ProgressBar, 'https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25429-686', {
  props: {
    labelPosition: figma.enum('Label', { None: 'none', Right: 'right', Bottom: 'bottom' }),
  },
  example: (props) => <ProgressBar value={40} label="Upload progress" {...props} />,
});
