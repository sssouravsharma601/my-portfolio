import { profile } from '../../data/profile';
import { useNow } from '../../hooks/useNow';
import styles from './Footer.module.css';

export default function Footer() {
  const year = useNow().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`page ${styles.inner}`}>
        <div className={styles.row}>
          <p>
            © {year} {profile.name}
          </p>
          <p>
            Set in Inter. Built with React and Vite.{' '}
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
