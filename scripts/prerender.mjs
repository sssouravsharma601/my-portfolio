// Renders the app to static HTML and writes it into dist/index.html, so
// crawlers and link previews get the full content without running JS.
import { readFile, writeFile, rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { build } from 'vite';

const root = resolve(import.meta.dirname, '..');
const ssrDir = resolve(root, 'dist-ssr');
const htmlPath = resolve(root, 'dist/index.html');
const MOUNT = '<div id="root"></div>';

await build({
  root,
  logLevel: 'warn',
  build: { ssr: 'src/entry-server.tsx', outDir: ssrDir, emptyOutDir: true },
});

const { render } = await import(pathToFileURL(resolve(ssrDir, 'entry-server.js')).href);
const html = await readFile(htmlPath, 'utf8');
if (!html.includes(MOUNT)) throw new Error(`prerender: ${MOUNT} not found in dist/index.html`);

const app = render();
if (!app.includes('<h1')) throw new Error('prerender: rendered markup has no <h1>');

await writeFile(htmlPath, html.replace(MOUNT, `<div id="root">${app}</div>`));
await rm(ssrDir, { recursive: true, force: true });
console.log(`prerendered ${(app.length / 1024).toFixed(1)} kB of HTML into dist/index.html`);
