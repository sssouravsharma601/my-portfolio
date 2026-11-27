import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { contentDir, FIXTURE_DIR, FIXTURE_POSTS, fixtureCopy, postText } from '../test/blog';
import { generateBlog, type GeneratedFile } from './generate';
import { loadBlog } from './load';
import { AI_NOTE, EMPTY_STATE } from './pages';
import { addFeedLink, createShell, entryAssets } from './shell';
import type { BlogConfig } from './schema';

const TODAY = '2026-11-27';
const INDEX_HTML = readFileSync(resolve(__dirname, '../../index.html'), 'utf8');
const shell = createShell(INDEX_HTML, {
  script: '/assets/blog-abc.js',
  preloads: ['/assets/react-abc.js', '/assets/site-abc.js'],
});

function build(dir: string, config?: Partial<BlogConfig>) {
  const blog = loadBlog(dir, TODAY);
  expect(blog.errors).toEqual([]);
  const out = generateBlog({
    config: { ...blog.config, ...config },
    posts: blog.posts,
    shell,
    buildDate: TODAY,
  });
  const file = (path: string): string => {
    const f = out.files.find((x: GeneratedFile) => x.path === path);
    if (!f)
      throw new Error(`${path} not generated; have ${out.files.map((x) => x.path).join(', ')}`);
    return f.content;
  };
  const doc = (path: string) => new DOMParser().parseFromString(file(path), 'text/html');
  const xml = (path: string) => new DOMParser().parseFromString(file(path), 'application/xml');
  return { ...out, file, doc, xml, paths: out.files.map((f) => f.path) };
}

const jsonLd = (d: Document) =>
  [...d.querySelectorAll('script[type="application/ld+json"]')].map(
    (s) => JSON.parse(s.textContent ?? '') as Record<string, unknown>,
  );
const meta = (d: Document, key: string) =>
  d.querySelector(`meta[property="${key}"], meta[name="${key}"]`)?.getAttribute('content');

