/** Helpers for the blog tests: valid posts on demand and throwaway content directories. */
import { cpSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach } from 'vitest';

/** The checked-in fixture: config.json and three posts. */
export const FIXTURE_DIR = resolve(__dirname, 'fixtures/blog');
export const FIXTURE_POSTS = [
  '2026-11-24-what-trusted-types-stop.md',
  '2026-11-17-gutenberg-and-the-cost-of-a-copy.md',
  '2026-11-10-prerendering-react-without-a-framework.md',
];

/** A paragraph of ordinary prose, repeated until the body has `words` words. */
export function prose(words: number): string {
  const sentence =
    'The quick reader skims a page of calm text and finds the point without any trouble at all.';
  const parts = sentence.split(' ');
  const out: string[] = [];
  for (let i = 0; i < words; i++) out.push(parts[i % parts.length] ?? 'word');
  return out.join(' ');
}

export interface PostOptions {
  title?: string;
  description?: string;
  date?: string;
  tags?: string;
  sources?: string;
  aiAssisted?: string;
  body?: string;
  extra?: string;
}

/** A post that passes every rule; override any part to break one. */
export function postText(o: PostOptions = {}): string {
  const lines = [
    '---',
    `title: ${o.title ?? 'A calm note about the web platform'}`,
    `description: ${o.description ?? 'A short description that is comfortably longer than fifty characters in total.'}`,
    `date: ${o.date ?? '2026-11-20'}`,
    `tags: ${o.tags ?? '[Frontend, Web Platform]'}`,
    'sources:',
    o.sources ??
      [
        '  - title: MDN Web Docs',
        '    url: https://developer.mozilla.org/en-US/',
        '  - title: web.dev',
        '    url: https://web.dev/',
      ].join('\n'),
    `aiAssisted: ${o.aiAssisted ?? 'true'}`,
    ...(o.extra ? [o.extra] : []),
    '---',
    '',
    o.body ?? `## First part\n\n${prose(320)}\n`,
  ];
  return lines.join('\n');
}

const dirs: string[] = [];
afterEach(() => {
  for (const d of dirs.splice(0)) rmSync(d, { recursive: true, force: true });
});

/** A temporary content directory, removed after the test. */
export function contentDir(
  files: Record<string, string>,
  config: unknown = { publishing: true, aiNote: true },
): string {
  const dir = mkdtempSync(join(tmpdir(), 'blog-test-'));
  dirs.push(dir);
  if (config !== null) writeFileSync(join(dir, 'config.json'), JSON.stringify(config));
  for (const [name, text] of Object.entries(files)) writeFileSync(join(dir, name), text);
  return dir;
}

/** A temporary copy of some of the fixture posts. */
export function fixtureCopy(posts: string[], config?: unknown): string {
  const dir = contentDir({}, config);
  for (const p of posts) cpSync(join(FIXTURE_DIR, p), join(dir, p));
  return dir;
}
