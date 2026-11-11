import { roles } from '../../data/profile';
import { formatDuration, formatYearMonth } from '../../utils/date';
import type { Role } from '../../types';
import Section from '../Section';
import styles from './Experience.module.css';

export default function Experience() {
  return (
    <Section id="work" title="Experience" aside="Four companies, from SaaS to banking.">
      <ol className={styles.list}>
        {roles.map((r) => (
          <RoleItem key={r.id} role={r} />
        ))}
      </ol>
    </Section>
  );
}

function RoleItem({ role: r }: { role: Role }) {
  const current = !r.end;
  return (
    <li className={`${styles.item} reveal`}>
      <div className={styles.when}>
        <span>
          {formatYearMonth(r.start)} – {r.end ? formatYearMonth(r.end) : 'Present'}
        </span>
        <span className={styles.duration}>{formatDuration(r.start, r.end)}</span>
      </div>

      <div className={styles.what}>
        <h3 className={styles.heading}>
          <span className={styles.company}>{r.company}</span>
          {r.context && <span className={styles.context}> {r.context}</span>}
          {current && <span className={styles.now}>Now</span>}
        </h3>
        <p className={styles.title}>{r.title}</p>
        <p className={styles.summary}>{r.summary}</p>
        <ul className={styles.highlights}>
          {r.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
        <ul className={styles.stack} aria-label="Stack">
          {r.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </li>
  );
}
