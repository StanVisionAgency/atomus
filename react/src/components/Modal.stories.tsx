import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Modal, type ModalProps } from './Modal';

function ModalDemo(props: Omit<ModalProps, 'open' | 'onClose'>) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Button hierarchy="outline" onClick={() => setOpen(true)}>Open modal</Button>
      <Modal {...props} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

const meta = {
  title: 'Overlays/Modal',
  component: Modal,
  args: {
    open: true,
    onClose: () => {},
    title: 'Invite team members',
    description: 'They get access to every project in this workspace.',
    size: 'md',
    type: 'default',
    closeButton: true,
  },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] }, type: { control: 'inline-radio', options: ['default', 'destructive'] }, actions: { control: false }, children: { control: false } },
  // Modals open in the top layer; in the docs page each story gets its own iframe.
  parameters: { layout: 'fullscreen', docs: { story: { inline: false, iframeHeight: 520 } } },
  render: ({ open: _open, onClose: _onClose, ...args }) => <div style={{ minHeight: 480, padding: 'var(--spacing-3xl)' }}><ModalDemo {...args} /></div>,
} satisfies Meta<typeof Modal>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    featuredIcon: true,
    children: <Input label="Email address" placeholder="you@company.com" />,
    actions: <><Button hierarchy="outline">Cancel</Button><Button hierarchy="primary">Send invite</Button></>,
  },
};

export const Destructive: Story = {
  args: {
    type: 'destructive',
    featuredIcon: true,
    size: 'sm',
    title: 'Delete project?',
    description: 'This permanently deletes “Website relaunch” and its 24 files.',
    actions: <><Button hierarchy="outline">Cancel</Button><Button hierarchy="primary">Delete</Button></>,
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    title: 'Release notes',
    description: 'What changed in Atomus 4.1.',
    children: <p style={{ margin: 0 }}>Brand and radius modes, a shadcn registry, Storybook with accessibility and visual tests, and 20 React components whose props mirror the Figma properties.</p>,
    actions: <Button hierarchy="primary">Got it</Button>,
  },
};
