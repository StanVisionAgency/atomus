// One screenshot per story × theme × brand, clipped to what the story renders (including open menus and dialogs).
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { expect, test } from '@playwright/test';

type Entry = { id: string; type: 'story' | 'docs'; title: string; name: string; tags?: string[] };
const index = JSON.parse(readFileSync(new URL('../storybook-static/index.json', import.meta.url), 'utf8')) as { entries: Record<string, Entry> };
const stories = Object.values(index.entries).filter((e) => e.type === 'story' && !e.tags?.includes('skip-visual'));

const THEMES = ['light', 'dark'] as const;
const BRANDS = ['atomus', 'violet'] as const;

for (const story of stories) {
  for (const theme of THEMES) {
    for (const brand of BRANDS) {
      test(`${story.title} › ${story.name} [${theme}, ${brand}]`, async ({ page }) => {
        await page.goto(`/iframe.html?id=${story.id}&viewMode=story&globals=theme:${theme};brand:${brand};radius:default`);
        await page.waitForSelector('#storybook-root > *, #storybook-root:empty ~ dialog', { state: 'attached' });
        await page.waitForFunction((t) => document.documentElement.getAttribute('data-theme') === t, theme);
        await page.evaluate(() => document.fonts.ready);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(300); // play functions and fade-ins
        // Freeze animations before measuring: a rotating spinner changes its bounding box, and so the clip.
        await page.addStyleTag({ content: '*, *::before, *::after { animation: none !important; transition: none !important; }' });
        const clip = await page.evaluate(() => {
          const nodes = [...document.querySelectorAll('#storybook-root *'), ...document.querySelectorAll('dialog[open] *')];
          let [x1, y1, x2, y2] = [Infinity, Infinity, -Infinity, -Infinity];
          for (const n of nodes) {
            const r = n.getBoundingClientRect();
            if (!r.width || !r.height) continue;
            x1 = Math.min(x1, r.left); y1 = Math.min(y1, r.top); x2 = Math.max(x2, r.right); y2 = Math.max(y2, r.bottom);
          }
          const pad = 8;
          const x = Math.max(0, Math.floor(x1 - pad));
          const y = Math.max(0, Math.floor(y1 - pad));
          return { x, y, width: Math.min(window.innerWidth, Math.ceil(x2 + pad)) - x, height: Math.ceil(y2 + pad) - y };
        });
        expect(clip.width, 'story renders something').toBeGreaterThan(0);
        const name = `${story.id}--${theme}-${brand}.png`;
        const baseline = test.info().snapshotPath(name, { kind: 'screenshot' });
        if (!existsSync(baseline) && test.info().config.updateSnapshots !== 'none') {
          // First run (or a new story): record the baseline and pass. CI uploads new baselines as an artifact.
          mkdirSync(dirname(baseline), { recursive: true });
          await page.screenshot({ path: baseline, clip, fullPage: true, animations: 'disabled', caret: 'hide', scale: 'css' });
          test.info().annotations.push({ type: 'baseline', description: `created ${name}` });
          return;
        }
        await expect(page).toHaveScreenshot(name, { clip, fullPage: true });
      });
    }
  }
}
