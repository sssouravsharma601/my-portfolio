import ScrollReveal from '../ui/ScrollReveal';
import ContactForm from './ContactForm';
import { contactChannels } from '../../data/education';
import styles from './Contact.module.css';

export default function Contact() {
  return (
    <section id="contact" className="section alt-bg" aria-label="Contact">
      <ScrollReveal className="sec-hd">
        <span className="sec-label">05 — Contact</span>
        <h2 className="sec-title">Get In Touch</h2>
        <p className="sec-desc">
          Open to senior frontend and full-stack roles in the UAE and remotely.
        </p>
      </ScrollReveal>

      <div className={styles.grid}>
        {/* Contact channels */}
        <ScrollReveal direction="left">
          <ul className={styles.channels} role="list" aria-label="Contact channels">
            {contactChannels.map((ch) => (
              <li key={ch.label}>
                <a
                  href={ch.href}
                  className={styles.channel}
                  {...(ch.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  aria-label={`${ch.label}: ${ch.value}`}
                >
                  <div className={styles.chIcon} aria-hidden="true">
                    {ch.icon}
                  </div>
                  <div className={styles.chBody}>
                    <div className={styles.chLabel}>{ch.label}</div>
                    <div className={styles.chValue}>{ch.value}</div>
                  </div>
                  <span className={styles.chArrow} aria-hidden="true">
                    {ch.arrowLabel}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </ScrollReveal>

        {/* Form */}
        <ScrollReveal direction="right">
          <div className={styles.formCard}>
            <div className={styles.formTitle}>Send a Message</div>
            <ContactForm />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
