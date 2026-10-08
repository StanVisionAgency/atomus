// Markdown scorecard from the JSON produced by scoreRun().
import { SCORERS } from './score.mjs';

const pct = (x) => `${Math.round(x * 100)}%`;
const esc = (s) => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');

export function toMarkdown(card) {
  const t = card.totals;
  const lines = [
    `# Atomus agent eval — ${card.run}`,
    '',
    `Agent: **${card.agent ?? 'unknown'}**${card.variant ? ` · setup: **${card.variant}**` : ''}${card.model ? ` · model: ${card.model}` : ''} · scored ${card.scoredAt.slice(0, 10)} · scorecard v${card.version} · Atomus ${card.atomus.manifest}`,
    '',
    `**Overall ${pct(t.score)}** · ${t.passed}/${t.prompts} prompts clean · ${t.errors} errors, ${t.warnings} warnings · ${t.axeViolations} axe violations · ${t.inlineStyles} inline styles · ${t.rawColors} raw colours${t.missing ? ` · ${t.missing} outputs missing` : ''}`,
    '',
    '## By scorer',
    '',
    '| Scorer | Mean score |',
    '| --- | --- |',
    ...SCORERS.filter((s) => card.byScorer[s.id] != null).map((s) => `| ${s.title} | ${pct(card.byScorer[s.id])} |`),
    '',
    '## By category',
    '',
    '| Category | Prompts | Clean | Mean score |',
    '| --- | --- | --- | --- |',
    ...Object.entries(card.byCategory).map(([c, v]) => `| ${c} | ${v.prompts} | ${v.passed} | ${pct(v.score)} |`),
    '',
    '## Prompts',
    '',
    `| Prompt | Category | Score | ${SCORERS.map((s) => s.id).join(' | ')} |`,
    `| --- | --- | --- | ${SCORERS.map(() => '---').join(' | ')} |`,
    ...card.items.map((i) => (i.missing
      ? `| ${i.id} | ${i.category} | missing | ${SCORERS.map(() => '—').join(' | ')} |`
      : `| ${i.pass ? '✓' : '✗'} ${i.id} | ${i.category} | ${pct(i.score)} | ${SCORERS.map((s) => (i.results[s.id] ? pct(i.results[s.id].score) : '—')).join(' | ')} |`)),
    '',
  ];
  const failing = card.items.filter((i) => !i.missing && Object.values(i.results).some((r) => r.issues.length));
  if (failing.length) {
    lines.push('## Issues', '');
    for (const i of failing) {
      lines.push(`### ${i.id}`, '');
      for (const [sid, r] of Object.entries(i.results)) {
        for (const is of r.issues) lines.push(`- **${sid}** · ${is.severity} · \`${is.rule}\`${is.line ? ` (line ${is.line}${is.file === 'css' ? ', CSS' : ''})` : ''}: ${esc(is.message)}`);
      }
      lines.push('');
    }
  }
  if (card.unknownOutputs?.length) lines.push(`Outputs without a prompt (ignored): ${card.unknownOutputs.join(', ')}`, '');
  return `${lines.join('\n')}\n`;
}
