import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
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
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
});
