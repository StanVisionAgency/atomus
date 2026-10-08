// Writes figma.client.config.json so Code Connect publishes to a client's duplicate of the Atomus Figma file.
// Usage: npm run figma:connect-client -- https://www.figma.com/design/<fileKey>/<name>
// Duplicated Figma files keep their node IDs, so only the file key in each `// url=` needs swapping.
import { readFileSync, writeFileSync } from 'node:fs';

const MASTER_KEY = 'bC42e82J3PYg2LMkryodIA';
const arg = process.argv[2];

function fileKey(input) {
  if (!input) return null;
  if (/^[0-9a-zA-Z]{15,128}$/.test(input)) return input;
  try {
    const parts = new URL(input).pathname.split('/').filter(Boolean);
    // /design/:key/:name, /file/:key/:name, /design/:key/branch/:branchKey/:name
    const i = parts.findIndex((p) => p === 'design' || p === 'file');
    if (i < 0 || !parts[i + 1]) return null;
    return parts[i + 2] === 'branch' && parts[i + 3] ? parts[i + 3] : parts[i + 1];
  } catch {
    return null;
  }
}

const key = fileKey(arg);
if (!key) {
  console.error('Usage: npm run figma:connect-client -- <Figma file URL or file key of the client duplicate>');
  process.exit(1);
}
if (key === MASTER_KEY) {
  console.error('That is the Atomus master file. Pass the URL of the client duplicate instead.');
  process.exit(1);
}

const template = JSON.parse(readFileSync(new URL('../figma.client.config.template.json', import.meta.url), 'utf8'));
template.codeConnect.documentUrlSubstitutions = { [`/${MASTER_KEY}/`]: `/${key}/` };
const out = new URL('../figma.client.config.json', import.meta.url);
writeFileSync(out, JSON.stringify(template, null, 2) + '\n');
console.log(`Wrote figma.client.config.json (Atomus ${MASTER_KEY} -> ${key}).`);
console.log('Publish with: FIGMA_ACCESS_TOKEN=<token> npm run figma:publish:client');
