import { profile } from '../../data/profile';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={`page ruled ${styles.footer}`}>
      <p>
        © {new Date().getFullYear()} {profile.name}
      </p>
      <p className={styles.colophon}>
        Set in Geist. Built with React and Vite.{' '}
        <a
          className="link"
          href="https://github.com/sssouravsharma601/my-portfolio"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source
        </a>
      </p>
    </footer>
  );
}
