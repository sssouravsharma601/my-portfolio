import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    __BUILD_DATE__: JSON.stringify('2026-01-15'),
    // The blog as the header, footer and home page see it: published, no posts yet.
    __BLOG_SITE__: JSON.stringify({ publishing: true, latest: [] }),
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      exclude: [
        'node_modules',
        'src/test',
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/data/**',
        'src/types/**',
      ],
    },
  },
});
