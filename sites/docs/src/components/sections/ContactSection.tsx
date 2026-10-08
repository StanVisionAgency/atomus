import { Button, Checkbox, Icon, Input } from '../../../../../react/src';
import { FIcon, Head, Section } from './parts';

export const anatomy = ['Heading and supporting text', 'Form: first/last name row, email, message, consent checkbox, full-width submit', 'Contact info cards: icon, label, value (email, office, phone)', 'Form and cards sit side by side on desktop and stack below'];

export default function ContactSection() {
  return (
    <Section>
      <div className="ws-split" style={{ alignItems: 'start' }}>
        <div>
          <Head eyebrow="Contact" size="lg" title="Get in touch" lead="We usually answer within one working day." />
          <form className="ws-form" onSubmit={(e) => e.preventDefault()}>
            <div className="ws-form__row"><Input label="First name" placeholder="Kristina" /><Input label="Last name" placeholder="Stan" /></div>
            <Input label="Email" type="email" placeholder="you@company.com" />
            <div className="ws-textarea"><label htmlFor="ws-msg">Message</label><textarea id="ws-msg" placeholder="Tell us about your project" /></div>
            <Checkbox label="You agree to our friendly privacy policy." />
            <Button hierarchy="primary" size="lg" fullWidth type="submit">Send message</Button>
          </form>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3xl)' }}>
          {([['bell', 'Email', 'hello@atomus.io'], ['home', 'Office', 'Sofia, Bulgaria'], ['user', 'Phone', '+359 2 123 4567']] as const).map(([i, l, v]) => (
            <div key={l} className="ws-card ws-card--filled" style={{ flexDirection: 'row', alignItems: 'center' }}><FIcon name={i} /><div><p className="ws-person__name">{l}</p><p className="ws-small">{v}</p></div><span style={{ marginLeft: 'auto', color: 'var(--color-fg-tertiary)' }}><Icon name="chevronRight" /></span></div>
          ))}
        </div>
      </div>
    </Section>
  );
}
