import { Brand } from './parts';

export const anatomy = ['Brand column: logo and one-line pitch', '4 link columns with a bold heading each', 'Bottom bar: copyright and legal links', 'Style = Dark sets data-theme="dark" on the footer, so every token flips'];

const COLS: [string, string[]][] = [
  ['Product', ['Overview', 'Features', 'Pricing', 'Releases']],
  ['Company', ['About', 'Careers', 'Press', 'Contact']],
  ['Resources', ['Blog', 'Guides', 'Help centre', 'Status']],
  ['Legal', ['Terms', 'Privacy', 'Cookies', 'Licenses']],
];

export default function Footer() {
  return (
    <footer className="ws-footer" data-theme="dark">
      <div className="ws-container">
        <div className="ws-footer__top">
          <div className="ws-footer__col"><Brand /><p className="ws-small">One design system for product UI and marketing websites.</p></div>
          {COLS.map(([h, links]) => (
            <div key={h} className="ws-footer__col"><b>{h}</b>{links.map((l) => <a key={l} className="ws-link" href="#" style={{ fontWeight: 400 }}>{l}</a>)}</div>
          ))}
        </div>
        <div className="ws-footer__bottom ws-tiny"><span>© 2026 Atomus. All rights reserved.</span><span>Terms · Privacy · Cookies</span></div>
      </div>
    </footer>
  );
}
