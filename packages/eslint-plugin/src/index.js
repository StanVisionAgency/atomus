// @stanvision/eslint-plugin-atomus — ESLint 9 flat-config plugin for the Atomus design system.
//
//   // eslint.config.js
//   import atomus from '@stanvision/eslint-plugin-atomus';
//   export default [atomus.configs.recommended];
//
// Rules read the Atomus manifest (components, props, enums, tokens). Docs: https://docs.atomus.io/ai/lint/
import noRawColor from './rules/no-raw-color.js';
import noPrimitiveToken from './rules/no-primitive-token.js';
import noArbitraryValue from './rules/no-arbitrary-value.js';
import validProps from './rules/valid-props.js';
import preferAtomusComponent from './rules/prefer-atomus-component.js';
import iconOnlyNeedsLabel from './rules/icon-only-needs-label.js';
import onePrimaryPerView from './rules/one-primary-per-view.js';
import manifest from '../data/atomus.manifest.json' with { type: 'json' };
import pkg from '../package.json' with { type: 'json' };

const rules = {
  'no-raw-color': noRawColor,
  'no-primitive-token': noPrimitiveToken,
  'no-arbitrary-value': noArbitraryValue,
  'valid-props': validProps,
  'prefer-atomus-component': preferAtomusComponent,
  'icon-only-needs-label': iconOnlyNeedsLabel,
  'one-primary-per-view': onePrimaryPerView,
};

const plugin = {
  meta: { name: pkg.name, version: pkg.version },
  rules,
  configs: {},
};

const files = ['**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'];
const languageOptions = { parserOptions: { ecmaFeatures: { jsx: true } } };

plugin.configs.recommended = {
  name: 'atomus/recommended',
  files,
  plugins: { atomus: plugin },
  languageOptions,
  rules: {
    'atomus/no-raw-color': 'error',
    'atomus/no-primitive-token': 'error',
    'atomus/no-arbitrary-value': 'warn',
    'atomus/valid-props': 'error',
    'atomus/prefer-atomus-component': 'warn',
    'atomus/icon-only-needs-label': 'error',
    'atomus/one-primary-per-view': 'warn',
  },
};

plugin.configs.strict = {
  name: 'atomus/strict',
  files,
  plugins: { atomus: plugin },
  languageOptions,
  rules: Object.fromEntries(Object.keys(rules).map((r) => [`atomus/${r}`, 'error'])),
};

/** The manifest the rules use (read-only). */
export { manifest };
export default plugin;
