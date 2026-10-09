// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25546-1208
// source=src/components/ai/ModelSelector.tsx
// component=ModelSelector

import figma from 'figma'
import type { InstanceHandle } from 'figma'

const instance = figma.selectedInstance

const state = instance.getEnum('State', { Default: 'default', Open: 'open', Disabled: 'disabled' }) ?? 'default'
const model = instance.getString('Model')
const showLabel = instance.getBoolean('Show label')
const label = instance.getString('Label')

// Open variants list the Model option instances; closed ones only show the selected model.
const options = instance
  .findConnectedInstances((n) => n.codeConnectId() === 'ModelOption')
  .filter((n): n is InstanceHandle => n.type === 'INSTANCE')
  .map((n) => (n.executeTemplate().metadata?.props ?? {}) as { entry?: string; value?: string; selected?: boolean })
const fallbackValue = model.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const models = options.length ? options.map((o) => String(o.entry)) : [`{ value: ${JSON.stringify(fallbackValue)}, label: ${JSON.stringify(model)} }`]
const value = options.find((o) => o.selected)?.value ?? fallbackValue

export default {
  id: 'ModelSelector',
  imports: ["import { ModelSelector } from '@stanvision/atomus-react'"],
  example: figma.tsx`<ModelSelector
  models={[
${models.map((m) => `    ${m},`).join('\n')}
  ]}
  defaultValue=${JSON.stringify(value)}${figma.helpers.react.renderProp('variant', instance.getEnum('Style', { Outline: 'outline' }))}${figma.helpers.react.renderProp(
    'size',
    instance.getEnum('Size', { md: 'md' }),
  )}${figma.helpers.react.renderProp('placement', instance.getEnum('Placement', { Down: 'down' }))}${figma.helpers.react.renderProp(
    'showLabel',
    showLabel,
  )}${figma.helpers.react.renderProp('label', label !== 'Model' ? label : undefined)}${figma.helpers.react.renderProp(
    'disabled',
    state === 'disabled',
  )}${figma.helpers.react.renderProp('defaultOpen', state === 'open')}
  onChange={(value) => {}}
/>`,
  metadata: { nestable: true },
}
