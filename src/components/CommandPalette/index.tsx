import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { blogSite } from '../../blog/site';
import { BLOG_PATH } from '../../blog/schema';
import { useThemeContext } from '../../context/ThemeContext';
import { profile } from '../../data/profile';
import { downloadResume } from '../../resume/download';
import { focusSection } from '../../utils/focusSection';
import styles from './CommandPalette.module.css';

interface Command {
  id: string;
  label: string;
  hint: string;
  run: () => void;
  /** Section to move focus to once the dialog has closed. */
  target?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  /** Away from the home page, "Go to" commands load it at that section. */
  page?: 'home' | 'blog';
}

const SECTIONS = [
  { id: 'top', label: 'Go to top' },
  { id: 'about', label: 'Go to About' },
  { id: 'cases', label: 'Go to Case studies' },
  { id: 'work', label: 'Go to Experience' },
  { id: 'skills', label: 'Go to Toolkit' },
  { id: 'contact', label: 'Go to Contact' },
];

const openTab = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');
const go = (url: string) => {
  window.location.href = url;
};

/**
 * Keyboard-first navigation: jump to a section, switch theme, copy the email.
 * A native <dialog>, so focus trapping, Esc and the backdrop come for free.
 * On small screens it doubles as the menu.
 */
export default function CommandPalette({ open, onClose, page = 'home' }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  // Closing a modal dialog puts focus back on whatever opened it (the Menu
  // button). For a "Go to" command, focus belongs in the section instead.
  const focusAfterClose = useRef<string | null>(null);
  const { theme, toggle } = useThemeContext();

  const commands = useMemo<Command[]>(
    () => [
      ...SECTIONS.map((s) =>
        page === 'home'
          ? {
              id: s.id,
              label: s.label,
              hint: `#${s.id}`,
              target: s.id,
              run: () => {
                window.location.hash = s.id;
              },
            }
          : s.id === 'top'
            ? { id: s.id, label: 'Go to home page', hint: '/', run: () => go('/') }
            : { id: s.id, label: s.label, hint: `/#${s.id}`, run: () => go(`/#${s.id}`) },
      ),
      ...(blogSite.publishing
        ? [{ id: 'blog', label: 'Go to blog', hint: BLOG_PATH, run: () => go(BLOG_PATH) }]
        : []),
      {
        id: 'theme',
        label: `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`,
        hint: 'theme',
        run: toggle,
      },
      {
        id: 'copy',
        label: 'Copy email address',
        hint: 'clipboard',
        run: () => void navigator.clipboard?.writeText(profile.email),
      },
      {
        id: 'resume',
        label: 'Download résumé (PDF)',
        hint: 'pdf',
        run: () => void downloadResume(),
      },
      {
        id: 'mail',
        label: 'Write an email',
        hint: 'mailto',
        run: () => {
          window.location.href = `mailto:${profile.email}`;
        },
      },
      {
        id: 'linkedin',
        label: 'Open LinkedIn',
        hint: 'new tab',
        run: () => openTab(profile.linkedin),
      },
      { id: 'github', label: 'Open GitHub', hint: 'new tab', run: () => openTab(profile.github) },
    ],
    [theme, toggle, page],
  );

  const needle = query.trim().toLowerCase();
  const shown = commands.filter((c) => c.label.toLowerCase().includes(needle));
  const current = Math.min(active, Math.max(0, shown.length - 1));

  useEffect(() => {
    const d = dialog.current;
    if (!d || typeof d.showModal !== 'function') return;
    if (open && !d.open) {
      setQuery('');
      setActive(0);
      d.showModal();
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  const run = (c: Command | undefined) => {
    if (!c) return;
    focusAfterClose.current = c.target ?? null;
    onClose();
    c.run();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const step = e.key === 'ArrowDown' ? 1 : -1;
      const next = (current + step + shown.length) % Math.max(1, shown.length);
      setActive(next);
      // Keep the highlighted option visible in a list that scrolls (short
      // windows). Instant, never smooth, so reduced motion is respected.
      const option = shown[next] && document.getElementById(`palette-${shown[next].id}`);
      option?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(shown[current]);
    }
  };

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-label="Command palette"
      onClose={() => {
        onClose();
        // The close event fires after the browser has restored focus to the
        // opener, so focusing here wins.
        const id = focusAfterClose.current;
        focusAfterClose.current = null;
        if (id) focusSection(id);
      }}
      onClick={(e) => {
        if (e.target === dialog.current) onClose();
      }}
    >
      <div className={styles.panel}>
        <div className={styles.search}>
          <span className={styles.caret} aria-hidden="true">
            &gt;
          </span>
          <input
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={shown[current] ? `palette-${shown[current].id}` : undefined}
            aria-label="Type a command"
            placeholder="Type a command or jump to a section"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
          />
          <button type="button" className={`label ${styles.esc}`} onClick={onClose}>
            <span className="visually-hidden">Close, or press </span>Esc
          </button>
        </div>

        <ul id="palette-list" role="listbox" aria-label="Commands" className={styles.list}>
          {shown.map((c, i) => (
            <li
              key={c.id}
              id={`palette-${c.id}`}
              role="option"
              aria-selected={i === current}
              className={styles.item}
              onPointerMove={() => setActive(i)}
              onClick={() => run(c)}
            >
              <span>{c.label}</span>
              <span className={`label ${styles.hint}`}>{c.hint}</span>
            </li>
          ))}
          {shown.length === 0 && <li className={styles.empty}>No matching command.</li>}
        </ul>
      </div>
    </dialog>
  );
}
