/**
 * The blog's fixed vocabulary and URL scheme. Safe to import from the browser
 * bundle: constants and pure helpers only.
 */

export const SITE_URL = 'https://souravsharma.in';
export const AUTHOR = 'Sourav Sharma';

export const TAGS = [
  'AI',
  'Research',
  'Frontend',
  'Web Platform',
  'History',
  'Future',
  'Security',
  'Inventions',
] as const;
export type Tag = (typeof TAGS)[number];

export const LIMITS = {
  TITLE_MAX: 90,
  DESCRIPTION_MIN: 50,
  DESCRIPTION_MAX: 160,
  TAGS_MIN: 1,
  TAGS_MAX: 4,
  SOURCES_MIN: 2,
  WORDS_MIN: 300,
  WORDS_MAX: 1500,
  SLUG_MAX: 80,
  /** Posts in the RSS feed. */
  FEED_ITEMS: 20,
  /** Posts on the home page. */
  LATEST: 3,
} as const;

/** Words per minute, for "4 min read". */
export const READING_SPEED = 230;

export interface Source {
  title: string;
  url: string;
}

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  /** YYYY-MM-DD, the day of publication in Dubai. */
  date: string;
  tags: Tag[];
  sources: Source[];
  aiAssisted: boolean;
}

export interface Post extends PostMeta {
  /** File name inside the content directory. */
  file: string;
  /** The rendered body. Built from Markdown with raw HTML disabled. */
  html: string;
  words: number;
  readingMinutes: number;
}

/** content/blog/config.json */
export interface BlogConfig {
  /** Kill switch: false builds the site with no blog at all. */
  publishing: boolean;
  /** Show the "researched and drafted with AI" note on AI-assisted posts. */
  aiNote: boolean;
}

/** What the browser bundle knows about the blog: the header link and the home page cards. */
export type PostTeaser = Pick<PostMeta, 'slug' | 'title' | 'description' | 'date' | 'tags'>;

export interface BlogSite {
  publishing: boolean;
  latest: PostTeaser[];
}

export const isTag = (value: string): value is Tag => (TAGS as readonly string[]).includes(value);

export const tagSlug = (tag: Tag): string => tag.toLowerCase().replace(/\s+/g, '-');

export const BLOG_PATH = '/blog/';
export const FEED_PATH = '/blog/feed.xml';
export const postPath = (slug: string): string => `/blog/${slug}/`;
export const tagPath = (tag: Tag): string => `/blog/tag/${tagSlug(tag)}/`;
export const absolute = (path: string): string => `${SITE_URL}${path}`;

/** A link that leaves the site, so it gets rel="noopener noreferrer". */
export function isExternal(href: string): boolean {
  try {
    return new URL(href, `${SITE_URL}/`).origin !== SITE_URL;
  } catch {
    return true;
  }
}

/** "https://www.example.com/a/b" → "example.com" */
export function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** "2026-11-20" → "20 November 2026", the same on every machine and in every time zone. */
export function formatDate(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  return `${d} ${MONTHS[(m ?? 1) - 1]} ${y}`;
}
