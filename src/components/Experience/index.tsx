import SectionHeading from '../ui/SectionHeading';
import TimelineItem from './TimelineItem';
import { experience } from '../../data/experience';
import { useGsapAnimation } from '../../animation/useGsapAnimation';
import { gsap } from '../../animation/gsapConfig';
import styles from './Experience.module.css';

export default function Experience() {
  const listRef = useGsapAnimation<HTMLOListElement>((scope) => {
    const el = scope.current;
    if (!el) return;

    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray<HTMLElement>('[data-timeline-item]', el).forEach((item) => {
        gsap.fromTo(
          item,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            ease: 'none',
            scrollTrigger: { trigger: item, start: 'top 92%', end: 'top 65%', scrub: 0.6 },
          },
        );
      });
    });
  }, []);

  return (
    <section id="experience" className="section" aria-label="Work experience">
      <SectionHeading
        index="01"
        label="Experience"
        title="Work Experience"
        description="8+ years across fintech, edtech, e-commerce, and ad-tech — always building at scale."
      />

      <ol className={styles.list} aria-label="Career timeline" ref={listRef}>
        {experience.map((item, i) => (
          <TimelineItem key={item.id} item={item} index={i + 1} />
        ))}
      </ol>
    </section>
  );
}
