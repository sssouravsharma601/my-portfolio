/** RSS 2.0 feed and sitemap entries for the blog. Build time only. */
import { BLOG_DESCRIPTION, BLOG_TITLE } from './head';
import {
  absolute,
  AUTHOR,
  BLOG_PATH,
  FEED_PATH,
  LIMITS,
  postPath,
  tagPath,
  TAGS,
  type Post,
} from './schema';

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** A post's day as an RFC 822 date: midnight in Dubai, where it was published. */
export const rfc822 = (date: string): string => new Date(`${date}T00:00:00+04:00`).toUTCString();

/** The 20 newest posts. `posts` is newest first; `buildDate` dates an empty feed. */
export function rss(posts: Post[], buildDate: string): string {
  const items = posts.slice(0, LIMITS.FEED_ITEMS).map((p) => {
    const url = absolute(postPath(p.slug));
    return [
      '    <item>',
      `      <title>${escapeXml(p.title)}</title>`,
      `      <link>${escapeXml(url)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
      `      <pubDate>${rfc822(p.date)}</pubDate>`,
      `      <description>${escapeXml(p.description)}</description>`,
      ...p.tags.map((t) => `      <category>${escapeXml(t)}</category>`),
      '    </item>',
    ].join('\n');
  });
  const updated = posts[0]?.date ?? buildDate;
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(BLOG_TITLE)}</title>`,
    `    <link>${escapeXml(absolute(BLOG_PATH))}</link>`,
    `    <atom:link href="${escapeXml(absolute(FEED_PATH))}" rel="self" type="application/rss+xml" />`,
    `    <description>${escapeXml(BLOG_DESCRIPTION)}</description>`,
    '    <language>en</language>',
    `    <copyright>© ${updated.slice(0, 4)} ${escapeXml(AUTHOR)}</copyright>`,
    `    <lastBuildDate>${rfc822(updated)}</lastBuildDate>`,
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}

/** <url> entries for every blog page; lastmod is the newest post each page shows. */
export function sitemapEntries(posts: Post[], buildDate: string): string {
  const entry = (path: string, lastmod: string) =>
    `  <url>\n    <loc>${escapeXml(absolute(path))}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
  const entries = [entry(BLOG_PATH, posts[0]?.date ?? buildDate)];
  for (const tag of TAGS) {
    const newest = posts.find((p) => p.tags.includes(tag));
    if (newest) entries.push(entry(tagPath(tag), newest.date));
  }
  for (const p of posts) entries.push(entry(postPath(p.slug), p.date));
  return `${entries.join('\n')}\n`;
}
