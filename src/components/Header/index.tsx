import { useEffect, useState } from 'react';
import { useThemeContext } from '../../context/ThemeContext';
import { useActiveSection } from '../../hooks/useActiveSection';
import { profile } from '../../data/profile';
import CommandPalette from '../CommandPalette';
import { Moon, Sun } from '../Icons';
import styles from './Header.module.css';

const NAV = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Toolkit' },
  { id: 'contact', label: 'Contact' },
];
const IDS = NAV.map((n) => n.id);

export default function Header() {
  const { theme, toggle } = useThemeContext();
  const active = useActiveSection(IDS);
  const [palette, setPalette] = useState(false);
  const next = theme === 'dark' ? 'light' : 'dark';

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPalette((open) => !open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className={styles.bar}>
      <div className={`page ${styles.inner}`}>
        <a href="#top" className={styles.brand} aria-label={`${profile.name}, back to top`}>
          <span className={styles.prompt} aria-hidden="true">
            ~/
          </span>
          sourav-sharma
        </a>

        <nav aria-label="Primary" className={styles.nav}>
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className={`label ${styles.navLink}`}
              aria-current={active === n.id ? 'location' : undefined}
            >
              {n.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className={`label ${styles.command}`}
          onClick={() => setPalette(true)}
          aria-haspopup="dialog"
          aria-label="Open command palette"
        >
          <span className={styles.menuWord}>Menu</span>
          <kbd className={styles.keys}>⌘K</kbd>
        </button>

        <button
          type="button"
          className={styles.theme}
          onClick={toggle}
          aria-label={`Switch to ${next} theme`}
          title={`Switch to ${next} theme`}
        >
          {theme === 'dark' ? <Sun /> : <Moon />}
        </button>
      </div>

      <CommandPalette open={palette} onClose={() => setPalette(false)} />
    </header>
  );
}
