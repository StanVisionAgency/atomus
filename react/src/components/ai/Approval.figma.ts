// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25550-1196
// source=src/components/ai/Approval.tsx
// component=Approval

import figma from 'figma'

const instance = figma.selectedInstance

const status = instance.getEnum('State', { Pending: 'pending', Approved: 'approved', Denied: 'denied' }) ?? 'pending'
const pending = status === 'pending'
const toolName = instance.getBoolean('Show tool name') ? instance.getString('Tool name') : undefined
const summary = instance.getBoolean('Show summary') ? instance.getString('Summary') : undefined
const editable = pending && instance.getBoolean('Editable')
const details = instance.getBoolean('Show details') && !editable ? instance.getSlot('Details') : undefined

// The checkbox label and button labels come from the nested library instances (exposed on the Approval instance).
const labelOf = (layer: string, prop: string) => {
  const node = instance.findInstance(layer)
  return node.type === 'INSTANCE' ? node.getString(prop) : undefined
}
const alwaysAllowLabel = pending && instance.getBoolean('Always allow') ? labelOf('Always allow', 'Label') : undefined
const approveLabel = pending ? labelOf('Approve', 'Label') : undefined
const denyLabel = pending ? labelOf('Deny', 'Label') : undefined

const head = figma.tsx`<Approval
  title=${JSON.stringify(instance.getString('Title'))}${figma.helpers.react.renderProp(
    'risk',
    instance.getEnum('Risk', { Low: 'low', High: 'high' }),
  )}${figma.helpers.react.renderProp('toolName', toolName)}${figma.helpers.react.renderProp('details', details)}${
    editable ? '\n  editableText="Text the person can edit before approving"' : ''
  }${figma.helpers.react.renderProp('alwaysAllowLabel', alwaysAllowLabel)}${figma.helpers.react.renderProp(
    'approveLabel',
    approveLabel && approveLabel !== 'Approve' ? approveLabel : undefined,
  )}${figma.helpers.react.renderProp('denyLabel', denyLabel && denyLabel !== 'Deny' ? denyLabel : undefined)}${figma.helpers.react.renderProp(
    'status',
    pending ? undefined : status,
  )}
  onApprove={(decision) => {}}
  onDeny={() => {}}`

export default {
  id: 'Approval',
  imports: ["import { Approval } from '@stanvision/atomus-react'"],
  example: summary
    ? figma.tsx`${head}
>
  ${summary}
</Approval>`
    : figma.tsx`${head}
/>`,
  metadata: { nestable: true },
}
