/**
 * Best-effort framebusting. GitHub Pages can't send X-Frame-Options or a
 * frame-ancestors CSP header, and neither works from a <meta> tag.
 */
export function bustFrames(): void {
  if (window.self !== window.top) {
    window.top?.location.replace(window.self.location.href);
  }
}
