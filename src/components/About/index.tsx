import { CAREER_START, highlights, profile } from '../../data/profile';
import { useNow } from '../../hooks/useNow';
import { yearsSince } from '../../utils/date';
import CountUp from '../CountUp';
import Section from '../Section';
import styles from './About.module.css';

export default function About() {
  const years = yearsSince(CAREER_START, useNow());
  return (
    <Section
      id="about"
      title="About"
      aside={`${years} years where the frontend meets a hard backend problem.`}
    >
      <div className={styles.prose}>
        <p className={`${styles.lead} reveal`}>
          I’m {profile.name}, a senior frontend engineer in Dubai. I’ve worked on the application
          where a bank writes its loan and credit-card eligibility rules, a learning portal used by
          millions of students a day, and a reservation flow that had to hold up through one of
          India’s largest EV launches.
        </p>
        <p className={`${styles.more} reveal`}>
          I care most about the parts that don’t demo well: state that stays predictable, bundles
          that stay small, and interfaces that make a complicated system feel obvious to the person
          using it. Most of my work is React and TypeScript, with enough Node, Rails and SQL to own
          a feature end to end. I lead four engineers across frontend and backend today, and led
          five frontend engineers at BYJU’S.
        </p>
      </div>

      <ul className={styles.numbers} aria-label="Selected results">
        {highlights.map((h) => (
          <li key={h.label} className="reveal" data-spot>
            <span className={`label ${styles.where}`}>{h.where}</span>
            <span className={styles.value}>
              <CountUp value={h.value} />
            </span>
            <span className={styles.label}>{h.label}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
