# Blog content

Posts for [souravsharma.in/blog](https://souravsharma.in/blog/). Each post is one Markdown file in this folder; the build turns them into static pages, the RSS feed and sitemap entries. This README and `config.json` are not posts.

## Switches: `config.json`

```json
{ "publishing": true, "aiNote": true }
```

- `publishing`: `false` builds the site with no blog at all: no pages, no feed, no header, footer or menu link, no cards on the home page. The posts stay here and are still checked.
- `aiNote`: `true` shows "Researched and drafted with AI from the linked sources." under the byline of every post with `aiAssisted: true`.

## A post

File name: `YYYY-MM-DD-slug.md`, for example `2026-11-24-what-trusted-types-stop.md`.

- The date is the day of publication in Dubai and must match `date` below. It cannot be in the future.
- The slug is lowercase letters, digits and hyphens, at most 80 characters, and unique across all posts. It becomes the URL: `https://souravsharma.in/blog/<slug>/`. `tag` and `feed` are reserved.

```markdown
---
title: "Trusted Types: what they stop, and what they don't"
description: A plain-language look at the browser feature that turns DOM XSS sinks into type errors, and at what it leaves to you.
date: 2026-11-24
tags: [Security, Web Platform]
sources:
  - title: Trusted Types API, MDN Web Docs
    url: https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API
  - title: Trusted Types, W3C draft
    url: https://w3c.github.io/trusted-types/dist/spec/
aiAssisted: true
---

The body, in Markdown. Start with a paragraph; use `##` and `###` for headings.
```

### Front matter

Between two `---` lines, one `key: value` per line, spaces only (no tabs). All six keys are required and no others are allowed.

| Key           | Rule                                                                                                                     |
| ------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `title`       | Up to 90 characters.                                                                                                     |
| `description` | 50–160 characters. Shown in the list, under the title, in search results and link previews.                             |
| `date`        | `YYYY-MM-DD`, a real date, not after today in Dubai (UTC+4), equal to the date in the file name.                         |
| `tags`        | 1–4 of exactly: `AI`, `Research`, `Frontend`, `Web Platform`, `History`, `Future`, `Security`, `Inventions`. No repeats. |
| `sources`     | At least 2 items, each with exactly a `title` and an `https://` `url`, written as in the example.                        |
| `aiAssisted`  | `true` or `false`.                                                                                                       |

Values may be plain, `"double-quoted"` (JSON escapes) or `'single-quoted'` (`''` for a quote inside). Quote a value that contains `: ` or ` #`, or starts with one of `[ ] { } & * ! | > % @ # , ? -` or a backtick. Lists are written inline (`[AI, Research]`) or one item per line as `  - item` (two spaces, dash, space); a source's `url` line is indented four spaces.

### Body

- 300–1500 words (text and code; link addresses and Markdown syntax are not counted).
- Markdown only. No raw HTML: the check rejects any `<` followed by a letter or `/`, even in code. Write `&lt;` for a literal `<`.
- Links must be `https://` URLs (`[text](https://…)`). No `http://`, `mailto:` or relative links. Bare URLs are not turned into links.
- No images.
- A `#` heading is shown as `##`: the title is the page's only top-level heading. Headings get ids for links (`#section-name`).
- Tables, lists, quotes, code spans and fenced code blocks work.

### Never allowed, anywhere in the file

- The words "Emirates", "ENBD" or "Synechron client" (any capitalisation).
- Email addresses or phone numbers.
- A line starting with "As an AI".

## Commands

```bash
npm run blog:check                              # check content/blog
BLOG_CONTENT_DIR=src/test/fixtures/blog npm run build   # build with the test posts
npm run build                                   # runs blog:check first; any problem fails the build
```

`npm run blog:check` lists every problem with the file (and line, where there is one).
