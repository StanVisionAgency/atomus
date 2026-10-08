// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25419-933
// source=src/components/Menu.tsx
// component=MenuItem

import figma from 'figma'

const instance = figma.selectedInstance

const label = instance.getString('Label')
const shortcut = instance.getBoolean('Shortcut') ? instance.getString('Shortcut text') : undefined
const state = instance.getEnum('State', { Selected: 'selected', Disabled: 'disabled' })
const icon = instance.getBoolean('Leading icon')
  ? instance.getInstanceSwap('Leading icon swap')?.executeTemplate().example
  : undefined

export default {
  id: 'MenuItem',
  imports: ["import { MenuItem } from '@stanvision/atomus-react'"],
  example: figma.tsx`<MenuItem${figma.helpers.react.renderProp('label', label)}${figma.helpers.react.renderProp(
    'icon',
    icon,
  )}${figma.helpers.react.renderProp('shortcut', shortcut)}${figma.helpers.react.renderProp(
    'size',
    instance.getEnum('Size', { sm: 'sm', md: 'md' }),
  )}${figma.helpers.react.renderProp('selected', state === 'selected')}${figma.helpers.react.renderProp(
    'disabled',
    state === 'disabled',
  )} onSelect={() => {}} />`,
  // Read by the Dropdown menu template to build its `items` array.
  metadata: { nestable: true, props: { label, shortcut, disabled: state === 'disabled' } },
}
