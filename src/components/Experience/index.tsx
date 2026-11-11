import { roles } from '../../data/profile';
import { formatDuration, formatYearMonth } from '../../utils/date';
import type { Role } from '../../types';
import Section from '../Section';
import styles from './Experience.module.css';

export default function Experience() {
  return (
    <Section id="work" index="02" title="Experience" aside="From SaaS to banking">
      <ol className={styles.list}>
        {roles.map((r, i) => (
          <RoleItem key={r.id} role={r} n={roles.length - i} />
        ))}
      </ol>
    </Section>
  );
}

function RoleItem({ role: r, n }: { role: Role; n: number }) {
  const current = !r.end;
  return (
    <li className={`${styles.item} ${current ? styles.current : ''}`}>
      <div className={styles.when}>
        <span className={styles.n} aria-hidden="true">
          {String(n).padStart(2, '0')}
        </span>
        <span className="label">
          {formatYearMonth(r.start)} – {r.end ? formatYearMonth(r.end) : 'Present'}
        </span>
        <span className={`label ${styles.duration}`}>{formatDuration(r.start, r.end)}</span>
      </div>

      <div className={`${styles.what} reveal`} data-spot>
        <h3 className={styles.heading}>
          <span className={styles.company}>{r.company}</span>
          {r.context && <span className={styles.context}>{r.context}</span>}
          {current && <span className={`label ${styles.now}`}>Now</span>}
        </h3>
        <p className={styles.title}>{r.title}</p>
        <p className={styles.summary}>{r.summary}</p>
        <ul className={styles.highlights}>
          {r.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
        <ul className={`label ${styles.stack}`} aria-label="Stack">
          {r.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </li>
  );
}
