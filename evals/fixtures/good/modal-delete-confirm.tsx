// Good: a destructive Modal, open, with one primary (destructive) action.
import { useState } from 'react';
import { Button, Modal } from '@stanvision/atomus-react';

export default function DeleteProject() {
  const [open, setOpen] = useState(true);
  return (
    <main>
      <h1 className="text-headline-h5">Project settings</h1>
      <Button hierarchy="secondary" onClick={() => setOpen(true)}>Delete project</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        type="destructive"
        size="sm"
        featuredIcon
        title="Delete project?"
        description="This deletes Atlas and its 12 files for everyone. You can't undo this."
        actions={
          <>
            <Button hierarchy="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button hierarchy="primary" onClick={() => setOpen(false)}>Delete</Button>
          </>
        }
      />
    </main>
  );
}
