---
title: "Trusted Types: what they stop, and what they don't"
description: A plain-language look at the browser feature that turns DOM XSS sinks into type errors, and at the work it still leaves to you.
date: 2026-11-24
tags: [Security, Web Platform]
sources:
  - title: Trusted Types API, MDN Web Docs
    url: https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API
  - title: Trusted Types, W3C Working Draft
    url: https://w3c.github.io/trusted-types/dist/spec/
  - title: Prevent DOM-based cross-site scripting vulnerabilities with Trusted Types, web.dev
    url: https://web.dev/articles/trusted-types
aiAssisted: true
---

Most cross-site scripting bugs in modern frontends are not on the server. They happen in the browser, when a string that someone else controls reaches a place that turns strings into code: `innerHTML`, `outerHTML`, `document.write`, `eval`, or the `src` of a script element. The web platform calls these places _injection sinks_, and Trusted Types is a way to lock them.

## The idea in one sentence

With Trusted Types enforced, those sinks stop accepting plain strings. They accept only special objects (`TrustedHTML`, `TrustedScript` and `TrustedScriptURL`), and the only way to make one is through a _policy_ that you register in code.

Turning it on is a single Content Security Policy directive:

```
Content-Security-Policy: require-trusted-types-for 'script'
```

After that, a line such as `element.innerHTML = userInput` throws a `TypeError` instead of quietly parsing markup. The bug becomes loud, and it becomes loud in the place where it lives.

## Policies are the narrow gate

A policy is a named object with functions that take a string and return a trusted value. Typically it wraps a sanitiser:

```js
const policy = trustedTypes.createPolicy('sanitize', {
  createHTML: (input) => DOMPurify.sanitize(input),
});
element.innerHTML = policy.createHTML(userInput);
```

The value of this is less about the sanitiser and more about the shape of the code. Every place that can create HTML now goes through a small number of named policies, so a security review reads a few functions instead of the whole codebase. The `trusted-types` directive can also list which policy names are allowed, and `trusted-types 'none'` allows none at all: a page that never needs to turn strings into markup can say so, and any attempt fails.

## What it does not do

Trusted Types is not a sanitiser. A policy that returns its input unchanged makes everything "trusted" again; the protection is exactly as good as the policies you write. It also does nothing for injection on the server, for unsafe addresses in links, or for logic bugs in your own templates. And it only covers sinks in the DOM; data that you send to a server is outside its view.

Browser support matters too. Chromium-based browsers have enforced Trusted Types for several years, and other engines have been adding support, so check a current compatibility table before relying on it as the only defence. Where it is not supported, the directive is ignored, which is why it works best as a second line behind careful code.

## Why it suits a static site

A site that renders its markup at build time and never assigns HTML strings in the browser can turn on the strictest setting and lose nothing. Libraries such as React already avoid string-to-markup sinks for ordinary rendering, so enforcement mostly flags the rare explicit escape hatch, which is exactly the code you want to review.

The practical advice is short: enable it in report-only mode first, read the reports, move the few legitimate sinks behind one policy, then enforce.
