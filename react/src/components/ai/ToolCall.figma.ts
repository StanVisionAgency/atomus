// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25548-1134
// source=src/components/ai/ToolCall.tsx
// component=ToolCall

import figma from 'figma'

const instance = figma.selectedInstance

/** "1.5s" → 1500, "320ms" → 320, "1m 05s" → 65000. */
function ms(text: string): number | undefined {
  const t = text.trim()
  const mm = t.match(/^(\d+)m\s*(\d+)s$/)
  if (mm) return (parseInt(mm[1], 10) * 60 + parseInt(mm[2], 10)) * 1000
  const m = t.match(/^([\d.]+)\s*(ms|s)$/)
  if (!m) return undefined
  return Math.round(parseFloat(m[1]) * (m[2] === 's' ? 1000 : 1))
}

/** Code text from the Input / Output layers: JSON stays a JS literal, anything else becomes a string. */
function literal(text: string): string {
  try {
    JSON.parse(text)
    return text.replace(/\n/g, '\n  ')
  } catch {
    return JSON.stringify(text)
  }
}

const status = instance.getEnum('Status', { Pending: 'pending', Running: 'running', Success: 'success', Error: 'error' }) ?? 'success'
const expanded = instance.getEnum('Expanded', { False: false, True: true }) === true
const done = status === 'success' || status === 'error'
const duration = done && instance.getBoolean('Show duration') ? ms(instance.getString('Duration')) : undefined
// Input / Output / Error layers only exist on the expanded variants.
const input = expanded ? ` input={${literal(instance.getString('Input'))}}` : ''
const output = expanded && status === 'success' ? ` output={${literal(instance.getString('Output'))}}` : ''
const error = expanded && status === 'error' ? instance.getString('Error') : status === 'error' ? 'The tool returned an error.' : undefined

export default {
  id: 'ToolCall',
  imports: ["import { ToolCall } from '@stanvision/atomus-react'"],
  example: figma.tsx`<ToolCall
  name=${JSON.stringify(instance.getString('Tool name'))}
  title=${JSON.stringify(instance.getString('Title'))}${figma.helpers.react.renderProp('status', status !== 'success' ? status : undefined)}${figma.helpers.react.renderProp(
    'duration',
    duration,
  )}${input}${output}${figma.helpers.react.renderProp('error', error)}${figma.helpers.react.renderProp('defaultOpen', expanded)}
/>`,
  metadata: { nestable: true },
}
