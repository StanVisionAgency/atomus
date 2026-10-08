// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25424-453
// source=src/components/Modal.tsx
// component=Modal

import figma from 'figma'
import type { InstanceHandle } from 'figma'

const instance = figma.selectedInstance

type Sections = ReturnType<InstanceHandle['executeTemplate']>['example']

/** Renders nested instance snippets as one JSX prop: ` name={<Child />}` or ` name={<>…</>}`. */
function nodeProp(name: string, list: Sections[]) {
  if (list.length === 0) return ''
  if (list.length === 1) return figma.tsx` ${name}={${list[0]}}`
  const body = list.reduce((acc, ex) => figma.tsx`${acc}\n    ${ex}`, figma.tsx``)
  return figma.tsx` ${name}={<>${body}\n  </>}`
}

// Actions: the Button instances in the Actions frame (not hard-coded Cancel/Confirm).
let actions: Sections[] = []
if (instance.getBoolean('Actions')) {
  const isButton = (n: InstanceHandle) => n.codeConnectId() === 'Button'
  let buttons = instance.findConnectedInstances(isButton, { path: ['Actions'] })
  if (buttons.length === 0) buttons = instance.findConnectedInstances((n) => isButton(n) && !n.__containingSlotName__)
  actions = buttons.filter((n): n is InstanceHandle => n.type === 'INSTANCE').map((n) => n.executeTemplate().example)
}

export default {
  id: 'Modal',
  imports: ["import { Modal } from '@stanvision/atomus-react'"],
  example: figma.tsx`<Modal
  open
  onClose={() => {}}${figma.helpers.react.renderProp('title', instance.getString('Title'))}${figma.helpers.react.renderProp(
    'description',
    instance.getString('Description'),
  )}${figma.helpers.react.renderProp('featuredIcon', instance.getBoolean('Featured icon'))}${instance.getBoolean('Close button') ? '' : ' closeButton={false}'}${figma.helpers.react.renderProp('size', instance.getEnum('Size', { sm: 'sm', md: 'md', lg: 'lg' }))}${figma.helpers.react.renderProp(
    'type',
    instance.getEnum('Type', { Default: 'default', Destructive: 'destructive' }),
  )}${nodeProp('actions', actions)}
>
  ${instance.getSlot('Content')}
</Modal>`,
  metadata: { nestable: false },
}
