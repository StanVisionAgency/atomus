// Server-rendered Atomus components for the hero. Same package the docs use.
import { Avatar, Badge, Button, Card, Icon, MetricCard, ProgressBar, Tabs, Toggle, Alert } from '../../../../react/src';

export function Showcase() {
  return (
    <div className="showcase">
      <Card className="showcase__main" title="Q4 launch" supportingText="Atomus Website · 24 files" headerAction={<Badge color="success" dot>On track</Badge>}
        footer={<><Button hierarchy="tertiary" size="sm">Share</Button><Button hierarchy="primary" size="sm">Open project</Button></>}>
        <div className="showcase__stack">
          <Tabs aria-label="Views" variant="segmented" defaultValue="w" items={[{ value: 'd', label: 'Day' }, { value: 'w', label: 'Week' }, { value: 'm', label: 'Month' }]} />
          <div className="showcase__metrics">
            <MetricCard label="Pages shipped" value="42" change="18%" caption="this week" />
            <MetricCard type="chart" label="Bugs open" value="3" change="-62%" data={[9, 8, 8, 6, 5, 4, 3]} />
          </div>
          <ProgressBar value={72} label="Launch checklist" />
          <div className="showcase__people">
            <Avatar name="Kristina Stan" size="sm" /><Avatar name="Mila Petrova" size="sm" /><Avatar name="Ivan Georgiev" size="sm" status="online" />
            <span>3 designers, 0 inconsistencies</span>
          </div>
        </div>
      </Card>
      <div className="showcase__side">
        <Alert color="brand" title="New: Atomus 4.0">Tokens, React and docs are free.</Alert>
        <Card variant="elevated" padding="md">
          <div className="showcase__stack">
            <Toggle label="Dark mode" defaultChecked readOnly />
            <Toggle label="Client brand" readOnly />
            <div className="showcase__row"><Button hierarchy="primary" size="sm" iconLeading={<Icon name="plus" size={16} />}>New page</Button><Button hierarchy="outline" size="sm">Preview</Button></div>
          </div>
        </Card>
      </div>
    </div>
  );
}
