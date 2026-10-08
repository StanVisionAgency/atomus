import { Button } from '../../../../../react/src';
import { Head, Section } from './parts';
import { Post } from './BlogCard';

export const anatomy = ['Heading with a "View all posts" action', '3 Blog cards — 3 → 2 → 1 columns'];

export default function BlogSection() {
  return (
    <Section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
        <Head eyebrow="Blog" title="Latest writing" lead="Notes on design systems, tokens and shipping faster." />
        <div style={{ marginBottom: 'var(--layout-xl)' }}><Button hierarchy="outline">View all posts</Button></div>
      </div>
      <div className="ws-grid ws-grid--3">
        <Post tag="Tokens" title="Semantic tokens in practice" excerpt="Why we never use raw hex in components — and what to do instead." />
        <Post tag="Figma" tone="warm" author="Mila Petrova" title="Brand modes for agencies" excerpt="One file, twenty clients: setting up brand ramps that scale." />
        <Post tag="AI" tone="green" author="Ivan Georgiev" title="Teaching agents your design system" excerpt="Markdown guidelines that Claude and Cursor actually follow." />
      </div>
    </Section>
  );
}
