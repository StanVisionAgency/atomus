// Jest config for `test-storybook` (@storybook/test-runner): runs every story's play function and the
// axe checks of @storybook/addon-a11y (parameters.a11y.test = 'error' in .storybook/preview.tsx fails on violations).
import { existsSync } from 'node:fs';
import { getJestConfig } from '@storybook/test-runner';

const testRunnerConfig = getJestConfig();
// Use a preinstalled Chromium when there is one (CHROMIUM_PATH, or the sandbox default); CI installs Playwright's own.
const executablePath = process.env.CHROMIUM_PATH ?? (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);

/** @type {import('@jest/types').Config.InitialOptions} */
export default {
  ...testRunnerConfig,
  testEnvironmentOptions: {
    'jest-playwright': {
      ...testRunnerConfig.testEnvironmentOptions?.['jest-playwright'],
      browsers: ['chromium'],
      launchOptions: executablePath ? { executablePath } : {},
    },
  },
};
