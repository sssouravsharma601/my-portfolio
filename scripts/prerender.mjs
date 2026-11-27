// Renders the app to static HTML and writes it into dist/index.html, so
// crawlers and link previews get the full content without running JS. Then
// writes the blog: its pages, feed and sitemap entries (src/blog/prerender.ts).
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';
import { build } from 'vite';

const root = resolve(import.meta.dirname, '..');
const ssrDir = resolve(root, 'dist-ssr');
const distDir = resolve(root, 'dist');
const htmlPath = resolve(distDir, 'index.html');
const manifestDir = resolve(distDir, '.vite');
const MOUNT = '<div id="root"></div>';

await build({
  root,
  logLevel: 'warn',
  build: { ssr: 'src/entry-server.tsx', outDir: ssrDir, emptyOutDir: true },
});

const { render, years, prerenderBlog } = await import(
  pathToFileURL(resolve(ssrDir, 'entry-server.js')).href
);
const html = await readFile(htmlPath, 'utf8');
if (!html.includes(MOUNT)) throw new Error(`prerender: ${MOUNT} not found in dist/index.html`);

const app = render();
if (!app.includes('<h1')) throw new Error('prerender: rendered markup has no <h1>');

// The description texts in <head> state the years of experience; fill them in now.
const YEARS = '{{years}}';
if (!html.includes(YEARS)) throw new Error(`prerender: ${YEARS} not found in dist/index.html`);

// Blog pages reuse the built page's <head> (CSP, theme script, fonts, icons)
// with their own title, description and structured data.
const manifest = JSON.parse(await readFile(resolve(manifestDir, 'manifest.json'), 'utf8'));
const blog = prerenderBlog(html, manifest);

await writeFile(
  htmlPath,
  blog.home(html.replaceAll(YEARS, String(years())).replace(MOUNT, `<div id="root">${app}</div>`)),
);

for (const file of blog.files) {
  const path = resolve(distDir, file.path);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, file.content);
}

if (blog.sitemap) {
  const sitemapPath = resolve(distDir, 'sitemap.xml');
  const sitemap = await readFile(sitemapPath, 'utf8');
  if (!sitemap.includes('</urlset>')) throw new Error('prerender: </urlset> not in sitemap.xml');
  await writeFile(sitemapPath, sitemap.replace('</urlset>', `${blog.sitemap}</urlset>`));
}

await rm(manifestDir, { recursive: true, force: true });
await rm(ssrDir, { recursive: true, force: true });
console.log(`prerendered ${(app.length / 1024).toFixed(1)} kB of HTML into dist/index.html`);
console.log(
  blog.publishing
    ? `blog: ${blog.posts} post(s), ${blog.files.length} file(s) written under dist/blog/`
    : 'blog: publishing is off in config.json; no blog pages built',
);
