import { caseStudies, roles } from '../../data/profile';
import { useNow } from '../../hooks/useNow';
import { formatDuration, formatYearMonth } from '../../utils/date';
import type { Role } from '../../types';
import Section from '../Section';
import styles from './Experience.module.css';

const caseIds = new Set(caseStudies.map((c) => c.id));

export default function Experience() {
  const now = useNow();
  return (
    <Section
      id="work"
      title="Experience"
      aside="Four companies, from SaaS to banking. I’ve led teams at the two most recent."
    >
      <ol className={styles.list}>
        {roles.map((r) => (
          <RoleItem key={r.id} role={r} now={now} />
        ))}
      </ol>
    </Section>
  );
}

function RoleItem({ role: r, now }: { role: Role; now: Date }) {
  const current = !r.end;
  return (
    <li className={styles.item}>
      <div className={styles.when}>
        <span className="label">
          {formatYearMonth(r.start)} – {r.end ? formatYearMonth(r.end) : 'Present'}
        </span>
        <span className={`label ${styles.duration}`}>{formatDuration(r.start, r.end, now)}</span>
      </div>

      <div className={`${styles.what} reveal`} data-spot>
        <h3 className={styles.heading}>
          <span className={styles.company}>{r.company}</span>
          {r.context && <span className={styles.context}>{r.context}</span>}
          {current && <span className={`label ${styles.now}`}>Now</span>}
        </h3>
        <p className={styles.title}>{r.title}</p>
        <p className={styles.summary}>{r.summary}</p>
        {caseIds.has(r.id) && (
          <a href={`#case-${r.id}`} className={`label ${styles.caseLink}`}>
            Read the case study
          </a>
        )}
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
