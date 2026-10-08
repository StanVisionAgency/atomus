import { Avatar } from '../../../../../react/src';
import { Head, Section, Stars } from './parts';

export const anatomy = ['Section heading', 'Testimonial cards: rating, quote (Web/Body), author row', '3 columns → 2 → 1'];

export const QUOTES: [string, string, string][] = [
  ['Kristina Stan', 'Founder, StanVision', 'The tokens alone saved us weeks on every client project.'],
  ['Ivan Georgiev', 'Frontend lead, Lumen', 'Props match the Figma properties, so handoff is basically copy and paste.'],
  ['Nora Lee', 'Product designer, Orbital', 'Dark mode and brand switching just work. Our clients love the previews.'],
];

export default function TestimonialsGrid() {
  return (
    <Section>
      <Head center eyebrow="Testimonials" title="Loved by product teams" />
      <div className="ws-grid ws-grid--3">
        {QUOTES.map(([n, r, q]) => (
          <figure key={n} className="ws-card ws-card--filled" style={{ margin: 0 }}>
            <Stars />
            <blockquote className="text-web-body" style={{ margin: 0, color: 'var(--color-text-primary)' }}>“{q}”</blockquote>
            <figcaption className="ws-person"><Avatar name={n} size="md" /><div><p className="ws-person__name">{n}</p><p className="ws-person__role">{r}</p></div></figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
