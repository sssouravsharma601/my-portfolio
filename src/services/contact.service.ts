import { FORMSPREE_ENDPOINT, OWNER_EMAIL } from '../constants';
import { sanitize } from '../utils/sanitize';
import type { FormData } from '../types';

export type SendResult =
  | { ok: true; channel: 'formspree' | 'mailto' }
  | { ok: false; error: string };

/**
 * Attempts to submit the contact form via Formspree when
 * `VITE_FORMSPREE_ID` is configured, otherwise constructs a
 * pre-filled `mailto:` link and opens the system mail client.
 */
export async function sendContactForm(data: FormData): Promise<SendResult> {
  // ── Strategy 1: Formspree (preferred when env var is set) ────────────────
  if (FORMSPREE_ENDPOINT) {
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: sanitize(data.name),
          email: sanitize(data.email),
          subject: sanitize(data.subject),
          message: sanitize(data.message),
        }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }

      return { ok: true, channel: 'formspree' };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return { ok: false, error: `Formspree submission failed: ${message}` };
    }
  }

  // ── Strategy 2: mailto fallback ──────────────────────────────────────────
  const subject = encodeURIComponent(sanitize(data.subject));
  const body = encodeURIComponent(
    `From: ${sanitize(data.name)} <${sanitize(data.email)}>\n\n${sanitize(data.message)}`,
  );
  const href = `mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`;

  // Use a hidden anchor so we don't block on window.open
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.rel = 'noopener noreferrer';
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  return { ok: true, channel: 'mailto' };
}
