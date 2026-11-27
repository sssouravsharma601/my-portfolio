import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  contentDir as tempDir,
  FIXTURE_DIR,
  FIXTURE_POSTS,
  fixtureCopy,
  postText,
} from '../test/blog';
import { blogSite, contentDir, DEFAULT_CONTENT_DIR, loadBlog } from './load';

const TODAY = '2026-11-27';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('loadBlog', () => {
  it('reads the three-post fixture, newest first', () => {
    const blog = loadBlog(FIXTURE_DIR, TODAY);
    expect(blog.errors).toEqual([]);
    expect(blog.config).toEqual({ publishing: true, aiNote: true });
    expect(blog.posts.map((p) => p.date)).toEqual(['2026-11-24', '2026-11-17', '2026-11-10']);
    expect(blog.posts.map((p) => p.file)).toEqual(FIXTURE_POSTS);
  });

  it('reads a single post', () => {
    const blog = loadBlog(fixtureCopy([FIXTURE_POSTS[1] ?? '']), TODAY);
    expect(blog.errors).toEqual([]);
    expect(blog.posts).toHaveLength(1);
    expect(blog.posts[0]?.slug).toBe('gutenberg-and-the-cost-of-a-copy');
  });

  it('reads an empty blog: config.json and a README only', () => {
    const blog = loadBlog(tempDir({ 'README.md': '# Not a post\n<b>anything</b>' }), TODAY);
    expect(blog).toMatchObject({ errors: [], posts: [] });
  });

  it('rejects duplicate slugs', () => {
    const dir = tempDir({
      '2026-11-20-same.md': postText(),
      '2026-11-21-same.md': postText({ date: '2026-11-21' }),
    });
    expect(loadBlog(dir, TODAY).errors).toEqual([
      '2026-11-21-same.md: duplicate slug "same" (also used by 2026-11-20-same.md)',
    ]);
  });

  it('prefixes every problem with its file and keeps the valid posts', () => {
    const dir = tempDir({
      '2026-11-20-good.md': postText(),
      '2026-11-21-bad.md': postText({ date: '2026-11-21', tags: '[Nope]' }),
      'notes.txt': 'stray',
    });
    const blog = loadBlog(dir, TODAY);
    expect(blog.posts.map((p) => p.slug)).toEqual(['good']);
    expect(blog.errors).toEqual([
      '2026-11-21-bad.md: unknown tag "Nope"',
      'notes.txt: unexpected file; the directory holds posts (.md), README.md and config.json',
    ]);
  });

  it('checks config.json', () => {
    expect(loadBlog(tempDir({}, null), TODAY).errors).toEqual(['config.json: missing']);
    expect(
      loadBlog(tempDir({}, { publishing: 'yes', aiNote: true, extra: 1 }), TODAY).errors,
    ).toEqual([
      'config.json: unknown key "extra"',
      'config.json: "publishing" must be true or false',
    ]);
    expect(loadBlog('/nonexistent/blog', TODAY).errors[0]).toMatch(/not found/);
  });

  it('takes the directory from BLOG_CONTENT_DIR', () => {
    expect(contentDir('/repo')).toBe(`/repo/${DEFAULT_CONTENT_DIR}`);
    vi.stubEnv('BLOG_CONTENT_DIR', 'src/test/fixtures/blog');
    expect(contentDir('/repo')).toBe('/repo/src/test/fixtures/blog');
  });
});

describe('blogSite', () => {
  it('gives the browser the three newest posts, without bodies', () => {
    const dir = tempDir(
      Object.fromEntries(
        [10, 11, 12, 13].map((d) => [
          `2026-11-${d}-post-${d}.md`,
          postText({ date: `2026-11-${d}` }),
        ]),
      ),
    );
    const site = blogSite(loadBlog(dir, TODAY));
    expect(site.publishing).toBe(true);
    expect(site.latest.map((p) => p.slug)).toEqual(['post-13', 'post-12', 'post-11']);
    expect(Object.keys(site.latest[0] ?? {}).sort()).toEqual([
      'date',
      'description',
      'slug',
      'tags',
      'title',
    ]);
  });

  it('is empty when publishing is off', () => {
    const blog = loadBlog(fixtureCopy(FIXTURE_POSTS, { publishing: false, aiNote: true }), TODAY);
    expect(blog.posts).toHaveLength(3);
    expect(blogSite(blog)).toEqual({ publishing: false, latest: [] });
  });
});
