import type { ESLint, Linter } from 'eslint';

declare const plugin: ESLint.Plugin & {
  configs: {
    /** Errors for raw colours, primitives, invalid props and unlabelled icon buttons; warnings for arbitrary values, raw controls and extra primaries. */
    recommended: Linter.Config;
    /** Every rule as an error. */
    strict: Linter.Config;
  };
};
/** The Atomus manifest the rules read (see @stanvision/atomus-manifest). */
export declare const manifest: Record<string, unknown>;
export default plugin;
