// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25552-1473
// source=src/components/ai/Message.tsx
// component=Message

import figma from 'figma'

const instance = figma.selectedInstance

const role = instance.getEnum('Role', { Assistant: 'assistant', User: 'user', Tool: 'tool', System: 'system' }) ?? 'assistant'
const status = instance.getEnum('Status', { Done: 'done', Streaming: 'streaming', Error: 'error', Stopped: 'stopped' }) ?? 'done'
const system = role === 'system'
// Action toggles only exist on the variants that show them (no actions while streaming or on system lines).
const hasActions = !system && status !== 'streaming'
const on = (prop: string, when: boolean) => when && instance.getBoolean(prop)

const name = system ? undefined : instance.getString('Name')
const showName = system ? undefined : instance.getBoolean('Show name')
const time = !system && instance.getBoolean('Show timestamp') ? instance.getString('Timestamp') : undefined
const aiLabel = role === 'assistant' ? instance.getBoolean('AI label') : true
const copy = on('Copy', hasActions)
const edit = on('Edit', hasActions && role === 'user')
const regenerate = on('Regenerate', hasActions && role === 'assistant' && status !== 'error') || (role === 'assistant' && status === 'error')
const feedback = on('Feedback', hasActions && role === 'assistant' && status === 'done')
const branchCount = on('Branch', hasActions) ? instance.getString('Branch count').match(/(\d+)\s*\/\s*(\d+)/) : null
const branch = branchCount ? ` branch={{ index: ${branchCount[1]}, count: ${branchCount[2]}, onPrevious: () => {}, onNext: () => {} }}` : ''
const errorMessage = status === 'error' ? instance.getString('Error message') : undefined
const hover = instance.getEnum('Actions visibility', { Always: false, Hover: true }) === true

// React defaults: the name is visible except for user messages.
const showNameProp = showName === undefined ? undefined : role === 'user' ? (showName ? true : undefined) : showName ? undefined : false

export default {
  id: 'Message',
  imports: [feedback ? "import { Feedback, Message } from '@stanvision/atomus-react'" : "import { Message } from '@stanvision/atomus-react'"],
  example: system
    ? figma.tsx`<Message role="system">${instance.getString('System text')}</Message>`
    : figma.tsx`<Message${figma.helpers.react.renderProp('role', role !== 'assistant' ? role : undefined)}${figma.helpers.react.renderProp(
        'status',
        status !== 'done' ? status : undefined,
      )}${figma.helpers.react.renderProp('name', name)}${figma.helpers.react.renderProp('showName', showNameProp)}${figma.helpers.react.renderProp(
        'aiLabel',
        aiLabel ? undefined : false,
      )}${figma.helpers.react.renderProp('time', time)}${copy ? ' copyText="Plain text of the message"' : ''}${edit ? ' onEdit={() => {}}' : ''}${
        regenerate ? ' onRegenerate={() => {}}' : ''
      }${branch}${feedback ? ' actions={<Feedback />}' : ''}${figma.helpers.react.renderProp('actionsVisibility', hover ? 'hover' : undefined)}${figma.helpers.react.renderProp(
        'errorMessage',
        errorMessage && errorMessage !== 'Something went wrong while generating this response.' ? errorMessage : undefined,
      )}>
  ${instance.getSlot('Content')}
</Message>`,
  metadata: { nestable: true },
}
