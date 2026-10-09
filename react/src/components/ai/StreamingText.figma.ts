// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25544-55
// source=src/components/ai/StreamingText.tsx
// component=StreamingText

import figma from 'figma'

const instance = figma.selectedInstance

const streaming = instance.getEnum('State', { Streaming: true, Done: false }) === true
// Caret only exists on the Streaming variants.
const caret = streaming ? instance.getBoolean('Caret') : true

export default {
  id: 'StreamingText',
  imports: ["import { StreamingText } from '@stanvision/atomus-react'"],
  example: figma.tsx`<StreamingText text={${JSON.stringify(instance.getString('Text'))}}${figma.helpers.react.renderProp('streaming', streaming)}${figma.helpers.react.renderProp(
    'caret',
    caret ? undefined : false,
  )}${figma.helpers.react.renderProp('announce', instance.getEnum('Announce', { End: 'end', Off: 'off' }))} />`,
  metadata: { nestable: true },
}
