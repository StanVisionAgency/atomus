// Storybook 10 for @stanvision/atomus-react: one story file per component (src/components/*.stories.tsx).
// Static build: `npm run build-storybook` → storybook-static/ (deployed at https://docs.atomus.io/storybook/).
// Agents: `npm run storybook` serves the MCP server at http://localhost:6006/mcp (@storybook/addon-mcp); the
// built Storybook serves the component manifest at /manifests/components.json.
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-mcp'],
  features: {
    // Component manifest (manifests/components.json) for the MCP docs tools and other agents.
    componentsManifest: true,
  },
  core: { disableTelemetry: true },
  viteFinal: async (vite) => ({
    ...vite,
    // .storybook/preview.tsx imports the tokens from ../../css/atomus.css (repo root).
    server: { ...vite.server, fs: { ...vite.server?.fs, allow: [...(vite.server?.fs?.allow ?? []), '../..'] } },
  }),
};

export default config;
