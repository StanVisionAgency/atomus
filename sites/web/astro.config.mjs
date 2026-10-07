import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://atomus.io',
  integrations: [react()],
  vite: { resolve: { dedupe: ['react', 'react-dom'] }, server: { fs: { allow: ['../..'] } } },
});
