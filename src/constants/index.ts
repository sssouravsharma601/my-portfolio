// ── Validation constraints ───────────────────────────────────────────────────
export const VALIDATION = {
  NAME_MIN_LENGTH: 2,
  SUBJECT_MIN_LENGTH: 3,
  MESSAGE_MIN_LENGTH: 10,
  EMAIL_LOCAL_MAX: 64,
  EMAIL_TOTAL_MAX: 254,
  SANITIZE_MAX_LEN: 5_000,
} as const;

// ── Storage keys ─────────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  THEME: 'ss_theme',
} as const;

// ── Contact / owner info ─────────────────────────────────────────────────────
export const OWNER_EMAIL = 'sssouravsharma601@gmail.com';

// ── Formspree ────────────────────────────────────────────────────────────────
/** Set VITE_FORMSPREE_ID in .env.local to enable real form submission. */
export const FORMSPREE_ENDPOINT = import.meta.env['VITE_FORMSPREE_ID']
  ? `https://formspree.io/f/${import.meta.env['VITE_FORMSPREE_ID'] as string}`
  : null;
