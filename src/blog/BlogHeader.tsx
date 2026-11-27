import { ThemeProvider } from '../context/ThemeContext';
import Header from '../components/Header';
import { useSpotlight } from '../hooks/useSpotlight';

/**
 * The site header for blog pages: theme switch, menu and command palette.
 * Rendered to HTML at build time and hydrated by blog/client.tsx; the rest of
 * a blog page is static.
 */
export default function BlogHeader() {
  // One document-level listener, so the post cards get the same soft light as the home page's.
  useSpotlight();
  return (
    <ThemeProvider>
      <Header page="blog" />
    </ThemeProvider>
  );
}
