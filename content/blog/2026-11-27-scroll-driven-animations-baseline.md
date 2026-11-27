---
title: "Scroll-driven animations are Baseline: what Firefox 159 changes"
description: Firefox 159 turned on scroll-driven animations by default, making them Baseline Newly available. What that means for scroll effects built in JavaScript.
date: 2026-11-27
tags: [Frontend, Web Platform]
sources:
  - title: New to the web platform in October, web.dev
    url: https://web.dev/blog/web-platform-10-2026?hl=en
  - title: Firefox 159 release notes for developers, MDN Web Docs
    url: https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/159
  - title: Animate elements on scroll with Scroll-driven animations, Chrome for Developers
    url: https://developer.chrome.com/docs/css-ui/scroll-driven-animations
  - title: view() CSS function, MDN Web Docs
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline/view
aiAssisted: true
---

October was a busy month for browser releases. The [web.dev roundup for October 2026](https://web.dev/blog/web-platform-10-2026?hl=en) lists Chrome 155 and 156, Firefox 158 and 159, and Safari 27.1 and 27.2 as reaching stable that month. Several features crossed the Baseline line, but for frontend teams the headline is scroll-driven animations.

## What happened

[Firefox 159 was released on October 27, 2026](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/159), and its release notes say that scroll-driven animations "are now enabled by default". Chrome has shipped the APIs [since version 115](https://developer.chrome.com/docs/css-ui/scroll-driven-animations), and Safari already supported them. In web.dev's words: "With support in Chrome, Safari, and now Firefox 159, scroll-driven animations are Baseline Newly available."

MDN now marks the [`view()` function](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline/view) as Baseline 2026, working across the latest browsers since October 2026. The web.dev post also points to an interactive history that traces the feature from an early 2014 proposal to a standard shipped in every core browser engine.

The same Firefox release also added support for [scoped custom element registries](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/159), which [web.dev notes](https://web.dev/blog/web-platform-10-2026?hl=en) are now Baseline Newly available. That is worth noting if you combine web components from different sources, because it avoids collisions when two components declare elements with the same name.

## Why it matters technically

Scroll-driven animations let you tie the progress of a CSS animation or a Web Animations API animation to scrolling instead of time. [web.dev describes](https://web.dev/blog/web-platform-10-2026?hl=en) two kinds of timeline:

- A **scroll progress timeline**, linked to the scroll offset of a scroll container, created with `scroll-timeline` or the `scroll()` function.
- A **view progress timeline**, linked to an element's visibility within its scrollport, created with `view-timeline` or the `view()` function.

Either is attached to an element with `animation-timeline`.

The reason this matters is where the work happens. The [Chrome documentation](https://developer.chrome.com/docs/css-ui/scroll-driven-animations) explains that the classic approach is to listen for scroll events on the main thread. That has two problems: browsers scroll on a separate process, so scroll events arrive asynchronously, and animations on the main thread are subject to jank. Because the new timelines build on existing CSS and Web Animations APIs, they gain the ability to run off the main thread.

A reading progress bar shows the pattern well. This follows the Chrome guide's demo, wrapped in a feature query:

```css
@keyframes grow-progress {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

@supports (animation-timeline: scroll()) {
  #progress {
    position: fixed;
    inset: 0 0 auto 0;
    height: 4px;
    background: currentColor;
    transform-origin: 0 50%;
    animation: grow-progress auto linear;
    animation-timeline: scroll();
  }
}
```

There are three details from the [Chrome guide](https://developer.chrome.com/docs/css-ui/scroll-driven-animations) to keep in mind:

1. `animation-timeline` is not part of the `animation` shorthand. Declare it after the shorthand, because the shorthand resets longhands it does not include.
2. A duration in seconds makes no sense on a scroll timeline, so the duration must be `auto` (the default if you leave it out).
3. The demo scales the bar with `transform` rather than animating `width`, so it can use composited animations.

For "animate as it enters the viewport" effects, `view()` is the tool. By default, [MDN explains](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline/view), the timeline sits at 0% when the subject first appears at one edge of the scroller. It reaches 100% when the subject's outer border edge reaches the opposite edge. The default axis is `block`, and if the chosen axis has no scrollbar the timeline stays inactive at zero progress. So if a `view()` animation never seems to run, check that the scroller actually scrolls along the chosen axis.

## What this means for frontend engineers

- **Audit your scroll handlers.** Progress bars, parallax and fade-in-on-scroll effects that only map scroll position to a style are now candidates for plain CSS. Removing them takes work off the main thread and can remove a dependency.
- **Keep the fallback.** "Newly available" means it works in current browsers. [MDN notes](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline/view) it "might not work in older devices or browsers." Treat the animation as an enhancement inside `@supports`, and make sure the page reads correctly without it.
- **Animate cheap properties.** As the progress bar demo shows, prefer `transform` to layout properties such as `width` so the animation can use composited animations.
- **Respect motion preferences.** Scroll-linked motion is still motion. Gate decorative effects behind `prefers-reduced-motion` just as you would time-based ones.
- **Test in Firefox again.** If you previously disabled these effects for Firefox, or shipped a polyfill only for it, revisit that decision against Firefox 159 and later.

## Closing

Scroll-driven animations have been usable in Chrome for a while. What changed in October is that they now ship in every core browser engine, which makes them a realistic option for most projects, with a fallback for older browsers. If your codebase has scroll listeners whose only job is to move a style along with the page, this is a good time to replace them with a few lines of CSS.
