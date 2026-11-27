// scripts/blog-check.mjs end to end: the exit code is what fails the build.
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { contentDir, FIXTURE_DIR, postText } from '../test/blog';

const ROOT = resolve(__dirname, '../..');

function check(dir: string) {
  const r = spawnSync(process.execPath, ['scripts/blog-check.mjs'], {
    cwd: ROOT,
    env: { ...process.env, BLOG_CONTENT_DIR: dir },
    encoding: 'utf8',
  });
  return { code: r.status, out: `${r.stdout}${r.stderr}` };
}

describe('npm run blog:check', () => {
  it('passes valid content and lists the posts', () => {
    const { code, out } = check(FIXTURE_DIR);
    expect(code).toBe(0);
    expect(out).toContain('3 post(s)');
    expect(out).toContain('what-trusted-types-stop');
  }, 30_000);

  it('passes the blog content in the repository, however many posts it has', () => {
    const { code, out } = check('content/blog');
    expect(code).toBe(0);
    expect(out).toMatch(/\d+ post\(s\) in content\/blog/);
  }, 30_000);

  it('fails, listing every problem, on invalid content', () => {
    const dir = contentDir({
      '2026-11-20-one.md': postText({ body: 'Too short, and <b>raw</b>.' }),
      '2026-11-21-two.md': postText({ date: '2026-11-21', tags: '[Cooking]' }),
    });
    const { code, out } = check(dir);
    expect(code).toBe(1);
    expect(out).toMatch(/2026-11-20-one\.md: line \d+: raw HTML/);
    expect(out).toMatch(/2026-11-20-one\.md: body has \d+ words/);
    expect(out).toContain('2026-11-21-two.md: unknown tag "Cooking"');
  }, 30_000);
});
