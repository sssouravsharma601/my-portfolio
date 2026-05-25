import { useRef, useEffect, useState } from 'react';
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

/** Animated counter that triggers once in viewport */
function StatCounter({
  value,
  suffix,
  label,
}: {
  value: number | string;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);
  const count = useCounter(typeof value === 'number' ? value : 0, 1600, triggered);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof value !== 'number') return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setTriggered(true);
          io.disconnect();
        }
      },
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

/** Terminal-style code window — replaces particle canvas */
function TerminalWindow() {
  return (
    <div className={styles.terminal} aria-hidden="true">
      {/* Title bar */}
      <div className={styles.termBar}>
        <span className={`${styles.termDot} ${styles.dotRed}`} />
        <span className={`${styles.termDot} ${styles.dotYellow}`} />
        <span className={`${styles.termDot} ${styles.dotGreen}`} />
        <span className={styles.termTitle}>profile.json</span>
      </div>

      {/* Body */}
      <div className={styles.termBody}>
        <p className={styles.termLine}>
          <span className={styles.tPrompt}>$</span>
          <span className={styles.tCmd}> cat profile.json</span>
        </p>

        <div className={styles.tJson}>
          <p>
            <span className={styles.tBrace}>{'{'}</span>
          </p>
          <p>
            <span className={styles.tKey}>&quot;name&quot;</span>
            <span className={styles.tColon}>: </span>
            <span className={styles.tStr}>&quot;Sourav Sharma&quot;</span>
            <span className={styles.tPunc}>,</span>
          </p>
          <p>
            <span className={styles.tKey}>&quot;role&quot;</span>
            <span className={styles.tColon}>: </span>
            <span className={styles.tStr}>&quot;Senior Frontend Engineer&quot;</span>
            <span className={styles.tPunc}>,</span>
          </p>
          <p>
            <span className={styles.tKey}>&quot;exp&quot;</span>
            <span className={styles.tColon}>: </span>
            <span className={styles.tStr}>&quot;8+ years&quot;</span>
            <span className={styles.tPunc}>,</span>
          </p>
          <p>
            <span className={styles.tKey}>&quot;location&quot;</span>
            <span className={styles.tColon}>: </span>
            <span className={styles.tStr}>&quot;Dubai, UAE 🇦🇪&quot;</span>
            <span className={styles.tPunc}>,</span>
          </p>
          <p>
            <span className={styles.tKey}>&quot;stack&quot;</span>
            <span className={styles.tColon}>: </span>
            <span className={styles.tBrace}>[</span>
          </p>
          <p className={styles.tIndent}>
            <span className={styles.tStr}>&quot;React&quot;</span>
            <span className={styles.tPunc}>, </span>
            <span className={styles.tStr}>&quot;TypeScript&quot;</span>
            <span className={styles.tPunc}>,</span>
          </p>
          <p className={styles.tIndent}>
            <span className={styles.tStr}>&quot;Node.js&quot;</span>
            <span className={styles.tPunc}>, </span>
            <span className={styles.tStr}>&quot;GraphQL&quot;</span>
            <span className={styles.tPunc}>,</span>
          </p>
          <p className={styles.tIndent}>
            <span className={styles.tStr}>&quot;MongoDB&quot;</span>
            <span className={styles.tPunc}>, </span>
            <span className={styles.tStr}>&quot;AWS&quot;</span>
          </p>
          <p>
            <span className={styles.tBrace}>]</span>
            <span className={styles.tPunc}>,</span>
          </p>
          <p>
            <span className={styles.tKey}>&quot;status&quot;</span>
            <span className={styles.tColon}>: </span>
            <span className={styles.tAvail}>&quot;open to work 🚀&quot;</span>
          </p>
          <p>
            <span className={styles.tBrace}>{'}'}</span>
          </p>
        </div>

        <p className={styles.termLine}>
          <span className={styles.tPrompt}>$</span>
          <span className={styles.tCursor} />
        </p>
      </div>
    </div>
  );
}

export default function Hero() {
  const typed = useTyping(PHRASES);

  return (
    <section id="hero" className={styles.hero} aria-label="Introduction">
      {/* CSS dot-grid background */}
      <div className={styles.dotGrid} aria-hidden="true" />

      <div className={styles.inner}>
        {/* ── Left column ── */}
        <div className={styles.content}>
          <div className={styles.badge}>
            <span className={styles.statusDot} aria-hidden="true" />
            Open to senior opportunities
          </div>

          <h1 className={styles.name}>Sourav Sharma</h1>

          <p className={styles.role} aria-label="Role">
            <span>{typed}</span>
            <span className={styles.cursor} aria-hidden="true" />
          </p>

          <p className={styles.desc}>
            8+ years building production‑grade web applications — from scalable MERN stacks to{' '}
            <strong>secure digital banking</strong> at <strong>Emirates NBD</strong>, Dubai.
            Specialised in <strong>React.js</strong> and <strong>TypeScript</strong>.
          </p>

          <div className={styles.cta}>
            <a href="#experience" className="btn-primary">
              View My Work ↓
            </a>
            <a href="#contact" className="btn-ghost">
              Get In Touch
            </a>
          </div>

          <div className={styles.stats} role="list" aria-label="Career highlights">
            {heroStats.map((s) => (
              <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
            ))}
          </div>
        </div>

        {/* ── Right column: terminal ── */}
        <TerminalWindow />
      </div>

      <div className={styles.scrollCue} aria-hidden="true">
        scroll
      </div>
    </section>
  );
}
