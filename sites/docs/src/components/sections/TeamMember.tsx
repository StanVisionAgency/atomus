import { Section, Img } from './parts';

export const anatomy = ['Square photo', 'Name (Web/Heading xs) and role in brand text', 'Short bio — 2 lines', 'Social links (optional)'];

export function Member({ name, role, bio, tone }: { name: string; role: string; bio?: string; tone?: 'soft' | 'warm' | 'green' }) {
  return (
    <div className="ws-member">
      <Img tone={tone ?? 'soft'} />
      <div><p className="ws-feature__title text-web-heading-xs">{name}</p><p className="ws-eyebrow ws-small">{role}</p></div>
      {bio ? <p className="text-web-body">{bio}</p> : null}
    </div>
  );
}

export default function TeamMember() {
  return (
    <Section alt>
      <div style={{ maxWidth: 300 }}><Member name="Kristina Stan" role="Founder & design lead" bio="Builds design systems for product teams and agencies." tone="warm" /></div>
    </Section>
  );
}
