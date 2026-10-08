// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25427-513
// source=src/components/Toast.tsx
// component=Toast

import figma from 'figma'

const instance = figma.selectedInstance

export default {
  id: 'Toast',
  imports: ["import { Toast } from '@stanvision/atomus-react'"],
  example: figma.tsx`<Toast${figma.helpers.react.renderProp('title', instance.getString('Title'))}${figma.helpers.react.renderProp(
    'description',
    instance.getString('Description'),
  )}${figma.helpers.react.renderProp(
    'color',
    instance.getEnum('Color', { Brand: 'brand', Gray: 'gray', Error: 'error', Warning: 'warning', Success: 'success' }),
  )}${instance.getBoolean('Close') ? ' onClose={() => {}}' : ''} />`,
  metadata: { nestable: true },
}
