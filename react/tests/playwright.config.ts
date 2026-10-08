// Visual regression for every Storybook story × light/dark × atomus/violet (radius: default).
// Runs against the static build (npm run build-storybook). Baselines: tests/__screenshots__/<story-id>--<theme>-<brand>.png
//   npm run test:visual            compare; a missing baseline is recorded and the test passes (first run creates them)
//   npm run test:visual:update     rewrite all baselines after an intended visual change
import { existsSync } from 'node:fs';
import { defineConfig } from '@playwright/test';

const PORT = Number(process.env.STORYBOOK_PORT ?? 6008);
// A preinstalled Chromium (CHROMIUM_PATH, or the sandbox default); CI uses `npx playwright install chromium`.
const executablePath = process.env.CHROMIUM_PATH ?? (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);

export default defineConfig({
  testDir: '.',
  testMatch: 'visual.spec.ts',
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
  updateSnapshots: 'missing',
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never', outputFolder: '../playwright-report' }]] : 'list',
  outputDir: '../test-results',
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.002, animations: 'disabled', caret: 'hide', scale: 'css' } },
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    viewport: { width: 1024, height: 768 },
    deviceScaleFactor: 1,
    colorScheme: 'light',
    launchOptions: executablePath ? { executablePath } : {},
  },
  webServer: {
    command: `node scripts/serve-static.mjs storybook-static ${PORT}`,
    cwd: '..',
    url: `http://127.0.0.1:${PORT}/index.json`,
    reuseExistingServer: !process.env.CI,
  },
});
