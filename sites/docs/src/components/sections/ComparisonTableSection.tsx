import { Button, Icon } from '../../../../../react/src';
import { Head, Section } from './parts';

export const anatomy = ['Section heading', 'Table header: plan names, prices and CTAs; the recommended plan column is tinted', 'Grouped feature rows with check / dash cells (never colour alone)', 'Scrolls horizontally on mobile instead of squeezing columns'];

const ROWS: [string, boolean[]][] = [['Components & variants', [true, true, true]], ['Website sections', [false, true, true]], ['Brand modes', [false, true, true]], ['Client workspaces', [false, false, true]], ['SSO', [false, false, true]]];

export default function ComparisonTableSection() {
  const mark = (v: boolean) => (v ? <span className="ws-yes" aria-label="Included"><Icon name="check" /></span> : <span className="ws-no" aria-label="Not included"><Icon name="minus" /></span>);
  return (
    <Section>
      <Head center title="Compare plans" />
      <div className="ws-scroll">
        <table className="ws-compare" style={{ minWidth: 640 }}>
          <thead><tr><th scope="col"><span className="ws-tiny">Features</span></th>{(['Starter', 'Pro', 'Agency'] as const).map((p, i) => <th key={p} scope="col" className={i === 1 ? 'ws-compare__hl' : undefined}><div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>{p}<Button size="sm" hierarchy={i === 1 ? 'primary' : 'outline'}>Choose</Button></div></th>)}</tr></thead>
          <tbody>
            <tr className="ws-compare__group"><th colSpan={4}>Design</th></tr>
            {ROWS.map(([f, v]) => <tr key={f}><th scope="row">{f}</th>{v.map((x, i) => <td key={i} className={i === 1 ? 'ws-compare__hl' : undefined}>{mark(x)}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
