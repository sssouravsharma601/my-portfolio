import { describe, expect, it } from 'vitest';
import { postText, prose } from '../test/blog';
import { bodyProblems, checkPost, dubaiToday, isRealDate, privacyProblems } from './validate';

const TODAY = '2026-11-27';
const FILE = '2026-11-20-a-calm-note.md';
const errorsOf = (text: string, file = FILE) => checkPost(file, text, TODAY).errors;

describe('checkPost', () => {
  it('accepts a valid post and returns it rendered', () => {
    const { post, errors } = checkPost(FILE, postText(), TODAY);
    expect(errors).toEqual([]);
    expect(post).toMatchObject({
      slug: 'a-calm-note',
      date: '2026-11-20',
      tags: ['Frontend', 'Web Platform'],
      aiAssisted: true,
      words: 322,
      readingMinutes: 1,
    });
    expect(post?.sources).toHaveLength(2);
    expect(post?.html).toContain('<h2 id="first-part">First part</h2>');
  });

  it.each([
    ['2026-11-20 a note.md', /file name/],
    ['20-11-2026-note.md', /file name/],
    ['2026-11-20-Upper.md', /file name/],
  ])('rejects the file name %s', (file, message) => {
    expect(errorsOf(postText(), file).join()).toMatch(message);
  });

  it('rejects reserved slugs', () => {
    expect(errorsOf(postText(), '2026-11-20-tag.md').join()).toMatch(/reserved/);
  });

  it('rejects missing, unknown and invalid front matter', () => {
    expect(errorsOf('no front matter at all').join()).toMatch(/front matter/);
    const missing = postText().replace(/^aiAssisted: true\n/m, '');
    expect(errorsOf(missing)).toContain('missing front matter key "aiAssisted"');
    expect(errorsOf(postText({ extra: 'author: Someone' }))).toContain(
      'unknown front matter key "author"',
    );
    expect(errorsOf(postText({ aiAssisted: 'yes' }))).toContain('aiAssisted must be true or false');
  });

  it('limits the title to 90 characters', () => {
    expect(errorsOf(postText({ title: 'x'.repeat(90) }))).toEqual([]);
    expect(errorsOf(postText({ title: 'x'.repeat(91) })).join()).toMatch(/title is 91 characters/);
  });

  it('keeps the description between 50 and 160 characters', () => {
    expect(errorsOf(postText({ description: 'd'.repeat(50) }))).toEqual([]);
    expect(errorsOf(postText({ description: 'd'.repeat(160) }))).toEqual([]);
    expect(errorsOf(postText({ description: 'd'.repeat(49) })).join()).toMatch(/description/);
    expect(errorsOf(postText({ description: 'd'.repeat(161) })).join()).toMatch(/description/);
  });

  it('checks the date: real, matching the file name, not in the future in Dubai', () => {
    expect(errorsOf(postText({ date: '2026-02-30' })).join()).toMatch(/real date/);
    expect(errorsOf(postText({ date: '2026-11-19' })).join()).toMatch(/does not match/);
    const future = postText({ date: '2026-11-28' });
    expect(errorsOf(future, '2026-11-28-a-calm-note.md').join()).toMatch(/in the future/);
    // Today in Dubai is allowed.
    expect(errorsOf(postText({ date: TODAY }), `${TODAY}-a-calm-note.md`)).toEqual([]);
  });

  it('allows 1–4 tags from the fixed list, without repeats', () => {
    expect(errorsOf(postText({ tags: '[AI]' }))).toEqual([]);
    expect(errorsOf(postText({ tags: '[AI, Research, Future, Inventions]' }))).toEqual([]);
    expect(errorsOf(postText({ tags: '[]' })).join()).toMatch(/0 tags/);
    expect(
      errorsOf(postText({ tags: '[AI, Research, Future, Inventions, History]' })).join(),
    ).toMatch(/5 tags/);
    expect(errorsOf(postText({ tags: '[ai]' }))).toContain('unknown tag "ai"');
    expect(errorsOf(postText({ tags: '[Cooking]' }))).toContain('unknown tag "Cooking"');
    expect(errorsOf(postText({ tags: '[AI, AI]' }))).toContain('tag "AI" is listed twice');
    expect(errorsOf(postText({ tags: 'AI' })).join()).toMatch(/list of tag names/);
  });

  it('needs at least two https sources with a title and a url', () => {
    const one = '  - title: Only one\n    url: https://example.com/';
    expect(errorsOf(postText({ sources: one })).join()).toMatch(/at least 2/);
    const insecure = `${one}\n  - title: Old\n    url: http://example.com/`;
    expect(errorsOf(postText({ sources: insecure }))).toContain(
      'source 2 url must be an https:// URL',
    );
    const untitled = `${one}\n  - url: https://example.org/`;
    expect(errorsOf(postText({ sources: untitled })).join()).toMatch(/source 2 needs a title/);
    expect(errorsOf(postText({ sources: '  - a\n  - b' })).join()).toMatch(/title" and "url/);
  });

  it('keeps the body between 300 and 1500 words', () => {
    expect(errorsOf(postText({ body: prose(299) })).join()).toMatch(/299 words/);
    expect(errorsOf(postText({ body: prose(300) }))).toEqual([]);
    expect(errorsOf(postText({ body: prose(1500) }))).toEqual([]);
    expect(errorsOf(postText({ body: prose(1501) })).join()).toMatch(/1501 words/);
  });

  it('rejects mentions of the client, contact details and "As an AI" anywhere', () => {
    const body = (extra: string) => postText({ body: `${prose(320)}\n\n${extra}\n` });
    expect(errorsOf(body('Flying with emirates.')).join()).toMatch(/Emirates/);
    expect(errorsOf(body('A bank called ENBD.')).join()).toMatch(/ENBD/);
    expect(errorsOf(body('For a Synechron  client.')).join()).toMatch(/Synechron client/);
    expect(errorsOf(postText({ title: 'Notes from Emirates' })).join()).toMatch(/Emirates/);
    expect(errorsOf(body('Write to me at someone@example.com.')).join()).toMatch(/email/);
    expect(errorsOf(body('Call +971 50 123 4567.')).join()).toMatch(/phone/);
    expect(errorsOf(body('Call (555) 123-4567.')).join()).toMatch(/phone/);
    expect(errorsOf(body('As an AI language model, I cannot.')).join()).toMatch(/As an AI/);
    expect(errorsOf(body('> as an ai, quoted')).join()).toMatch(/As an AI/);
    expect(
      errorsOf(
        postText({ description: '"As an AI model I wrote this description for you, at length."' }),
      ).join(),
    ).toMatch(/As an AI/);
  });

  it('rejects raw HTML, images and links that are not https', () => {
    const body = (extra: string) => postText({ body: `${prose(320)}\n\n${extra}\n` });
    expect(errorsOf(body('Some <b>bold</b> text.')).join()).toMatch(/raw HTML/);
    expect(errorsOf(body('Closing </div> only.')).join()).toMatch(/raw HTML/);
    expect(errorsOf(body('An autolink <https://example.com>.')).join()).toMatch(/raw HTML/);
    expect(errorsOf(body('![alt](https://example.com/a.png)')).join()).toMatch(/images/);
    expect(errorsOf(body('[old](http://example.com)')).join()).toMatch(/http:\/\//);
    expect(errorsOf(body('[mail](mailto:a@b.co)')).join()).toMatch(/not an https/);
    expect(errorsOf(body('[relative](/blog/)')).join()).toMatch(/not an https/);
    expect(errorsOf(body('[js](javascript:alert(1))')).join()).toMatch(/not an https/);
    expect(errorsOf(body('[ref][1]\n\n[1]: ftp://example.com/')).join()).toMatch(/not an https/);
    // Comparisons are fine: "<" not followed by a letter or "/".
    expect(
      errorsOf(body('When a < b and 3 <= 4, nothing breaks; [ok](https://example.com).')),
    ).toEqual([]);
  });

  it('reports every problem at once, with line numbers for the body', () => {
    const errors = errorsOf(
      postText({ title: 'x'.repeat(95), tags: '[Nope]', body: `${prose(320)}\n\n<i>hi</i>\n` }),
    );
    expect(errors.length).toBeGreaterThanOrEqual(3);
    expect(errors.join()).toMatch(/line 16: raw HTML/);
  });
});

describe('privacyProblems', () => {
  it('does not mistake dates, years, decimals or URLs for phone numbers', () => {
    expect(
      privacyProblems(
        'On 2026-11-20, in the 1440s and 1450s, pi is 3.14159265, 1,000,000 copies, https://arxiv.org/abs/2301.123456789',
      ),
    ).toEqual([]);
  });
});

describe('bodyProblems', () => {
  it('passes a long, plain body', () => {
    expect(bodyProblems(prose(400))).toEqual([]);
  });
});

describe('dates', () => {
  it('works out today in Dubai (UTC+4)', () => {
    expect(dubaiToday(new Date('2026-11-27T19:59:00Z'))).toBe('2026-11-27');
    expect(dubaiToday(new Date('2026-11-27T20:00:00Z'))).toBe('2026-11-28');
  });

  it('knows real calendar dates', () => {
    expect(isRealDate('2028-02-29')).toBe(true);
    expect(isRealDate('2026-02-29')).toBe(false);
    expect(isRealDate('2026-1-2')).toBe(false);
  });
});
