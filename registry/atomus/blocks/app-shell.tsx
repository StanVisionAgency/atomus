// Atomus 4.0 — App shell block. MIT licence, https://docs.atomus.io
// Sidebar navigation + app header + main area. The dashboard, settings and table-view blocks render inside it.
import type { ReactNode } from 'react';
import { Avatar } from '../avatar';
import { Button } from '../button';
import { Icon, type IconName } from '../icon';
import { Input } from '../input';
import { AppHeader, NavItem, SidebarNavigation } from '../navigation';

export interface AppShellNavItem {
  id: string;
  label: string;
  icon: IconName;
  href?: string;
  badge?: ReactNode;
}

export const APP_NAV: AppShellNavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'home', href: '#dashboard' },
  { id: 'projects', label: 'Projects', icon: 'folder', href: '#projects', badge: 12 },
  { id: 'customers', label: 'Customers', icon: 'user', href: '#customers' },
  { id: 'notifications', label: 'Notifications', icon: 'bell', href: '#notifications', badge: 3 },
  { id: 'settings', label: 'Settings', icon: 'settings', href: '#settings' },
];

export interface AppShellProps {
  /** Page title (h1) */
  title: ReactNode;
  /** One line under the title */
  description?: ReactNode;
  /** Page actions, right of the title — one primary button at most */
  actions?: ReactNode;
  /** id of the active nav item */
  active?: string;
  nav?: AppShellNavItem[];
  children: ReactNode;
}

export function AppShell({ title, description, actions, active = 'dashboard', nav = APP_NAV, children }: AppShellProps) {
  return (
    <div className="ab-shell">
      <SidebarNavigation
        className="ab-shell__sidebar"
        header={<span className="ab-brand"><span className="ab-brand__mark" aria-hidden="true" />Atomus</span>}
        footer={
          <div className="ab-user">
            <Avatar name="Olivia Rhye" size="md" status="online" />
            <span className="ab-user__text"><span className="ab-user__name">Olivia Rhye</span><span className="ab-user__mail">olivia@atomus.io</span></span>
          </div>
        }
      >
        {nav.map((n) => <NavItem key={n.id} href={n.href} label={n.label} icon={<Icon name={n.icon} />} badge={n.badge} active={n.id === active} />)}
      </SidebarNavigation>
      <div className="ab-shell__body">
        <AppHeader
          brand={<Button className="ab-shell__menu" hierarchy="tertiary" iconOnly aria-label="Open navigation" iconLeading={<Icon name="menu" />} />}
          actions={
            <>
              <Input className="ab-shell__search" size="sm" type="search" aria-label="Search" placeholder="Search" iconLeading={<Icon name="search" size={16} />} />
              <Button hierarchy="tertiary" iconOnly aria-label="Notifications" iconLeading={<Icon name="bell" />} />
              <Avatar name="Olivia Rhye" size="sm" />
            </>
          }
        />
        <main className="ab-main">
          <div className="ab-page-header">
            <div className="ab-page-header__text">
              <h1 className="ab-page-header__title text-headline-h4">{title}</h1>
              {description ? <p className="ab-page-header__desc text-content-body">{description}</p> : null}
            </div>
            {actions ? <div className="ab-page-header__actions">{actions}</div> : null}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
