import { Button, Icon, Input } from '../../../../../react/src';
import { Section } from './parts';

export const anatomy = ['Large "404" in brand text', 'Title and one line of help', 'Search field', 'Back and Home actions'];

export default function NotFoundSection() {
  return (
    <Section>
      <div className="ws-404">
        <p className="ws-404__code" aria-hidden="true">404</p>
        <p className="ws-title text-web-heading-lg">We can’t find that page</p>
        <p className="ws-lead text-web-body-lg">The page you’re looking for doesn’t exist or has moved.</p>
        <div className="ws-search"><Input size="lg" aria-label="Search" placeholder="Search the site" iconLeading={<Icon name="search" />} /></div>
        <div className="ws-actions"><Button hierarchy="outline" size="lg" iconLeading={<Icon name="chevronLeft" />}>Go back</Button><Button hierarchy="primary" size="lg">Take me home</Button></div>
      </div>
    </Section>
  );
}
