# Sourav Sharma — Portfolio

[![CI](https://github.com/sssouravsharma601/my-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/sssouravsharma601/my-portfolio/actions/workflows/ci.yml)

Production-grade personal portfolio built with **React 18 · TypeScript 5 · Vite 5**.  
Live site → [sssouravsharma601.github.io/my-portfolio](https://sssouravsharma601.github.io/my-portfolio)

---

## Tech Stack

| Layer | Choice |
|---|---|
| UI framework | React 18 (StrictMode) |
| Language | TypeScript 5 strict |
| Bundler | Vite 5 |
| Styling | CSS Modules + CSS custom properties |
| Testing | Vitest + Testing Library |
| Linting | ESLint 8 + `@typescript-eslint` |
| Formatting | Prettier 3 |
| CI/CD | GitHub Actions → GitHub Pages |

---

## Project Structure

```
src/
├── components/
│   ├── ErrorBoundary/      # Class-based error boundary with recovery UI
│   ├── Navbar/
│   ├── Hero/
│   ├── About/
│   ├── Experience/
│   ├── Skills/
│   ├── Education/
│   ├── Contact/            # ContactForm uses service + validation utils
│   ├── Footer/
│   └── ui/
│       ├── ScrollReveal.tsx   # Polymorphic IntersectionObserver wrapper
│       ├── ParticleCanvas.tsx # Canvas particle network (~30 fps)
│       ├── CustomCursor.tsx
│       └── BackToTop.tsx
├── constants/index.ts      # All magic numbers / strings in one place
├── context/ThemeContext.tsx # Dark / light theme via Context API
├── data/                   # Static content (experience, skills, education)
├── hooks/                  # useScrollReveal · useTyping · useCounter · …
├── services/
│   └── contact.service.ts  # Formspree (primary) → mailto fallback
├── styles/
│   ├── globals.css         # CSS tokens + resets + utility classes
│   └── animations.css      # reveal-up / reveal-left / reveal-right
├── test/setup.ts           # @testing-library/jest-dom global matchers
├── types/index.ts          # Shared TypeScript interfaces
└── utils/
    ├── sanitize.ts         # DOM text-node sanitiser, regex fallback for SSR
    └── validation.ts       # isValidEmail · isMinLength · validateContactForm
```

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

- **Content-Security-Policy** meta tag (script-src self only, no unsafe-inline)
- **X-Frame-Options: DENY** + JS `FrameGuard` component — double-fenced against clickjacking
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

MIT — feel free to use this as a template for your own portfolio.
