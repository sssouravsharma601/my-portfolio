import { VALIDATION } from '../constants';

/**
 * Strips HTML by routing through a DOM text node, then slices to `maxLength`.
 *
 * Safe to call server-side (e.g. Vitest/jsdom) because it detects the DOM
 * absence and falls back to a regex strip.
 */
export function sanitize(input: string, maxLength: number = VALIDATION.SANITIZE_MAX_LEN): string {
  const trimmed = input.trim().slice(0, maxLength);

  if (typeof document === 'undefined') {
    // Non-browser environment (SSR / test with no jsdom)
    return trimmed.replace(/[<>"'&]/g, '');
  }

  const div = document.createElement('div');
  div.appendChild(document.createTextNode(trimmed));
  return div.innerHTML;
}
