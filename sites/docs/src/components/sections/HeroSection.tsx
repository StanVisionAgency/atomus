import { Badge, Button, Icon } from '../../../../../react/src';
import { Head, Img, Section } from './parts';

export const anatomy = ['Badge or eyebrow (optional)', 'Headline — Web/Display', 'Supporting text — Web/Body lg, max ~2 lines', 'Primary + secondary CTA', 'Product image or screenshot; Split image puts it beside the text, Email capture swaps the CTAs for an email field'];

export default function HeroSection() {
  return (
    <Section>
      <Head center size="display" title="Design and ship websites in days, not weeks" lead="Atomus gives your team one design system for product UI and marketing pages — in Figma, React and AI tools." top={<Badge color="brand" size="lg" dot>New · Atomus 4.0 is here</Badge>}>
        <div className="ws-actions"><Button hierarchy="outline" size="xl">Book a demo</Button><Button hierarchy="primary" size="xl" iconTrailing={<Icon name="chevronRight" />}>Get started</Button></div>
      </Head>
      <Img ratio="16 / 8" ui />
    </Section>
  );
}
