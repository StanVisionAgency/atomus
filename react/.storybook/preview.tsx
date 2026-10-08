// Global setup: Atomus tokens + component CSS + fonts, and toolbar globals for the three Atomus modes.
// Each global sets the same data attribute products use: data-theme, data-brand, data-radius on <html>.
import type { Decorator, Preview } from '@storybook/react-vite';
import { useEffect } from 'react';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/roboto-mono/400.css';
import '@fontsource/roboto-mono/500.css';
import '../../css/atomus.css';
import '../src/styles.css';
import './preview.css';

const withAtomusModes: Decorator = (Story, context) => {
  const { theme, brand, radius } = context.globals as { theme: string; brand: string; radius: string };
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-theme', theme);
    if (brand === 'atomus') html.removeAttribute('data-brand');
    else html.setAttribute('data-brand', brand);
    if (radius === 'default') html.removeAttribute('data-radius');
    else html.setAttribute('data-radius', radius);
  }, [theme, brand, radius]);
  return <Story />;
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Atomus theme (data-theme)',
      toolbar: { title: 'Theme', icon: 'mirror', items: [{ value: 'light', title: 'Light', icon: 'sun' }, { value: 'dark', title: 'Dark', icon: 'moon' }], dynamicTitle: true },
    },
    brand: {
      description: 'Atomus brand (data-brand)',
      toolbar: { title: 'Brand', icon: 'paintbrush', items: [{ value: 'atomus', title: 'Atomus' }, { value: 'violet', title: 'Violet' }], dynamicTitle: true },
    },
    radius: {
      description: 'Atomus radius mode (data-radius)',
      toolbar: { title: 'Radius', icon: 'circlehollow', items: [{ value: 'default', title: 'Default' }, { value: 'round', title: 'Round' }, { value: 'sharp', title: 'Sharp' }], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'light', brand: 'atomus', radius: 'default' },
  decorators: [withAtomusModes],
  parameters: {
    layout: 'padded',
    options: { storySort: { order: ['Foundations', 'Actions', 'Forms', 'Feedback', 'Navigation', 'Data display', 'Overlays', 'Layout'] } },
    backgrounds: { disable: true },
    controls: { expanded: true, matchers: { color: /(background|color)$/i } },
    // Accessibility: every story is checked with axe; violations fail the test-runner (npm run test-storybook).
    a11y: { test: 'error' },
    docs: { codePanel: true },
  },
  tags: ['autodocs'],
};

export default preview;
