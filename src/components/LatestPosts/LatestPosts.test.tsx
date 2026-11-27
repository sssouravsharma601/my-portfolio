import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import LatestPosts from '.';
import type { PostTeaser } from '../../blog/schema';

const post = (n: number): PostTeaser => ({
  slug: `post-${n}`,
  title: `Post number ${n}`,
  description: `What post ${n} is about, in a sentence or two.`,
  date: `2026-11-0${n}`,
  tags: ['Frontend'],
});

describe('LatestPosts', () => {
  it('renders nothing without posts', () => {
    const { container } = render(<LatestPosts posts={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('links to each post and to the list', () => {
    render(<LatestPosts posts={[post(3), post(2), post(1)]} />);
    const section = screen.getByRole('region', { name: 'Latest from the blog' });
    const links = within(section).getAllByRole('link');
    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      '/blog/post-3/',
      '/blog/post-2/',
      '/blog/post-1/',
      '/blog/',
    ]);
    expect(within(section).getByText('3 November 2026')).toHaveAttribute('datetime', '2026-11-03');
  });
});
