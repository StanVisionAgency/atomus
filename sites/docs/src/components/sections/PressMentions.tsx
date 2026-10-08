import { Button } from '../../../../../react/src';
import { Logo, Section } from './parts';

export const anatomy = ['Heading', 'Press items: publication logo, short quote, "Read article" link', '3 columns → 1, separated by a left rule'];

const PRESS: [number, string][] = [[1, 'The most complete open design system for agencies we have seen this year.'], [2, 'Atomus makes brand theming a one-click decision.'], [3, 'A rare system that treats AI tools as first-class users.']];

export default function PressMentions() {
  return (
    <Section alt>
      <p className="ws-title text-web-heading-md" style={{ textAlign: 'center', marginBottom: 'var(--layout-md)' }}>In the press</p>
      <div className="ws-grid ws-grid--3">
        {PRESS.map(([i, q]) => (
          <div key={i} className="ws-press"><Logo i={i} /><p className="text-web-body-lg" style={{ color: 'var(--color-text-primary)' }}>“{q}”</p><div><Button hierarchy="link">Read article</Button></div></div>
        ))}
      </div>
    </Section>
  );
}
