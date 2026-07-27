// ── Animation timings (ms) ───────────────────────────────────────────────────
export const TYPING_SPEED_MS = 75;
export const DELETING_SPEED_MS = 45;
export const COUNTER_DURATION_MS = 1600;

// ── Scroll / intersection ────────────────────────────────────────────────────
export const SCROLL_REVEAL_THRESHOLD = 0.15; // 15 % visible before triggering
export const SCROLL_REVEAL_ROOT_MARGIN = '0px 0px -60px 0px';
export const BACK_TO_TOP_THRESHOLD_PX = 400;
// Tuned for a borderless sidebar on desktop (no fixed top bar to compensate
// for) and the shorter mobile top bar — smaller than the old top-navbar era.
export const NAV_SECTION_OFFSET_PX = 96;

// ── Canvas particle network ──────────────────────────────────────────────────
export const PARTICLE_COUNT = 65;
export const PARTICLE_CONNECT_DIST = 115; // px
export const PARTICLE_SPEED_MAX = 0.4;
export const PARTICLE_RADIUS_MIN = 1.5;
export const PARTICLE_RADIUS_MAX = 3.5;
export const CANVAS_FPS_CAP_MS = 34; // ≈ 30 fps

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
