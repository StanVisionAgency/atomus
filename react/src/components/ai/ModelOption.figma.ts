// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25546-397
// source=src/components/ai/ModelSelector.tsx
// component=ModelSelector

import figma from 'figma'

const instance = figma.selectedInstance

// "Model option" in Figma = one entry of the ModelSelector `models` array in code.
const label = instance.getString('Name')
const state = instance.getEnum('State', { Default: 'default', Hover: 'default', Selected: 'selected', Disabled: 'disabled' }) ?? 'default'
// "StanVision · Best for long, careful work" → provider + description
const [first, ...rest] = instance.getString('Description').split(' · ')
const provider = rest.length ? first : undefined
const description = rest.length ? rest.join(' · ') : first
const badge = instance.getBoolean('Badge') ? instance.getString('Badge label') : undefined
const value = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const entry = `{ value: ${JSON.stringify(value)}, label: ${JSON.stringify(label)}${provider ? `, provider: ${JSON.stringify(provider)}` : ''}${
  description ? `, description: ${JSON.stringify(description)}` : ''
}${badge ? `, badge: ${JSON.stringify(badge)}` : ''}${state === 'disabled' ? ', disabled: true' : ''} }`

export default {
  id: 'ModelOption',
  imports: ["import { ModelSelector } from '@stanvision/atomus-react'"],
  example: figma.tsx`<ModelSelector models={[${entry}]} />`,
  // Read by the Model selector template to build its `models` array and the selected value.
  metadata: { nestable: true, props: { entry, value, selected: state === 'selected' } },
}
