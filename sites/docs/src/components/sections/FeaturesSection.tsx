import { FEATURES, FIcon, Head, Section } from './parts';

export const anatomy = ['Section heading: eyebrow, title, supporting text', '6 features: featured icon, title (Web/Heading xs), one or two lines of text', 'Grid: 3 columns on desktop, 2 on tablet, 1 on mobile'];

export default function FeaturesSection() {
  return (
    <Section>
      <Head eyebrow="Features" title="Everything a design team needs" lead="Components, tokens and guidelines that stay in sync from Figma to production." />
      <div className="ws-grid ws-grid--3">
        {FEATURES.map(([icon, t, d]) => (
          <div key={t} className="ws-feature"><FIcon name={icon} /><p className="ws-feature__title text-web-heading-xs">{t}</p><p className="text-web-body">{d}</p></div>
        ))}
      </div>
    </Section>
  );
}
