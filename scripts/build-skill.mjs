#!/usr/bin/env node
// Rebuilds everything generated in skills/atomus/ from the repo's single sources:
//   - references/components.md + react-api.json  (scripts/gen-react-api.mjs: react/src + guidelines/overview-components.md)
//   - references/tokens.md + tokens.json          (scripts/gen-token-reference.mjs: tokens/*.tokens.json)
//   - SKILL.md core rules and forbidden list      (copied from guidelines/Guidelines.md)
//   - references/figma.md MCP rules               (copied from guidelines/figma-mcp-rules.md)
// Also refreshes the React API sections in guidelines/components/*.md.
//
//   node scripts/build-skill.mjs           write
//   node scripts/build-skill.mjs --check   exit 1 if anything is stale (use in CI)
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');
let stale = false;

for (const script of ['gen-react-api.mjs', 'gen-token-reference.mjs']) {
  try {
    process.stdout.write(execFileSync(process.execPath, [join(root, 'scripts', script), ...(CHECK ? ['--check'] : [])], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }));
  } catch {
    stale = true;
  }
}

const read = (p) => readFileSync(join(root, p), 'utf8');
/** Returns the "## <heading>" section of a Markdown file, heading included. */
const section = (md, heading) => {
  const m = md.match(new RegExp(`^## ${heading}\\n[\\s\\S]*?(?=^## |(?![\\s\\S]))`, 'm'));
  if (!m) throw new Error(`build-skill: "## ${heading}" not found`);
  return m[0].trim();
};
// Paths in the guidelines are relative to guidelines/; inside the skill they point at its references.
const forSkill = (md) =>
  md
    .replace(/`overview-components\.md` and read the component's guideline file/g, '`references/components.md` (catalogue, decision trees and React API)')
    .replace(/`overview-components\.md` and open its guideline file/g, '`references/components.md`')
    .replace(/open its guideline file/g, 'read its entry in `references/components.md`')
    .replace(/the guideline's React API table/g, 'the React API in `references/components.md`')
    .replace(/Check the guideline file\./g, 'Check `references/components.md`.')
    .replace(/a component's \*\*React API\*\* section/g, 'the **React API** in `references/components.md`')
    .replace(/`guidelines\/components\/[\w-]+\.md`/g, '`references/components.md`')
    .replace(/`website-sections\.md`/g, '`references/patterns.md`')
    .replace(/`foundations\/typography\.md`/g, '`references/tokens.md`')
    .replace(/`overview-components\.md`/g, '`references/components.md`')
    .replace(/node skills\/atomus\/scripts\/validate\.mjs/g, 'node <skill-dir>/scripts/validate.mjs')
    .replace(/(?<![\w/])Guidelines\.md(?!\w)/g, 'SKILL.md');

function splice(file, marker, content) {
  const path = join(root, file);
  const md = readFileSync(path, 'utf8');
  const re = new RegExp(`(<!-- ${marker}:start[^\\n]*-->\\n)[\\s\\S]*?(<!-- ${marker}:end -->)`);
  if (!re.test(md)) throw new Error(`build-skill: markers ${marker} missing in ${file}`);
  const next = md.replace(re, (_, a, b) => `${a}${content.trim()}\n${b}`);
  if (next === md) return;
  if (CHECK) { console.error(`build-skill: ${file} is out of date`); stale = true; return; }
  writeFileSync(path, next);
  console.log(`build-skill: updated ${file}`);
}

const guidelines = read('guidelines/Guidelines.md');
splice('skills/atomus/SKILL.md', 'core-rules', forSkill(`${section(guidelines, 'Core rules')}\n\n${section(guidelines, 'Forbidden')}`));
const figmaRules = read('guidelines/figma-mcp-rules.md').replace(/^# .*\n+/, '').replace(/^Rules for an agent[^\n]*\n+/m, '');
splice('skills/atomus/references/figma.md', 'figma-mcp-rules', forSkill(`## Rules for the Figma MCP server\n\n${figmaRules.replace(/^## /gm, '### ')}`));

if (stale) process.exit(1);
