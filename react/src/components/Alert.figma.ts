// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25427-447
// source=src/components/Alert.tsx
// component=Alert

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

// Action buttons are real Button instances in the Actions frame, so their labels and hierarchy flow through.
const actions = instance.getBoolean('Actions')
  ? instance
      .findConnectedInstances((n) => n.codeConnectId() === 'Button')
      .filter((n): n is InstanceHandle => n.type === 'INSTANCE')
      .map((n) => n.executeTemplate().example)
  : []

export default {
  id: 'Alert',
  imports: ["import { Alert } from '@stanvision/atomus-react'"],
  example: figma.tsx`<Alert${figma.helpers.react.renderProp('title', instance.getString('Title'))}${figma.helpers.react.renderProp(
    'variant',
    instance.getEnum('Style', { Subtle: 'subtle', Outline: 'outline', Solid: 'solid' }),
  )}${figma.helpers.react.renderProp(
    'color',
    instance.getEnum('Color', { Brand: 'brand', Gray: 'gray', Error: 'error', Warning: 'warning', Success: 'success' }),
  )}${nodeProp('actions', actions)}${instance.getBoolean('Close') ? ' onClose={() => {}}' : ''}>${
    instance.getBoolean('Show description') ? instance.getString('Description') : ''
  }</Alert>`,
  metadata: { nestable: true },
}
