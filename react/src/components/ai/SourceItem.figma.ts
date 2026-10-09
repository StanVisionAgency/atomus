// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25547-794
// source=src/components/ai/Sources.tsx
// component=Sources

import figma from 'figma'

const instance = figma.selectedInstance

// "Source item" in Figma = one entry of the Sources `sources` array in code.
const title = instance.getString('Title')
const domain = instance.getString('Domain')
const snippet = instance.getBoolean('Show snippet') ? instance.getString('Snippet') : undefined
const url = instance.getBoolean('Link') ? `https://${domain}` : undefined
const id = String(instance.getString('Number'))
const entry = `{ id: ${JSON.stringify(id)}, title: ${JSON.stringify(title)}${url ? `, url: ${JSON.stringify(url)}` : `, domain: ${JSON.stringify(domain)}`}${
  snippet ? `, snippet: ${JSON.stringify(snippet)}` : ''
} }`

export default {
  id: 'SourceItem',
  imports: ["import { Sources } from '@stanvision/atomus-react'"],
  example: figma.tsx`<Sources variant="list" sources={[${entry}]} />`,
  // Read by the Sources template to build its `sources` array.
  metadata: { nestable: true, props: { entry } },
}
