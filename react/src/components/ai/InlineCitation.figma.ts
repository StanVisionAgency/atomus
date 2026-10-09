// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25547-946
// source=src/components/ai/Sources.tsx
// component=InlineCitation

import figma from 'figma'

const instance = figma.selectedInstance

const index = parseInt(instance.getString('Number'), 10) || 1
const domain = instance.getString('Domain')

export default {
  id: 'InlineCitation',
  imports: ["import { InlineCitation } from '@stanvision/atomus-react'"],
  example: figma.tsx`<InlineCitation
  index={${index}}
  source={{ id: ${JSON.stringify(String(index))}, title: ${JSON.stringify(instance.getString('Title'))}, url: ${JSON.stringify(
    `https://${domain}`,
  )}, snippet: ${JSON.stringify(instance.getString('Snippet'))} }}
/>`,
  metadata: { nestable: true },
}
