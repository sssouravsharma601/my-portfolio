import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Emits the Content-Security-Policy <meta> at build time. Inline scripts are
 * allowed by SHA-256 hash, computed here, so the policy needs no
 * 'unsafe-inline' and can't drift from the markup. Build-only: the dev server
 * relies on inline scripts and styles for HMR.
 */
function csp(): Plugin {
  const INLINE_SCRIPT =
    /<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g;
  return {
    name: 'csp-meta',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const hashes = [...html.matchAll(INLINE_SCRIPT)].map(
          (m) =>
            `'sha256-${createHash('sha256')
              .update(m[1] ?? '')
              .digest('base64')}'`,
        );
        const policy = [
          `default-src 'none'`,
          `script-src 'self' ${hashes.join(' ')}`.trim(),
          `style-src 'self'`,
          `img-src 'self'`,
          `font-src 'self'`,
          `connect-src 'self' https://formspree.io`,
          `manifest-src 'self'`,
          // The contact form posts with fetch (or opens a mailto: draft) from
          // script; a native submission, e.g. before hydration, is never wanted.
          `form-action 'none'`,
          `base-uri 'none'`,
          `object-src 'none'`,
          `require-trusted-types-for 'script'`,
          `trusted-types 'none'`,
        ].join('; ');
        return {
          html,
          tags: [
            {
              tag: 'meta',
              attrs: { 'http-equiv': 'Content-Security-Policy', content: policy },
              injectTo: 'head-prepend',
            },
          ],
        };
      },
    },
  };
}

/** Preloads the display font so the wordmark (the LCP element) doesn't wait on CSS discovery. */
function preloadDisplayFont(): Plugin {
  return {
    name: 'preload-display-font',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const font = Object.keys(ctx.bundle ?? {}).find((f) =>
          /inter-latin-opsz-normal.*\.woff2$/.test(f),
        );
        if (!font) return html;
        return {
          html,
          tags: [
            {
              tag: 'link',
              attrs: {
                rel: 'preload',
                as: 'font',
                type: 'font/woff2',
                href: `./${font}`,
                crossorigin: '',
              },
              injectTo: 'head',
            },
          ],
        };
      },
    },
  };
}

/** The day of this build (UTC). The prerendered HTML and the first client render both use it. */
const BUILD_DATE = new Date().toISOString().slice(0, 10);

/**
 * Stamps the build day into the dates crawlers read: `dateModified` in the
 * JSON-LD of index.html and `<lastmod>` in sitemap.xml (copied from public/).
 * Both hold a `{{buildDate}}` placeholder in source; the build fails if one
 * is missing or survives.
 */
function stampBuildDate(): Plugin {
  const TOKEN = '{{buildDate}}';
  const fill = (text: string, file: string) => {
    if (!text.includes(TOKEN)) throw new Error(`build-date: ${TOKEN} not found in ${file}`);
    return text.replaceAll(TOKEN, BUILD_DATE);
  };
  let outDir = '';
  return {
    name: 'build-date',
    // The client build only: the SSR build that prerendering runs has no
    // index.html or public/ files of its own.
    apply: (_config, env) => env.command === 'build' && !env.isSsrBuild,
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    transformIndexHtml: (html) => fill(html, 'index.html'),
    // public/ has been copied into the output by the time the bundle is written.
    async writeBundle() {
      const sitemap = resolve(outDir, 'sitemap.xml');
      await writeFile(sitemap, fill(await readFile(sitemap, 'utf8'), 'dist/sitemap.xml'));
    },
  };
}

export default defineConfig(({ isSsrBuild }) => ({
  define: { __BUILD_DATE__: JSON.stringify(BUILD_DATE) },
  plugins: [react(), preloadDisplayFont(), csp(), stampBuildDate()],
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Never inline assets as data: URIs; the CSP only allows same-origin files.
    assetsInlineLimit: 0,
    // React (with react-dom and its scheduler) in a chunk of its own, which
    // stays cached across content deploys.
    rolldownOptions: isSsrBuild
      ? {}
      : {
          output: {
            codeSplitting: {
              groups: [
                { name: 'react', test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
              ],
            },
          },
        },
  },
}));
