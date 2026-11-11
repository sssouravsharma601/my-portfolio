import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { roles } from './data/profile';

beforeAll(() => {
  // jsdom has no matchMedia
  window.matchMedia ??= ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
});

describe('App', () => {
  it('renders every section with a reachable heading', () => {
    render(<App />);
    // The name is the page's primary heading: it is what people search for.
    expect(screen.getByRole('heading', { level: 1, name: 'Sourav Sharma' })).toHaveTextContent(
      'Sourav Sharma',
    );
    for (const name of ['About', 'Experience', 'Toolkit']) {
      expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument();
    }
    expect(screen.getByRole('heading', { level: 2, name: /let’s talk/i })).toBeInTheDocument();
  });

  it('lists every role, current one first and marked', () => {
    render(<App />);
    const work = document.getElementById('work');
    expect(work).not.toBeNull();
    const items = within(work as HTMLElement)
      .getAllByRole('listitem')
      .filter((li) => li.querySelector('h3'));
    expect(items).toHaveLength(roles.length);
    expect(items[0]).toHaveTextContent('Now');
    expect(items[0]).toHaveTextContent('Present');
  });

  it('toggles and persists the theme', async () => {
    render(<App />);
    const btn = screen.getByRole('button', { name: /switch to dark theme/i });
    await userEvent.click(btn);
    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(localStorage.getItem('ss_theme')).toBe('dark');
    expect(screen.getByRole('button', { name: /switch to light theme/i })).toBeInTheDocument();
  });

  it('shows inline validation errors and focuses the first invalid field', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /send message/i }));
    const name = screen.getByLabelText('Name');
    expect(name).toHaveAttribute('aria-invalid', 'true');
    expect(name).toHaveFocus();
  });
});
