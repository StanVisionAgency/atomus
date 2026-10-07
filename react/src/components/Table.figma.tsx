import figma from '@figma/code-connect';
import { Table } from './Table';

const example = () => (
  <Table
    caption="Team members"
    selectable
    rowKey={(r) => String(r.id)}
    rows={[{ id: '1', name: 'Olivia Rhye', role: 'Designer' }]}
    columns={[
      { key: 'name', header: 'Name', sortable: true },
      { key: 'role', header: 'Role' },
    ]}
  />
);
figma.connect(Table, 'https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25426-419', { example });
figma.connect(Table, 'https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25426-503', { example });
