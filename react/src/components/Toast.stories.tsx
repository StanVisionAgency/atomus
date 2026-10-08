import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from './Button';
import { Toast, ToastProvider, useToast } from './Toast';

const COLORS = ['gray', 'brand', 'success', 'warning', 'error'] as const;

const meta = {
  title: 'Feedback/Toast',
  component: Toast,
  args: { title: 'Changes saved', description: 'Your workspace settings are up to date.', color: 'success', onClose: () => {} },
  argTypes: { color: { control: 'inline-radio', options: COLORS }, action: { control: false } },
  decorators: [(Story) => <div style={{ maxWidth: 420 }}><Story /></div>],
} satisfies Meta<typeof Toast>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Colors: Story = {
  render: (args) => <div className="sb-stack">{COLORS.map((c) => <Toast key={c} {...args} color={c} title={`${c[0].toUpperCase()}${c.slice(1)} toast`} />)}</div>,
};

export const WithAction: Story = {
  args: { color: 'gray', title: 'Project archived', description: undefined, action: <Button hierarchy="link" size="sm">Undo</Button> },
};

function Trigger() {
  const toast = useToast();
  return <Button hierarchy="primary" onClick={() => toast.show({ title: 'Invite sent', description: 'mila@northwind.io can now join.', color: 'success', duration: 0 })}>Send invite</Button>;
}

/** ToastProvider + useToast(): click the button to show a toast. */
export const WithProvider: Story = {
  render: () => <ToastProvider position="bottom-right"><Trigger /></ToastProvider>,
  parameters: { layout: 'padded' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Send invite' }));
    const title = await canvas.findByText('Invite sent');
    // Toasts fade in; wait for the animation to finish.
    await waitFor(() => expect(title).toBeVisible());
  },
};
