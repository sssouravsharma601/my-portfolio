import { useEffect, useRef, useState } from 'react';
import { profile } from '../../data/profile';
import { ArrowUpRight, Check, Copy } from '../Icons';
import ContactForm from './ContactForm';
import styles from './Contact.module.css';

export default function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className={`page ruled ${styles.contact}`}
    >
      <div className={styles.lead}>
        <h2 id="contact-heading" className={`${styles.heading} reveal`}>
          Working on something hard? <em>Let’s talk.</em>
        </h2>
        <p className={`${styles.note} reveal`}>
          Email is the fastest way to reach me. I usually reply within a day or two.
        </p>

        <EmailRow />

        <ul className={`${styles.links} reveal`}>
          <li>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              <span>LinkedIn</span>
              <ArrowUpRight />
            </a>
          </li>
          <li>
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              <span>GitHub</span>
              <ArrowUpRight />
            </a>
          </li>
          <li>
            <a href={profile.phone.href}>
              <span>{profile.phone.display}</span>
              <ArrowUpRight />
            </a>
          </li>
        </ul>
      </div>

      <div className={`${styles.formWrap} reveal`}>
        <h3 className={styles.formTitle}>Or send a note</h3>
        <ContactForm />
      </div>
    </section>
  );
}

function EmailRow() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <div className={`${styles.email} reveal`}>
      <a href={`mailto:${profile.email}`} className={styles.emailLink}>
        {profile.email}
      </a>
      <button
        type="button"
        onClick={() => void copy()}
        className={styles.copy}
        aria-label={copied ? 'Email address copied' : 'Copy email address'}
      >
        {copied ? <Check /> : <Copy />}
        <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
      </button>
    </div>
  );
}
