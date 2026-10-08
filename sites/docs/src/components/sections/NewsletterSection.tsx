import { Button, Input } from '../../../../../react/src';
import { Section } from './parts';

export const anatomy = ['Title and one line of value', 'Email input (lg) + primary button on one row; stacks on mobile', 'Privacy hint under the field'];

export default function NewsletterSection() {
  return (
    <Section alt>
      <div className="ws-split" style={{ alignItems: 'end' }}>
        <div className="ws-head" style={{ marginBottom: 0 }}><p className="ws-title text-web-heading-md">Get the Atomus newsletter</p><p className="ws-lead text-web-body-lg">New components, sections and design tips — once a month.</p></div>
        <div className="ws-inline-form"><Input size="lg" type="email" aria-label="Email" placeholder="you@company.com" hint="We care about your data. Read our privacy policy." /><Button hierarchy="primary" size="lg">Subscribe</Button></div>
      </div>
    </Section>
  );
}
