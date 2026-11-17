import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default defineConfig([
  globalIgnores(['dist', 'coverage']),
  {
    // The app (src) and the Vite and Vitest configs, all type-checked.
    // TypeScript reports undefined names itself, so no browser globals are needed.
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs['flat/recommended-type-checked'],
      reactHooks.configs.flat.recommended,
    ],
    plugins: { 'react-refresh': reactRefresh },
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // ── Code quality ──────────────────────────────────────────
      'no-console': ['warn', { allow: ['error', 'warn'] }],
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',

      // ── TypeScript ────────────────────────────────────────────
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',

      // ── React ─────────────────────────────────────────────────
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
]);
