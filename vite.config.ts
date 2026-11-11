import { createHash } from 'node:crypto';
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
          `img-src 'self' data:`,
          `font-src 'self'`,
          `connect-src 'self' https://formspree.io`,
          `manifest-src 'self'`,
          `form-action 'self'`,
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
          /archivo-latin-standard-normal.*\.woff2$/.test(f),
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

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), preloadDisplayFont(), csp()],
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Never inline assets as data: URIs; the CSP only allows same-origin files.
    assetsInlineLimit: 0,
    rollupOptions: isSsrBuild
      ? {}
      : { output: { manualChunks: { react: ['react', 'react-dom'] } } },
  },
}));
