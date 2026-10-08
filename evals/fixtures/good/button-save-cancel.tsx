// Good: Atomus Button with real hierarchies, one primary action, no inline styles or raw colours.
import { Button } from '@stanvision/atomus-react';

export default function FormFooter() {
  return (
    <div className="form-footer">
      <Button hierarchy="secondary">Cancel</Button>
      <Button hierarchy="primary" type="submit">Save changes</Button>
    </div>
  );
}
