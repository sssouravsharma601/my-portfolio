import { useEffect, useState } from 'react';
import { useThemeContext } from '../../context/ThemeContext';
import { profile } from '../../data/profile';
import { Moon, Sun } from '../Icons';
import styles from './Header.module.css';

const NAV = [
  { href: '#work', label: 'Work' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  const { theme, toggle } = useThemeContext();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const next = theme === 'dark' ? 'light' : 'dark';

  return (
    <header className={`${styles.bar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`page ${styles.inner}`}>
        <a href="#top" className={styles.brand} aria-label={`${profile.name}, back to top`}>
          <span className={styles.mark} aria-hidden="true">
            SS
          </span>
          <span className={styles.brandName}>{profile.name}</span>
        </a>

        <nav aria-label="Primary" className={styles.nav}>
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className={styles.navLink}>
              {n.label}
            </a>
          ))}
          <button
            type="button"
            className={styles.theme}
            onClick={toggle}
            aria-label={`Switch to ${next} theme`}
            title={`Switch to ${next} theme`}
          >
            {theme === 'dark' ? <Sun /> : <Moon />}
          </button>
        </nav>
      </div>
    </header>
  );
}
