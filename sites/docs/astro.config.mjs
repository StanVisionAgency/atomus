import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import { componentSidebar, figmaReferenceRedirects } from './scripts/component-pages.mjs';

export default defineConfig({
  site: 'https://docs.atomus.io',
  // The Figma reference pages were merged into the component pages.
  redirects: figmaReferenceRedirects(),
  integrations: [
    react(),
    starlight({
      title: 'Atomus',
      description: 'Atomus 4.0 — one design system for product UI and marketing websites. Figma, tokens, React and AI guidelines.',
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
      ],
      sidebar: [
        { label: 'Start here', items: ['index', 'getting-started', 'figma', 'react', 'changelog'] },
        { label: 'Foundations', items: [{ autogenerate: { directory: 'foundations' } }] },
        { label: 'Components', items: componentSidebar() },
        { label: 'Website sections', items: ['website-sections'] },
        { label: 'Code', items: ['code/tokens', 'code/css', 'code/tailwind', 'code/shadcn', 'code/ai-guidelines'] },
      ],
    }),
  ],
  vite: { resolve: { dedupe: ['react', 'react-dom'] }, server: { fs: { allow: ['../..'] } } },
});
