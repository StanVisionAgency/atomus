import figma from '@figma/code-connect';
import { MetricCard } from './MetricCard';

figma.connect(MetricCard, 'https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25435-72', {
  props: {
    label: figma.string('Label'),
    value: figma.string('Value'),
    type: figma.enum('Type', { Simple: 'simple', Trend: 'trend', Chart: 'chart' }),
  },
  example: (props) => <MetricCard change="12%" caption="vs last month" data={[4, 6, 5, 8, 7, 10]} {...props} />,
});
