import ScrollReveal from '../ui/ScrollReveal';
import SectionHeading from '../ui/SectionHeading';
import { education } from '../../data/education';
import { GraduationIcon, RulerIcon, BooksIcon } from '../ui/Icons';
import { useGsapAnimation } from '../../animation/useGsapAnimation';
import { gsap } from '../../animation/gsapConfig';
import styles from './Education.module.css';

const getEducationIcon = (iconKey: string) => {
  switch (iconKey) {
    case 'graduation':
      return <GraduationIcon size={22} />;
    case 'ruler':
      return <RulerIcon size={22} />;
    case 'books':
      return <BooksIcon size={22} />;
    default:
      return <GraduationIcon size={22} />;
  }
};

export default function Education() {
  const viewportRef = useGsapAnimation<HTMLDivElement>((scope) => {
    const viewport = scope.current;
    const track = viewport?.querySelector<HTMLElement>('[data-edu-track]');
    if (!viewport || !track) return;

    // Desktop-with-a-mouse only: horizontal scroll-jacking is disorienting on
    // touch (no `hover: hover`) and on narrow viewports, so it falls back to
    // the normal stacked grid below (see Education.module.css) everywhere else.
    gsap
      .matchMedia()
      .add(
        '(min-width: 1024px) and (hover: hover) and (prefers-reduced-motion: no-preference)',
        () => {
          gsap.to(track, {
            x: () => -(track.scrollWidth - viewport.clientWidth),
            ease: 'none',
            scrollTrigger: {
              trigger: viewport,
              start: 'top top',
              end: () => `+=${track.scrollWidth - viewport.clientWidth}`,
              scrub: 0.6,
              pin: true,
              invalidateOnRefresh: true,
            },
          });
        },
      );
  }, []);

  return (
    <section id="education" className="section" aria-label="Education">
      <SectionHeading
        index="04"
        label="Education"
        title="Academic History"
        description="Formal engineering foundations built across technical training institutions."
      />

      <div className={styles.trackViewport} ref={viewportRef}>
        <div className={styles.track} data-edu-track>
          {education.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 100} as="article" className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.icon} aria-hidden="true">
                  {getEducationIcon(item.icon)}
                </span>
                <span className={styles.year} aria-hidden="true">
                  {item.year}
                </span>
              </div>
              <h3 className={styles.degree}>{item.degree}</h3>
              <div className={styles.school}>{item.school}</div>
              <div className={styles.score}>{item.score}</div>
            </ScrollReveal>
          ))}
        </div>
        <div className={styles.scrollHint} aria-hidden="true">
          Scroll to explore →
        </div>
      </div>
    </section>
  );
}
