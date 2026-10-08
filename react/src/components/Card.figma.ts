// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25425-172
// source=src/components/Card.tsx
// component=Card

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

const header = instance.getBoolean('Header')

// Header action: the nested "Action" instance (Button icon), rendered from its own template.
let headerAction: Sections[] = []
if (header && instance.getBoolean('Header action')) {
  const action = instance.findInstance('Action')
  if (action.type === 'INSTANCE' && action.hasCodeConnect()) headerAction = [action.executeTemplate().example]
}

// Footer: whatever Button instances sit in the Footer frame (not hard-coded Cancel/Save).
let footer: Sections[] = []
if (instance.getBoolean('Footer')) {
  const isButton = (n: InstanceHandle) => n.codeConnectId() === 'Button'
  let buttons = instance.findConnectedInstances(isButton, { path: ['Footer'] })
  if (buttons.length === 0) buttons = instance.findConnectedInstances((n) => isButton(n) && !n.__containingSlotName__)
  footer = buttons.filter((n): n is InstanceHandle => n.type === 'INSTANCE').map((n) => n.executeTemplate().example)
}

export default {
  id: 'Card',
  imports: ["import { Card } from '@stanvision/atomus-react'"],
  example: figma.tsx`<Card${figma.helpers.react.renderProp('title', header ? instance.getString('Title') : undefined)}${figma.helpers.react.renderProp(
    'supportingText',
    header ? instance.getString('Supporting text') : undefined,
  )}${nodeProp('headerAction', headerAction)}${nodeProp('footer', footer)}${figma.helpers.react.renderProp(
    'variant',
    instance.getEnum('Style', { Outlined: 'outlined', Elevated: 'elevated', Filled: 'filled' }),
  )}${figma.helpers.react.renderProp('padding', instance.getEnum('Padding', { md: 'md', lg: 'lg' }))}>
  ${instance.getSlot('Content')}
</Card>`,
  metadata: { nestable: true },
}
