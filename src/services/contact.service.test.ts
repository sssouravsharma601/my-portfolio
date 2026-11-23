import { afterEach, describe, expect, it, vi } from 'vitest';
import type * as Constants from '../constants';
import { profile } from '../data/profile';

const DATA = {
  name: '  Ada <Lovelace>  ',
  email: 'ada@example.com',
  subject: 'Q&A <b>',
  message: 'Q&A <b> R&D, 5 > 3 & "quoted"',
};

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.doUnmock('../constants');
  vi.resetModules();
});

describe('sendContactForm without a form service', () => {
  it('opens a mail draft addressed to the owner, text kept exactly as typed', async () => {
    const { sendContactForm } = await import('./contact.service');
    let href = '';
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      href = this.href;
    });

    await expect(sendContactForm(DATA)).resolves.toEqual({ ok: true, channel: 'mailto' });

    const url = new URL(href);
    expect(url.protocol).toBe('mailto:');
    expect(url.pathname).toBe(profile.email);
    expect(url.searchParams.get('subject')).toBe('Q&A <b>');
    expect(url.searchParams.get('body')).toBe(
      'From: Ada <Lovelace> <ada@example.com>\n\nQ&A <b> R&D, 5 > 3 & "quoted"',
    );
    // Encoded exactly once: no HTML entities and no double percent-encoding.
    expect(href).toContain('subject=Q%26A%20%3Cb%3E&body=');
    expect(href).not.toMatch(/%25|&amp;|&lt;|&gt;/);
    expect(document.querySelector('a[href^="mailto:"]')).toBeNull();
  });
});

describe('sendContactForm with Formspree configured', () => {
  async function load(fetchImpl: typeof fetch) {
    vi.doMock('../constants', async (importOriginal) => ({
      ...(await importOriginal<typeof Constants>()),
      FORMSPREE_ENDPOINT: 'https://formspree.io/f/test',
    }));
    const fetchMock = vi.fn(fetchImpl);
    vi.stubGlobal('fetch', fetchMock);
    const { sendContactForm } = await import('./contact.service');
    return { sendContactForm, fetchMock };
  }

  it('posts the trimmed fields as JSON, unchanged', async () => {
    const { sendContactForm, fetchMock } = await load(() =>
      Promise.resolve(new Response('{}', { status: 200 })),
    );
    await expect(sendContactForm(DATA)).resolves.toEqual({ ok: true, channel: 'formspree' });

    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe('https://formspree.io/f/test');
    expect(init?.method).toBe('POST');
    // The service sends a JSON string; anything else is a failure in itself.
    expect(typeof init?.body).toBe('string');
    const body = JSON.parse(init?.body as string) as Record<string, string>;
    expect(body).toEqual({
      name: 'Ada <Lovelace>',
      email: 'ada@example.com',
      subject: 'Q&A <b>',
      message: 'Q&A <b> R&D, 5 > 3 & "quoted"',
    });
  });

  it('reports the service’s own error message', async () => {
    const { sendContactForm } = await load(() =>
      Promise.resolve(new Response(JSON.stringify({ error: 'Rate limited' }), { status: 429 })),
    );
    await expect(sendContactForm(DATA)).resolves.toEqual({
      ok: false,
      error: 'Formspree submission failed: Rate limited',
    });
  });

  it('reports a network failure', async () => {
    const { sendContactForm } = await load(() => Promise.reject(new Error('offline')));
    await expect(sendContactForm(DATA)).resolves.toEqual({
      ok: false,
      error: 'Formspree submission failed: offline',
    });
  });
});
