// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25543-123
// source=src/components/ai/AILabel.tsx
// component=AILabel

import figma from 'figma'

const instance = figma.selectedInstance

const edited = instance.getEnum('Edited', { False: false, True: true }) === true
const style = instance.getEnum('Style', { Chip: 'chip', Inline: 'inline', Icon: 'icon' })
// Edited variants always read "Edited" and have no Label property.
const label = edited ? undefined : instance.getString('Label')
const popover = instance.getBoolean('Explainability popover')

export default {
  id: 'AILabel',
  imports: ["import { AILabel } from '@stanvision/atomus-react'"],
  example: figma.tsx`<AILabel${figma.helpers.react.renderProp('label', label && label !== 'AI' ? label : undefined)}${figma.helpers.react.renderProp(
    'size',
    instance.getEnum('Size', { xs: 'xs', md: 'md' }),
  )}${figma.helpers.react.renderProp('variant', style === 'chip' ? undefined : style)}${figma.helpers.react.renderProp('edited', edited)}${
    popover ? ' explanation={<p>Why this content was generated and what it is based on.</p>} model="Atomus Fast"' : ''
  }${edited && popover ? ' onRevert={() => {}}' : ''} />`,
  metadata: { nestable: true },
}
