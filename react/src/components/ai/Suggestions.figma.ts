// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25545-453
// source=src/components/ai/Suggestions.tsx
// component=Suggestions

import figma from 'figma'
import type { InstanceHandle } from 'figma'

const instance = figma.selectedInstance

const cards = instance.getEnum('Style', { Chips: false, Cards: true }) === true
const mode = instance.getEnum('Action', { Send: undefined, Insert: 'insert' })
const wrap = !cards && instance.getEnum('Wrap', { False: false, True: true }) === true

// Items come from the nested Suggestion instances, in order.
const items = instance
  .findConnectedInstances((n) => n.codeConnectId() === 'Suggestion')
  .filter((n): n is InstanceHandle => n.type === 'INSTANCE')
  .map((n) => (n.executeTemplate().metadata?.props ?? {}) as { label?: string; description?: string })
const list = (items.length ? items : [{ label: 'Fix the contrast issue', description: 'Find WCAG 2.2 issues and file them' }])
  .map((it) =>
    cards
      ? `    { label: ${JSON.stringify(it.label ?? '')}${it.description ? `, description: ${JSON.stringify(it.description)}` : ''} },`
      : `    ${JSON.stringify(it.label ?? '')},`,
  )
  .join('\n')

export default {
  id: 'Suggestions',
  imports: ["import { Suggestions } from '@stanvision/atomus-react'"],
  example: figma.tsx`<Suggestions${figma.helpers.react.renderProp('variant', cards ? 'cards' : undefined)}${figma.helpers.react.renderProp(
    'mode',
    mode,
  )}${figma.helpers.react.renderProp('wrap', wrap)}
  suggestions={[
${list}
  ]}
  onSelect={(prompt) => {}}
/>`,
  metadata: { nestable: true },
}
