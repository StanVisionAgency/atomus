// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25416-2898
// source=src/components/Button.tsx
// component=Button

import figma from 'figma'

const instance = figma.selectedInstance

const label = instance.getString('Label')
const state = instance.getEnum('State', { Disabled: 'disabled', Loading: 'loading' })
const iconLeading = instance.getBoolean('Leading icon')
  ? instance.getInstanceSwap('Leading icon swap')?.executeTemplate().example
  : undefined
const iconTrailing = instance.getBoolean('Trailing icon')
  ? instance.getInstanceSwap('Trailing icon swap')?.executeTemplate().example
  : undefined

export default {
  id: 'Button',
  imports: ["import { Button } from '@stanvision/atomus-react'"],
  example: figma.tsx`<Button${figma.helpers.react.renderProp(
    'hierarchy',
    instance.getEnum('Hierarchy', { Primary: 'primary', Secondary: 'secondary', Outline: 'outline', Tertiary: 'tertiary', Link: 'link' }),
  )}${figma.helpers.react.renderProp('size', instance.getEnum('Size', { xs: 'xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' }))}${figma.helpers.react.renderProp(
    'disabled',
    state === 'disabled',
  )}${figma.helpers.react.renderProp('loading', state === 'loading')}${figma.helpers.react.renderProp(
    'iconLeading',
    iconLeading,
  )}${figma.helpers.react.renderProp('iconTrailing', iconTrailing)}>${label}</Button>`,
  metadata: { nestable: true, props: { label } },
}
