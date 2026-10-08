import { Button } from '../../../../../react/src';
import { Head, Section } from './parts';
import { Member } from './TeamMember';

export const anatomy = ['Section heading with an optional "We’re hiring" CTA', 'Team member cards — 4 → 2 → 1 columns'];

export default function TeamSection() {
  return (
    <Section>
      <Head center eyebrow="Team" title="Meet the people behind Atomus" lead="A small team of designers and engineers.">
        <Button hierarchy="primary">Open roles</Button>
      </Head>
      <div className="ws-grid ws-grid--4">
        <Member name="Kristina Stan" role="Founder" tone="warm" />
        <Member name="Mila Petrova" role="Design lead" />
        <Member name="Ivan Georgiev" role="Engineering" tone="green" />
        <Member name="Nora Lee" role="Product design" tone="soft" />
      </div>
    </Section>
  );
}
