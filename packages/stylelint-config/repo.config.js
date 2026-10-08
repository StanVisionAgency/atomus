// Stylelint config for linting this repository's own CSS (npm run lint:repo). Not published.
// Generated token files and the static atomus.io site are out of scope: shadcn/globals.css maps shadcn
// variables to Atomus tokens (generated from Figma), and sites/atomus-io/ is the legacy marketing site.
import atomus from './index.js';

export default {
  ...atomus,
  ignoreFiles: [
    '../../shadcn/globals.css',
    '../../sites/atomus-io/**',
    '../../**/node_modules/**',
    '../../**/dist/**',
  ],
};
