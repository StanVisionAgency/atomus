// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25423-513
// source=src/components/Tabs.tsx
// component=Tabs

import figma from 'figma'
import type { InstanceHandle } from 'figma'

const instance = figma.selectedInstance

// Tab instances are not code components of their own, so their labels, counts and active state become `items`.
const tabs = instance
  .findLayers((n) => n.type === 'INSTANCE' && n.name === 'Tab')
  .filter((n): n is InstanceHandle => n.type === 'INSTANCE')
const slug = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'tab'
let active: string | undefined
const items = tabs.map((tab) => {
  const label = tab.getString('Label')
  const value = slug(label)
  const state = tab.getEnum('State', { Active: 'active', Disabled: 'disabled' })
  if (state === 'active' && !active) active = value
  const count = tab.getBoolean('Count') ? `, count: ${Number(tab.getString('Count number')) || 0}` : ''
  return `    { value: ${JSON.stringify(value)}, label: ${JSON.stringify(label)}${count}${state === 'disabled' ? ', disabled: true' : ''} },`
})
const list = items.length > 0 ? items.join('\n') : "    { value: 'overview', label: 'Overview' },"

export default {
  id: 'Tabs',
  imports: ["import { Tabs } from '@stanvision/atomus-react'"],
  example: figma.tsx`<Tabs${figma.helpers.react.renderProp(
    'variant',
    instance.getEnum('Style', { Underline: 'underline', Pill: 'pill', Segmented: 'segmented' }),
  )}${figma.helpers.react.renderProp('defaultValue', active)}
  aria-label="Sections"
  items={[
${list}
  ]}
/>`,
  metadata: { nestable: true },
}
