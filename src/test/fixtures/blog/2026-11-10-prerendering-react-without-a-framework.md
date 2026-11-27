---
title: Prerendering a React page without a framework
description: Rendering a single-page React site to static HTML at build time with Vite and react-dom/server, then hydrating it, in a few dozen lines.
date: 2026-11-10
tags: [Frontend, Web Platform]
sources:
  - title: renderToString, React reference
    url: https://react.dev/reference/react-dom/server/renderToString
  - title: hydrateRoot, React reference
    url: https://react.dev/reference/react-dom/client/hydrateRoot
  - title: Server-Side Rendering, Vite guide
    url: https://vite.dev/guide/ssr
aiAssisted: false
---

A portfolio or a small product page does not need a server to be fast. If the content is known at build time, the HTML can be too. Search engines, link previews and people on slow connections then get the full page in the first response, and React takes over once its script has loaded.

## The shape of it

There are three steps, and each one is small:

1. Build the browser bundle as usual.
2. Build a second, server-side bundle whose entry exports a `render()` function.
3. Run a short script that calls `render()`, puts the result into the built HTML file and writes it back.

The server entry is a few lines:

```ts
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

export const render = () => renderToString(createElement(App));
```

In the browser, `hydrateRoot` replaces `createRoot` when the page already has markup, so React attaches to the existing elements instead of drawing them again. The [React reference for hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot) covers the details.

## Things that bite

Hydration expects the first browser render to produce exactly the markup the server produced. Three sources of mismatch come up again and again:

| Source           | Example                     | Fix                                       |
| :--------------- | :-------------------------- | :---------------------------------------- |
| Time             | "8 years of experience"     | Render the build date first, then update  |
| Browser state    | A theme saved in storage    | Read it in an effect or an external store |
| Platform details | Keyboard shortcut labels    | Pick one default and swap it after mount  |

`useSyncExternalStore` is a good fit for the last two: it takes a separate snapshot for the server, so the first client render can match it and then move to the real value.

### Keep the head honest

The title, description and structured data live in the HTML template, not in components, so they are correct before any script runs. Placeholders such as the build date can be filled in by the same script that injects the markup.

## Is it worth it?

For a site with one page and content that changes when the code changes, yes. The cost is one extra build step and a little discipline about what renders differently in the browser. The benefit is a page that is complete without JavaScript, and a clear rule for everything that is not: it must not change the first paint.

> If the page reads well with scripts turned off, everything after that is an enhancement.
