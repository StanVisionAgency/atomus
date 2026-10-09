// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25548-978
// source=src/components/ai/Reasoning.tsx
// component=Reasoning

import figma from 'figma'
import type { InstanceHandle } from 'figma'

const instance = figma.selectedInstance

const thinking = instance.getEnum('State', { Thinking: true, Done: false }) === true
const expanded = instance.getEnum('Expanded', { False: false, True: true }) === true

// Done variants show "Thought for 12s" (Label); "Thought for Ns" becomes duration={N}, anything else is a custom label.
let duration: number | undefined
let label: string | undefined
if (!thinking) {
  const text = instance.getString('Label')
  const m = text.match(/^Thought for (\d+)\s*s$/)
  if (m) duration = parseInt(m[1], 10)
  else label = text
}

// Steps and the summary only exist on the expanded variants.
const steps =
  expanded && instance.getBoolean('Steps')
    ? instance
        .findConnectedInstances((n) => n.codeConnectId() === 'ReasoningStep')
        .filter((n): n is InstanceHandle => n.type === 'INSTANCE')
        .map((n) => `    ${String((n.executeTemplate().metadata?.props as { entry?: string } | undefined)?.entry ?? '')},`)
    : []
const summary = expanded && instance.getBoolean('Show summary') ? instance.getString('Summary') : undefined
// Thinking opens by default and Done starts closed; only the opposite needs defaultOpen.
const defaultOpen = thinking ? (expanded ? undefined : false) : expanded ? true : undefined

const stepsProp = steps.length ? `\n  steps={[\n${steps.join('\n')}\n  ]}` : ''

export default {
  id: 'Reasoning',
  imports: ["import { Reasoning } from '@stanvision/atomus-react'"],
  example: summary
    ? figma.tsx`<Reasoning${figma.helpers.react.renderProp('status', thinking ? 'thinking' : undefined)}${figma.helpers.react.renderProp(
        'duration',
        duration,
      )}${figma.helpers.react.renderProp('label', label)}${figma.helpers.react.renderProp('defaultOpen', defaultOpen)}${stepsProp}
>
  <p>${summary}</p>
</Reasoning>`
    : figma.tsx`<Reasoning${figma.helpers.react.renderProp('status', thinking ? 'thinking' : undefined)}${figma.helpers.react.renderProp(
        'duration',
        duration,
      )}${figma.helpers.react.renderProp('label', label)}${figma.helpers.react.renderProp('defaultOpen', defaultOpen)}${stepsProp}${stepsProp ? '\n' : ' '}/>`,
  metadata: { nestable: true },
}
