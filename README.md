# Sourav Sharma — Portfolio

[![CI](https://github.com/sssouravsharma601/my-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/sssouravsharma601/my-portfolio/actions/workflows/ci.yml)

Production-grade personal portfolio built with **React 18 · TypeScript 5 · Vite 5**.  
Live site → [sssouravsharma601.github.io/my-portfolio](https://sssouravsharma601.github.io/my-portfolio)

---

## Design

Quiet, typographic, content-first. The page is built to be skimmed by a recruiter in under a minute and read properly by an engineer.

- **Type:** Geist throughout (600 weight, tight tracking for display), Geist Mono for dates and stacks.
- **Colour:** crisp neutrals with a single blue accent. Light and dark themes; the initial theme is resolved before first paint from the saved choice or the OS preference, and follows OS changes until the visitor picks one.
- **Layout:** one editorial grid (sticky section label + content column) that collapses to a single column under 820px.
- **Motion:** one staggered entrance on load and CSS scroll-driven reveals (`animation-timeline: view()`) where supported. No animation libraries. Content is always visible when motion is unsupported, reduced, or printed.

## Tech Stack

| Layer | Choice |
|---|---|
| UI | React 18 (StrictMode), no runtime deps beyond React |
| Language | TypeScript 5, strict |
| Bundler | Vite 5 |
| Styling | CSS Modules + custom properties |
| Testing | Vitest + Testing Library |
| Lint / format | ESLint 8 + `@typescript-eslint`, Prettier 3 |
| CI/CD | GitHub Actions → GitHub Pages |

Production JS is ~55 KB gzipped (React ~45 KB, app ~10 KB).

---

## Project Structure

```
src/
├── App.tsx                 # Page composition + best-effort framebusting
├── data/profile.ts         # All content: roles, highlights, skills, education
├── components/
│   ├── Header/             # Sticky bar, anchor nav, theme toggle
│   ├── Intro/              # Statement, at-a-glance facts, primary actions
│   ├── Section/            # Shared two-column section layout
│   ├── About/              # Bio + selected results
│   ├── Experience/         # Roles with computed durations
│   ├── Skills/             # Toolkit + education
│   ├── Contact/            # Email (copy), links, ContactForm
│   ├── LocalTime/          # Live Dubai time
│   ├── Footer/
│   ├── ErrorBoundary/
│   └── Icons.tsx
├── context/ThemeContext.tsx
├── hooks/useTheme.ts       # Saved choice → OS preference → live OS changes
├── services/contact.service.ts  # Formspree → mailto fallback
├── styles/globals.css      # Tokens, base, primitives, motion
├── utils/                  # date · sanitize · validation (+ tests)
└── types/index.ts
```

To update content, edit `src/data/profile.ts`. Durations and years of experience are computed from dates, so they never go stale.

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- npm ≥ 9

### Install & run

```bash
git clone https://github.com/sssouravsharma601/my-portfolio.git
cd my-portfolio
npm install
npm run dev          # http://localhost:5173
```

### Contact form (optional)

1. Create a free [Formspree](https://formspree.io) account.
2. Copy `.env.example` → `.env.local`.
3. Paste your form ID into `VITE_FORMSPREE_ID`.

Without this the form falls back to a pre-filled `mailto:` link.

---

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check then produce optimised `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run typecheck` | `tsc --noEmit` — zero-emit type check |
| `npm run lint` | ESLint with zero-warnings policy |
| `npm run lint:fix` | ESLint with auto-fix |
| `npm run format` | Prettier write |
| `npm run format:check` | Prettier check (used in CI) |
| `npm run test` | Vitest single-run |
| `npm run test:watch` | Vitest watch mode |
| `npm run test:coverage` | Vitest + V8 coverage report |
| `npm run ci` | Full gate: typecheck → lint → format → test → build |

---

## Security Highlights

- **Content-Security-Policy** meta tag. `script-src` still allows `'unsafe-inline'` for the pre-paint theme script and JSON-LD; moving to a hash-based policy is a possible follow-up.
- **Clickjacking:** GitHub Pages can't send `X-Frame-Options` or `frame-ancestors` headers, and neither works from a `<meta>` tag, so the site uses JS framebusting as a best-effort fallback. A CDN in front (e.g. Cloudflare) is needed for a real header.
- **Permissions-Policy** — disables camera, microphone, geolocation
- **Referrer-Policy: strict-origin-when-cross-origin**
- **Honeypot field** on the contact form to filter bot submissions
- **Input sanitisation** via DOM `createTextNode` before any data leaves the client
- All external links carry `rel="noopener noreferrer"`

---

## CI/CD Pipeline

Every push to `main` or a feature branch runs:

1. **Type-check** → `tsc --noEmit`
2. **Lint** → ESLint (max-warnings 0)
3. **Format** → Prettier check
4. **Tests** → Vitest
5. **Build** → `vite build`
6. **Deploy** → GitHub Pages (only on `main` pushes)

---

## License

MIT.
