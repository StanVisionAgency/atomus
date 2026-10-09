// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25545-219
// source=src/components/ai/Feedback.tsx
// component=Feedback

import figma from 'figma'

const instance = figma.selectedInstance

const rating = instance.getEnum('Rating', { None: undefined, Up: 'up', Down: 'down' })
// Form only exists on the Up / Down variants.
const form = rating ? instance.getBoolean('Form') : false

export default {
  id: 'Feedback',
  imports: ["import { Feedback } from '@stanvision/atomus-react'"],
  example: figma.tsx`<Feedback${figma.helpers.react.renderProp('size', instance.getEnum('Size', { sm: 'sm' }))}${figma.helpers.react.renderProp(
    'defaultValue',
    rating,
  )}${rating === 'up' && form ? " positiveReasons={['Accurate', 'Clear and concise', 'Saved me time']}" : ''}${
    rating === 'down' && !form ? ' reasons={[]}' : ''
  } onSubmit={(feedback) => {}} />`,
  metadata: { nestable: true },
}
