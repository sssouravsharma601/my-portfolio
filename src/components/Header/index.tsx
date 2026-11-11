import { useThemeContext } from '../../context/ThemeContext';
import { profile } from '../../data/profile';
import { Moon, Sun } from '../Icons';
import styles from './Header.module.css';

const NAV = [
  { href: '#about', label: 'About' },
  { href: '#work', label: 'Work' },
  { href: '#skills', label: 'Toolkit' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  const { theme, toggle } = useThemeContext();
  const next = theme === 'dark' ? 'light' : 'dark';

  return (
    <header className={styles.bar}>
      <div className={`page ${styles.inner}`}>
        <a href="#top" className={styles.brand} aria-label={`${profile.name}, back to top`}>
          <span className={styles.brandFull}>{profile.name}</span>
          <span className={styles.brandShort} aria-hidden="true">
            S/S
          </span>
        </a>

        <nav aria-label="Primary" className={styles.nav}>
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className={`label ${styles.navLink}`}>
              {n.label}
            </a>
          ))}
        </nav>

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
    </header>
  );
}
