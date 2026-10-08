// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25418-1714
// source=src/components/Input.tsx
// component=Input

import figma from 'figma'

const instance = figma.selectedInstance

const state = instance.getEnum('State', { Disabled: 'disabled', Error: 'error' })

export default {
  id: 'Input',
  imports: ["import { Input } from '@stanvision/atomus-react'"],
  example: figma.tsx`<Input placeholder="Placeholder"${figma.helpers.react.renderProp(
    'label',
    instance.getBoolean('Show label') ? instance.getString('Label') : undefined,
  )}${figma.helpers.react.renderProp('hint', instance.getBoolean('Show hint') ? instance.getString('Hint') : undefined)}${figma.helpers.react.renderProp(
    'size',
    instance.getEnum('Size', { sm: 'sm', md: 'md', lg: 'lg' }),
  )}${figma.helpers.react.renderProp('disabled', state === 'disabled')}${figma.helpers.react.renderProp(
    'error',
    state === 'error' ? 'Describe how to fix the error' : undefined,
  )} />`,
  metadata: { nestable: true },
}
