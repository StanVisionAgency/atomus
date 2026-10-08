import { Button, Icon } from '../../../../../react/src';
import { Brand } from './parts';

export const anatomy = ['Logo (links home)', 'Primary links — 4 to 6, sentence case', 'Secondary action (Log in, tertiary) and primary CTA', 'Tablet and mobile: links and actions collapse into a menu button (Type = Mobile menu open shows the panel)'];

export default function HeaderNavigation() {
  return (
    <header className="ws-header">
      <Brand />
      <nav className="ws-header__nav" aria-label="Example">
        {['Product', 'Solutions', 'Pricing', 'Resources', 'Company'].map((l) => <a key={l} className="ws-link" href="#">{l}</a>)}
      </nav>
      <div className="ws-actions">
        <Button hierarchy="tertiary">Log in</Button>
        <Button hierarchy="primary">Get started</Button>
      </div>
      <Button className="ws-header__menu" hierarchy="outline" iconOnly aria-label="Open menu" iconLeading={<Icon name="menu" />} />
    </header>
  );
}
