import ScrollReveal from '../ui/ScrollReveal';
import { education } from '../../data/education';
import { GraduationIcon, RulerIcon, BooksIcon } from '../ui/Icons';
import styles from './Education.module.css';

const getEducationIcon = (iconKey: string) => {
  switch (iconKey) {
    case 'graduation':
      return <GraduationIcon size={22} />;
    case 'ruler':
      return <RulerIcon size={22} />;
    case 'books':
      return <BooksIcon size={22} />;
    default:
      return <GraduationIcon size={22} />;
  }
};

export default function Education() {
  return (
    <section id="education" className="section" aria-label="Education">
      <ScrollReveal className="sec-hd">
        <span className="sec-label">04 — Education</span>
        <h2 className="sec-title">Academic History</h2>
        <p className="sec-desc">
          Formal engineering foundations built across technical training institutions.
        </p>
      </ScrollReveal>

      <div className={styles.grid}>
        {education.map((item, i) => (
          <ScrollReveal key={item.id} delay={i * 100} as="article" className={styles.card}>
            <span className={styles.icon} aria-hidden="true">
              {getEducationIcon(item.icon)}
            </span>
            <h3 className={styles.degree}>{item.degree}</h3>
            <div className={styles.school}>{item.school}</div>
            <div className={styles.meta}>
              <span className={styles.badge}>{item.year}</span>
              <span className={`${styles.badge} ${styles.highlight}`}>{item.score}</span>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
