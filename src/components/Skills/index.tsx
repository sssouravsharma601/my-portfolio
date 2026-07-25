import { motion, type Variants } from 'framer-motion';
import ScrollReveal from '../ui/ScrollReveal';
import SkillCard from './SkillCard';
import { skills } from '../../data/skills';
import styles from './Skills.module.css';

const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

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

      <motion.div
        className={styles.grid}
        variants={gridVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {skills.map((cat) => (
          <SkillCard key={cat.id} category={cat} />
        ))}
      </motion.div>
    </section>
  );
}
