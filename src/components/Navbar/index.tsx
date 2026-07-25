import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useThemeContext } from '../../context/ThemeContext';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useMagneticHover } from '../../hooks/useMagneticHover';
import { SunIcon, MoonIcon } from '../ui/Icons';
import styles from './Navbar.module.css';

const NAV_LINKS = ['about', 'experience', 'skills', 'education', 'contact'] as const;
const SECTION_IDS = [...NAV_LINKS];

const mobileListVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};

const mobileItemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

export default function Navbar() {
  const { theme, toggle } = useThemeContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useActiveSection(SECTION_IDS);
  const hireRef = useMagneticHover<HTMLAnchorElement>({ strength: 0.4 });

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
    return () => {
      document.body.style.overflow = '';
    };
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
          <div className={styles.logoBadge}>
            <img
              src="/avatar.jpg"
              alt=""
              aria-hidden="true"
              className={styles.logoAvatar}
              width={36}
              height={36}
            />
          </div>
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
                {activeSection === id && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className={styles.activePill}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className={styles.linkLabel}>{id.charAt(0).toUpperCase() + id.slice(1)}</span>
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
            {theme === 'dark' ? <SunIcon size={16} /> : <MoonIcon size={16} />}
          </button>
          <a
            ref={hireRef}
            href="mailto:sssouravsharma601@gmail.com"
            className={styles.hireBtn}
            aria-label="Hire me"
            data-cursor="magnetic"
          >
            Get In Touch
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
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav"
            className={styles.mobileNav}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            variants={mobileListVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {NAV_LINKS.map((id) => (
              <motion.a
                key={id}
                href={`#${id}`}
                className={styles.mobileLink}
                onClick={close}
                variants={mobileItemVariants}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </motion.a>
            ))}
            <motion.a
              href="mailto:sssouravsharma601@gmail.com"
              className={styles.mobileHire}
              onClick={close}
              variants={mobileItemVariants}
            >
              Get In Touch
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
