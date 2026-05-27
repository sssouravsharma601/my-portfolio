import styles from './Footer.module.css';

const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      {/* ── Top row: Performance Diagnostics Console ── */}
      <div className={styles.top}>
        <div className={styles.diagnostics}>
          <div className={styles.diagTitle}>
            <span className={styles.diagDot} aria-hidden="true" />
            <span>Diagnostics Console</span>
          </div>
          <div className={styles.diagGrid}>
            <div className={styles.diagItem}>
              <span className={styles.diagLabel}>Core Vitals</span>
              <span className={styles.diagVal}>Excellent (LCP 0.8s)</span>
            </div>
            <div className={styles.diagItem}>
              <span className={styles.diagLabel}>Bundle Weight</span>
              <span className={styles.diagVal}>&lt; 32 KB (gzip)</span>
            </div>
            <div className={styles.diagItem}>
              <span className={styles.diagLabel}>Active Protocol</span>
              <span className={styles.diagVal}>HTTP/2 · TLS 1.3</span>
            </div>
            <div className={styles.diagItem}>
              <span className={styles.diagLabel}>Build Pipeline</span>
              <span className={styles.diagVal}>Vite 5 · React 18</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom row: Copyright & Links ── */}
      <div className={styles.bottom}>
        <div className={styles.left}>
          © {YEAR} <strong>Sourav Sharma</strong> · Crafted in Dubai, UAE 🇦🇪
        </div>
        <div className={styles.right}>
          <a href="#hero" className={styles.link}>
            Back to top ↑
          </a>
          <a href="mailto:sssouravsharma601@gmail.com" className={styles.link}>
            Email
          </a>
          <a
            href="https://www.linkedin.com/in/sssouravsharma601/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            LinkedIn ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
