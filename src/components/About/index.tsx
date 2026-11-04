import { highlights, YEARS } from '../../data/profile';
import Section from '../Section';
import styles from './About.module.css';

export default function About() {
  return (
    <Section id="about" title="About">
      <div className={`${styles.prose} reveal`}>
        <p>
          For {YEARS} years I’ve worked where the frontend meets a hard backend problem: a rule
          engine that decides loan eligibility across a bank, a classroom portal serving millions of
          students, and a reservation flow that had to survive one of India’s largest EV launches.
        </p>
        <p>
          I care most about the parts that don’t demo well. I want state that stays predictable,
          bundles that stay small, and interfaces that make a complicated system feel obvious to the
          person using it. Most of my work is React and TypeScript, with enough Node, Rails and SQL
          to own a feature end to end. I’ve led frontend teams of four and five engineers.
        </p>
      </div>

      <ul className={styles.numbers} aria-label="Selected results">
        {highlights.map((h) => (
          <li key={h.label} className="reveal">
            <span className={styles.value}>{h.value}</span>
            <span className={styles.label}>{h.label}</span>
            <span className={styles.where}>{h.where}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
