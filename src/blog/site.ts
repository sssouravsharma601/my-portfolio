import type { BlogSite } from './schema';

/**
 * Whether the blog is published, and its newest posts, as of the build.
 * vite.config.ts reads the content directory and defines __BLOG_SITE__; with
 * publishing off it is `{ publishing: false, latest: [] }` and the header,
 * footer, palette and home page show no trace of the blog.
 */
declare const __BLOG_SITE__: BlogSite;

export const blogSite: BlogSite = __BLOG_SITE__;
