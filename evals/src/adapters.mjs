// Adapters that turn a prompt into a generated output file by invoking an agent CLI.
//
//   claude-code  `claude -p` in an empty workspace. Variant "atomus": the Atomus skill in .claude/skills/atomus and
//                the Atomus MCP server (local build, or the remote server with --remote-mcp). Variant "baseline":
//                no skill, no MCP servers — the agent only knows the package names from the instruction.
//   command      any CLI that prints a reply: --cmd "my-agent --prompt-file {prompt_file}" (Codex, Aider, …).
//   manual       writes the instructions to <out>/prompts/<id>.md for agents without a CLI (Cursor, Copilot):
//                paste each into the agent and save the code as <out>/<id>.tsx (+ <id>.css).
import { spawn } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ROOT } from './context.mjs';

/** The instruction every agent gets: same wording for all agents and variants. */
export function instruction(prompt) {
  return [
    'Build this UI with the Atomus design system: React components from `@stanvision/atomus-react` (styles: `@stanvision/atomus-react/styles.css`) and design tokens from `@stanvision/atomus-tokens` (CSS custom properties such as var(--color-text-primary), var(--spacing-xl)).',
    '',
    `Task: ${prompt.prompt.trim()}`,
    '',
    'Reply with exactly one ```tsx code block: a single React + TypeScript file that default-exports a component rendering the whole UI with no required props (use realistic sample data). If you need CSS, add one ```css code block after it (plain class selectors, no Tailwind). No other code blocks, no explanation.',
  ].join('\n');
}

/** Pulls the first ```tsx (or ```jsx / ```typescript) block and the first ```css block out of a reply. */
export function extractCode(reply) {
  const blocks = [...reply.matchAll(/```([\w-]*)[^\n]*\n([\s\S]*?)```/g)].map((m) => ({ lang: m[1].toLowerCase(), code: m[2] }));
  const tsx = blocks.find((b) => ['tsx', 'jsx', 'typescript', 'ts', 'react'].includes(b.lang)) ?? blocks.find((b) => b.lang !== 'css' && /export\s+default/.test(b.code));
  const css = blocks.find((b) => b.lang === 'css');
  return { tsx: tsx?.code ?? null, css: css?.code ?? null };
}

function exec(cmd, args, { cwd, input, timeoutMs = 600_000, shell = false }) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { cwd, shell, stdio: ['pipe', 'pipe', 'pipe'], env: process.env });
    let out = '';
    let err = '';
    const timer = setTimeout(() => child.kill('SIGTERM'), timeoutMs);
    child.stdout.on('data', (d) => { out += d; });
    child.stderr.on('data', (d) => { err += d; });
    child.on('close', (code) => { clearTimeout(timer); resolve({ code, out, err }); });
    child.on('error', (e) => { clearTimeout(timer); resolve({ code: -1, out, err: String(e) }); });
    if (input) child.stdin.write(input);
    child.stdin.end();
  });
}

/** MCP config for the "atomus" variant: the local build of packages/mcp, or the remote server. */
export function atomusMcpConfig({ remote = false } = {}) {
  const local = join(ROOT, 'packages/mcp/dist/stdio.js');
  if (!remote && existsSync(local)) return { mcpServers: { atomus: { command: 'node', args: [local] } } };
  return { mcpServers: { atomus: { type: 'http', url: 'https://mcp.atomus.io/mcp' } } };
}

export const ADAPTERS = {
  'claude-code': {
    async available() {
      const r = await exec('claude', ['--version'], {});
      return r.code === 0 ? r.out.trim() : null;
    },
    async generate(prompt, { variant = 'atomus', model, remoteMcp = false, timeoutMs }) {
      const ws = mkdtempSync(join(tmpdir(), `atomus-eval-${prompt.id}-`));
      try {
        const args = ['-p', instruction(prompt), '--output-format', 'text', '--strict-mcp-config'];
        if (variant === 'atomus') {
          cpSync(join(ROOT, 'skills/atomus'), join(ws, '.claude/skills/atomus'), { recursive: true });
          writeFileSync(join(ws, 'mcp.json'), JSON.stringify(atomusMcpConfig({ remote: remoteMcp }), null, 2));
          args.push('--mcp-config', join(ws, 'mcp.json'), '--allowedTools', 'mcp__atomus', 'Skill', 'Read', 'Glob', 'Grep');
        } else {
          args.push('--disallowedTools', 'Skill', 'WebFetch', 'WebSearch');
        }
        if (model) args.push('--model', model);
        const r = await exec('claude', args, { cwd: ws, timeoutMs });
        return { reply: r.out, error: r.code === 0 ? null : (r.err || r.out).trim().split('\n').slice(-3).join(' ') };
      } finally {
        rmSync(ws, { recursive: true, force: true });
      }
    },
  },
  command: {
    async available() { return 'custom command'; },
    async generate(prompt, { cmd, timeoutMs }) {
      if (!cmd) throw new Error('--agent command needs --cmd "… {prompt_file} …"');
      const ws = mkdtempSync(join(tmpdir(), `atomus-eval-${prompt.id}-`));
      try {
        const file = join(ws, 'prompt.md');
        writeFileSync(file, instruction(prompt));
        const r = await exec(cmd.replaceAll('{prompt_file}', JSON.stringify(file)), [], { cwd: ws, shell: true, timeoutMs, input: cmd.includes('{prompt_file}') ? undefined : instruction(prompt) });
        return { reply: r.out, error: r.code === 0 ? null : (r.err || r.out).trim().split('\n').slice(-3).join(' ') };
      } finally {
        rmSync(ws, { recursive: true, force: true });
      }
    },
  },
};

/** Manual mode: writes one instruction file per prompt for copy and paste. */
export function writeManualPrompts(prompts, out) {
  mkdirSync(join(out, 'prompts'), { recursive: true });
  for (const p of prompts) writeFileSync(join(out, 'prompts', `${p.id}.md`), `${instruction(p)}\n`);
}
