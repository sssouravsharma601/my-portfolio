/**
 * Reads the blog from disk: content/blog by default, or the directory in
 * BLOG_CONTENT_DIR (tests and fixture builds). Build time only.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { LIMITS, type BlogConfig, type BlogSite, type Post } from './schema';
import { checkPost, dubaiToday } from './validate';

export const DEFAULT_CONTENT_DIR = 'content/blog';
/** The browser entry of blog pages (a second build input next to index.html). */
export const BLOG_ENTRY = 'src/blog/client.tsx';

export function contentDir(root: string = process.cwd()): string {
  return resolve(root, process.env['BLOG_CONTENT_DIR'] ?? DEFAULT_CONTENT_DIR);
}

export interface Blog {
  dir: string;
  config: BlogConfig;
  /** Newest first. */
  posts: Post[];
  /** Every problem found, each prefixed with its file. Empty means the content is valid. */
  errors: string[];
}

/** Files that live in the content directory but are not posts. */
const NOT_POSTS = new Set(['README.md', 'config.json']);

function readConfig(dir: string, errors: string[]): BlogConfig {
  const fallback: BlogConfig = { publishing: false, aiNote: true };
  const file = join(dir, 'config.json');
  if (!existsSync(file)) {
    errors.push('config.json: missing');
    return fallback;
  }
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    errors.push(`config.json: not valid JSON (${(e as Error).message})`);
    return fallback;
  }
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    errors.push('config.json: must be an object');
    return fallback;
  }
  const config = raw as Record<string, unknown>;
  const problems: string[] = [];
  for (const key of Object.keys(config)) {
    if (key !== 'publishing' && key !== 'aiNote') problems.push(`unknown key "${key}"`);
  }
  for (const key of ['publishing', 'aiNote']) {
    if (typeof config[key] !== 'boolean') problems.push(`"${key}" must be true or false`);
  }
  errors.push(...problems.map((p) => `config.json: ${p}`));
  if (problems.length) return fallback;
  return { publishing: config['publishing'] as boolean, aiNote: config['aiNote'] as boolean };
}

export function loadBlog(dir: string = contentDir(), today: string = dubaiToday()): Blog {
  const errors: string[] = [];
  if (!existsSync(dir) || !statSync(dir).isDirectory()) {
    return {
      dir,
      config: { publishing: false, aiNote: true },
      posts: [],
      errors: [`${dir}: content directory not found`],
    };
  }

  const config = readConfig(dir, errors);
  const posts: Post[] = [];
  const bySlug = new Map<string, string>();

  for (const file of readdirSync(dir).sort()) {
    if (file.startsWith('.') || NOT_POSTS.has(file)) continue;
    if (!file.endsWith('.md') || !statSync(join(dir, file)).isFile()) {
      errors.push(
        `${file}: unexpected file; the directory holds posts (.md), README.md and config.json`,
      );
      continue;
    }
    const { post, errors: problems } = checkPost(
      file,
      readFileSync(join(dir, file), 'utf8'),
      today,
    );
    errors.push(...problems.map((p) => `${file}: ${p}`));
    if (!post) continue;
    const other = bySlug.get(post.slug);
    if (other) {
      errors.push(`${file}: duplicate slug "${post.slug}" (also used by ${other})`);
      continue;
    }
    bySlug.set(post.slug, file);
    posts.push(post);
  }

  posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
  return { dir, config, posts, errors };
}

/** The part of the blog the browser bundle needs. Nothing when publishing is off. */
export function blogSite(blog: Pick<Blog, 'config' | 'posts'>): BlogSite {
  if (!blog.config.publishing) return { publishing: false, latest: [] };
  return {
    publishing: true,
    latest: blog.posts.slice(0, LIMITS.LATEST).map(({ slug, title, description, date, tags }) => ({
      slug,
      title,
      description,
      date,
      tags,
    })),
  };
}
