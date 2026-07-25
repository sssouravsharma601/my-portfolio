import type { ExperienceItem } from '../../types';
import { CpuIcon, ServerIcon, PlatformsIcon, CloudIcon } from '../ui/Icons';
import styles from './Experience.module.css';

interface Props {
  item: ExperienceItem;
}

const getProjectIcon = (id: string) => {
  switch (id) {
    case 'synechron':
      return <ServerIcon size={16} />;
    case 'byjus':
      return <CpuIcon size={16} />;
    case 'robosoft':
      return <PlatformsIcon size={16} />;
    case 'social-frontier':
      return <CloudIcon size={16} />;
    default:
      return <ServerIcon size={16} />;
  }
};

export default function TimelineItem({ item }: Props) {
  return (
    <li className={styles.item} data-timeline-item>
      <div className={styles.dot} data-timeline-dot aria-hidden="true" />
      <div className={styles.card} data-timeline-card>
        <div className={styles.head}>
          <div>
            <h3 className={styles.role}>{item.role}</h3>
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
            <span className={styles.projectIcon} aria-hidden="true">
              {getProjectIcon(item.id)}
            </span>
            <span className={styles.projectTitleText}>{item.project.name}</span>
            <span className={styles.teamBadge}>Scale: {item.project.teamSize}-Engineer Team</span>
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
    </li>
  );
}
