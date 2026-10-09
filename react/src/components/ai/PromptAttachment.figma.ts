// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25553-1183
// source=src/components/ai/PromptInput.tsx
// component=PromptInput

import figma from 'figma'

const instance = figma.selectedInstance

// "Prompt attachment" in Figma = one entry of the PromptInput `attachments` array in code.
const status = instance.getEnum('Status', { Ready: 'ready', Uploading: 'uploading', Error: 'error' }) ?? 'ready'
const name = instance.getString('Name')
// Size only exists on the Ready variant; the others show "Uploading…" / "Upload failed".
const size = status === 'ready' ? instance.getString('Size') : undefined
const kind = /\.(png|jpe?g|gif|webp|svg)$/i.test(name) ? 'image' : undefined
const entry = `{ id: ${JSON.stringify(name)}, name: ${JSON.stringify(name)}${kind ? ", kind: 'image'" : ''}${size ? `, size: ${JSON.stringify(size)}` : ''}${
  status !== 'ready' ? `, status: '${status}'` : ''
} }`

export default {
  id: 'PromptAttachment',
  imports: ["import { PromptInput } from '@stanvision/atomus-react'"],
  example: figma.tsx`<PromptInput attachments={[${entry}]}${instance.getBoolean('Removable') ? ' onRemoveAttachment={(id) => {}}' : ''} onSubmit={(text, files) => {}} />`,
  // Read by the Prompt input template to build its `attachments` array.
  metadata: { nestable: true, props: { entry } },
}
