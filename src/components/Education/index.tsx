import ScrollReveal from '../ui/ScrollReveal';
import { education } from '../../data/education';
import styles from './Education.module.css';

export default function Education() {
  return (
    <section id="education" className="section" aria-label="Education">
      <ScrollReveal className="sec-hd">
        <span className="sec-label">04 — Education</span>
        <h2 className="sec-title">Education</h2>
        <p className="sec-desc">
          Solid computer-science foundation built across three institutions in Punjab, India.
        </p>
      </ScrollReveal>

      <div className={styles.grid}>
        {education.map((item, i) => (
          <ScrollReveal key={item.id} delay={i * 100} as="article" className={styles.card}>
            <span className={styles.icon} aria-hidden="true">
              {item.icon}
            </span>
            <div className={styles.degree}>{item.degree}</div>
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
