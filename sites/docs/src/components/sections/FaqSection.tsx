import { Button } from '../../../../../react/src';
import { Head, Section } from './parts';
import { Faq } from './FaqItem';

export const anatomy = ['Section heading', '6 FAQ items (first one open)', 'Optional "Still have questions?" line with a contact link'];

const QA: [string, string][] = [
  ['What is Atomus?', 'A design system for product UI and marketing websites: a Figma library, design tokens, React components and AI guidelines.'],
  ['Can I use it for client projects?', 'Yes — duplicate the file per client and set the brand mode.'],
  ['Does it support dark mode?', 'Every colour token has a light and a dark value.'],
  ['Which frameworks are supported?', 'React components, plain CSS variables, a Tailwind preset and shadcn/ui themes.'],
  ['How do updates work?', 'Pull the latest library in Figma and bump the npm package.'],
  ['Is there a free plan?', 'Yes, Starter is free forever for one project.'],
];

export default function FaqSection() {
  return (
    <Section>
      <Head center title="Frequently asked questions" lead="Everything you need to know about Atomus." />
      <div className="ws-faq-list">{QA.map(([q, a], i) => <Faq key={q} q={q} a={a} open={i === 0} />)}</div>
      <div className="ws-head ws-head--center" style={{ margin: 'var(--layout-md) auto 0' }}><p className="text-web-body">Still have questions?</p><Button hierarchy="outline">Contact us</Button></div>
    </Section>
  );
}
