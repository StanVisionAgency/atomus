// @stanvision/stylelint-config-atomus
//
//   // stylelint.config.js
//   export default { extends: ['@stanvision/stylelint-config-atomus'] };
//
// Rules: atomus/no-raw-color, atomus/no-primitive-token, atomus/use-tokens. Docs: https://docs.atomus.io/ai/lint/
// Token files (custom properties named --color-*, --spacing-* …) may hold raw values; everything else uses var(--…).
import plugins from './src/plugin.js';

export default {
  plugins,
  rules: {
    'atomus/no-raw-color': true,
    'atomus/no-primitive-token': true,
    'atomus/use-tokens': true,
  },
};
