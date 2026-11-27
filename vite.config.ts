import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { defineConfig, runnerImport, type Plugin } from 'vite';
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
  let base = '/';
  return {
    name: 'preload-display-font',
    apply: 'build',
    configResolved(config) {
      base = config.base;
    },
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
                href: `${base}${font}`,
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

/** The parts of src/blog/load.ts used here. */
interface BlogLoader {
  BLOG_ENTRY: string;
  loadBlog(): { config: { publishing: boolean }; errors: string[] };
  blogSite(blog: unknown): unknown;
}

/**
 * The blog (content/blog, or BLOG_CONTENT_DIR). The browser bundle gets only
 * the publishing switch and the newest posts (__BLOG_SITE__); the pages
 * themselves are rendered by scripts/prerender.mjs. A build with invalid
 * content fails here too, not only in `npm run blog:check`. The loader is
 * app code (src/, its own tsconfig), so it is loaded through Vite rather than
 * imported into this file.
 */
async function readBlog(command: 'build' | 'serve') {
  const { module: loader } = await runnerImport<BlogLoader>(resolve('src/blog/load.ts'), {
    configFile: false,
    logLevel: 'error',
  });
  const blog = loader.loadBlog();
  if (blog.errors.length) {
    const report = `blog content has problems (npm run blog:check):\n  ${blog.errors.join('\n  ')}`;
    if (command === 'build') throw new Error(report);
    console.warn(report);
  }
  return { entry: loader.BLOG_ENTRY, site: loader.blogSite(blog), ...blog };
}

export default defineConfig(async ({ command, isSsrBuild }) => {
  const blog = await readBlog(command);
  const publishing = blog.config.publishing;
  return {
    define: {
      __BUILD_DATE__: JSON.stringify(BUILD_DATE),
      __BLOG_SITE__: JSON.stringify(blog.site),
    },
    plugins: [react(), preloadDisplayFont(), csp(), stampBuildDate()],
    // Absolute asset URLs: blog pages sit in nested folders (/blog/<slug>/).
    base: '/',
    build: {
      outDir: 'dist',
      sourcemap: false,
      // Never inline assets as data: URIs; the CSP only allows same-origin files.
      assetsInlineLimit: 0,
      // One stylesheet for the whole site, in the same order as before the
      // blog existed, cached across every page.
      cssCodeSplit: false,
      // Tells the prerender which files the blog entry loads; it deletes the file afterwards.
      manifest: !isSsrBuild,
      // React (with react-dom and its scheduler) in a chunk of its own, which
      // stays cached across content deploys.
      rolldownOptions: isSsrBuild
        ? {}
        : {
            // Blog pages are static HTML whose header is hydrated by a small entry of its own.
            ...(publishing && {
              input: { index: resolve('index.html'), blog: resolve(blog.entry) },
            }),
            output: {
              codeSplitting: {
                groups: [
                  { name: 'react', test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
                  // App code that the home page and blog pages share: the header, palette and theme.
                  { name: 'site', test: /[\\/]src[\\/]/, minShareCount: 2 },
                ],
              },
            },
          },
    },
  };
});
