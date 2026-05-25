import type { ExperienceItem } from '../../types';
import ScrollReveal from '../ui/ScrollReveal';
import styles from './Experience.module.css';

interface Props {
  item: ExperienceItem;
}

export default function TimelineItem({ item }: Props) {
  return (
    <ScrollReveal className={styles.item} as="li" role="listitem">
      <div className={styles.dot} aria-hidden="true" />
      <div className={styles.card}>
        <div className={styles.head}>
          <div>
            <div className={styles.role}>{item.role}</div>
            <div className={styles.company}>{item.company}</div>
          </div>
          <span className={styles.period}>
            {item.period} · {item.duration}
          </span>
        </div>

        <ul className={styles.bullets} aria-label="Responsibilities">
          {item.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>

        <div className={styles.project}>
          <div className={styles.projectName}>
            {item.project.name} · Team: {item.project.teamSize} engineers
          </div>
          <p className={styles.projectDesc}>{item.project.description}</p>
          <div className={styles.tags}>
            {item.project.tech.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
