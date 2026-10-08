// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25431-195
// source=src/components/Navigation.tsx
// component=SidebarNavigation

import figma from 'figma'
import type { InstanceHandle } from 'figma'

const instance = figma.selectedInstance

// The Nav item instances in the sidebar become its children (labels, icons, active state flow through).
const items = instance
  .findConnectedInstances((n) => n.codeConnectId() === 'NavItem')
  .filter((n): n is InstanceHandle => n.type === 'INSTANCE')
  .map((n) => n.executeTemplate().example)
const children = items.reduce((acc, ex) => figma.tsx`${acc}\n  ${ex}`, figma.tsx``)

export default {
  id: 'SidebarNavigation',
  imports: ["import { SidebarNavigation } from '@stanvision/atomus-react'"],
  example: figma.tsx`<SidebarNavigation${figma.helpers.react.renderProp(
    'collapsed',
    instance.getEnum('Collapsed', { True: true, False: false }),
  )}>${children}
</SidebarNavigation>`,
  metadata: { nestable: false },
}
