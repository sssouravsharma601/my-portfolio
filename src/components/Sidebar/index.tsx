import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useThemeContext } from '../../context/ThemeContext';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useMagneticHover } from '../../hooks/useMagneticHover';
import { SunIcon, MoonIcon, ArrowRightIcon } from '../ui/Icons';
import styles from './Sidebar.module.css';

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

/**
 * Fixed left-edge scroll-spy dot rail on desktop (≥1025px), replacing the
 * generic top navbar. Collapses to a slim top bar + full-screen mobile menu
 * below that breakpoint, since a persistent sidebar doesn't work on narrow
 * viewports.
 */
export default function Sidebar() {
  const { theme, toggle } = useThemeContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useActiveSection(SECTION_IDS);
  const hireRef = useMagneticHover<HTMLAnchorElement>({ strength: 0.35 });

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      {/* ── Desktop sidebar ── */}
      <nav className={styles.sidebar} role="navigation" aria-label="Main navigation">
        <a href="#hero" className={styles.logo} aria-label="Sourav Sharma — home">
          <img
            src="/avatar.jpg"
            alt=""
            aria-hidden="true"
            className={styles.logoAvatar}
            width={40}
            height={40}
          />
        </a>

        <ul className={styles.navList} role="list">
          {NAV_LINKS.map((id) => {
            const isActive = activeSection === id;
            const label = id.charAt(0).toUpperCase() + id.slice(1);
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                  aria-label={label}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active-ring"
                      className={styles.activeRing}
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className={styles.navDot} aria-hidden="true" />
                  <span className={styles.navTooltip} aria-hidden="true">
                    {label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className={styles.sidebarFooter}>
          <button
            className={styles.themeBtn}
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <SunIcon size={15} /> : <MoonIcon size={15} />}
          </button>
          <a
            ref={hireRef}
            href="mailto:sssouravsharma601@gmail.com"
            className={styles.hireDot}
            aria-label="Get in touch"
            data-cursor="magnetic"
          >
            <ArrowRightIcon size={16} style={{ transform: 'rotate(-45deg)' }} />
          </a>
        </div>
      </nav>

      {/* ── Mobile top bar ── */}
      <div className={`${styles.mobileBar} ${scrolled ? styles.mobileBarScrolled : ''}`}>
        <a href="#hero" className={styles.logo} aria-label="Sourav Sharma — home">
          <img
            src="/avatar.jpg"
            alt=""
            aria-hidden="true"
            className={styles.logoAvatar}
            width={36}
            height={36}
          />
        </a>
        <div className={styles.mobileActions}>
          <button
            className={styles.themeBtn}
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <SunIcon size={15} /> : <MoonIcon size={15} />}
          </button>
          <button
            className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setMenuOpen((p) => !p)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

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
