import { education, skills } from '../../data/profile';
import Section from '../Section';
import styles from './Skills.module.css';

export default function Skills() {
  return (
    <Section id="skills" index="04" title="Toolkit" aside="What I reach for, and what I studied">
      <div className={styles.rows}>
        {skills.map((g) => (
          <div key={g.title} className={`${styles.row} reveal`}>
            <h3 className={`label ${styles.rowTitle}`}>{g.title}</h3>
            <ul className={styles.items}>
              {g.items.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        ))}

        <div className={`${styles.row} reveal`}>
          <h3 className={`label ${styles.rowTitle}`}>Education</h3>
          <ul className={styles.edu}>
            {education.map((d) => (
              <li key={d.title}>
                <span className={styles.degree}>{d.title}</span>
                <span className={styles.school}>
                  {d.school}, {d.year}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
