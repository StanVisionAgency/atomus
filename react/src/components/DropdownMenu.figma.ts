// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25419-934
// source=src/components/Menu.tsx
// component=DropdownMenu

import figma from 'figma'

const instance = figma.selectedInstance

// Items come from the Menu item instances placed in the Items slot.
const slot = instance.getSlot('Items')
const items = (slot?.connectedInstances ?? []).map((item) => {
  const p = (item.executeTemplate().metadata?.props ?? {}) as { label?: string; shortcut?: string; disabled?: boolean }
  const extra = `${p.shortcut ? `, shortcut: ${JSON.stringify(p.shortcut)}` : ''}${p.disabled ? ', disabled: true' : ''}`
  return `    { label: ${JSON.stringify(p.label ?? 'Item')}${extra}, onSelect: () => {} },`
})
const list = items.length > 0 ? items.join('\n') : "    { label: 'Rename', onSelect: () => {} },"

export default {
  id: 'DropdownMenu',
  imports: ["import { Button, DropdownMenu } from '@stanvision/atomus-react'"],
  example: figma.tsx`<DropdownMenu
  label="Actions"
  trigger={<Button hierarchy="outline">Actions</Button>}
  items={[
${list}
  ]}
/>`,
  metadata: { nestable: false },
}
