import { Badge, Button } from '../../../../../react/src';
import { Check, Section } from './parts';

export const anatomy = ['Plan name and short description', 'Price (Web/Heading xl) with billing period', 'CTA — primary on the highlighted plan, outline on the rest', 'Feature checklist', 'Highlighted = True adds the brand border, shadow and a "Most popular" badge'];

export function Plan({ name, price, desc, cta, features, hl }: { name: string; price: string; desc: string; cta: string; features: string[]; hl?: boolean }) {
  return (
    <div className={`ws-price${hl ? ' ws-price--hl' : ''}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><p className="ws-feature__title text-web-heading-xs">{name}</p>{hl ? <Badge color="brand">Most popular</Badge> : null}</div>
        <p className="text-web-body">{desc}</p>
      </div>
      <p className="ws-price__amount"><span className="text-web-heading-xl">{price}</span><span className="ws-small" style={{ color: 'var(--color-text-tertiary)' }}>/ month</span></p>
      <Button hierarchy={hl ? 'primary' : 'outline'} size="lg" fullWidth>{cta}</Button>
      <ul className="ws-checks ws-small">{features.map((f) => <li key={f}><Check />{f}</li>)}</ul>
    </div>
  );
}

export default function PricingCard() {
  return (
    <Section alt>
      <div className="ws-grid ws-grid--2" style={{ maxWidth: 820, margin: '0 auto' }}>
        <Plan name="Starter" price="$0" desc="For freelancers trying Atomus." cta="Start free" features={['1 project', 'Core components', 'Community support']} />
        <Plan hl name="Pro" price="$24" desc="For teams shipping every week." cta="Start 14-day trial" features={['Unlimited projects', 'All sections and templates', 'Brand modes', 'Priority support']} />
      </div>
    </Section>
  );
}
