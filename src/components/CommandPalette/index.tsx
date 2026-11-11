import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useThemeContext } from '../../context/ThemeContext';
import { profile } from '../../data/profile';
import styles from './CommandPalette.module.css';

interface Command {
  id: string;
  label: string;
  hint: string;
  run: () => void;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

const SECTIONS = [
  { id: 'top', label: 'Go to top' },
  { id: 'about', label: 'Go to About' },
  { id: 'work', label: 'Go to Experience' },
  { id: 'skills', label: 'Go to Toolkit' },
  { id: 'contact', label: 'Go to Contact' },
];

const openTab = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');

/**
 * Keyboard-first navigation: jump to a section, switch theme, copy the email.
 * A native <dialog>, so focus trapping, Esc and the backdrop come for free.
 * On small screens it doubles as the menu.
 */
export default function CommandPalette({ open, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const { theme, toggle } = useThemeContext();

  const commands = useMemo<Command[]>(
    () => [
      ...SECTIONS.map((s) => ({
        id: s.id,
        label: s.label,
        hint: `#${s.id}`,
        run: () => {
          window.location.hash = s.id;
        },
      })),
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
    [theme, toggle],
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
    onClose();
    c.run();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const step = e.key === 'ArrowDown' ? 1 : -1;
      setActive((current + step + shown.length) % Math.max(1, shown.length));
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
      onClose={onClose}
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
