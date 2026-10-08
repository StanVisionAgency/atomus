// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25433-71
// source=src/components/EmptyState.tsx
// component=EmptyState

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

const actions = instance.getBoolean('Actions')
  ? instance
      .findConnectedInstances((n) => n.codeConnectId() === 'Button')
      .filter((n): n is InstanceHandle => n.type === 'INSTANCE')
      .map((n) => n.executeTemplate().example)
  : []

export default {
  id: 'EmptyState',
  imports: ["import { EmptyState } from '@stanvision/atomus-react'"],
  example: figma.tsx`<EmptyState${figma.helpers.react.renderProp('title', instance.getString('Title'))}${figma.helpers.react.renderProp(
    'description',
    instance.getString('Description'),
  )}${figma.helpers.react.renderProp('size', instance.getEnum('Size', { sm: 'sm', md: 'md' }))}${nodeProp('actions', actions)} />`,
  metadata: { nestable: true },
}