describe('generateBlog', () => {
  it('builds a calm, empty blog when there are no posts', () => {
    const out = build(contentDir({}));
    expect(out.paths).toEqual(['blog/index.html', 'blog/feed.xml']);
    const list = out.doc('blog/index.html');
    expect(list.querySelector('main')?.textContent).toContain(EMPTY_STATE);
    expect(list.querySelector('nav[aria-label="Filter by tag"]')).toBeNull();
    const feed = out.xml('blog/feed.xml');
    expect(feed.querySelector('parsererror')).toBeNull();
    expect(feed.querySelectorAll('item')).toHaveLength(0);
    expect(out.sitemap).toContain('<loc>https://souravsharma.in/blog/</loc>');
    expect(out.sitemap).toContain(`<lastmod>${TODAY}</lastmod>`);
  });

  it('builds one post: its page, its tags, the list and the feed', () => {
    const out = build(fixtureCopy([FIXTURE_POSTS[0] ?? '']));
    expect(out.paths).toEqual([
      'blog/index.html',
      'blog/tag/web-platform/index.html',
      'blog/tag/security/index.html',
      'blog/what-trusted-types-stop/index.html',
      'blog/feed.xml',
    ]);

    const html = out.file('blog/what-trusted-types-stop/index.html');
    const d = out.doc('blog/what-trusted-types-stop/index.html');
    expect(d.title).toBe("Trusted Types: what they stop, and what they don't — Sourav Sharma");
    expect(d.querySelectorAll('h1')).toHaveLength(1);
    expect(d.querySelector('h1')?.textContent).toBe(
      "Trusted Types: what they stop, and what they don't",
    );
    expect(d.querySelector('time')?.getAttribute('datetime')).toBe('2026-11-24');
    expect(d.querySelector('main')?.textContent).toContain('Sourav Sharma');
    expect(d.querySelector('main')?.textContent).toContain('2 min read');
    expect(d.querySelector('main')?.textContent).toContain(AI_NOTE);
    expect(d.querySelectorAll('#sources + ol li')).toHaveLength(3);
    // One post: nothing before or after it.
    expect(d.querySelector('nav[aria-label="More posts"]')).toBeNull();
    expect(d.querySelector('main a[href="/blog/"]')).not.toBeNull();

    // Head: canonical, previews, feed, structured data.
    const canonical = 'https://souravsharma.in/blog/what-trusted-types-stop/';
    expect(d.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(canonical);
    expect(meta(d, 'description')).toMatch(/^A plain-language look/);
    expect(meta(d, 'og:type')).toBe('article');
    expect(meta(d, 'og:url')).toBe(canonical);
    expect(meta(d, 'og:image')).toBe('https://souravsharma.in/og-image.png');
    expect(meta(d, 'article:published_time')).toBe('2026-11-24');
    expect(d.querySelector('link[rel="alternate"]')?.getAttribute('href')).toBe(
      'https://souravsharma.in/blog/feed.xml',
    );
    const [ld] = jsonLd(d);
    expect(ld).toMatchObject({
      '@type': 'BlogPosting',
      headline: "Trusted Types: what they stop, and what they don't",
      datePublished: '2026-11-24',
      dateModified: '2026-11-24',
      author: { '@id': 'https://souravsharma.in/#person', name: 'Sourav Sharma' },
      publisher: { '@id': 'https://souravsharma.in/#person' },
      mainEntityOfPage: { '@id': canonical },
      url: canonical,
    });
    expect(JSON.stringify(ld)).not.toMatch(/\bAI\b.*author|author.*\bAI\b/);

    // The frame: the built head is kept, the home page's own head and script are not.
    expect(html).toContain('<meta name="theme-color" content="#ffffff" />');
    expect(html).toContain("localStorage.getItem('ss_theme')");
    expect(html).toContain('<link rel="icon" href="/favicon.svg"');
    expect(html).toContain('<script type="module" crossorigin src="/assets/blog-abc.js"></script>');
    expect(html).toContain('<link rel="modulepreload" crossorigin href="/assets/react-abc.js">');
    expect(html).not.toContain('/src/main.tsx');
    expect(html).not.toContain('og:type" content="profile"');
    expect(html).not.toMatch(/\{\{\w+\}\}/);
    expect(html).not.toMatch(/\sstyle="/);
    // The hydrated header sits on its own; the article is static.
    expect(d.querySelector('#root > div > header nav a[href="/blog/"]')).not.toBeNull();
    expect(d.querySelector('#root > div > header a[href="/#about"]')).not.toBeNull();
  });

  it('links three posts to each other and filters by tag', () => {
    const out = build(FIXTURE_DIR);
    const list = out.doc('blog/index.html');
    expect([...list.querySelectorAll('main li h2')].map((h) => h.textContent)).toEqual([
      "Trusted Types: what they stop, and what they don't",
      'Gutenberg’s press and the falling cost of a copy',
      'Prerendering a React page without a framework',
    ]);
    const filter = list.querySelector('nav[aria-label="Filter by tag"]');
    expect([...(filter?.querySelectorAll('a') ?? [])].map((a) => a.textContent)).toEqual([
      'All',
      'Frontend',
      'Web Platform',
      'History',
      'Security',
      'Inventions',
    ]);
    expect(filter?.querySelector('[aria-current="page"]')?.textContent).toBe('All');
    expect(jsonLd(list)[0]?.['@graph']).toMatchObject([
      { '@type': 'Blog' },
      { '@type': 'CollectionPage' },
    ]);

    const tag = out.doc('blog/tag/web-platform/index.html');
    expect(tag.querySelectorAll('main li h2')).toHaveLength(2);
    expect(tag.querySelector('h1')?.textContent).toBe('Web Platform');
    expect(
      tag.querySelector('nav[aria-label="Filter by tag"] [aria-current="page"]')?.textContent,
    ).toBe('Web Platform');
    expect(tag.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://souravsharma.in/blog/tag/web-platform/',
    );

    const middle = out.doc('blog/gutenberg-and-the-cost-of-a-copy/index.html');
    expect(middle.querySelector('a[rel="prev"]')?.getAttribute('href')).toBe(
      '/blog/prerendering-react-without-a-framework/',
    );
    expect(middle.querySelector('a[rel="next"]')?.getAttribute('href')).toBe(
      '/blog/what-trusted-types-stop/',
    );
    // aiAssisted: false, so no note.
    const human = out.doc('blog/prerendering-react-without-a-framework/index.html');
    expect(human.querySelector('main')?.textContent).not.toContain(AI_NOTE);
    expect(human.querySelector('table')?.innerHTML).toContain('class="align-left"');

    for (const slug of ['what-trusted-types-stop', 'gutenberg-and-the-cost-of-a-copy']) {
      expect(out.sitemap).toContain(`<loc>https://souravsharma.in/blog/${slug}/</loc>`);
    }
    expect(out.sitemap).toContain(
      '<url>\n    <loc>https://souravsharma.in/blog/tag/history/</loc>\n    <lastmod>2026-11-17</lastmod>',
    );
  });

  it('keeps the feed to the 20 newest posts, absolute and escaped', () => {
    const files: Record<string, string> = {};
    for (let i = 1; i <= 25; i++) {
      const day = `2026-10-${String(i).padStart(2, '0')}`;
      files[`${day}-post-${i}.md`] = postText({
        date: day,
        title: `'Post ${i}: Tom & Jerry "quoted" <b>'`,
      });
    }
    const out = build(contentDir(files));
    const feed = out.xml('blog/feed.xml');
    expect(feed.querySelector('parsererror')).toBeNull();
    const items = [...feed.querySelectorAll('item')];
    expect(items).toHaveLength(20);
    expect(items[0]?.querySelector('title')?.textContent).toBe('Post 25: Tom & Jerry "quoted" <b>');
    expect(items[0]?.querySelector('link')?.textContent).toBe(
      'https://souravsharma.in/blog/post-25/',
    );
    expect(items[0]?.querySelector('pubDate')?.textContent).toBe('Sat, 24 Oct 2026 20:00:00 GMT');
    expect(items[19]?.querySelector('title')?.textContent).toMatch(/^Post 6:/);
    expect(out.file('blog/feed.xml')).toContain('Tom &amp; Jerry &quot;quoted&quot; &lt;b&gt;');
    // Every post still gets its page and sitemap entry.
    expect(out.paths.filter((p) => /^blog\/post-\d+\/index\.html$/.test(p))).toHaveLength(25);
    expect(out.sitemap.match(/\/blog\/post-\d+\//g)).toHaveLength(25);
    // The title is escaped in the page head and body too.
    const page = out.file('blog/post-25/index.html');
    expect(page).toContain(
      '<title>Post 25: Tom &amp; Jerry &quot;quoted&quot; &lt;b&gt; — Sourav Sharma</title>',
    );
    expect(page).not.toContain('<b>');
  });

  it('builds nothing when publishing is off', () => {
    const out = build(FIXTURE_DIR, { publishing: false });
    expect(out.files).toEqual([]);
    expect(out.sitemap).toBe('');
  });

  it('hides the AI note when aiNote is off', () => {
    const out = build(FIXTURE_DIR, { aiNote: false });
    const d = out.doc('blog/what-trusted-types-stop/index.html');
    expect(d.querySelector('main')?.textContent).not.toContain(AI_NOTE);
  });

  it('never lets a post body close the structured data block', () => {
    const out = build(
      contentDir({
        '2026-11-20-x.md': postText({
          description: "'A description with </script> in it, long enough to pass the rule.'",
        }),
      }),
    );
    const html = out.file('blog/x/index.html');
    expect(html.match(/<\/script>/g)?.length).toBe(html.match(/<script/g)?.length);
    expect(jsonLd(out.doc('blog/x/index.html'))[0]?.['description']).toContain('</script>');
  });
});

describe('shell', () => {
  it('finds the entry and its imports in the build manifest', () => {
    expect(
      entryAssets(
        {
          'src/blog/client.tsx': { file: 'assets/blog-1.js', isEntry: true, imports: ['_site'] },
          _site: { file: 'assets/site-1.js', imports: ['_react'] },
          _react: { file: 'assets/react-1.js' },
        },
        'src/blog/client.tsx',
      ),
    ).toEqual({
      script: '/assets/blog-1.js',
      preloads: ['/assets/site-1.js', '/assets/react-1.js'],
    });
    expect(() => entryAssets({}, 'src/blog/client.tsx')).toThrow(/not an entry/);
  });

  it('refuses a page without the markers it relies on', () => {
    expect(() => createShell('<html></html>', { script: '/a.js', preloads: [] })).toThrow(/Search/);
  });

  it('adds the feed link to the home page head', () => {
    const home = addFeedLink(INDEX_HTML);
    expect(home).toContain(
      '<link rel="alternate" type="application/rss+xml" title="Sourav Sharma — Blog" href="https://souravsharma.in/blog/feed.xml" />',
    );
  });
});
