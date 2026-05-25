import ScrollReveal from '../ui/ScrollReveal';
import SkillCard from './SkillCard';
import { skills } from '../../data/skills';
import styles from './Skills.module.css';

export default function Skills() {
  return (
    <section id="skills" className={`section alt-bg`} aria-label="Technical skills">
      <ScrollReveal className="sec-hd">
        <span className="sec-label">03 — Skills</span>
        <h2 className="sec-title">Technical Skills</h2>
        <p className="sec-desc">
          A decade of hands-on experience across the full web stack — from browser paint to database
          query.
        </p>
      </ScrollReveal>

      <div className={styles.grid}>
        {skills.map((cat) => (
          <SkillCard key={cat.id} category={cat} />
        ))}
      </div>
    </section>
  );
}
