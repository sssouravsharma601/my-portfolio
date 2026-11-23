import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../Header';
import { ThemeProvider } from '../../context/ThemeContext';
import { profile } from '../../data/profile';
import { downloadResume } from '../../resume/download';

vi.mock('../../resume/download', () => ({ downloadResume: vi.fn().mockResolvedValue(undefined) }));

beforeAll(() => {
  // jsdom does no layout, so it has no scrollIntoView.
  if (!('scrollIntoView' in Element.prototype)) {
    Object.defineProperty(Element.prototype, 'scrollIntoView', {
      configurable: true,
      writable: true,
      value: () => undefined,
    });
  }
  // jsdom has <dialog> but not its modal methods.
  const proto = HTMLDialogElement.prototype;
  if (!('showModal' in proto)) {
    Object.defineProperty(proto, 'showModal', {
      configurable: true,
      value(this: HTMLDialogElement) {
        this.setAttribute('open', '');
      },
    });
  }
  if (!('close' in proto)) {
    Object.defineProperty(proto, 'close', {
      configurable: true,
      value(this: HTMLDialogElement) {
        this.removeAttribute('open');
        this.dispatchEvent(new Event('close'));
      },
    });
  }
});

function setup() {
  const user = userEvent.setup();
  render(
    <ThemeProvider>
      <Header />
    </ThemeProvider>,
  );
  // A closed <dialog> is not in the accessibility tree, so find it directly.
  const dialog = document.querySelector<HTMLDialogElement>('dialog[aria-label="Command palette"]');
  if (!dialog) throw new Error('command palette dialog not rendered');
  const input = within(dialog).getByRole('combobox', { name: 'Type a command', hidden: true });
  const options = () => within(dialog).queryAllByRole('option', { hidden: true });
  const selected = () => options().find((o) => o.getAttribute('aria-selected') === 'true');
  return { user, dialog, input, options, selected };
}

describe('command palette', () => {
  beforeEach(() => {
    window.location.hash = '';
    localStorage.clear();
    vi.mocked(downloadResume).mockClear();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('opens with Ctrl+K and closes with it again', async () => {
    const { user, dialog } = setup();
    expect(dialog.open).toBe(false);
    await user.keyboard('{Control>}k{/Control}');
    expect(dialog.open).toBe(true);
    await user.keyboard('{Control>}k{/Control}');
    expect(dialog.open).toBe(false);
  });

  it('opens from the header button', async () => {
    const { user, dialog } = setup();
    await user.click(screen.getByRole('button', { name: /open command palette/i }));
    expect(dialog.open).toBe(true);
  });

  it('filters by what is typed and jumps to the chosen section', async () => {
    const { user, dialog, input, options } = setup();
    await user.keyboard('{Control>}k{/Control}');
    await user.type(input, 'tool');
    expect(options().map((o) => o.textContent)).toEqual([expect.stringContaining('Go to Toolkit')]);
    await user.keyboard('{Enter}');
    expect(window.location.hash).toBe('#skills');
    expect(dialog.open).toBe(false);
  });

  it('moves the selection with the arrow keys, wrapping at the ends', async () => {
    const { user, input, options, selected } = setup();
    await user.keyboard('{Control>}k{/Control}');
    await user.click(input);
    expect(selected()).toBe(options()[0]);
    await user.keyboard('{ArrowDown}');
    expect(selected()).toBe(options()[1]);
    await user.keyboard('{ArrowUp}{ArrowUp}');
    expect(selected()).toBe(options()[options().length - 1]);
    expect(input).toHaveAttribute('aria-activedescendant', selected()?.id);
  });

  it('scrolls the option picked with the arrow keys into view, instantly', async () => {
    const scroll = vi.fn();
    vi.spyOn(Element.prototype, 'scrollIntoView').mockImplementation(scroll);
    const { user, input, selected } = setup();
    await user.keyboard('{Control>}k{/Control}');
    await user.click(input);
    await user.keyboard('{ArrowDown}');
    expect(scroll).toHaveBeenCalledTimes(1);
    expect(scroll).toHaveBeenLastCalledWith({ block: 'nearest', behavior: 'instant' });
    expect(scroll.mock.contexts[0]).toBe(selected());
    await user.keyboard('{ArrowUp}{ArrowUp}');
    expect(scroll).toHaveBeenCalledTimes(3);
    expect(scroll.mock.contexts[2]).toBe(selected());
  });

  it('moves focus into the chosen section, not back to the menu button', async () => {
    const { user, dialog, input } = setup();
    const contact = document.createElement('section');
    contact.id = 'contact';
    contact.innerHTML = '<h2>Contact</h2>';
    document.body.append(contact);
    try {
      await user.click(screen.getByRole('button', { name: /open command palette/i }));
      await user.type(input, 'go to contact{Enter}');
      expect(dialog.open).toBe(false);
      expect(window.location.hash).toBe('#contact');
      expect(document.activeElement).toBe(contact);
      expect(contact).toHaveAttribute('tabindex', '-1');
    } finally {
      contact.remove();
    }
  });

  it('says so when nothing matches', async () => {
    const { user, dialog, input, options } = setup();
    await user.keyboard('{Control>}k{/Control}');
    await user.type(input, 'zzz');
    expect(options()).toHaveLength(0);
    expect(within(dialog).getByText('No matching command.')).toBeInTheDocument();
    await user.keyboard('{Enter}');
    expect(dialog.open).toBe(true);
  });

  it('switches the theme', async () => {
    const { user, input } = setup();
    const before = document.documentElement.dataset['theme'];
    await user.keyboard('{Control>}k{/Control}');
    await user.type(input, 'theme{Enter}');
    expect(document.documentElement.dataset['theme']).not.toBe(before);
  });

  it('copies the email address', async () => {
    const { user, input } = setup();
    const write = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
    await user.keyboard('{Control>}k{/Control}');
    await user.type(input, 'copy email{Enter}');
    expect(write).toHaveBeenCalledWith(profile.email);
  });

  it('downloads the résumé', async () => {
    const { user, input } = setup();
    await user.keyboard('{Control>}k{/Control}');
    await user.type(input, 'résumé{Enter}');
    expect(downloadResume).toHaveBeenCalledTimes(1);
  });

  it('opens LinkedIn in a new tab without giving it a handle back', async () => {
    const { user, input } = setup();
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    await user.keyboard('{Control>}k{/Control}');
    await user.type(input, 'linkedin{Enter}');
    expect(open).toHaveBeenCalledWith(profile.linkedin, '_blank', 'noopener,noreferrer');
  });
});
