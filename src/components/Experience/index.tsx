import ScrollReveal from '../ui/ScrollReveal';
import TimelineItem from './TimelineItem';
import { experience } from '../../data/experience';
import styles from './Experience.module.css';

export default function Experience() {
  return (
    <section id="experience" className="section" aria-label="Work experience">
      <ScrollReveal className="sec-hd">
        <div className="sec-label">Career</div>
        <h2 className="sec-title">Work Experience</h2>
        <p className="sec-desc">
          8+ years across fintech, edtech, e-commerce, and ad-tech — always building at scale.
        </p>
      </ScrollReveal>

      <ol className={styles.timeline} aria-label="Career timeline">
        {experience.map((item) => (
          <TimelineItem key={item.id} item={item} />
        ))}
      </ol>
    </section>
  );
}
