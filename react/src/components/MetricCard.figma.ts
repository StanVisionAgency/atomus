// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25435-72
// source=src/components/MetricCard.tsx
// component=MetricCard

import figma from 'figma'

const instance = figma.selectedInstance

export default {
  id: 'MetricCard',
  imports: ["import { MetricCard } from '@stanvision/atomus-react'"],
  example: figma.tsx`<MetricCard${figma.helpers.react.renderProp('label', instance.getString('Label'))}${figma.helpers.react.renderProp(
    'value',
    instance.getString('Value'),
  )}${figma.helpers.react.renderProp(
    'type',
    instance.getEnum('Type', { Simple: 'simple', Trend: 'trend', Chart: 'chart' }),
  )} change="12%" caption="vs last month" data={[4, 6, 5, 8, 7, 10]} />`,
  metadata: { nestable: true },
}
