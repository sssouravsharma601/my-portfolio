import { useEffect, useRef, type ReactNode, type RefObject } from 'react';
import { profile } from '../../data/profile';
import LocalTime from '../LocalTime';
import Field from './Field';
import { ArrowUpRight } from '../Icons';
import styles from './Hero.module.css';

const [FIRST = '', LAST = ''] = profile.name.split(' ');
const TICKER = [
  'Bank rule engines',
  'Live classrooms',
  'Launch-day checkouts',
  'Design systems',
  'Performance budgets',
];

/** How far the pointer's pull reaches, in px, and how thin a letter can get. */
const RADIUS = 340;
const WGHT = { rest: 800, min: 180 };
const WDTH = { rest: 100, min: 66 };

/**
 * The name is set in a variable font. Letters near the pointer lose weight
 * and width, so the cursor leaves a dent in the wordmark as it moves.
 * Works with a mouse, a pen, or a finger dragged across the name; never when
 * the visitor prefers reduced motion.
 */
function useKineticType(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const letters = Array.from(el.querySelectorAll<HTMLElement>('[data-letter]'));
    let frame = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      frame = 0;
      // Read every box first, then write, so one move costs one layout.
      const pulls = letters.map((l) => {
        const r = l.getBoundingClientRect();
        const d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2));
        return Math.max(0, 1 - d / RADIUS) ** 1.5;
      });
      letters.forEach((l, i) => {
        const t = pulls[i] ?? 0;
        l.style.setProperty('--wght', String(Math.round(WGHT.rest - (WGHT.rest - WGHT.min) * t)));
        l.style.setProperty('--wdth', String(Math.round(WDTH.rest - (WDTH.rest - WDTH.min) * t)));
      });
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onLeave = (e: PointerEvent) => {
      // A mouse button release is not the end of a hover.
      if (e.type === 'pointerup' && e.pointerType === 'mouse') return;
      cancelAnimationFrame(frame);
      frame = 0;
      letters.forEach((l) => {
        l.style.removeProperty('--wght');
        l.style.removeProperty('--wdth');
      });
    };

    const events = ['pointerleave', 'pointerup', 'pointercancel'] as const;
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerdown', onMove);
    events.forEach((t) => el.addEventListener(t, onLeave));
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerdown', onMove);
      events.forEach((t) => el.removeEventListener(t, onLeave));
      cancelAnimationFrame(frame);
    };
  }, [ref]);
}

function Letters({ word }: { word: string }) {
  return (
    <span className={styles.line} aria-hidden="true">
      {Array.from(word).map((ch, i) => (
        <span key={i} data-letter className={styles.letter}>
          {ch}
        </span>
      ))}
    </span>
  );
}

const K = ({ children }: { children: ReactNode }) => <span className={styles.kw}>{children}</span>;
const S = ({ children }: { children: ReactNode }) => (
  <span className={styles.str}>&quot;{children}&quot;</span>
);

/** The at-a-glance facts, written the way the owner would write them. */
function Snippet() {
  return (
    <figure className={styles.code} aria-label="Profile summary as a TypeScript object" data-spot>
      <figcaption className={`label ${styles.codeBar}`}>
        <span>sourav.ts</span>
        <span aria-hidden="true">TS</span>
      </figcaption>
      <pre className={styles.pre}>
        <code>
          <span className={styles.ln}>
            <K>export const</K> sourav = {'{'}
          </span>
          <span className={styles.ln}>
            {'  '}role: <S>{profile.title}</S>,
          </span>
          <span className={styles.ln}>
            {'  '}now: <S>Synechron, for Emirates NBD</S>,
          </span>
          <span className={styles.ln}>
            {'  '}before: [<S>BYJU’S</S>, <S>Ola Electric</S>, <S>Clearout</S>],
          </span>
          <span className={styles.ln}>
            {'  '}focus: [<S>React</S>, <S>TypeScript</S>, <S>Performance</S>],
          </span>
          <span className={styles.ln}>
            {'  '}leadsTeams: <K>true</K>,
          </span>
          <span className={styles.ln}>{'}'};</span>
        </code>
      </pre>
    </figure>
  );
}

export default function Hero() {
  const hero = useRef<HTMLElement>(null);
  const name = useRef<HTMLHeadingElement>(null);
  useKineticType(name);

  return (
    <section ref={hero} id="top" className={styles.hero} aria-label="Introduction">
      <Field host={hero} />
      <div className={`page ${styles.inner}`}>
        <ul className={`label ${styles.meta}`}>
          <li>{profile.title}</li>
          <li>
            {profile.location} · <LocalTime timeZone={profile.timeZone} /> local
          </li>
          <li className={styles.status}>
            <span className={styles.dot} aria-hidden="true" />
            {profile.availability}
          </li>
        </ul>

        <div className={styles.nameWrap}>
          {/* The h1's text is exactly the name. Each letter is its own box for the
              pointer effect, so the label gives assistive tech the plain words. */}
          <h1 ref={name} className={styles.name} aria-label={profile.name}>
            <Letters word={FIRST} /> <Letters word={LAST} />
          </h1>

          <div className={styles.stamp}>
            <svg viewBox="0 0 200 200" className={styles.ring} aria-hidden="true">
              <defs>
                <path id="stamp-ring" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
              </defs>
              <text>
                <textPath href="#stamp-ring" textLength="508">
                  React · TypeScript · Frontend architecture · Since 2018 ·
                </textPath>
              </text>
            </svg>
            <img
              src="./avatar.jpg"
              alt={`Portrait of ${profile.name}`}
              width={560}
              height={560}
              className={styles.avatar}
            />
          </div>
        </div>

        <div className={styles.lower}>
          <p className={styles.statement}>
            I build frontends for <em>complicated</em> systems: bank rule engines, live classrooms,
            launch&#8209;day checkouts.
          </p>

          <Snippet />

          <div className={styles.actions}>
            <a href={`mailto:${profile.email}`} className={styles.primary}>
              Email me <ArrowUpRight size={18} />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer me"
              className={styles.secondary}
            >
              LinkedIn <ArrowUpRight />
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer me"
              className={styles.secondary}
            >
              GitHub <ArrowUpRight />
            </a>
          </div>
        </div>
      </div>

      <div className={styles.ticker} aria-hidden="true">
        <div className={styles.track}>
          {[0, 1, 2].map((n) => (
            <span key={n} className={styles.run}>
              {TICKER.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
