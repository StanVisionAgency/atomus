import { Section } from './parts';

export const anatomy = ['Brand background (bg-brand-solid) with on-brand text', 'Short heading and supporting line', '3–4 key numbers: value (Web/Heading xl) and label', '4 → 2 → 1 columns'];

export default function MetricsSection() {
  return (
    <Section className="ws-band">
      <div className="ws-head" style={{ marginBottom: 'var(--layout-md)' }}>
        <p className="ws-title text-web-heading-xl">Built for scale</p>
        <p className="ws-lead text-web-body-lg">Numbers from teams that switched to Atomus last year.</p>
      </div>
      <div className="ws-grid ws-grid--4">
        {[['4,000+', 'Teams'], ['600+', 'Components & variants'], ['2×', 'Faster launches'], ['99%', 'Token coverage']].map(([v, l]) => (
          <div key={l} className="ws-stat"><p className="ws-stat__value text-web-heading-xl">{v}</p><p className="ws-stat__label text-web-body">{l}</p></div>
        ))}
      </div>
    </Section>
  );
}
