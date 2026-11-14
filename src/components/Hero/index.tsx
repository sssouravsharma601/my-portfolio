import type { ReactNode } from 'react';
import { profile } from '../../data/profile';
import LocalTime from '../LocalTime';
import { ArrowUpRight } from '../Icons';
import styles from './Hero.module.css';

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
          <span className={styles.ln}>
            {'  '}noticeDays: <K>30</K>,
          </span>
          <span className={styles.ln}>{'}'};</span>
        </code>
      </pre>
    </figure>
  );
}

export default function Hero() {
  return (
    <section id="top" className={styles.hero} aria-label="Introduction">
      <div className={`page ${styles.inner}`}>
        <img
          src="./avatar.jpg"
          alt={`Portrait of ${profile.name}`}
          width={560}
          height={560}
          className={styles.avatar}
        />

        <p className={styles.eyebrow}>
          {profile.title} · {profile.location}
        </p>

        <h1 className={styles.name}>{profile.name}</h1>

        <p className={styles.statement}>
          I build frontends for complicated systems: bank rule engines, live classrooms,
          launch&#8209;day checkouts.
        </p>

        <div className={styles.actions}>
          <a href={`mailto:${profile.email}`} className={styles.primary}>
            Email me
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

        <p className={styles.status}>
          <span className={styles.dot} aria-hidden="true" />
          {profile.availability} · <LocalTime timeZone={profile.timeZone} /> in Dubai
        </p>

        <Snippet />
      </div>
    </section>
  );
}
