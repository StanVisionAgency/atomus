// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25430-2256
// source=src/components/DatePicker.tsx
// component=DatePicker

import figma from 'figma'

const instance = figma.selectedInstance

const state = instance.getEnum('State', { Disabled: 'disabled', Error: 'error' })

export default {
  id: 'DatePicker',
  imports: ["import { DatePicker } from '@stanvision/atomus-react'"],
  example: figma.tsx`<DatePicker${figma.helpers.react.renderProp('label', instance.getString('Label'))}${figma.helpers.react.renderProp(
    'disabled',
    state === 'disabled',
  )}${figma.helpers.react.renderProp('error', state === 'error' ? 'Pick a date after today' : undefined)} value={null} onChange={() => {}} />`,
  metadata: { nestable: true },
}
