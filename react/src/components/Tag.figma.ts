// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25421-1092
// source=src/components/Tag.tsx
// component=Tag

import figma from 'figma'

const instance = figma.selectedInstance

const icon = instance.getBoolean('Leading icon')
  ? instance.getInstanceSwap('Leading icon swap')?.executeTemplate().example
  : undefined

export default {
  id: 'Tag',
  imports: ["import { Tag } from '@stanvision/atomus-react'"],
  example: figma.tsx`<Tag${figma.helpers.react.renderProp('size', instance.getEnum('Size', { sm: 'sm', md: 'md', lg: 'lg' }))}${figma.helpers.react.renderProp(
    'icon',
    icon,
  )}${instance.getBoolean('Close') ? ' onRemove={() => {}}' : ''}>${instance.getString('Label')}</Tag>`,
  metadata: { nestable: true },
}
