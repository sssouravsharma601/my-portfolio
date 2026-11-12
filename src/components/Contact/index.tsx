import { useEffect, useRef, useState } from 'react';
import { hiring, profile } from '../../data/profile';
import { ArrowUpRight, Check, Copy } from '../Icons';
import ContactForm from './ContactForm';
import styles from './Contact.module.css';

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className={styles.contact} data-spot>
      <div className={`page ${styles.inner}`}>
        <header className={styles.head}>
          <span className="label" aria-hidden="true">
            05 /
          </span>
          <h2 id="contact-heading" className={styles.heading}>
            <span className={styles.kicker}>Working on something hard?</span> Let’s talk.
          </h2>
        </header>

        <dl className={styles.hiring} aria-label="Hiring details">
          {hiring.map((h) => (
            <div key={h.label}>
              <dt className="label">{h.label}</dt>
              <dd>{h.value}</dd>
            </div>
          ))}
        </dl>

        <div className={styles.cols}>
          <div className={styles.lead}>
            <p className={styles.note}>
              Email is the fastest way to reach me. I usually reply within a day or two.
            </p>

            <EmailRow />

            <ul className={styles.links}>
              <li>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer me">
                  <span>LinkedIn</span>
                  <ArrowUpRight size={18} />
                </a>
              </li>
              <li>
                <a href={profile.github} target="_blank" rel="noopener noreferrer me">
                  <span>GitHub</span>
                  <ArrowUpRight size={18} />
                </a>
              </li>
              <li>
                <a href={profile.phone.href}>
                  <span>{profile.phone.display}</span>
                  <ArrowUpRight size={18} />
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.formWrap}>
            <h3 className={`label ${styles.formTitle}`}>Or send a note</h3>
            <ContactForm />
          </div>
        </div>
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
    <div className={styles.email}>
      <a href={`mailto:${profile.email}`} className={styles.emailLink}>
        {profile.email}
      </a>
      <button
        type="button"
        onClick={() => void copy()}
        className={`label ${styles.copy}`}
        aria-label={copied ? 'Email address copied' : 'Copy email address'}
      >
        {copied ? <Check /> : <Copy />}
        <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
      </button>
    </div>
  );
}
