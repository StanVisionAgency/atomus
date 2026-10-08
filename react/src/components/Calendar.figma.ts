// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25430-2200
// source=src/components/DatePicker.tsx
// component=Calendar

import figma from 'figma'

const instance = figma.selectedInstance

const type = instance.getEnum('Type', { Single: 'single', Range: 'range' })

export default {
  id: 'Calendar',
  imports: ["import { Calendar } from '@stanvision/atomus-react'"],
  example:
    type === 'range'
      ? figma.tsx`<Calendar type="range" range={{ start: '2026-10-14', end: '2026-10-18' }} onRangeChange={() => {}} />`
      : figma.tsx`<Calendar value="2026-10-14" onChange={() => {}} />`,
  metadata: { nestable: true },
}
