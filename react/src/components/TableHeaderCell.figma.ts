// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25426-419
// source=src/components/Table.tsx
// component=Table

import figma from 'figma'

const instance = figma.selectedInstance

// "Table header cell" in Figma = one column definition in code.
const header = instance.getString('Label')

export default {
  id: 'TableHeaderCell',
  imports: ["import { Table } from '@stanvision/atomus-react'"],
  example: figma.tsx`<Table
  caption="Team members"${instance.getBoolean('Checkbox') ? '\n  selectable' : ''}
  rowKey={(r) => String(r.id)}
  rows={[{ id: '1', name: 'Olivia Rhye', role: 'Designer' }]}
  columns={[
    { key: 'name', header: ${JSON.stringify(header)}${instance.getBoolean('Sortable') ? ', sortable: true' : ''} },
    { key: 'role', header: 'Role' },
  ]}
/>`,
  metadata: { nestable: false },
}
