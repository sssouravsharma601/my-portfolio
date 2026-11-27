import { useEffect, useState } from 'react';
import { blogSite } from '../../blog/site';
import { BLOG_PATH } from '../../blog/schema';
import { useThemeContext } from '../../context/ThemeContext';
import { useActiveSection } from '../../hooks/useActiveSection';
import { profile } from '../../data/profile';
import CommandPalette from '../CommandPalette';
import { Moon, Sun } from '../Icons';
import styles from './Header.module.css';

const NAV = [
  { id: 'about', label: 'About' },
  { id: 'cases', label: 'Case studies' },
  { id: 'work', label: 'Experience' },
  { id: 'skills', label: 'Toolkit' },
  { id: 'contact', label: 'Contact' },
];
const IDS = NAV.map((n) => n.id);

export type Page = 'home' | 'blog';

interface Props {
  /** On blog pages the section links lead back to the home page. */
  page?: Page;
}

export default function Header({ page = 'home' }: Props) {
  const home = page === 'home';
  const { theme, toggle } = useThemeContext();
  const active = useActiveSection(IDS);
  const [palette, setPalette] = useState(false);
  // The prerendered page shows the Mac key; other platforms swap it after mount.
  const [keys, setKeys] = useState('⌘K');
  const next = theme === 'dark' ? 'light' : 'dark';

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the platform is only known after hydration
    if (!/Mac|iPhone|iPad/.test(navigator.platform)) setKeys('Ctrl K');
  }, []);

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
        <a
          href={home ? '#top' : '/'}
          className={styles.brand}
          aria-label={home ? `${profile.name}, back to top` : `${profile.name}, home`}
        >
          {profile.name}
        </a>

        <nav aria-label="Primary" className={styles.nav}>
          {NAV.map((n) => (
            <a
              key={n.id}
              href={home ? `#${n.id}` : `/#${n.id}`}
              className={styles.navLink}
              aria-current={home && active === n.id ? 'location' : undefined}
            >
              {n.label}
            </a>
          ))}
          {blogSite.publishing && (
            <a
              href={BLOG_PATH}
              className={styles.navLink}
              aria-current={page === 'blog' ? 'location' : undefined}
            >
              Blog
            </a>
          )}
        </nav>

        <button
          type="button"
          className={styles.command}
          onClick={() => setPalette(true)}
          aria-haspopup="dialog"
          aria-label={`Menu: open command palette, ${keys}`}
          aria-keyshortcuts="Meta+K Control+K"
        >
          <span className={styles.menuWord}>Menu</span>
          <kbd className={styles.keys}>{keys}</kbd>
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

      <CommandPalette open={palette} onClose={() => setPalette(false)} page={page} />
    </header>
  );
}
