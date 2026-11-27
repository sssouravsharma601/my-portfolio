/**
 * Every file the blog adds to dist/: the list, one page per tag in use, one
 * page per post and the RSS feed, plus the sitemap entries. Build time only;
 * scripts/prerender.mjs writes the result.
 */
import { StrictMode } from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import Footer from '../components/Footer';
import BlogHeader from './BlogHeader';
import styles from './Blog.module.css';
import { rss, sitemapEntries } from './feed';
import { listHead, postHead, tagHead } from './head';
import { ListPage, PostPage } from './pages';
import { TAGS, tagSlug, type BlogConfig, type Post } from './schema';
import type { Shell } from './shell';

export interface GeneratedFile {
  /** Relative to dist/. */
  path: string;
  content: string;
}

export interface GenerateOptions {
  config: BlogConfig;
  /** Newest first, already checked. */
  posts: Post[];
  shell: Shell;
  /** YYYY-MM-DD; dates the list and the feed while there are no posts. */
  buildDate: string;
}

export interface Generated {
  files: GeneratedFile[];
  /** <url> entries to add to sitemap.xml. */
  sitemap: string;
}

export function generateBlog({ config, posts, shell, buildDate }: GenerateOptions): Generated {
  if (!config.publishing) return { files: [], sitemap: '' };

  // The header is hydrated by blog/client.tsx, so it is rendered the same way
  // as the home page; the rest of a blog page is plain static markup.
  const header = renderToString(
    <StrictMode>
      <BlogHeader />
    </StrictMode>,
  );
  const footer = renderToStaticMarkup(<Footer />);
  const page = (head: string, main: string) =>
    shell({ head, body: `<div class="${styles.island}">${header}</div>${main}${footer}` });

  const tags = TAGS.filter((t) => posts.some((p) => p.tags.includes(t)));
  const files: GeneratedFile[] = [
    {
      path: 'blog/index.html',
      content: page(listHead(posts), renderToStaticMarkup(<ListPage posts={posts} tags={tags} />)),
    },
  ];

  for (const tag of tags) {
    const tagged = posts.filter((p) => p.tags.includes(tag));
    files.push({
      path: `blog/tag/${tagSlug(tag)}/index.html`,
      content: page(
        tagHead(tag, tagged),
        renderToStaticMarkup(<ListPage posts={tagged} tags={tags} tag={tag} />),
      ),
    });
  }

  posts.forEach((post, i) => {
    files.push({
      path: `blog/${post.slug}/index.html`,
      content: page(
        postHead(post),
        renderToStaticMarkup(
          <PostPage
            post={post}
            previous={posts[i + 1]}
            next={posts[i - 1]}
            aiNote={config.aiNote}
          />,
        ),
      ),
    });
  });

  files.push({ path: 'blog/feed.xml', content: rss(posts, buildDate) });
  return { files, sitemap: sitemapEntries(posts, buildDate) };
}
