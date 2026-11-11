import type { ReactNode } from 'react';
import styles from './Section.module.css';

interface Props {
  id: string;
  title: string;
  /** Short aside under the title, desktop only. */
  aside?: ReactNode;
  children: ReactNode;
}

export default function Section({ id, title, aside, children }: Props) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className={`page ruled ${styles.section}`}>
      <header className={styles.head}>
        <h2 id={headingId} className={styles.title}>
          {title}
        </h2>
        {aside && <div className={styles.aside}>{aside}</div>}
      </header>
      <div className={styles.body}>{children}</div>
    </section>
  );
}
