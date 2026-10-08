// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25420-988
// source=src/components/Choice.tsx
// component=Toggle

import figma from 'figma'

const instance = figma.selectedInstance

const checked = instance.getEnum('Checked', { True: 'true', False: 'false', Indeterminate: 'indeterminate' })

export default {
  id: 'Toggle',
  imports: ["import { Toggle } from '@stanvision/atomus-react'"],
  example: figma.tsx`<Toggle${figma.helpers.react.renderProp(
    'label',
    instance.getBoolean('Show label') ? instance.getString('Label') : undefined,
  )}${figma.helpers.react.renderProp(
    'description',
    instance.getBoolean('Show description') ? instance.getString('Description') : undefined,
  )}${figma.helpers.react.renderProp('size', instance.getEnum('Size', { sm: 'sm', md: 'md' }))}${figma.helpers.react.renderProp('shape', instance.getEnum('Shape', { Pill: 'pill', Square: 'square' }))}${figma.helpers.react.renderProp(
    'defaultChecked',
    checked === 'true',
  )}${figma.helpers.react.renderProp('disabled', instance.getEnum('State', { Disabled: true }) === true)} />`,
  metadata: { nestable: true },
}
