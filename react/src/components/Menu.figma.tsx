import figma from '@figma/code-connect';
import { DropdownMenu, MenuItem } from './Menu';
import { Button } from './Button';

figma.connect(MenuItem, 'https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25419-933', {
  props: {
    label: figma.string('Label'),
    icon: figma.boolean('Leading icon', { true: figma.instance('Leading icon swap'), false: undefined }),
    shortcut: figma.boolean('Shortcut', { true: figma.string('Shortcut text'), false: undefined }),
    size: figma.enum('Size', { sm: 'sm', md: 'md' }),
    selected: figma.enum('State', { Selected: true }),
    disabled: figma.enum('State', { Disabled: true }),
  },
  example: (props) => <MenuItem {...props} onSelect={() => {}} />,
});

figma.connect(DropdownMenu, 'https://www.figma.com/design/bC42e82J3PYg2LMkryodIA/Atomus-4.0?node-id=25419-934', {
  example: () => (
    <DropdownMenu
      label="Actions"
      trigger={<Button hierarchy="outline">Actions</Button>}
      items={[{ label: 'Rename', onSelect: () => {} }, { type: 'separator' }, { label: 'Delete', destructive: true, onSelect: () => {} }]}
    />
  ),
});
