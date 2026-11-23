/**
 * Moves keyboard focus to a page section (by id) without scrolling, so the
 * next Tab continues from there and screen readers announce where we landed.
 * Sections aren't focusable by default, so the target gets tabindex="-1"
 * (focusable from script, but not added to the Tab order).
 */
export function focusSection(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}
