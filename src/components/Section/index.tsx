import type { ReactNode } from 'react';
import styles from './Section.module.css';

interface Props {
  id: string;
  /** Two-digit position on the page, shown beside the title. */
  index: string;
  title: string;
  aside?: ReactNode;
  children: ReactNode;
}

export default function Section({ id, index, title, aside, children }: Props) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className={`page ${styles.section}`}>
      <header className={styles.head}>
        <span className={`label ${styles.index}`} aria-hidden="true">
          ({index})
        </span>
        <h2 id={headingId} className={styles.title}>
          {title}
        </h2>
        {aside && <p className={`label ${styles.aside}`}>{aside}</p>}
      </header>
      {children}
    </section>
  );
}
