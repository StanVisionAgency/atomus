import { Button } from '../../../../../react/src';
import { Section } from './parts';

export const anatomy = ['Brand band: bg-brand-solid with on-brand text and a large radius', 'Title (Web/Heading lg) and one supporting line', 'Two CTAs — white primary, translucent outline', 'Type = Card with image adds an image beside the text; stacks on tablet and mobile'];

export default function CtaSection() {
  return (
    <Section>
      <div className="ws-cta">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)', maxWidth: 560 }}>
          <p className="ws-title text-web-heading-lg">Start building with Atomus</p>
          <p className="text-web-body-lg" style={{ opacity: 0.85 }}>Join 4,000+ teams designing faster with one system.</p>
        </div>
        <div className="ws-actions"><Button hierarchy="outline" size="xl">Talk to sales</Button><Button hierarchy="secondary" size="xl">Get started</Button></div>
      </div>
    </Section>
  );
}
