import ScrollReveal from '../ui/ScrollReveal';
import SectionHeading from '../ui/SectionHeading';
import ContactForm from './ContactForm';
import { contactChannels } from '../../data/education';
import { MailIcon, LinkedInIcon, PhoneIcon } from '../ui/Icons';
import styles from './Contact.module.css';

const getContactIcon = (iconKey: string) => {
  switch (iconKey) {
    case 'email':
      return <MailIcon size={18} />;
    case 'linkedin':
      return <LinkedInIcon size={18} />;
    case 'phone':
      return <PhoneIcon size={18} />;
    default:
      return <MailIcon size={18} />;
  }
};

export default function Contact() {
  return (
    <section id="contact" className="section alt-bg" aria-label="Contact">
      <SectionHeading
        index="05"
        label="Contact"
        title="Get In Touch"
        description="Open to senior roles, technical advisory, and consulting opportunities globally."
      />

      <div className={styles.grid}>
        {/* Contact channels — large list rows, not boxed cards */}
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
                    {getContactIcon(ch.icon)}
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

        {/* Form — flush, not a bordered card */}
        <ScrollReveal direction="right">
          <div className={styles.formWrap}>
            <div className={styles.formTitle}>Send a Message</div>
            <ContactForm />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
