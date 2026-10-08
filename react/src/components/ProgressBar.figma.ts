// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25429-686
// source=src/components/ProgressBar.tsx
// component=ProgressBar

import figma from 'figma'

const instance = figma.selectedInstance

export default {
  id: 'ProgressBar',
  imports: ["import { ProgressBar } from '@stanvision/atomus-react'"],
  example: figma.tsx`<ProgressBar value={40} label="Upload progress"${figma.helpers.react.renderProp(
    'labelPosition',
    instance.getEnum('Label', { None: 'none', Right: 'right', Bottom: 'bottom' }),
  )} />`,
  metadata: { nestable: true },
}
