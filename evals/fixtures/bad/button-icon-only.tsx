// Bad: icon-only buttons with no accessible name (axe: button-name; lint: icon-only-needs-label), two primaries.
import { Button, Icon } from '@stanvision/atomus-react';

export default function Toolbar() {
  return (
    <div className="toolbar">
      <Button iconOnly hierarchy="primary"><Icon name="edit" size={16} /></Button>
      <Button iconOnly hierarchy="primary"><Icon name="copy" size={16} /></Button>
      <Button iconOnly hierarchy="tertiary"><Icon name="x" size={16} /></Button>
    </div>
  );
}
