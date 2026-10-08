import { Avatar, Badge } from '../../../../../react/src';
import { Img, Section } from './parts';

export const anatomy = ['Cover image (16:10)', 'Category badge', 'Title — Web/Heading xs, max 2 lines', 'Excerpt — 2 lines', 'Author row: avatar, name, date'];

export function Post({ title, excerpt, tag, tone, author = 'Kristina Stan' }: { title: string; excerpt: string; tag: string; tone?: 'soft' | 'warm' | 'green'; author?: string }) {
  return (
    <article className="ws-post">
      <Img ratio="16 / 10" tone={tone} />
      <div><Badge color="brand">{tag}</Badge></div>
      <p className="ws-post__title text-web-heading-xs">{title}</p>
      <p className="text-web-body">{excerpt}</p>
      <div className="ws-person"><Avatar name={author} size="sm" /><div><p className="ws-person__name ws-small">{author}</p><p className="ws-tiny">8 Oct 2026 · 6 min read</p></div></div>
    </article>
  );
}

export default function BlogCard() {
  return (
    <Section alt>
      <div style={{ maxWidth: 400 }}><Post tag="Design systems" title="How we built one system for product and web" excerpt="Tokens, modes and slots: the decisions behind Atomus 4.0." /></div>
    </Section>
  );
}
