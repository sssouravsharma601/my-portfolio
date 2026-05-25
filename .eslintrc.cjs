/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', 'coverage', 'node_modules'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'react-refresh'],
  rules: {
    // ── Code quality ──────────────────────────────────────────
    'no-console':               ['warn', { allow: ['error', 'warn'] }],
    'no-debugger':              'error',
    'no-duplicate-imports':     'error',

    // ── TypeScript ────────────────────────────────────────────
    '@typescript-eslint/no-explicit-any':           'error',
    '@typescript-eslint/no-non-null-assertion':      'error',
    '@typescript-eslint/consistent-type-imports':   ['error', { prefer: 'type-imports' }],
    '@typescript-eslint/no-unused-vars':            ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-floating-promises':      'error',
    '@typescript-eslint/no-misused-promises':       'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'warn',
    '@typescript-eslint/prefer-optional-chain':     'warn',

    // ── React ─────────────────────────────────────────────────
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react-hooks/rules-of-hooks':           'error',
    'react-hooks/exhaustive-deps':          'warn',
  },
};
