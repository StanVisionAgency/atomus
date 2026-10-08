// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25431-196
// source=src/components/Navigation.tsx
// component=AppHeader

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

// Right-hand actions (icon buttons, avatar) are rendered from their own templates.
const actions = instance
  .findConnectedInstances((n) => n.codeConnectId() === 'ButtonIcon' || n.codeConnectId() === 'Avatar')
  .filter((n): n is InstanceHandle => n.type === 'INSTANCE')
  .map((n) => n.executeTemplate().example)

export default {
  id: 'AppHeader',
  imports: ["import { AppHeader, NavItem } from '@stanvision/atomus-react'"],
  example: figma.tsx`<AppHeader brand="Atomus" nav={<NavItem label="Dashboard" href="/" active />}${nodeProp('actions', actions)} />`,
  metadata: { nestable: false },
}
