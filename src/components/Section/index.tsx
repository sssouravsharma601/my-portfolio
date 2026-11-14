import type { ReactNode } from 'react';
import styles from './Section.module.css';

interface Props {
  id: string;
  title: string;
  aside?: ReactNode;
  children: ReactNode;
}

export default function Section({ id, title, aside, children }: Props) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className={`page ${styles.section}`}>
      <header className={styles.head}>
        <h2 id={headingId} className={styles.title}>
          {title}
        </h2>
        {aside && <p className={styles.aside}>{aside}</p>}
      </header>
      {children}
    </section>
  );
}
