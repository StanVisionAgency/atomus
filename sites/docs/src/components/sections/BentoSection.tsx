import { Badge } from '../../../../../react/src';
import { FIcon, Head, Img, Section } from './parts';

export const anatomy = ['Section heading', 'Bento grid of feature cards — one wide and one tall card for rhythm', 'Each card: icon or image, title, one line of text', '3 columns → 2 → 1'];

export default function BentoSection() {
  return (
    <Section alt>
      <Head center eyebrow="Platform" title="Built for the way teams work" />
      <div className="ws-bento">
        <div className="ws-card ws-bento__wide"><div><p className="ws-feature__title text-web-heading-sm">Live components</p><p className="text-web-body">Every demo is the shipped React code.</p></div><Img ratio="16 / 6" ui /></div>
        <div className="ws-card ws-bento__tall"><FIcon name="settings" /><div><p className="ws-feature__title text-web-heading-sm">Tokens everywhere</p><p className="text-web-body">Figma variables, CSS, Tailwind and DTCG JSON from one source.</p></div><Img ratio="3 / 4" tone="warm" /></div>
        <div className="ws-card"><FIcon name="search" /><div><p className="ws-feature__title text-web-heading-xs">AI-ready</p><p className="text-web-body">Guidelines agents can read.</p></div></div>
        <div className="ws-card"><Badge color="success" dot>99.9% uptime</Badge><div><p className="ws-feature__title text-web-heading-xs">Fast docs</p><p className="text-web-body">Static, searchable, themeable.</p></div></div>
      </div>
    </Section>
  );
}
