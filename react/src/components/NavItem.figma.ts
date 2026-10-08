// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25431-67
// source=src/components/Navigation.tsx
// component=NavItem

import figma from 'figma'

const instance = figma.selectedInstance

export default {
  id: 'NavItem',
  imports: ["import { NavItem } from '@stanvision/atomus-react'"],
  example: figma.tsx`<NavItem href="/"${figma.helpers.react.renderProp('label', instance.getString('Label'))}${figma.helpers.react.renderProp(
    'icon',
    instance.getInstanceSwap('Icon swap')?.executeTemplate().example,
  )}${figma.helpers.react.renderProp('badge', instance.getBoolean('Badge') ? 12 : undefined)}${figma.helpers.react.renderProp(
    'chevron',
    instance.getBoolean('Chevron'),
  )}${figma.helpers.react.renderProp('collapsed', instance.getEnum('Collapsed', { True: true, False: false }))}${figma.helpers.react.renderProp(
    'active',
    instance.getEnum('State', { Active: true }) === true,
  )} />`,
  metadata: { nestable: true },
}
