import { Tabs } from '../../../../../react/src';
import { Head, Section } from './parts';
import { Plan } from './PricingCard';

export const anatomy = ['Section heading', 'Billing toggle (Tabs, segmented): Monthly / Yearly', '3 Pricing cards, the recommended plan highlighted', 'Cards stack on tablet and mobile with the highlighted plan kept in order'];

export default function PricingSection() {
  return (
    <Section>
      <Head center eyebrow="Pricing" title="Simple, transparent pricing" lead="Start free. Upgrade when your team grows." />
      <div className="ws-toggle-wrap"><Tabs variant="segmented" aria-label="Billing" defaultValue="m" items={[{ value: 'm', label: 'Monthly' }, { value: 'y', label: 'Yearly · save 20%' }]} /></div>
      <div className="ws-grid ws-grid--3 ws-grid--pricing" style={{ alignItems: 'start' }}>
        <Plan name="Starter" price="$0" desc="For freelancers trying Atomus." cta="Start free" features={['1 project', 'Core components', 'Community support']} />
        <Plan hl name="Pro" price="$24" desc="For teams shipping every week." cta="Start 14-day trial" features={['Unlimited projects', 'All sections', 'Brand modes', 'Priority support']} />
        <Plan name="Agency" price="$79" desc="For studios with many clients." cta="Contact sales" features={['Everything in Pro', 'Client workspaces', 'SSO and audit log']} />
      </div>
    </Section>
  );
}
