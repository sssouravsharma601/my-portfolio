import { describe, expect, it } from 'vitest';
import { FrontmatterError, parseFrontmatter } from './frontmatter';

const fm = (...lines: string[]) => `---\n${lines.join('\n')}\n---\nBody text\n`;

describe('parseFrontmatter', () => {
  it('reads scalars, booleans, inline and block lists, and lists of maps', () => {
    const { data, body, bodyLine } = parseFrontmatter(
      fm(
        'title: "Quoted: with a colon"',
        "single: 'it''s fine'",
        'plain: Gutenberg’s press',
        'date: 2026-11-20',
        'flag: true',
        'inline: [AI, "Web Platform", Research]',
        'block:',
        '  - History',
        '  - Inventions',
        'sources:',
        '  - title: MDN',
        '    url: https://developer.mozilla.org/',
        '  - title: "web.dev: articles"',
        '    url: https://web.dev/',
      ),
    );
    expect(data).toEqual({
      title: 'Quoted: with a colon',
      single: "it's fine",
      plain: 'Gutenberg’s press',
      date: '2026-11-20',
      flag: true,
      inline: ['AI', 'Web Platform', 'Research'],
      block: ['History', 'Inventions'],
      sources: [
        { title: 'MDN', url: 'https://developer.mozilla.org/' },
        { title: 'web.dev: articles', url: 'https://web.dev/' },
      ],
    });
    expect(body).toBe('Body text\n');
    expect(bodyLine).toBe(17);
  });

  it('accepts Windows line endings and a byte order mark', () => {
    const text = `${String.fromCharCode(0xfeff)}---\r\ntitle: Hi\r\n---\r\nBody`;
    expect(parseFrontmatter(text).data).toEqual({ title: 'Hi' });
  });

  it.each([
    ['no opening line', 'title: x\n---\n', /must start with a --- line/],
    ['no closing line', '---\ntitle: x\n', /not closed/],
    ['a tab', fm('title:\tx'), /tabs/],
    ['a duplicate key', fm('title: a', 'title: b'), /set twice/],
    ['an unquoted colon', fm('title: Trusted Types: a look'), /double quotes/],
    ['a value that starts with a dash', fm('title: - nope'), /double quotes/],
    ['an unclosed quote', fm('title: "nope'), /unclosed/],
    ['a bad escape', fm('title: "\\q"'), /bad escape/],
    ['a lone single quote', fm("title: 'it's'"), /unclosed/],
    ['a nested list', fm('tags: [[a]]'), /nested/],
    ['an empty list', fm('tags:'), /no value/],
    ['badly indented items', fm('tags:', ' - a'), /two spaces/],
    ['mixed list items', fm('x:', '  - a', '  - k: v'), /mixed/],
    ['a line that is not key: value', fm('just words'), /key: value/],
    ['an empty inline value', fm('tags: [a, ]'), /empty value/],
  ])('rejects %s', (_, text, message) => {
    expect(() => parseFrontmatter(text)).toThrow(FrontmatterError);
    expect(() => parseFrontmatter(text)).toThrow(message);
  });

  it('reports the line of the problem', () => {
    try {
      parseFrontmatter(fm('title: ok', 'bad line'));
      expect.unreachable();
    } catch (e) {
      expect((e as FrontmatterError).line).toBe(3);
    }
  });
});
