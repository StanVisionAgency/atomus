// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25544-34
// source=src/components/ai/StreamingText.tsx
// component=Shimmer

import figma from 'figma'

const instance = figma.selectedInstance

const label = instance.getString('Label')

export default {
  id: 'Shimmer',
  imports: ["import { Shimmer } from '@stanvision/atomus-react'"],
  example: figma.tsx`<Shimmer${figma.helpers.react.renderProp('active', instance.getBoolean('Animated') ? undefined : false)}>${label}</Shimmer>`,
  metadata: { nestable: true, props: { label } },
}
