/**
 * The page-specific <head> of each blog page: title, description, canonical
 * URL, link previews and structured data. Build time only.
 */
import {
  absolute,
  AUTHOR,
  BLOG_PATH,
  FEED_PATH,
  postPath,
  SITE_URL,
  tagPath,
  type Post,
  type Tag,
} from './schema';

const OG_IMAGE = {
  url: `${SITE_URL}/og-image.png`,
  width: 1200,
  height: 630,
  alt: 'Sourav Sharma, Senior Frontend Engineer, Dubai',
};
const PERSON = {
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: AUTHOR,
  url: `${SITE_URL}/`,
};
const BLOG_ID = `${absolute(BLOG_PATH)}#blog`;
export const BLOG_TITLE = `${AUTHOR} — Blog`;
export const BLOG_DESCRIPTION =
  'Short, sourced notes by Sourav Sharma, a senior frontend engineer in Dubai, on the web platform, frontend engineering, AI, security and the history of inventions.';

/** Escapes text for HTML text and double-quoted attribute values. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** JSON for a <script type="application/ld+json"> block: nothing in it can close the element. */
export function jsonLd(data: unknown): string {
  const json = JSON.stringify(data, null, 2)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
  return `<script type="application/ld+json">\n${json.replace(/^/gm, '  ')}\n  </script>`;
}

export const feedLink = (): string =>
  `<link rel="alternate" type="application/rss+xml" title="${escapeHtml(BLOG_TITLE)}" href="${absolute(FEED_PATH)}" />`;

interface HeadOptions {
  title: string;
  description: string;
  path: string;
  type: 'website' | 'article';
  extraMeta?: [string, string][];
  structured: unknown;
}

function head({ title, description, path, type, extraMeta = [], structured }: HeadOptions): string {
  const url = absolute(path);
  const meta = (attr: 'name' | 'property', key: string, value: string) =>
    `<meta ${attr}="${key}" content="${escapeHtml(value)}" />`;
  return (
    [
      '<!-- Search -->',
      `<title>${escapeHtml(title)}</title>`,
      meta('name', 'description', description),
      meta('name', 'author', AUTHOR),
      meta('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large'),
      `<link rel="canonical" href="${url}" />`,
      feedLink(),
      '',
      '<!-- Link previews -->',
      meta('property', 'og:type', type),
      meta('property', 'og:url', url),
      meta('property', 'og:site_name', AUTHOR),
      meta('property', 'og:locale', 'en_GB'),
      meta('property', 'og:title', title),
      meta('property', 'og:description', description),
      meta('property', 'og:image', OG_IMAGE.url),
      meta('property', 'og:image:type', 'image/png'),
      meta('property', 'og:image:width', String(OG_IMAGE.width)),
      meta('property', 'og:image:height', String(OG_IMAGE.height)),
      meta('property', 'og:image:alt', OG_IMAGE.alt),
      ...extraMeta.map(([k, v]) => meta('property', k, v)),
      meta('name', 'twitter:card', 'summary_large_image'),
      '',
      '<!-- Structured data -->',
      jsonLd(structured),
    ]
      .map((line) => (line ? `  ${line}` : ''))
      .join('\n')
      // The frame keeps the text before <!-- Search --> and from <!-- Icons --> on.
      .trimStart()
      .concat('\n\n  ')
  );
}

const postRef = (p: Post) => ({
  '@type': 'BlogPosting',
  '@id': `${absolute(postPath(p.slug))}#post`,
  headline: p.title,
  url: absolute(postPath(p.slug)),
  datePublished: p.date,
});

export function listHead(posts: Post[]): string {
  return head({
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    path: BLOG_PATH,
    type: 'website',
    structured: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Blog',
          '@id': BLOG_ID,
          name: BLOG_TITLE,
          description: BLOG_DESCRIPTION,
          url: absolute(BLOG_PATH),
          inLanguage: 'en',
          author: PERSON,
          publisher: PERSON,
          isPartOf: { '@id': `${SITE_URL}/#website` },
          blogPost: posts.map(postRef),
        },
        {
          '@type': 'CollectionPage',
          '@id': `${absolute(BLOG_PATH)}#page`,
          name: BLOG_TITLE,
          url: absolute(BLOG_PATH),
          mainEntity: { '@id': BLOG_ID },
          isPartOf: { '@id': `${SITE_URL}/#website` },
          inLanguage: 'en',
        },
      ],
    },
  });
}

export function tagHead(tag: Tag, posts: Post[]): string {
  const path = tagPath(tag);
  const title = `${tag} — ${BLOG_TITLE}`;
  const description = `Posts tagged ${tag} on the blog of Sourav Sharma, senior frontend engineer in Dubai: short, sourced notes, newest first.`;
  return head({
    title,
    description,
    path,
    type: 'website',
    structured: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${absolute(path)}#page`,
      name: title,
      description,
      url: absolute(path),
      about: tag,
      isPartOf: { '@id': BLOG_ID },
      inLanguage: 'en',
      hasPart: posts.map(postRef),
    },
  });
}

export function postHead(post: Post): string {
  const url = absolute(postPath(post.slug));
  return head({
    title: `${post.title} — ${AUTHOR}`,
    description: post.description,
    path: postPath(post.slug),
    type: 'article',
    extraMeta: [
      ['article:published_time', post.date],
      ['article:modified_time', post.date],
      ['article:author', `${SITE_URL}/`],
      ...post.tags.map((t): [string, string] => ['article:tag', t]),
    ],
    structured: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `${url}#post`,
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.date,
      author: PERSON,
      publisher: PERSON,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      url,
      image: OG_IMAGE.url,
      isPartOf: { '@id': BLOG_ID },
      inLanguage: 'en',
      keywords: post.tags.join(', '),
      wordCount: post.words,
      citation: post.sources.map((s) => ({ '@type': 'CreativeWork', name: s.title, url: s.url })),
    },
  });
}
