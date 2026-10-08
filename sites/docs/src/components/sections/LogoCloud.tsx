import { Logo, Section } from './parts';

export const anatomy = ['One-line label ("Trusted by …"), Web/Body, tertiary text', '5–6 customer logos in fg-tertiary (one colour)', 'Wraps to 2 columns on mobile'];

export default function LogoCloud() {
  return (
    <Section tight>
      <p className="text-web-body ws-lead" style={{ textAlign: 'center', marginBottom: 'var(--layout-xs)' }}>Trusted by 4,000+ teams at fast-growing companies</p>
      <div className="ws-grid ws-grid--logos" style={{ gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', justifyItems: 'center', gap: 'var(--layout-xs)' }}>
        {Array.from({ length: 6 }, (_, i) => <Logo key={i} i={i} />)}
      </div>
    </Section>
  );
}
