/**
 * The browser entry for blog pages. A blog page is static HTML; only the
 * header (theme switch, menu, command palette) is hydrated.
 */
import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import BlogHeader from './BlogHeader';
import { bustFrames } from '../utils/frameGuard';
// The site has one stylesheet (build.cssCodeSplit is off), so this entry adds
// the blog's styles to it, after globals.css; the island class is what ties
// the static markup, rendered with the same class names, to this script.
import styles from './Blog.module.css';

bustFrames();

const island = document.querySelector(`.${styles.island}`);
if (island) {
  hydrateRoot(
    island,
    <StrictMode>
      <BlogHeader />
    </StrictMode>,
  );
}
