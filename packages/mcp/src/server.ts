// The Atomus MCP server: tool registrations shared by the stdio entry and the Cloudflare Worker.
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { data } from './data.js';
import { closedWorld } from './closed-world.js';
import * as tools from './tools.js';
import type { ToolResult, Validator } from './tools.js';

export const NAME = 'atomus';
export const VERSION = data.version;

export const INSTRUCTIONS = `Atomus design system (StanVision): React components (@stanvision/atomus-react), semantic tokens (@stanvision/atomus-tokens) and a Figma file whose properties the props mirror.
Before writing or changing any UI that uses Atomus, CALL atomus_get_started FIRST. Then: atomus_list_components to choose, atomus_get_component before using a component (never invent props), atomus_find_token for every colour, spacing and radius (never raw hex/rgb/px or primitives), atomus_get_pattern for screen layouts, atomus_figma_to_code for Figma instances.
REQUIRED FINAL STEP: atomus_validate on every file you created or changed; fix all errors before you finish.
All links point to https://docs.atomus.io.`;

const READ_ONLY = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } as const;

function reply(r: ToolResult) {
  return { content: [{ type: 'text' as const, text: closedWorld(r.text) }], ...(r.isError ? { isError: true } : {}) };
}

export function createServer(validator: Validator, options: { remote?: boolean; jsonSchemaValidator?: unknown } = {}) {
  const server = new McpServer(
    { name: NAME, title: 'Atomus design system', version: VERSION, websiteUrl: 'https://docs.atomus.io/ai/mcp/' },
    { instructions: INSTRUCTIONS, ...(options.jsonSchemaValidator ? { jsonSchemaValidator: options.jsonSchemaValidator as never } : {}) },
  );

  server.registerTool(
    'atomus_get_started',
    {
      title: 'Start here: Atomus rules and workflow',
      description:
        'CALL THIS FIRST, before you write, change or review any UI that uses Atomus (imports from @stanvision/atomus-react or @stanvision/atomus-tokens, Atomus tokens like --color-text-primary, data-theme/data-brand attributes, or an Atomus Figma file). Returns the required workflow, the core rules, the forbidden list, the setup imports and which Atomus tool to call next. Pass the task in one sentence to get tailored next steps.',
      inputSchema: { task: z.string().max(2000).optional().describe('What you are about to build, in one sentence (optional).') },
      annotations: { title: 'Start here', ...READ_ONLY },
    },
    async ({ task }) => reply(tools.getStarted(task)),
  );

  server.registerTool(
    'atomus_list_components',
    {
      title: 'List Atomus components',
      description:
        'List every Atomus component with what it is for, whether it has a React export or is Figma-only, other names people use (dialog → Modal, sheet → Drawer, snackbar → Toast) and the decision trees (Alert vs Toast vs Modal, Card vs section, Tabs vs segmented …). Call this BEFORE choosing a component. Pass `query` to resolve a name or need ("dialog", "combobox", "kpi"); never import a component that this tool marks Figma-only.',
      inputSchema: {
        query: z.string().max(200).optional().describe('A component name, another name for it, or a need ("dialog", "date range", "kpi").'),
        category: z.string().max(100).optional().describe('Only this catalogue group, e.g. "Forms and inputs", "Feedback", "Overlays".'),
        includeFigmaOnly: z.boolean().optional().describe('Include Figma-only components (default true).'),
        decisionTrees: z.boolean().optional().describe('Include the decision trees (default true).'),
      },
      annotations: { title: 'List components', ...READ_ONLY },
    },
    async (args) => reply(tools.listComponents(args)),
  );

  server.registerTool(
    'atomus_get_component',
    {
      title: 'Get an Atomus component',
      description:
        'Get one Atomus component from the manifest: import, every prop with type, allowed values, default and the Figma property it mirrors, native attributes, Do / Don\'t / Forbidden rules, code examples, Figma component sets and Code Connect mapping, accessibility notes and related components. ALWAYS call this before writing JSX for a component, and use only the props and values it returns. Accepts React names (DatePicker), Figma names ("Date picker", "Button icon") and other names ("dialog").',
      inputSchema: {
        name: z.string().min(1).max(200).describe('Component name: React export, Figma component set or another name.'),
        format: z.enum(['markdown', 'json']).optional().describe('markdown (default) or the raw manifest entry as JSON.'),
      },
      annotations: { title: 'Get component', ...READ_ONLY },
    },
    async (args) => reply(tools.getComponent(args)),
  );

  server.registerTool(
    'atomus_find_token',
    {
      title: 'Find an Atomus token',
      description:
        'Find the Atomus design token for an intent, with Light and Dark values, the Tailwind utility and what it is for. Call this INSTEAD of writing any hex, rgb(), hsl(), px value or primitive (--color-gray-500) for colour, spacing, radius, shadow or type. Describe the intent in plain words ("supporting text", "card border", "page background", "gap inside a card", "space between sections", "error background"); a hex, a px value or a primitive name also works and returns the semantic tokens with that value.',
      inputSchema: {
        query: z.string().min(1).max(300).describe('Intent in plain words, or a hex / px value / primitive token name.'),
        kind: z.enum(['any', 'color', 'spacing', 'size', 'radius', 'shadow', 'text-style']).optional().describe('Restrict to one kind of token (default any).'),
        limit: z.number().int().min(1).max(25).optional().describe('Maximum results (default 6).'),
      },
      annotations: { title: 'Find token', ...READ_ONLY },
    },
    async (args) => reply(tools.findToken(args)),
  );

  server.registerTool(
    'atomus_get_pattern',
    {
      title: 'Get an Atomus page pattern',
      description:
        'Get a complete, validated screen recipe built only from Atomus components and tokens: app shell (sidebar + page), dashboard, table view, settings, auth (log in / sign up), website sections (marketing pages) or AI chat. Call this before you lay out a new screen, then copy the structure and change the content.',
      inputSchema: { pattern: z.string().min(1).max(100).describe(`One of: ${tools.PATTERNS.join(', ')}.`) },
      annotations: { title: 'Get pattern', ...READ_ONLY },
    },
    async (args) => reply(tools.getPattern(args)),
  );

  server.registerTool(
    'atomus_figma_to_code',
    {
      title: 'Atomus Figma instance → JSX',
      description:
        'Turn an Atomus Figma component instance into Atomus JSX using the Code Connect mappings in the manifest: pass the component set name (e.g. "Button", "Button icon", "Alert") and its property values as shown in Figma ({"Hierarchy": "Primary", "Size": "md", "State": "Loading", "Label": "Save"}). Use it when reading a design through the Figma MCP server and no Code Connect snippet came back. Interaction states (Hover, Focused) are dropped; Figma-only components return what to use instead. The JSX is checked with atomus_validate.',
      inputSchema: {
        component: z.string().min(1).max(200).describe('Figma component set name (or React name).'),
        properties: z.record(z.string(), z.union([z.string(), z.boolean(), z.number()])).optional().describe('Figma property values by property name, e.g. {"Hierarchy": "Primary", "Leading icon": true, "Leading icon swap": "plus"}.'),
        text: z.string().max(500).optional().describe('Text content (label or title) when it is not in properties.'),
      },
      annotations: { title: 'Figma to code', ...READ_ONLY },
    },
    async (args) => reply(await tools.figmaToCode(args, validator)),
  );

  server.registerTool(
    'atomus_validate',
    {
      title: 'Validate code against Atomus',
      description:
        'REQUIRED FINAL STEP: validate every file you created or changed before you hand over. Runs the Atomus ESLint plugin (TSX/JSX/TS/JS: raw colours, primitive tokens, arbitrary Tailwind values, unknown props and enum values, raw <button>/<input>/<select>/<dialog>, unlabelled icon buttons, more than one primary Button per view) or the Atomus Stylelint rules (CSS: raw colours, primitives, non-token spacing/radius/colour values). Returns each problem with line, rule, message and suggestions; with fix=true also the code with safe autofixes applied. Fix every error and run it again.',
      inputSchema: {
        code: z.string().min(1).max(200_000).describe('The full file content.'),
        filename: z.string().max(300).optional().describe('File name; the extension picks the linter (.tsx/.jsx/.ts/.js → ESLint, .css → Stylelint). Default Component.tsx.'),
        fix: z.boolean().optional().describe('Also return the code with safe autofixes applied (default false).'),
      },
      annotations: { title: 'Validate', ...READ_ONLY },
    },
    async (args) => reply(await tools.validate(args, validator)),
  );

  server.registerTool(
    'atomus_init',
    {
      title: 'Atomus setup files for a project',
      description:
        'Return the files to set up Atomus in a consumer repo: AGENTS.md rules (from the Atomus consumer template), CLAUDE.md, a Cursor rule, Copilot instructions, the CSS imports for plain CSS / Tailwind v4 / shadcn, ESLint and Stylelint configs and MCP configs for Claude Code, Cursor, VS Code and Codex. Returns content only and writes nothing: create or merge the files yourself. Call it once when a project starts using Atomus.',
      inputSchema: {
        agents: z.array(z.enum(['agents-md', 'claude', 'cursor', 'copilot', 'codex'])).optional().describe('Which agent files to return (default all).'),
        styling: z.enum(['css', 'tailwind', 'shadcn']).optional().describe('Token setup: plain CSS (default), Tailwind v4 theme or shadcn/ui theme.'),
        lint: z.boolean().optional().describe('Include ESLint and Stylelint configs (default true).'),
        mcp: z.boolean().optional().describe('Include MCP server configs (default true).'),
      },
      annotations: { title: 'Init project', ...READ_ONLY },
    },
    async (args) => reply(tools.init(args)),
  );

  server.registerTool(
    'atomus_brand',
    {
      title: 'Atomus brand ramp from a colour',
      description:
        'Turn one brand colour (hex) into an Atomus brand: the 12-step ramp (--color-brand-25 … 950) as a [data-brand="<name>"] CSS block, WCAG contrast checks for buttons and links in light and dark, and the steps to apply it in code and Figma. Use it when a client brand colour must replace the Atomus blue. Never hard-code the brand colour in components; adding a brand is a token change that needs human review.',
      inputSchema: {
        hex: z.string().regex(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/).describe('Brand colour, e.g. #ff6600.'),
        name: z.string().min(1).max(40).describe('Brand name for data-brand, e.g. "acme".'),
        anchor: z.enum(['auto', '300', '400', '500', '600', '700', '800']).optional().describe('Ramp step the colour lands on (default auto: the closest lightness).'),
      },
      annotations: { title: 'Brand ramp', ...READ_ONLY },
    },
    async (args) => reply(tools.brand(args)),
  );

  return server;
}
