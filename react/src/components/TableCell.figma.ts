// url=https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25426-503
// source=src/components/Table.tsx
// component=Table

import figma from 'figma'

const instance = figma.selectedInstance

// "Table cell" in Figma = one value in a Table row in code.
const text = instance.getString('Text')

export default {
  id: 'TableCell',
  imports: ["import { Table } from '@stanvision/atomus-react'"],
  example: figma.tsx`<Table
  caption="Team members"
  rowKey={(r) => String(r.id)}
  rows={[{ id: '1', name: ${JSON.stringify(text)}, role: 'Designer' }]}
  columns={[
    { key: 'name', header: 'Name', sortable: true },
    { key: 'role', header: 'Role' },
  ]}
/>`,
  metadata: { nestable: false },
}
