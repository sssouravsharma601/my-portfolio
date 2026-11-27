/**
 * The blog's part of scripts/prerender.mjs, run from the SSR build: reads and
 * checks the content, then renders every blog file from the built
 * dist/index.html and the build manifest. The script writes the files.
 */
import type { Manifest } from 'vite';
import { generateBlog, type GeneratedFile } from './generate';
import { BLOG_ENTRY, loadBlog } from './load';
import { addFeedLink, createShell, entryAssets } from './shell';

export interface PrerenderedBlog {
  publishing: boolean;
  posts: number;
  files: GeneratedFile[];
  /** <url> entries for sitemap.xml. */
  sitemap: string;
  /** Finishes the home page's HTML: the feed link, when the blog is published. */
  home: (html: string) => string;
}

export function prerenderBlog(indexHtml: string, manifest: Manifest): PrerenderedBlog {
  const blog = loadBlog();
  if (blog.errors.length) {
    throw new Error(
      `blog: the content has problems (npm run blog:check):\n${blog.errors.join('\n')}`,
    );
  }
  if (!blog.config.publishing) {
    return { publishing: false, posts: 0, files: [], sitemap: '', home: (html) => html };
  }
  const shell = createShell(indexHtml, entryAssets(manifest, BLOG_ENTRY));
  const { files, sitemap } = generateBlog({
    config: blog.config,
    posts: blog.posts,
    shell,
    buildDate: __BUILD_DATE__,
  });
  return { publishing: true, posts: blog.posts.length, files, sitemap, home: addFeedLink };
}
