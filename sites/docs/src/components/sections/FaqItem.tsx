import { Section } from './parts';

export const anatomy = ['Question — Web/Body lg, semibold', 'Plus icon that turns into × when open', 'Answer — Web/Body, secondary text', 'State: Closed · Open; a hairline divider between items'];

export function Faq({ q, a, open }: { q: string; a: string; open?: boolean }) {
  return (
    <details className="ws-faq" open={open}>
      <summary>{q}<span aria-hidden="true">+</span></summary>
      <p className="text-web-body">{a}</p>
    </details>
  );
}

export default function FaqItem() {
  return (
    <Section tight>
      <div className="ws-faq-list">
        <Faq q="Can I use Atomus for client projects?" a="Yes. Duplicate the file per client, set the brand mode and design. The licence covers unlimited client work." />
        <Faq open q="Does it work with Tailwind?" a="Yes. The Tailwind preset maps every Atomus token to utilities, so classes like bg-primary and text-secondary follow light, dark and brand modes." />
      </div>
    </Section>
  );
}
