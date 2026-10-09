// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25553-1955
// source=src/components/ai/PromptInput.tsx
// component=PromptInput

import figma from 'figma'
import type { InstanceHandle } from 'figma'

const instance = figma.selectedInstance

const state = instance.getEnum('State', { Ready: 'ready', Submitted: 'submitted', Streaming: 'streaming', Error: 'error', Disabled: 'disabled' }) ?? 'ready'
const busy = state === 'submitted' || state === 'streaming'
const text = instance.getBoolean('Show text') ? instance.getString('Text') : undefined
const placeholder = instance.getString('Placeholder')
const disclaimer = instance.getBoolean('Show disclaimer') ? instance.getString('Disclaimer') : undefined

// Attachments: the Prompt attachment instances in the Attachments slot.
const attachments = instance.getBoolean('Show attachments')
  ? instance
      .findConnectedInstances((n) => n.codeConnectId() === 'PromptAttachment')
      .filter((n): n is InstanceHandle => n.type === 'INSTANCE')
      .map((n) => String((n.executeTemplate().metadata?.props as { entry?: string } | undefined)?.entry ?? ''))
      .filter(Boolean)
  : []

// Command menu: the Menu item instances in the "Command menu" frame become a "/" trigger.
const commands = instance.getBoolean('Command menu')
  ? instance
      .findConnectedInstances((n) => n.codeConnectId() === 'MenuItem', { path: ['Command menu'] })
      .filter((n): n is InstanceHandle => n.type === 'INSTANCE')
      .map((n) => (n.executeTemplate().metadata?.props ?? {}) as { label?: string; shortcut?: string })
      .map((p) => {
        const value = (p.shortcut ?? p.label ?? 'command').replace(/^[/@]/, '').toLowerCase().replace(/\s+/g, '-')
        return `{ value: ${JSON.stringify(value)}, label: ${JSON.stringify(p.label ?? value)} }`
      })
  : []

const toolbar = instance.getSlot('Toolbar')
const actions = instance.getSlot('Actions')

export default {
  id: 'PromptInput',
  imports: ["import { PromptInput } from '@stanvision/atomus-react'"],
  example: figma.tsx`<PromptInput${figma.helpers.react.renderProp('size', instance.getEnum('Size', { lg: 'lg' }))}${figma.helpers.react.renderProp(
    'status',
    state !== 'ready' && state !== 'disabled' ? state : undefined,
  )}${figma.helpers.react.renderProp('disabled', state === 'disabled')}${figma.helpers.react.renderProp(
    'placeholder',
    placeholder !== 'Ask anything…' ? placeholder : undefined,
  )}${figma.helpers.react.renderProp('defaultValue', text)}${
    attachments.length ? `\n  attachments={[\n${attachments.map((a) => `    ${a},`).join('\n')}\n  ]}\n  onRemoveAttachment={(id) => {}}` : ''
  }${instance.getBoolean('Attach button') ? '\n  onAttach={() => {}}' : ''}${figma.helpers.react.renderProp('toolbar', toolbar)}${figma.helpers.react.renderProp(
    'actions',
    actions,
  )}${commands.length ? `\n  triggers={[{ char: '/', label: 'Commands', items: [${commands.join(', ')}] }]}` : ''}${figma.helpers.react.renderProp(
    'disclaimer',
    disclaimer,
  )}
  onSubmit={(text, attachments) => {}}${busy ? '\n  onStop={() => {}}' : ''}
/>`,
  metadata: { nestable: true },
}
