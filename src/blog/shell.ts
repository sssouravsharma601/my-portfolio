/**
 * Turns the built dist/index.html into the frame of a blog page. Everything
 * the build put in its <head> stays as it is: the Content-Security-Policy
 * (whose script hash covers the same pre-paint theme script), theme colour,
 * font preload, stylesheet and icons. Only the page-specific part, from
 * <!-- Search --> to <!-- Icons -->, and the scripts are swapped.
 */
import type { Manifest } from 'vite';
import { feedLink } from './head';

export const PAGE_HEAD_START = '<!-- Search -->';
export const PAGE_HEAD_END = '<!-- Icons -->';
const MOUNT = '<div id="root"></div>';
const MODULE_SCRIPT = /[ \t]*<script type="module"[^>]*\ssrc="[^"]+"[^>]*><\/script>\n?/g;
const MODULE_PRELOAD = /[ \t]*<link rel="modulepreload"[^>]*>\n?/g;

export interface EntryAssets {
  /** The entry's module script. */
  script: string;
  /** Chunks it imports statically, preloaded. */
  preloads: string[];
}

/** The files a JS entry loads at start-up, from the build manifest. */
export function entryAssets(manifest: Manifest, entry: string, base = '/'): EntryAssets {
  const chunk = manifest[entry];
  if (!chunk?.isEntry) throw new Error(`blog: ${entry} is not an entry in the build manifest`);
  const preloads = new Set<string>();
  const visit = (key: string) => {
    const c = manifest[key];
    if (!c || preloads.has(base + c.file)) return;
    preloads.add(base + c.file);
    c.imports?.forEach(visit);
  };
  chunk.imports?.forEach(visit);
  return { script: base + chunk.file, preloads: [...preloads] };
}

export type Shell = (page: { head: string; body: string }) => string;

export function createShell(indexHtml: string, assets: EntryAssets): Shell {
  const start = indexHtml.indexOf(PAGE_HEAD_START);
  const end = indexHtml.indexOf(PAGE_HEAD_END);
  if (start === -1 || end === -1 || end < start) {
    throw new Error(`blog: ${PAGE_HEAD_START} … ${PAGE_HEAD_END} not found in dist/index.html`);
  }
  if (!indexHtml.includes(MOUNT)) throw new Error(`blog: ${MOUNT} not found in dist/index.html`);

  const scripts = indexHtml.match(MODULE_SCRIPT) ?? [];
  if (scripts.length !== 1) {
    throw new Error(`blog: expected one module script in dist/index.html, found ${scripts.length}`);
  }
  const tags = [
    `  <script type="module" crossorigin src="${assets.script}"></script>`,
    ...assets.preloads.map((p) => `  <link rel="modulepreload" crossorigin href="${p}">`),
  ].join('\n');

  const frame = (indexHtml.slice(0, start) + '%%BLOG_HEAD%%' + indexHtml.slice(end))
    .replace(MODULE_SCRIPT, '')
    .replace(MODULE_PRELOAD, '')
    .replace('</head>', `${tags}\n</head>`)
    .replace(MOUNT, '<div id="root">%%BLOG_BODY%%</div>');
  // Build placeholders ({{years}}) live in the home page's own head, which is gone.
  const leftover = /\{\{\w+\}\}/.exec(frame);
  if (leftover) throw new Error(`blog: placeholder ${leftover[0]} left in the blog page frame`);

  return ({ head, body }) =>
    frame.replace('%%BLOG_HEAD%%', () => head).replace('%%BLOG_BODY%%', () => body);
}

/** Adds the feed's <link rel="alternate"> to a page head (the home page's). */
export function addFeedLink(html: string): string {
  if (!html.includes(PAGE_HEAD_END)) throw new Error(`blog: ${PAGE_HEAD_END} not found`);
  return html.replace(PAGE_HEAD_END, `${feedLink()}\n\n  ${PAGE_HEAD_END}`);
}
