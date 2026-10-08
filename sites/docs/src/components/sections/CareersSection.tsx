import { Badge, Button, Icon, Tabs } from '../../../../../react/src';
import { Head, Section } from './parts';

export const anatomy = ['Heading and supporting text', 'Department filter (Tabs, pill)', 'Job cards: title, department badge, location and type, "Apply" action', 'Job cards stack their action under the text on mobile'];

const JOBS: [string, string, string][] = [['Senior product designer', 'Design', 'Remote · Full-time'], ['Frontend engineer (React)', 'Engineering', 'Sofia · Hybrid'], ['Design system advocate', 'Marketing', 'Remote · Part-time']];

export default function CareersSection() {
  return (
    <Section>
      <Head eyebrow="Careers" title="Open positions" lead="Join a small team that ships design systems for the world’s best product teams." />
      <div style={{ marginBottom: 'var(--layout-xs)' }}><Tabs variant="pill" aria-label="Department" items={[{ value: 'all', label: 'View all' }, { value: 'd', label: 'Design' }, { value: 'e', label: 'Engineering' }, { value: 'm', label: 'Marketing' }]} /></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
        {JOBS.map(([t, d, m]) => (
          <div key={t} className="ws-job">
            <div><p className="ws-feature__title text-web-heading-xs">{t}</p><div className="ws-job__meta"><Badge color="brand">{d}</Badge><span className="ws-small" style={{ color: 'var(--color-text-tertiary)' }}>{m}</span></div></div>
            <Button hierarchy="outline" iconTrailing={<Icon name="chevronRight" />}>Apply</Button>
          </div>
        ))}
      </div>
    </Section>
  );
}
