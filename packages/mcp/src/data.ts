// The Atomus data bundled at build time (scripts/build-data.mjs → generated/data.json).
import raw from '../generated/data.json';

export interface Prop {
  type: string;
  values?: Array<string | number>;
  default: string | number | boolean | null;
  required: boolean;
  figma: string | null;
  notes: string | null;
}
export interface FigmaMapping {
  figma: string;
  prop: string;
  kind: 'enum' | 'text' | 'boolean' | 'flag' | 'instance' | 'expression';
  values?: Record<string, string | number | boolean>;
  when?: string;
  visibleWhen?: string;
  whenTrue?: string;
  whenFalse?: string;
  notes?: string;
}
export interface FigmaNode {
  componentSet: string;
  nodeId: string;
  codeConnectId?: string;
  staticProps?: string;
  mappings: FigmaMapping[];
}
export interface Component {
  name: string;
  kind: 'component' | 'hook';
  status: 'stable' | 'beta' | 'deprecated' | 'figma-only';
  since: string;
  category: string | null;
  import: string | null;
  source: string;
  purpose: string;
  description: string | null;
  aliases: string[];
  alternative: string | null;
  native?: { elements: string[]; omit: string[]; ref: boolean };
  props: Record<string, Prop>;
  rules: { do: string[]; dont: string[]; forbidden: string[] };
  examples: Array<{ title: string; code: string; language: string; source?: string }>;
  figma: {
    componentSet: string[];
    fileKey: string | null;
    nodeIds: string[];
    nodes: FigmaNode[];
    codeConnect: boolean;
    variants: number | null;
    properties?: Array<{ componentSet?: string; name: string; type: string; options?: string[] }>;
    docs: string | null;
  };
  docs: string | null;
  related: string[];
  a11y: { element?: string | null; requiresLabel?: boolean; notes: string[] };
}
export interface ColorToken { name: string; group: string; light: string; dark: string | null; description: string; tailwind: string[]; figma: string | null }
export interface ModeToken { name: string; values: Record<string, string>; description?: string; tailwind?: string[]; figma?: string | null }
export interface Manifest {
  version: string;
  package: string;
  exports: { values: string[]; types: string[] };
  components: Component[];
  tokens: {
    rules: string[];
    intents: Array<{ intent: string; tokens: string[] }>;
    groups: Record<string, { title: string; intent: string }>;
    semantic: ColorToken[];
    spacing: ModeToken[];
    radius: ModeToken[];
    shadows: ModeToken[];
    textStyles: string[];
    primitives: Record<string, string>;
  };
}
export interface Data {
  version: string;
  docs: string;
  manifest: Manifest;
  guidelines: {
    intro: string;
    coreRules: string;
    forbidden: string;
    beforeYouFinish: string;
    setup: Record<'install' | 'imports' | 'themes' | 'brand' | 'fonts' | 'dontConfigure', string>;
    catalogue: string;
    aliases: string;
    decisionTrees: Record<string, string>;
    figmaRules: string;
  };
  patterns: { sharedCss: string; items: Record<string, { title: string; body: string }> };
  templates: Record<string, string>;
  brand: { ramp: Record<string, string>; usage: Record<string, { light?: string; dark?: string }> };
}

export const data = raw as unknown as Data;
export const manifest = data.manifest;
