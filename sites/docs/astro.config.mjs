import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import { componentSidebar, figmaReferenceRedirects } from './scripts/component-pages.mjs';

export default defineConfig({
  site: 'https://docs.atomus.io',
  // The Figma reference pages were merged into the component pages.
  redirects: {
    ...figmaReferenceRedirects(),
    // The single "AI guidelines" page became the "AI & agents" section.
    '/code/ai-guidelines': '/ai/rules/',
  },
  integrations: [
    react(),
    starlight({
      title: 'Atomus',
      description: 'Atomus 4.0 — one design system for product UI and marketing websites, built for humans and agents. Figma, tokens, React, guidelines and an agent skill.',
      logo: { light: './src/assets/atomus-logo.svg', dark: './src/assets/atomus-logo-white.svg', replacesTitle: true },
      favicon: '/favicon.svg',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/StanVisionAgency/atomus' },
      ],
      editLink: { baseUrl: 'https://github.com/StanVisionAgency/atomus/edit/main/sites/docs/' },
      customCss: ['./src/styles/atomus.css', './src/styles/components.css', './src/styles/theme.css', './src/styles/foundations.css', './src/styles/sections-responsive.css', './src/styles/sections.css'],
      head: [
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
        { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..700&family=Roboto+Mono:wght@400;500&display=swap' } },
        { tag: 'link', attrs: { rel: 'alternate', type: 'text/plain', title: 'llms.txt', href: '/llms.txt' } },
      ],
      sidebar: [
        { label: 'Start here', items: ['index', 'getting-started', 'figma', 'react', 'changelog'] },
        { label: 'Foundations', items: [{ autogenerate: { directory: 'foundations' } }] },
        { label: 'Components', items: componentSidebar() },
        { label: 'Website sections', items: ['website-sections'] },
        { label: 'Code', items: ['code/tokens', 'code/css', 'code/tailwind', 'code/shadcn', { label: 'Storybook', link: '/storybook/', attrs: { target: '_blank', rel: 'noopener' } }] },
        {
          label: 'AI & agents',
          items: [
            { label: 'Overview', link: '/ai/' },
            'ai/coding-agents',
            'ai/mcp',
            'ai/lint',
            'ai/figma-mcp',
            'ai/figma-make',
            'ai/llms-txt',
            'ai/registry',
            'ai/evals',
            'ai/rules',
            'ai/figma-mcp-rules',
          ],
        },
      ],
    }),
  ],
  vite: { resolve: { dedupe: ['react', 'react-dom'] }, server: { fs: { allow: ['../..'] } } },
});
