// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25548-901
// source=src/components/ai/Reasoning.tsx
// component=Reasoning

import figma from 'figma'

const instance = figma.selectedInstance

// "Reasoning step" in Figma = one entry of the Reasoning `steps` array in code.
const label = instance.getString('Label')
const detail = instance.getBoolean('Show detail') ? instance.getString('Detail') : undefined
const status = instance.getEnum('Status', { Done: 'done', Active: 'active', Pending: 'pending' }) ?? 'done'
const entry = `{ label: ${JSON.stringify(label)}${detail ? `, detail: ${JSON.stringify(detail)}` : ''}${status !== 'done' ? `, status: '${status}'` : ''} }`

export default {
  id: 'ReasoningStep',
  imports: ["import { Reasoning } from '@stanvision/atomus-react'"],
  example: figma.tsx`<Reasoning steps={[${entry}]} />`,
  // Read by the Reasoning template to build its `steps` array.
  metadata: { nestable: true, props: { entry } },
}
