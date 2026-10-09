// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25545-252
// source=src/components/ai/Suggestions.tsx
// component=Suggestions

import figma from 'figma'

const instance = figma.selectedInstance

// "Suggestion" in Figma = one item of the Suggestions `suggestions` array in code.
const card = instance.getEnum('Style', { Chip: false, Card: true }) === true
const label = instance.getString('Label')
const description = card ? instance.getString('Description') : undefined
const mode = instance.getEnum('Action', { Send: undefined, Insert: 'insert' })

export default {
  id: 'Suggestion',
  imports: ["import { Suggestions } from '@stanvision/atomus-react'"],
  example: figma.tsx`<Suggestions${figma.helpers.react.renderProp('variant', card ? 'cards' : undefined)}${figma.helpers.react.renderProp(
    'mode',
    mode,
  )} suggestions={[${card ? `{ label: ${JSON.stringify(label)}, description: ${JSON.stringify(description)} }` : JSON.stringify(label)}]} onSelect={(prompt) => {}} />`,
  // Read by the Suggestions template to build its `suggestions` array.
  metadata: { nestable: true, props: { label, description } },
}
