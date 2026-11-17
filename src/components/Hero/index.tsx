import type { ReactNode } from 'react';
import { profile } from '../../data/profile';
import LocalTime from '../LocalTime';
import { ArrowUpRight } from '../Icons';
import ResumeButton from '../ResumeButton';
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
            {'  '}now: <S>Team Lead at Synechron</S>,
          </span>
          <span className={styles.ln}>
            {'  '}builtFor: [<S>Emirates NBD</S>, <S>BYJU’S</S>, <S>Ola Electric</S>],
          </span>
          <span className={styles.ln}>
            {'  '}focus: [<S>React</S>, <S>TypeScript</S>, <S>Performance</S>],
          </span>
          <span className={styles.ln}>
            {'  '}leadsTeamOf: <K>4</K>,
          </span>
          <span className={styles.ln}>
            {'  '}engineerSince: <K>2018</K>,
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
          srcSet="./avatar-128.webp 128w, ./avatar-192.webp 192w, ./avatar-256.webp 256w, ./avatar-384.webp 384w"
          sizes="(min-width: 761px) and (max-height: 800px) 96px, (min-width: 1164px) 128px, (min-width: 873px) 11vw, 96px"
          alt={`Portrait of ${profile.name}`}
          width={560}
          height={560}
          decoding="async"
          className={styles.avatar}
        />

        <p className={styles.eyebrow}>
          {profile.title} · {profile.location}
        </p>

        <h1 className={styles.name}>{profile.name}</h1>

        <p className={styles.statement}>
          I build frontends for complicated systems: a&nbsp;bank’s rule engine, live classes for
          millions of students, a launch&#8209;day checkout.
        </p>

        <div className={styles.actions}>
          <a href={`mailto:${profile.email}`} className={styles.primary}>
            Email me
          </a>
          <ResumeButton className={styles.outline}>Résumé</ResumeButton>
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
