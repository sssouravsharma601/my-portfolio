import { education, skills } from '../../data/profile';
import Section from '../Section';
import styles from './Skills.module.css';

export default function Skills() {
  return (
    <Section id="skills" title="Toolkit" aside="What I reach for, and what I studied.">
      <div className={styles.grid}>
        {skills.map((g) => (
          <div key={g.title} className={`${styles.group} reveal`}>
            <h3 className={styles.groupTitle}>{g.title}</h3>
            <ul>
              {g.items.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={`${styles.edu} reveal`}>
        <h3 className={styles.groupTitle}>Education</h3>
        <ul>
          {education.map((d) => (
            <li key={d.title}>
              <span className={styles.degree}>{d.title}</span>
              <span className={styles.school}>{d.school}</span>
              <span className={styles.year}>{d.year}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
