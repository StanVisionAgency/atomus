// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25547-925
// source=src/components/ai/Sources.tsx
// component=Sources

import figma from 'figma'
import type { InstanceHandle } from 'figma'

const instance = figma.selectedInstance

const list = instance.getEnum('Style', { Collapsible: false, List: true }) === true
const expanded = instance.getEnum('Expanded', { False: false, True: true }) === true
// Only the collapsible style has a Label; "3 sources" is the default text, so it is not repeated.
const label = list ? undefined : instance.getString('Label')

const entries = instance
  .findConnectedInstances((n) => n.codeConnectId() === 'SourceItem')
  .filter((n): n is InstanceHandle => n.type === 'INSTANCE')
  .map((n) => String((n.executeTemplate().metadata?.props as { entry?: string } | undefined)?.entry ?? ''))
  .filter(Boolean)
const sources = (
  entries.length
    ? entries
    : [
        "{ id: '1', title: 'Understanding SC 1.4.3: Contrast (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum' }",
        "{ id: '2', title: 'Understanding SC 3.3.2: Labels or Instructions', url: 'https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions' }",
        "{ id: '3', title: 'Understanding SC 2.4.3: Focus Order', url: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-order' }",
      ]
)
  .map((e) => `    ${e},`)
  .join('\n')

export default {
  id: 'Sources',
  imports: ["import { Sources } from '@stanvision/atomus-react'"],
  example: figma.tsx`<Sources${figma.helpers.react.renderProp('variant', list ? 'list' : undefined)}${figma.helpers.react.renderProp(
    'label',
    label && !/^\d+ sources?$/.test(label) ? label : undefined,
  )}${figma.helpers.react.renderProp('defaultOpen', !list && expanded)}
  sources={[
${sources}
  ]}
/>`,
  metadata: { nestable: true },
}
