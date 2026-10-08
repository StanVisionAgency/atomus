import { Button } from '../../../../../react/src';
import { Check, Head, Img, Section } from './parts';

export const anatomy = ['Text column: eyebrow, title, supporting text', 'Checklist — 3 to 5 short benefits', 'Optional CTA', 'Image column; Type = Image left mirrors the order. Stacks text-first on tablet and mobile'];

export default function FeatureSplitSection() {
  return (
    <Section>
      <div className="ws-split">
        <div>
          <Head eyebrow="Theming" size="lg" title="One file, every client brand" lead="Switch the Brand, Color and Radius modes and the whole system follows — no detaching, no overrides." />
          <ul className="ws-checks text-web-body">
            {['Brand ramps for each client', 'Light and dark from the same tokens', 'Sharp, default and round radius modes'].map((t) => <li key={t}><Check />{t}</li>)}
          </ul>
          <div className="ws-actions" style={{ marginTop: 'var(--layout-xs)' }}><Button hierarchy="primary" size="lg">Explore theming</Button></div>
        </div>
        <Img ratio="1 / 1" tone="soft" ui />
      </div>
    </Section>
  );
}
