// Per-prompt expectations from prompts/<id>.yaml (`expect:`):
//   components: [Button, Modal]        rendered as JSX (imported from @stanvision/atomus-react)
//   props: [{ component, prop, value }] at least one element sets that prop to that value
//   max_primary: 1                      at most N <Button hierarchy="primary">
//   forbid_elements: [button, select]   raw HTML elements that should be Atomus components
//   text: ["Save changes"]              strings the UI must contain (case-insensitive)
//   patterns: ['role="log"']            regular expressions the code must match
import { parseTsx } from '../context.mjs';
import { atomusBindings, atomusTag, importsOf, jsxElements } from '../jsx.mjs';

export const id = 'expectations';
export const title = 'Prompt expectations';

export async function score({ code, prompt }) {
  const e = prompt.expect ?? {};
  const { ts, sf } = await parseTsx(code);
  const bindings = atomusBindings(importsOf(ts, sf));
  const elements = jsxElements(ts, sf).map((el) => ({ ...el, atomus: atomusTag(el.tag, bindings) }));
  const checks = [];
  const check = (rule, ok, message) => checks.push({ rule, ok, message });

  for (const c of e.components ?? []) check('renders', elements.some((el) => el.atomus === c), `Renders <${c}>`);
  for (const p of e.props ?? []) {
    check('prop', elements.some((el) => el.atomus === p.component && el.attrs.some((a) => a.name === p.prop && (p.value === undefined || a.value === p.value))),
      `<${p.component} ${p.prop}${p.value === undefined ? '' : `="${p.value}"`}>`);
  }
  if (e.max_primary != null) {
    const primaries = elements.filter((el) => el.atomus === 'Button' && el.attrs.some((a) => a.name === 'hierarchy' && a.value === 'primary')).length;
    check('max-primary', primaries <= e.max_primary, `At most ${e.max_primary} primary button(s) (found ${primaries})`);
  }
  for (const tag of e.forbid_elements ?? []) {
    const found = elements.filter((el) => el.tag === tag);
    check('forbid-element', !found.length, `No raw <${tag}>${found.length ? ` (line ${found.map((f) => f.line).join(', ')})` : ''}`);
  }
  const lower = code.toLowerCase();
  for (const t of e.text ?? []) check('text', lower.includes(String(t).toLowerCase()), `Contains “${t}”`);
  for (const re of e.patterns ?? []) check('pattern', new RegExp(re, 'm').test(code), `Matches /${re}/`);

  const passed = checks.filter((c) => c.ok).length;
  return {
    score: checks.length ? passed / checks.length : 1,
    issues: checks.filter((c) => !c.ok).map((c) => ({ rule: c.rule, severity: 'error', message: `Expected: ${c.message}` })),
    stats: { checks: checks.length, passed },
  };
}
