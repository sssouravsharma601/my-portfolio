# Sourav Sharma — Portfolio

[![CI](https://github.com/sssouravsharma601/my-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/sssouravsharma601/my-portfolio/actions/workflows/ci.yml)

Personal portfolio of Sourav Sharma, built with **React 18 · TypeScript 5 · Vite 5**.  
Live site → [souravsharma.in](https://souravsharma.in/)

---

## Design

Calm and clear: white space, restrained type, soft rounded cards and very little colour.

- **Type:** Inter (variable, with optical sizing) throughout; JetBrains Mono only inside the code card and the rule sketch. Both self-hosted.
- **Colour:** white and one soft grey for bands and cards, near-black text, and an indigo accent kept for links and focus. Light and dark themes; the initial theme is resolved before first paint from the saved choice or the OS preference.
- **Layout:** a centred introduction (portrait, name, one sentence, the way to get in touch), then sections on alternating white and grey bands. Content is held to a 66rem measure.
- **Components:** pill buttons, borderless cards with a 22px radius, a thin frosted header.

### Interaction

Quiet, and always in response to the visitor.

- **Command palette:** `⌘K` / `Ctrl+K`, or the header button, opens a native `<dialog>` to jump to a section, switch theme or copy the email. Below 760px it is the menu.
- **Spotlight:** cards show a soft light under the cursor (`hooks/useSpotlight.ts`).
- **Count-up:** the result figures count to their value the first time they scroll into view.
- **Scroll-linked CSS** (`animation-timeline`): gentle reveals, and the nav marks the section in view.

All of it is off under `prefers-reduced-motion`, and the content is complete without JavaScript.

### Displays

Sizes are fluid from 320px phones to 4K. The root font size and the page width (set in `rem`) scale together above 1440px, safe-area insets are respected on notched phones, and hover-only effects are limited to devices that can hover.

## Résumé

The "Résumé" button builds a PDF in the visitor's browser at the moment they press it, from the same `src/data/profile.ts` the page renders. Years of experience, the length of the current role and the "generated on" date are therefore always today's.

- `src/resume/pdf.ts` is a small PDF writer (A4, the two built-in Helvetica faces, text, hairlines, links). No library and no embedded font: the generator is a lazy chunk of about 9 kB that loads on the first press.
- `src/resume/build.ts` lays out the résumé; `src/resume/helvetica.ts` holds the font metrics used to wrap and right-align text.
- The text is real text (selectable, readable by applicant-tracking systems), and the contact details are links.

## SEO

- **Prerendered HTML.** `npm run build` renders the app to static markup and writes it into `dist/index.html` (`scripts/prerender.mjs`), then React hydrates it. Crawlers and link previews get the full content without running JavaScript.
- The `<h1>` is the name; the title leads with it.
- JSON-LD `Person` + `ProfilePage` + `WebSite` in `index.html`, with `sameAs` pointing at LinkedIn and GitHub.
- `robots.txt`, `sitemap.xml`, canonical URL, Open Graph image.

`dateModified` in the JSON-LD (`index.html`) and `lastmod` in `public/sitemap.xml` are `{{buildDate}}` placeholders, stamped with the build day (UTC) by `vite.config.ts`.

## Blog

Posts are Markdown files in `content/blog/`, named `YYYY-MM-DD-slug.md`, with front matter for `title`, `description`, `date`, `tags` (1–4 from a fixed list), `sources` (at least two `https` links) and `aiAssisted`. The full format and every rule are in [`content/blog/README.md`](content/blog/README.md).

- **Static, at build time.** `scripts/prerender.mjs` renders `/blog/`, one page per tag (`/blog/tag/<tag>/`, so the filter works without JavaScript), one page per post (`/blog/<slug>/`) and `/blog/feed.xml` (RSS 2.0, newest 20), and adds every blog URL to `sitemap.xml`. Markdown is rendered with `markdown-it` (a dev dependency) with raw HTML off; no Markdown code reaches the browser.
- **Same frame as the home page.** Each page reuses the built `index.html` head (CSP, pre-paint theme script, fonts, icons) with its own title, description, canonical URL, Open Graph tags and JSON-LD (`Blog`, `CollectionPage`, `BlogPosting`). Only the header (theme switch, menu) is hydrated, by `src/blog/client.tsx`.
- **Checked before every build.** `npm run blog:check` (`scripts/blog-check.mjs`, rules in `src/blog/validate.ts`) fails the build on invalid front matter, duplicate slugs, future dates (Dubai time), bodies under 300 or over 1500 words, raw HTML, non-`https` links, client names, contact details and lines starting with "As an AI".
- **Kill switch.** `content/blog/config.json`: `"publishing": false` builds the site with no blog pages, feed, links or home-page cards (the posts stay in the repo); `"aiNote"` shows or hides "Researched and drafted with AI from the linked sources." on AI-assisted posts.

```bash
npm run blog:check                                      # check content/blog
BLOG_CONTENT_DIR=src/test/fixtures/blog npm run build   # build with the three test posts
```

With no posts the list says "First posts coming soon." and the home page shows no blog cards.

## Security

- **Content-Security-Policy** generated at build time (`vite.config.ts`): `default-src 'none'`, same-origin scripts, styles and fonts only, the one inline script allowed by SHA-256 hash, no `unsafe-inline`, Trusted Types enforced, no `data:` images, and `form-action 'none'` (the form submits from script, never natively). The only third-party origin is Formspree, and only if the contact form is configured.
- No third-party scripts, fonts, analytics or cookies.
- CI: actions pinned to commit SHAs, read-only default token, `npm audit` on production dependencies, Dependabot for npm and actions.
- `/.well-known/security.txt` for reports.
- Contact form: a hidden honeypot field filters bots, fields are trimmed and length-capped (not HTML-escaped: they travel as JSON or a URL-encoded mailto draft and are never rendered as markup), and external links carry `rel="noopener noreferrer"`.

GitHub Pages cannot send response headers, so `frame-ancestors`, HSTS and `X-Content-Type-Options` cannot be set from this repo (they do not work from `<meta>`). `App.tsx` has a best-effort frame guard. To get real headers, put the site behind a CDN that can add them.

## Tech Stack

| Layer | Choice |
|---|---|
| UI | React 19 (StrictMode), prerendered and hydrated; no runtime deps beyond React |
| Language | TypeScript 6, strict |
| Bundler | Vite 8 |
| Styling | CSS Modules + custom properties |
| Testing | Vitest + Testing Library |
| Lint / format | ESLint 10 (flat config) + `typescript-eslint`, Prettier 3 |
| CI/CD | GitHub Actions → GitHub Pages |

---

## Project Structure

```
index.html                  # Head: SEO meta, JSON-LD, pre-paint theme script
vite.config.ts              # CSP generation, display-font preload
scripts/prerender.mjs       # Build-time render into dist/index.html, plus the blog pages
scripts/blog-check.mjs      # npm run blog:check: validates content/blog
content/blog/               # Blog posts (Markdown), config.json (kill switch), README (format)
src/
├── App.tsx                 # Page composition + best-effort framebusting
├── entry-server.tsx        # renderToString entry used by the prerender
├── data/profile.ts         # All content: roles, highlights, skills, education
├── blog/                   # Blog: content rules, Markdown, page markup, feed, header entry
├── components/
│   ├── Header/             # Sticky bar, anchor nav, theme toggle
│   ├── Hero/               # Portrait, name, statement, actions, code card
│   ├── CommandPalette/     # ⌘K dialog; the menu on small screens
│   ├── CountUp/            # Figures that count up when scrolled into view
│   ├── ResumeButton/       # Builds and downloads the résumé PDF
│   ├── Section/            # Shared section header and band
│   ├── About/              # Bio + selected results
│   ├── CaseStudies/        # Two projects in depth, each with a system diagram
│   ├── Experience/         # Roles with computed durations
│   ├── Skills/             # Toolkit + education
│   ├── LatestPosts/        # Newest blog posts, near the end of the home page
│   ├── Contact/            # Hiring details, email (copy), links, ContactForm
│   ├── LocalTime/          # Live Dubai time
│   ├── Footer/
│   ├── ErrorBoundary/
│   └── Icons.tsx
├── context/ThemeContext.tsx
├── hooks/                  # useTheme · useNow (hydration-safe date) · useSpotlight · useActiveSection
├── resume/                 # PDF writer, résumé layout, download
├── services/contact.service.ts  # Formspree → mailto fallback
├── styles/globals.css      # Fonts, tokens, base, primitives, motion
├── utils/                  # date · cleanField · validation (+ tests)
└── types/index.ts
```

To update content, edit `src/data/profile.ts`. Durations and years of experience are computed from dates, never typed in. The prerendered HTML holds them as of the build date; the browser then updates them to the visitor's date (`hooks/useNow.ts`), and CI rebuilds the site on the 1st of each month so the static HTML is never more than a month old.

---

## Getting Started

### Prerequisites

- Node.js 22 (22.22.2 or later) or 24
- npm ≥ 10

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
| `npm run build` | Type-check, check the blog content, build `dist/`, then prerender the page and the blog |
| `npm run blog:check` | Validate the posts in `content/blog` (or `BLOG_CONTENT_DIR`) |
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

## CI/CD Pipeline

Every push to `main` or a feature branch, and every pull request, runs:

1. **Audit** → `npm audit` on production dependencies
2. **Type-check** → `tsc --noEmit`
3. **Lint** → ESLint (max-warnings 0)
4. **Format** → Prettier check
5. **Tests** → Vitest
6. **Build** → `vite build` plus the prerender step
7. **Deploy** → GitHub Pages, from `main` only: on every push, on the 1st of each month (so dates in the static HTML stay current), and on manual dispatch

---

## License

MIT.
