import type { CSSProperties } from 'react';
import { profile } from '../../data/profile';
import LocalTime from '../LocalTime';
import { ArrowUpRight } from '../Icons';
import styles from './Intro.module.css';

const i = (n: number) => ({ '--i': n }) as CSSProperties;

export default function Intro() {
  return (
    <section id="top" className={`page ${styles.intro}`} aria-label="Introduction">
      <div className={`${styles.who} rise`} style={i(0)}>
        <img
          src="./avatar.jpg"
          alt=""
          width={44}
          height={44}
          className={styles.avatar}
          decoding="async"
        />
        <p>
          <span className={styles.name}>{profile.name}</span>
          <span className={styles.role}>
            {profile.title}, {profile.location}
          </span>
        </p>
      </div>

      <h1 className={`${styles.statement} rise`} style={i(1)}>
        I build frontends for <em>complicated</em> systems: bank rule engines, live classrooms,
        launch&#8209;day checkouts.
      </h1>

      <dl className={`${styles.facts} rise`} style={i(2)}>
        <div>
          <dt>Now</dt>
          <dd>Frontend lead at Synechron, for Emirates NBD</dd>
        </div>
        <div>
          <dt>Before</dt>
          <dd>BYJU’S, Ola Electric, Clearout</dd>
        </div>
        <div>
          <dt>Local time</dt>
          <dd>
            <LocalTime timeZone={profile.timeZone} /> in Dubai
          </dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd className={styles.status}>
            <span className={styles.dot} aria-hidden="true" />
            {profile.availability}
          </dd>
        </div>
      </dl>

      <div className={`${styles.actions} rise`} style={i(3)}>
        <a href={`mailto:${profile.email}`} className={styles.primary}>
          Email me
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.secondary}
        >
          LinkedIn <ArrowUpRight />
        </a>
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.secondary}
        >
          GitHub <ArrowUpRight />
        </a>
      </div>
    </section>
  );
}
