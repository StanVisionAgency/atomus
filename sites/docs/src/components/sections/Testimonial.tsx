import { Avatar } from '../../../../../react/src';
import { Logo, Section, Stars } from './parts';

export const anatomy = ['Company logo or star rating', 'Quote — Web/Heading md, centred, max ~3 lines', 'Author: avatar, name, role and company'];

export default function Testimonial() {
  return (
    <Section alt>
      <div className="ws-head ws-head--center" style={{ maxWidth: 960, marginBottom: 0 }}>
        <Stars />
        <p className="ws-title text-web-heading-md">“We replaced three UI kits with Atomus. Our designers and developers finally speak the same language — and launches take half the time.”</p>
        <div className="ws-person" style={{ flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <Avatar name="Mila Petrova" size="lg" />
          <div><p className="ws-person__name">Mila Petrova</p><p className="ws-person__role">Head of Design, Northwind</p></div>
        </div>
        <Logo i={0} />
      </div>
    </Section>
  );
}
