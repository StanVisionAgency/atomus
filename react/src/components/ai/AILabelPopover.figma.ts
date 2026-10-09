// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25543-124
// source=src/components/ai/AILabel.tsx
// component=AILabel

import figma from 'figma'

const instance = figma.selectedInstance

// "AI label popover" in Figma = the explainability popover an AILabel opens in code.
const title = instance.getString('Title')
const model = instance.getBoolean('Show model') ? instance.getString('Model') : undefined
const revert = instance.getBoolean('Revert to AI')

export default {
  id: 'AILabelPopover',
  imports: ["import { AILabel } from '@stanvision/atomus-react'"],
  example: figma.tsx`<AILabel
  explanation={<p>${instance.getString('Explanation')}</p>}${figma.helpers.react.renderProp(
    'explanationTitle',
    title !== 'About this AI content' ? title : undefined,
  )}${figma.helpers.react.renderProp('model', model)}${revert ? ' edited onRevert={() => {}}' : ''}
/>`,
  metadata: { nestable: false },
}
