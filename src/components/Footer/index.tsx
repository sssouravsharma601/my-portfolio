import { profile } from '../../data/profile';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`page ${styles.inner}`}>
        <p className={styles.wordmark} aria-hidden="true">
          {profile.name}
        </p>
        <div className={`label ${styles.row}`}>
          <p>
            © {new Date().getFullYear()} {profile.name}
          </p>
          <p>
            Set in Archivo and JetBrains Mono. Built with React and Vite.{' '}
            <a
              className="link"
              href="https://github.com/sssouravsharma601/my-portfolio"
              target="_blank"
              rel="noopener noreferrer"
            >
              Source
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
