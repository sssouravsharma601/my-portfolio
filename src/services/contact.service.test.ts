import { afterEach, describe, expect, it, vi } from 'vitest';
import { profile } from '../data/profile';

const DATA = {
  name: 'Ada <b>Lovelace</b>',
  email: 'ada@example.com',
  subject: 'Role & team',
  message: 'Hello <script>alert(1)</script>',
};

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.doUnmock('../constants');
  vi.resetModules();
});

describe('sendContactForm without a form service', () => {
  it('opens a mail draft addressed to the owner, with markup escaped', async () => {
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
    expect(url.searchParams.get('subject')).toBe('Role &amp; team');
    const body = url.searchParams.get('body') ?? '';
    expect(body).toContain('ada@example.com');
    expect(body).not.toContain('<script>');
    expect(document.querySelector('a[href^="mailto:"]')).toBeNull();
  });
});

describe('sendContactForm with Formspree configured', () => {
  async function load(fetchImpl: typeof fetch) {
    vi.doMock('../constants', async (importOriginal) => ({
      ...(await importOriginal<typeof import('../constants')>()),
      FORMSPREE_ENDPOINT: 'https://formspree.io/f/test',
    }));
    const fetchMock = vi.fn(fetchImpl);
    vi.stubGlobal('fetch', fetchMock);
    const { sendContactForm } = await import('./contact.service');
    return { sendContactForm, fetchMock };
  }

  it('posts the sanitised fields as JSON', async () => {
    const { sendContactForm, fetchMock } = await load(
      async () => new Response('{}', { status: 200 }),
    );
    await expect(sendContactForm(DATA)).resolves.toEqual({ ok: true, channel: 'formspree' });

    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe('https://formspree.io/f/test');
    expect(init?.method).toBe('POST');
    const body = JSON.parse(String(init?.body)) as Record<string, string>;
    expect(body['email']).toBe('ada@example.com');
    expect(body['message']).not.toContain('<script>');
  });

  it('reports the service’s own error message', async () => {
    const { sendContactForm } = await load(
      async () => new Response(JSON.stringify({ error: 'Rate limited' }), { status: 429 }),
    );
    await expect(sendContactForm(DATA)).resolves.toEqual({
      ok: false,
      error: 'Formspree submission failed: Rate limited',
    });
  });

  it('reports a network failure', async () => {
    const { sendContactForm } = await load(async () => {
      throw new Error('offline');
    });
    await expect(sendContactForm(DATA)).resolves.toEqual({
      ok: false,
      error: 'Formspree submission failed: offline',
    });
  });
});
