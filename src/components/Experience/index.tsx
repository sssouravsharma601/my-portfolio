import ScrollReveal from '../ui/ScrollReveal';
import TimelineItem from './TimelineItem';
import { experience } from '../../data/experience';
import { useGsapAnimation } from '../../animation/useGsapAnimation';
import { gsap } from '../../animation/gsapConfig';
import styles from './Experience.module.css';

export default function Experience() {
  const wrapRef = useGsapAnimation<HTMLDivElement>((scope) => {
    const el = scope.current;
    if (!el) return;

    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      const line = el.querySelector<HTMLElement>('[data-timeline-line]');
      if (line) {
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 65%', scrub: 0.6 },
          },
        );
      }

      gsap.utils.toArray<HTMLElement>('[data-timeline-item]', el).forEach((item) => {
        const targets = [
          item.querySelector('[data-timeline-card]'),
          item.querySelector('[data-timeline-dot]'),
        ].filter((t): t is HTMLElement => t !== null);

        gsap.fromTo(
          targets,
          { autoAlpha: 0, x: -28 },
          {
            autoAlpha: 1,
            x: 0,
            ease: 'none',
            scrollTrigger: { trigger: item, start: 'top 88%', end: 'top 60%', scrub: 0.6 },
          },
        );
      });
    });
  }, []);

  return (
    <section id="experience" className="section" aria-label="Work experience">
      <ScrollReveal className="sec-hd">
        <span className="sec-label">01 — Experience</span>
        <h2 className="sec-title">Work Experience</h2>
        <p className="sec-desc">
          8+ years across fintech, edtech, e-commerce, and ad-tech — always building at scale.
        </p>
      </ScrollReveal>

      <div className={styles.timelineWrap} ref={wrapRef}>
        <div className={styles.lineTrack} aria-hidden="true" />
        <div className={styles.lineProgress} data-timeline-line aria-hidden="true" />
        <ol className={styles.timeline} aria-label="Career timeline">
          {experience.map((item) => (
            <TimelineItem key={item.id} item={item} />
          ))}
        </ol>
      </div>
    </section>
  );
}
