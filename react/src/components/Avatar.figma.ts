// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25422-267
// source=src/components/Avatar.tsx
// component=Avatar

import figma from 'figma'

const instance = figma.selectedInstance

const type = instance.getEnum('Type', { Initials: 'initials', Image: 'image', Icon: 'icon' })
const icon = type === 'icon' ? instance.getInstanceSwap('Icon swap')?.executeTemplate().example : undefined

export default {
  id: 'Avatar',
  imports: ["import { Avatar } from '@stanvision/atomus-react'"],
  example: figma.tsx`<Avatar name="Olivia Rhye"${figma.helpers.react.renderProp(
    'size',
    instance.getEnum('Size', { xs: 'xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl', '2xl': '2xl' }),
  )}${figma.helpers.react.renderProp('shape', instance.getEnum('Shape', { Circle: 'circle', Rounded: 'rounded' }))}${figma.helpers.react.renderProp(
    'initials',
    type === 'initials' ? instance.getString('Initials') : undefined,
  )}${figma.helpers.react.renderProp('src', type === 'image' ? '/avatar.jpg' : undefined)}${figma.helpers.react.renderProp(
    'icon',
    icon,
  )}${figma.helpers.react.renderProp('status', instance.getBoolean('Status') ? 'online' : undefined)} />`,
  metadata: { nestable: true },
}
