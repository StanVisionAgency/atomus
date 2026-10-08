import { Avatar, Badge } from '../../../../../react/src';
import { Img, Section } from './parts';

export const anatomy = ['Meta: category badge and reading time', 'Title (Web/Heading xl) and lead paragraph', 'Author row', 'Cover image', 'Rich-text body (max 720px): Web/Body paragraphs, Web/Heading sm subheads, quotes, lists'];

export default function BlogPostContent() {
  return (
    <Section>
      <article className="ws-article">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}><Badge color="brand">Design systems</Badge><span className="ws-tiny">6 min read</span></div>
        <p className="ws-title text-web-heading-xl">How we built one system for product and web</p>
        <p className="text-web-body-lg ws-lead">Tokens, modes and slots: the decisions behind Atomus 4.0.</p>
        <div className="ws-person"><Avatar name="Kristina Stan" size="md" /><div><p className="ws-person__name">Kristina Stan</p><p className="ws-person__role">8 Oct 2026</p></div></div>
        <Img ratio="16 / 8" tone="soft" ui />
        <p className="text-web-body">Most teams keep two libraries: one for the product and one for the marketing site. They drift apart within months. Atomus starts from a single set of semantic tokens that both sides share.</p>
        <h3 className="text-web-heading-sm">Start from semantic tokens</h3>
        <p className="text-web-body">Components never reference a hex value. They use roles such as text-primary or bg-brand-solid, and modes decide the actual colour.</p>
        <blockquote className="text-web-quote">“The best design system is the one both designers and developers can read.”</blockquote>
      </article>
    </Section>
  );
}
