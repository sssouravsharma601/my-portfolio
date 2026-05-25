import { useRef, useEffect, useState } from 'react';
import ParticleCanvas from '../ui/ParticleCanvas';
import { useTyping } from '../../hooks/useTyping';
import { useCounter } from '../../hooks/useCounter';
import { heroStats } from '../../data/education';
import styles from './Hero.module.css';

const PHRASES = [
  'Senior Frontend Engineer',
  'React.js Specialist',
  'TypeScript Expert',
  'UI/UX Architect',
  'MERN Stack Developer',
];

function StatCounter({ value, suffix, label }: { value: number | string; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);
  const count = useCounter(typeof value === 'number' ? value : 0, 1600, triggered);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof value !== 'number') return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTriggered(true); io.disconnect(); } },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <div ref={ref} className={styles.stat} role="listitem">
      <div className={styles.statNum}>
        {typeof value === 'number' ? `${count}${suffix ?? ''}` : value}
      </div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

export default function Hero() {
  const typed = useTyping(PHRASES);

  return (
    <section id="hero" className={styles.hero} aria-label="Introduction">
      <ParticleCanvas />
      <div className={styles.grid}      aria-hidden="true" />
      <div className={`${styles.blob} ${styles.b1}`} aria-hidden="true" />
      <div className={`${styles.blob} ${styles.b2}`} aria-hidden="true" />
      <div className={`${styles.blob} ${styles.b3}`} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.badge}>
          <span className={styles.dot} aria-hidden="true" />
          Open to senior opportunities
        </div>

        <h1 className={styles.name}>
          <span className="grad">Sourav Sharma</span>
        </h1>

        <p className={styles.role} aria-label="Senior Frontend Engineer">
          <span>{typed}</span>
          <span className={styles.cursor} aria-hidden="true" />
        </p>

        <p className={styles.desc}>
          8+ years building production‑grade web applications — from scalable MERN stacks to{' '}
          <strong>secure digital banking</strong> at <strong>Emirates NBD</strong>, Dubai.
          Specialising in <strong>React.js</strong> and <strong>TypeScript</strong>.
        </p>

        <div className={styles.cta}>
          <a href="#experience" className="btn-primary">View My Work ↓</a>
          <a href="#contact"    className="btn-ghost">Get In Touch</a>
        </div>

        <div className={styles.stats} role="list" aria-label="Career highlights">
          {heroStats.map((s) => (
            <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
          ))}
        </div>
      </div>

      <div className={styles.scrollCue} aria-hidden="true">Scroll</div>
    </section>
  );
}
