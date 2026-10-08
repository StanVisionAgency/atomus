import { Button } from '../../../../../react/src';
import { Head, Section } from './parts';

export const anatomy = ['Section heading', 'Integration cards: app tile, name, one-line description, "View integration" link', '3 → 2 → 1 columns'];

const APPS: [string, string, string][] = [['Figma', '#a259ff', 'Variables and components in sync.'], ['GitHub', '#24292f', 'Token pull requests on every publish.'], ['Slack', '#4a154b', 'Release notes in your channel.'], ['Notion', '#191919', 'Embed live docs pages.'], ['Webflow', '#4353ff', 'Sections as Webflow components.'], ['Vercel', '#000000', 'Preview deployments for docs.']];

export default function IntegrationsSection() {
  return (
    <Section alt>
      <Head center eyebrow="Integrations" title="Works with your stack" />
      <div className="ws-grid ws-grid--3">
        {APPS.map(([n, c, d]) => (
          <div key={n} className="ws-card">
            <span className="ws-tile" style={{ background: c }} aria-hidden="true">{n[0]}</span>
            <div><p className="ws-feature__title text-web-heading-xs">{n}</p><p className="text-web-body">{d}</p></div>
            <div><Button hierarchy="link">View integration</Button></div>
          </div>
        ))}
      </div>
    </Section>
  );
}
