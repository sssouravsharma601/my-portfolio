import { useState, useEffect } from 'react';
import { useThemeContext } from '../../context/ThemeContext';
import { useActiveSection } from '../../hooks/useActiveSection';
import styles from './Navbar.module.css';

const NAV_LINKS = ['about', 'experience', 'skills', 'education', 'contact'] as const;
const SECTION_IDS = [...NAV_LINKS];

export default function Navbar() {
  const { theme, toggle } = useThemeContext();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const activeSection             = useActiveSection(SECTION_IDS);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close menu on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <>
      <nav
        className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <a href="#hero" className={styles.logo} aria-label="Sourav Sharma — home">
          <div className={styles.logoBadge} aria-hidden="true">SS</div>
          <span className={styles.logoName}>Sourav Sharma</span>
        </a>

        {/* Desktop links */}
        <ul className={styles.links} role="list">
          {NAV_LINKS.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`${styles.link} ${activeSection === id ? styles.active : ''}`}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className={styles.right}>
          <button
            className={styles.themeBtn}
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
          <a
            href="mailto:sssouravsharma601@gmail.com"
            className={styles.hireBtn}
            aria-label="Hire me"
          >
            Hire Me →
          </a>
        </div>

        {/* Hamburger */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen((p) => !p)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile overlay */}
      <div
        id="mobile-nav"
        className={`${styles.mobileNav} ${menuOpen ? styles.mobileOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!menuOpen}
      >
        {NAV_LINKS.map((id) => (
          <a key={id} href={`#${id}`} className={styles.mobileLink} onClick={close}>
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </a>
        ))}
        <a
          href="mailto:sssouravsharma601@gmail.com"
          className={styles.mobileHire}
          onClick={close}
        >
          Hire Me →
        </a>
      </div>
    </>
  );
}
