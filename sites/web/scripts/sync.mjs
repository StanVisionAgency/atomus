// Copies the tokens and component CSS from the repo root so the site always uses the current Atomus build.
import { cpSync } from 'node:fs';
const root = new URL('../../../', import.meta.url).pathname;
cpSync(root + 'css/atomus.css', new URL('../src/styles/atomus.css', import.meta.url).pathname);
cpSync(root + 'react/src/styles.css', new URL('../src/styles/components.css', import.meta.url).pathname);
cpSync(root + 'assets/logos/atomus-brandmark.svg', new URL('../public/brandmark.svg', import.meta.url).pathname);
console.log('synced atomus.css and components.css');
