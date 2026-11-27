import { describe, expect, it } from 'vitest';
import { countWords, linkTargets, renderMarkdown, slugify } from './markdown';

describe('renderMarkdown', () => {
  it('never passes raw HTML through', () => {
    const html = renderMarkdown('Hello <script>alert(1)</script> and <img src=x onerror=alert(1)>');
    expect(html).not.toContain('<script');
    expect(html).not.toContain('<img');
    expect(html).toContain('&lt;script&gt;');
  });

  it('does not link bare URLs, and refuses unsafe link targets', () => {
    expect(renderMarkdown('See https://example.com today')).not.toContain('<a');
    expect(renderMarkdown('[x](javascript:alert(1))')).not.toContain('<a');
  });

  it('gives external links rel="noopener noreferrer" and no target', () => {
    const html = renderMarkdown(
      '[MDN](https://developer.mozilla.org/) and [home](https://souravsharma.in/)',
    );
    expect(html).toContain(
      '<a href="https://developer.mozilla.org/" rel="noopener noreferrer">MDN</a>',
    );
    expect(html).toContain('<a href="https://souravsharma.in/">home</a>');
    expect(html).not.toContain('target=');
  });

  it('gives headings unique ids and turns "#" into the second level', () => {
    const html = renderMarkdown(
      '# Top\n\n## Same name\n\n## Same name\n\n### Café `code`\n\n## Main',
    );
    expect(html).toContain('<h2 id="top-2">Top</h2>');
    expect(html).toContain('<h2 id="same-name">Same name</h2>');
    expect(html).toContain('<h2 id="same-name-2">Same name</h2>');
    expect(html).toContain('<h3 id="cafe-code">Café <code>code</code></h3>');
    // Ids the page uses itself are never taken.
    expect(html).toContain('<h2 id="main-2">Main</h2>');
    expect(html).not.toContain('<h1');
  });

  it('writes no style attributes: table alignment becomes a class', () => {
    const html = renderMarkdown('| a | b | c |\n| :-- | :-: | --: |\n| 1 | 2 | 3 |');
    expect(html).not.toContain('style=');
    expect(html).toContain('<th class="align-left">a</th>');
    expect(html).toContain('<td class="align-center">2</td>');
    expect(html).toContain('<td class="align-right">3</td>');
  });

  it('does not render images', () => {
    expect(renderMarkdown('![alt](https://example.com/a.png)')).not.toContain('<img');
  });
});

describe('helpers', () => {
  it('lists link targets, reference links included', () => {
    expect(linkTargets('[a](https://a.example/) and [b][1]\n\n[1]: https://b.example/')).toEqual([
      'https://a.example/',
      'https://b.example/',
    ]);
  });

  it('counts words of text and code, not link targets or syntax', () => {
    expect(countWords('## Two words\n\n- one [link text](https://example.com/a/b) `code`')).toBe(6);
  });

  it('slugifies', () => {
    expect(slugify('  Hello, World!  ')).toBe('hello-world');
    expect(slugify('***')).toBe('section');
  });
});
