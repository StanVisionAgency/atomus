// Atomus 4.0 — Settings block. MIT licence, https://docs.atomus.io
// Account settings: tabs, profile form, notification preferences and a danger zone with a confirmation modal.
import { useState } from 'react';
import { AppShell } from './app-shell';
import { Alert } from '../alert';
import { Avatar } from '../avatar';
import { Button } from '../button';
import { Card } from '../card';
import { Checkbox, Toggle } from '../checkbox-radio-toggle';
import { Input } from '../input';
import { Modal } from '../modal';
import { Select } from '../select';
import { Tabs } from '../tabs';

export function Settings() {
  const [tab, setTab] = useState('profile');
  const [confirm, setConfirm] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <AppShell active="settings" title="Settings" description="Manage your profile, notifications and workspace.">
      <Tabs
        aria-label="Settings sections"
        value={tab}
        onChange={setTab}
        items={[{ value: 'profile', label: 'Profile' }, { value: 'notifications', label: 'Notifications' }, { value: 'billing', label: 'Billing' }, { value: 'team', label: 'Team', count: 8 }]}
      />
      {saved ? <Alert color="success" title="Changes saved" onClose={() => setSaved(false)}>Your profile is up to date.</Alert> : null}
      <form className="ab-settings" onSubmit={(e) => { e.preventDefault(); setSaved(true); }}>
        <Card
          title="Profile"
          supportingText="This information appears on your public profile."
          padding="lg"
          footer={<><Button hierarchy="outline" type="reset">Cancel</Button><Button hierarchy="primary" type="submit">Save changes</Button></>}
        >
          <div className="ab-form">
            <div className="ab-form__avatar"><Avatar name="Olivia Rhye" size="xl" /><Button hierarchy="secondary" size="sm">Change photo</Button></div>
            <div className="ab-form__row">
              <Input label="First name" defaultValue="Olivia" autoComplete="given-name" />
              <Input label="Last name" defaultValue="Rhye" autoComplete="family-name" />
            </div>
            <Input label="Email" type="email" defaultValue="olivia@atomus.io" hint="We send receipts and security alerts here." autoComplete="email" />
            <div className="ab-form__row">
              <Select label="Role" defaultValue="design" options={[{ value: 'design', label: 'Design lead' }, { value: 'eng', label: 'Engineer' }, { value: 'pm', label: 'Product manager' }]} />
              <Select label="Time zone" defaultValue="cet" options={[{ value: 'utc', label: 'UTC' }, { value: 'cet', label: 'Central European (UTC+1)' }, { value: 'pst', label: 'Pacific (UTC−8)' }]} />
            </div>
          </div>
        </Card>
        <Card title="Notifications" supportingText="Choose what we email you about." padding="lg">
          <div className="ab-form">
            <Toggle label="Product updates" description="New components, tokens and releases." defaultChecked />
            <Toggle label="Weekly digest" description="A summary of activity every Monday." />
            <Checkbox label="Security alerts" description="Always on for workspace owners." defaultChecked disabled />
          </div>
        </Card>
        <Card title="Delete workspace" supportingText="Permanently remove the workspace and all of its projects." padding="lg" footer={<Button hierarchy="outline" onClick={() => setConfirm(true)}>Delete workspace</Button>} />
      </form>
      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        type="destructive"
        featuredIcon
        size="sm"
        title="Delete workspace?"
        description="This removes 12 projects and cannot be undone."
        actions={<><Button hierarchy="outline" onClick={() => setConfirm(false)}>Cancel</Button><Button hierarchy="primary" onClick={() => setConfirm(false)}>Delete</Button></>}
      />
    </AppShell>
  );
}

export default Settings;
