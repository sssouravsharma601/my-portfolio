# Sourav Sharma — Portfolio

[![CI](https://github.com/sssouravsharma601/my-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/sssouravsharma601/my-portfolio/actions/workflows/ci.yml)

Personal portfolio of Sourav Sharma, built with **React 18 · TypeScript 5 · Vite 5**.  
Live site → [souravsharma.in](https://souravsharma.in/)

---

## Design

A type poster. The name is the hero, set edge to edge in a variable font, and the rest of the page keeps that voice: heavy condensed headings, hard 2px rules, mono spec-sheet labels.

- **Type:** Bricolage Grotesque (variable weight and width) for everything, JetBrains Mono for labels. Both self-hosted.
- **Colour:** warm paper and ink. The accent changes with the theme: vermilion on paper, lime on ink. The initial theme is resolved before first paint from the saved choice or the OS preference.
- **Signature interaction:** letters of the name lose weight and width near the pointer, so the cursor dents the wordmark. Fine pointers only; off under reduced motion.
- **Motion:** everything else is scroll-linked CSS (`animation-timeline`): reveals, the wire that fills beside the experience list, the ticker, the page progress bar. Nothing runs on its own, and content is fully visible when motion is unsupported, reduced, or printed. No animation libraries.

## SEO

- **Prerendered HTML.** `npm run build` renders the app to static markup and writes it into `dist/index.html` (`scripts/prerender.mjs`), then React hydrates it. Crawlers and link previews get the full content without running JavaScript.
- The `<h1>` is the name; the title leads with it.
- JSON-LD `Person` + `ProfilePage` + `WebSite` in `index.html`, with `sameAs` pointing at LinkedIn and GitHub.
- `robots.txt`, `sitemap.xml`, canonical URL, Open Graph image.

When content changes, update `dateModified` in `index.html` and `lastmod` in `public/sitemap.xml`.

## Security

- **Content-Security-Policy** generated at build time (`vite.config.ts`): `default-src 'none'`, same-origin scripts, styles and fonts only, the one inline script allowed by SHA-256 hash, no `unsafe-inline`, and Trusted Types enforced. The only third-party origin is Formspree, and only if the contact form is configured.
- No third-party scripts, fonts, analytics or cookies.
- CI: actions pinned to commit SHAs, read-only default token, `npm audit` on production dependencies, Dependabot for npm and actions.
- `/.well-known/security.txt` for reports.

GitHub Pages cannot send response headers, so `frame-ancestors`, HSTS and `X-Content-Type-Options` cannot be set from this repo (they do not work from `<meta>`). `App.tsx` has a best-effort frame guard. To get real headers, put the site behind a CDN that can add them.

## Tech Stack

| Layer | Choice |
|---|---|
| UI | React 18 (StrictMode), prerendered and hydrated; no runtime deps beyond React |
| Language | TypeScript 5, strict |
| Bundler | Vite 5 |
| Styling | CSS Modules + custom properties |
| Testing | Vitest + Testing Library |
| Lint / format | ESLint 8 + `@typescript-eslint`, Prettier 3 |
| CI/CD | GitHub Actions → GitHub Pages |

---

## Project Structure

```
index.html                  # Head: SEO meta, JSON-LD, pre-paint theme script
vite.config.ts              # CSP generation, display-font preload
scripts/prerender.mjs       # Build-time render into dist/index.html
src/
├── App.tsx                 # Page composition + best-effort framebusting
├── entry-server.tsx        # renderToString entry used by the prerender
├── data/profile.ts         # All content: roles, highlights, skills, education
├── components/
│   ├── Header/             # Sticky bar, anchor nav, theme toggle
│   ├── Hero/               # Kinetic wordmark, portrait stamp, statement, ticker
│   ├── Section/            # Shared numbered section header
│   ├── About/              # Bio + selected results
│   ├── Experience/         # Roles on a scroll-filled wire, computed durations
│   ├── Skills/             # Toolkit + education
│   ├── Contact/            # Accent block: email (copy), links, ContactForm
│   ├── LocalTime/          # Live Dubai time
│   ├── Footer/
│   ├── ErrorBoundary/
│   └── Icons.tsx
├── context/ThemeContext.tsx
├── hooks/useTheme.ts       # Theme as an external store (hydration-safe)
├── services/contact.service.ts  # Formspree → mailto fallback
├── styles/globals.css      # Fonts, tokens, base, primitives, motion
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
