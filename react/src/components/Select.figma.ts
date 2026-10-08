// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25419-14452
// source=src/components/Select.tsx
// component=Select

import figma from 'figma'

const instance = figma.selectedInstance

const state = instance.getEnum('State', { Disabled: 'disabled', Error: 'error' })

export default {
  id: 'Select',
  imports: ["import { Select } from '@stanvision/atomus-react'"],
  example: figma.tsx`<Select${figma.helpers.react.renderProp(
    'label',
    instance.getBoolean('Show label') ? instance.getString('Label') : undefined,
  )}${figma.helpers.react.renderProp('hint', instance.getBoolean('Show hint') ? 'Helper text' : undefined)}${figma.helpers.react.renderProp(
    'size',
    instance.getEnum('Size', { sm: 'sm', md: 'md', lg: 'lg' }),
  )}${figma.helpers.react.renderProp('disabled', state === 'disabled')}${figma.helpers.react.renderProp(
    'error',
    state === 'error' ? 'Choose an option' : undefined,
  )}
  placeholder="Select an option"
  options={[
    { value: 'design', label: 'Design' },
    { value: 'product', label: 'Product' },
  ]}
/>`,
  metadata: { nestable: true },
}
