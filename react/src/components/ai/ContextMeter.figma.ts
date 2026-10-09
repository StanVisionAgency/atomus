// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25546-320
// source=src/components/ai/ContextMeter.tsx
// component=ContextMeter

import figma from 'figma'

const instance = figma.selectedInstance

/** "48.2K" → 48200, "200K" → 200000, "1.2M" → 1200000. */
function tokens(text: string): number {
  const m = text.replace(/,/g, '').trim().match(/^([\d.]+)\s*([kKmM]?)/)
  if (!m) return 0
  const n = parseFloat(m[1])
  return Math.round(m[2].toLowerCase() === 'm' ? n * 1e6 : m[2].toLowerCase() === 'k' ? n * 1e3 : n)
}

const variant = instance.getEnum('Style', { Compact: 'compact', Bar: 'bar' })
const bar = variant === 'bar'
const limit = bar ? tokens(instance.getString('Limit')) : 200000
// The compact style only shows a percentage; derive "used" from it against a 200K window.
const used = bar ? tokens(instance.getString('Used')) : Math.round((parseFloat(instance.getString('Percentage')) / 100) * limit)
const label = bar ? instance.getString('Label') : 'Context window'
const cost = bar && instance.getBoolean('Show cost') ? parseFloat(instance.getString('Cost').replace(/[^\d.]/g, '')) : undefined
const breakdown = bar && instance.getBoolean('Breakdown')

export default {
  id: 'ContextMeter',
  imports: ["import { ContextMeter } from '@stanvision/atomus-react'"],
  example: figma.tsx`<ContextMeter used={${used}} limit={${limit}}${cost !== undefined && !Number.isNaN(cost) ? ` cost={${cost}}` : ''}${figma.helpers.react.renderProp(
    'label',
    label !== 'Context window' ? label : undefined,
  )}${figma.helpers.react.renderProp('variant', bar ? 'bar' : undefined)}${
    breakdown ? " breakdown={[{ label: 'Input', tokens: 39200 }, { label: 'Output', tokens: 6810 }, { label: 'Tools', tokens: 2200 }]}" : ''
  } />`,
  metadata: { nestable: true },
}
