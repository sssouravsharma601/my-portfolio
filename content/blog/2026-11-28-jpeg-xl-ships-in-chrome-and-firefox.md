---
title: "JPEG XL is now in Chrome and Firefox: what to do with it"
description: Chrome 155 and Firefox 158 decode JPEG XL by default. What the format offers, why Chrome used a Rust decoder, and how to adopt it safely.
date: 2026-11-28
tags: [Frontend, Web Platform, Security]
sources:
  - title: Shipping JPEG XL in Chrome, Chrome for Developers
    url: https://developer.chrome.com/blog/jpeg-xl-in-chrome
  - title: New to the web platform in October, web.dev
    url: https://web.dev/blog/web-platform-10-2026
  - title: Image file type and format guide, MDN Web Docs
    url: https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types
aiAssisted: true
---

JPEG XL has been a popular request from web developers for years: Chrome's team says it was a popular proposal in the Interop Project in 2026 and several years prior. Now it has landed. According to the [web.dev roundup of October's browser releases](https://web.dev/blog/web-platform-10-2026), both Chrome 155 and Firefox 158 now enable support for the format (`image/jxl`) by default. The Chrome team's [announcement](https://developer.chrome.com/blog/jpeg-xl-in-chrome), published on 6 October 2026, says decoding support starts from Chrome 155.

## What happened

JPEG XL is a royalty-free raster image format standardised as ISO/IEC 18181. Per the web.dev summary, it supports lossy and lossless compression, progressive decoding, wide colour gamuts, high dynamic range, high bit depths, transparency and animation. It can also transcode existing JPEG files losslessly.

Chrome's announcement makes a stronger claim about compression: it describes the format as offering 30–50% better compression than JPEG. That is the Chrome team's own figure, so treat it as a vendor claim and measure it on your own images. The same post is notably balanced about the alternatives. It recommends trying both AVIF and JPEG XL, and expects JPEG XL to help most with high-fidelity or lossless compression of photographic images, or where fine-grained progressive decoding is wanted.

MDN's [image format guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types) lists support as Chrome 155, Firefox 158 and Safari 17. It adds that Safari does not support progressive download of JPEG XL files, so it renders them only after the whole file has arrived. MDN also says browser support is not yet universal and recommends a fallback.

## Why it matters technically

The most interesting part of the Chrome post is not the format but the decoder. Chrome's authors note that image decoders are among the most critical and targeted attack surfaces in a browser, because they parse complex untrusted binary data inside the renderer process. They say decoders written in memory-unsafe languages such as C++ have historically been prone to out-of-bounds reads, heap overflows and use-after-free bugs.

Chrome's answer was to integrate `jxl-rs`, a pure Rust implementation of the decoder. To keep it fast, the post describes the stabilisation of the `target_feature_11` Rust feature, which allows SIMD instructions to be used without `unsafe` code, and the building of a SIMD abstraction layer called `jxl_simd`, inspired by the C++ Highway library. The post says the team verified the decoder with fuzzing and AI review and found no memory safety bugs across the implementation's history. That is the authors' own report rather than an independent audit, but the design principle is sound: remove a whole class of bugs at the source rather than rely only on the sandbox, which the post calls a secondary layer of defence.

The post also credits developer feedback, including the Interop Project, for the decision to ship, and says Chrome took part in the Interop 2026 JPEG XL investigation to make sure browsers have test coverage for the format's features.

Firefox 158 also changed its default `Accept` header for image requests to include `image/jxl`, according to web.dev. That matters for anything that negotiates formats on the server or at a CDN.

## What this means for frontend engineers

Do not rush to replace your whole image pipeline. A few practical points follow from the sources.

- **Keep a fallback.** MDN recommends serving an alternative such as AVIF, WebP or JPEG through the `picture` element. Treat JPEG XL as an extra `source` entry with a JPEG XL `type`, placed ahead of the formats you already serve.
- **Benchmark before committing.** Chrome itself suggests trying both AVIF and JPEG XL. Compare file size, decode time and visual quality on your real photography, especially if your content is high-resolution or needs lossless output.
- **Think about progressive loading.** The format's progressive decoding is a selling point, but MDN notes Safari renders files only after full download. Test on the browsers your users actually have.
- **Check your delivery layer.** If an image CDN negotiates on the `Accept` header, confirm it understands `image/jxl` before relying on it.
- **Mind the legacy JPEG archive.** Lossless JPEG transcoding lets an existing JPEG be converted and reconstructed exactly, so you may be able to reuse an archive without re-encoding from originals. Measure whether the resulting files are actually smaller, and verify round-trip results on a sample first.

## What this means for security-minded teams

The Rust decoder is a useful example for any team that parses untrusted input. Choosing a memory-safe implementation for the riskiest component, and then investing in performance so the safe choice is also a fast one, is a pattern worth copying in your own services.

## Closing

JPEG XL being enabled by default in Chrome and Firefox, on top of the Safari support MDN lists, is a genuine change for image delivery, but it is an addition rather than a replacement. The sensible approach is to add it behind a fallback, measure the gains on your own content, and let real data decide where it earns its place next to AVIF and WebP.
