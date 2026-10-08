import { Img, Section } from './parts';

export const anatomy = ['Eyebrow and title', 'Long-form copy in two to four paragraphs', 'Supporting image beside the text (below on tablet and mobile)', 'Optional pull quote'];

export default function ContentSection() {
  return (
    <Section>
      <div className="ws-split" style={{ alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3xl)' }}>
          <p className="ws-eyebrow text-web-eyebrow">Our story</p>
          <p className="ws-title text-web-heading-lg">From agency toolkit to design system</p>
          <p className="text-web-body">Atomus began as the internal kit of a design agency running twenty client projects at once. Every project needed the same buttons, forms and sections — in a different brand.</p>
          <p className="text-web-body">We rebuilt it around variables and modes, so one file could serve every client without detaching a single component.</p>
          <p className="text-web-quote" style={{ color: 'var(--color-text-primary)', paddingLeft: 16, borderLeft: '3px solid var(--color-border-brand)' }}>“Duplicate, set the brand, design.”</p>
        </div>
        <Img ratio="1 / 1" tone="warm" />
      </div>
    </Section>
  );
}
