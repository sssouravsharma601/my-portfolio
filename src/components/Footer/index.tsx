import styles from './Footer.module.css';

const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.left}>
        © {YEAR} <strong>Sourav Sharma</strong> · Designed &amp; built by me, in Dubai, UAE
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
    </footer>
  );
}
