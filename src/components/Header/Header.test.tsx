import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import Header from '.';
import Footer from '../Footer';
import { ThemeProvider } from '../../context/ThemeContext';
import { blogSite } from '../../blog/site';

// The kill switch: each test sets whether the blog is published.
vi.mock('../../blog/site', () => ({ blogSite: { publishing: true, latest: [] } }));

function setup(page?: 'home' | 'blog') {
  render(
    <ThemeProvider>
      <Header page={page} />
      <Footer />
    </ThemeProvider>,
  );
  const dialog = document.querySelector('dialog');
  if (!dialog) throw new Error('no command palette');
  const commands = within(dialog)
    .queryAllByRole('option', { hidden: true })
    .map((o) => o.textContent);
  return { nav: screen.getByRole('navigation', { name: 'Primary' }), commands };
}

describe('Header and footer: the blog', () => {
  beforeEach(() => {
    blogSite.publishing = true;
  });

  it('link to the blog from the nav, the footer and the palette', () => {
    const { nav, commands } = setup();
    expect(within(nav).getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/blog/');
    expect(screen.getByRole('contentinfo')).toContainElement(
      screen.getAllByRole('link', { name: 'Blog' })[1] ?? null,
    );
    expect(commands).toContain('Go to blog/blog/');
    // On the home page the section links stay in-page.
    expect(within(nav).getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about');
  });

  it('lead back to the home page from a blog page', () => {
    const { nav, commands } = setup('blog');
    expect(within(nav).getByRole('link', { name: 'About' })).toHaveAttribute('href', '/#about');
    expect(within(nav).getByRole('link', { name: 'Blog' })).toHaveAttribute(
      'aria-current',
      'location',
    );
    expect(screen.getByRole('link', { name: 'Sourav Sharma, home' })).toHaveAttribute('href', '/');
    expect(commands).toContain('Go to home page/');
    expect(commands).toContain('Go to About/#about');
  });

  it('show no trace of the blog when publishing is off', () => {
    blogSite.publishing = false;
    const { nav, commands } = setup();
    expect(within(nav).queryByRole('link', { name: 'Blog' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Blog' })).toBeNull();
    expect(commands.some((c) => c?.includes('blog'))).toBe(false);
  });
});
