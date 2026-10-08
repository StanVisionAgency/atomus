// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25416-17407
// source=src/components/Button.tsx
// component=Button

import figma from 'figma'

const instance = figma.selectedInstance

// Figma "Button icon" is the icon-only Button in code (iconOnly + aria-label).
const icon = instance.getInstanceSwap('Icon')
const iconName = icon && icon.type === 'INSTANCE' ? icon.name.replace(/^icon\//, '').replace(/[-_]/g, ' ') : 'Action'
const state = instance.getEnum('State', { Disabled: 'disabled', Loading: 'loading' })

export default {
  id: 'ButtonIcon',
  imports: ["import { Button } from '@stanvision/atomus-react'"],
  example: figma.tsx`<Button iconOnly aria-label="${iconName}"${figma.helpers.react.renderProp(
    'hierarchy',
    instance.getEnum('Hierarchy', { Primary: 'primary', Secondary: 'secondary', Outline: 'outline', Tertiary: 'tertiary' }),
  )}${figma.helpers.react.renderProp('size', instance.getEnum('Size', { xs: 'xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' }))}${figma.helpers.react.renderProp(
    'disabled',
    state === 'disabled',
  )}${figma.helpers.react.renderProp('loading', state === 'loading')}${figma.helpers.react.renderProp(
    'iconLeading',
    icon && icon.type === 'INSTANCE' ? icon.executeTemplate().example : undefined,
  )} />`,
  metadata: { nestable: true },
}
