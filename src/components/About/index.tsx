import ScrollReveal from '../ui/ScrollReveal';
import {
  LocationIcon,
  MailIcon,
  PhoneIcon,
  LinkedInIcon,
  GraduationIcon,
  ServerIcon,
} from '../ui/Icons';
import styles from './About.module.css';

interface InfoItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string | null;
  external?: boolean;
}

const INFO: InfoItem[] = [
  {
    icon: <LocationIcon size={16} />,
    label: 'Location Base',
    value: 'Dubai, UAE 🇦🇪',
    href: null,
  },
  {
    icon: <MailIcon size={16} />,
    label: 'Official Email',
    value: 'sssouravsharma601@gmail.com',
    href: 'mailto:sssouravsharma601@gmail.com',
  },
  {
    icon: <PhoneIcon size={16} />,
    label: 'Direct Phone',
    value: '+971 589 850 644',
    href: 'tel:+971589850644',
  },
  {
    icon: <LinkedInIcon size={16} />,
    label: 'Professional Network',
    value: 'linkedin/sssouravsharma601',
    href: 'https://www.linkedin.com/in/sssouravsharma601/',
    external: true,
  },
  {
    icon: <GraduationIcon size={16} />,
    label: 'Core Education',
    value: 'B.Tech Computer Science',
    href: null,
  },
];

export default function About() {
  return (
    <section id="about" className={`section alt-bg ${styles.about}`} aria-label="About">
      <ScrollReveal className="sec-hd">
        <span className="sec-label">02 — Profile Overview</span>
        <h2 className="sec-title">The Engineer</h2>
        <p className="sec-desc">
          Building durable frontend foundations and low-latency API wrappers to power enterprise web
          clients.
        </p>
      </ScrollReveal>

      <div className={styles.grid}>
        {/* ── Left: photo card ─────────────────────────────── */}
        <ScrollReveal direction="left" className={styles.photoCol}>
          <div className={styles.photoWrap}>
            {/* Decorative corner accents */}
            <span className={`${styles.corner} ${styles.cornerTL}`} aria-hidden="true" />
            <span className={`${styles.corner} ${styles.cornerBR}`} aria-hidden="true" />

            <img
              src="/avatar.jpg"
              alt="Sourav Sharma — Senior Frontend Engineer"
              className={styles.photo}
              width={300}
              height={300}
              loading="lazy"
            />

            {/* Availability badge */}
            <div className={styles.availBadge} aria-label="Open to opportunities">
              <span className={styles.availDot} aria-hidden="true" />
              Active in Dubai
            </div>
          </div>

          {/* Quick stat chips below photo */}
          <div className={styles.chips}>
            <div className={styles.chip}>
              <span className={styles.chipNum}>8+</span>
              <span className={styles.chipLabel}>Years Exp</span>
            </div>
            <div className={styles.chip}>
              <span className={styles.chipNum}>12+</span>
              <span className={styles.chipLabel}>Systems</span>
            </div>
            <div className={styles.chip}>
              <span className={styles.chipNum}>4</span>
              <span className={styles.chipLabel}>Scales</span>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Right: bio + info ─────────────────────────────── */}
        <ScrollReveal direction="right" className={styles.contentCol}>
          <div className={styles.text}>
            <p>
              I am a <strong>Senior Associate at Synechron Technologies</strong>, currently embedded
              as a frontend lead at <strong>Emirates NBD</strong> in Dubai. I architect
              risk-modelling eligibility UIs and credit configurations serving active retail
              operations across the UAE.
            </p>
            <p>
              My stack revolves around the **React.js ecosystem**—with a specific focus on
              structural optimization, Redux state orchestration, performance budgeting, and custom
              native bridges. I design frontend architectures that are modular, strictly typed, and
              easily maintainable.
            </p>
            <p>
              Over my career, I have worked across diverse industries including fintech (Emirates
              NBD), edtech (Byju's Learn Portal), and EV mobility retail (Ola Electric checkout
              pipeline)—consistently delivering scalable codebases and low-latency client apps.
            </p>
          </div>

          <div className={styles.callout}>
            <div className={styles.calloutIcon} aria-hidden="true">
              <ServerIcon size={18} />
            </div>
            <div>
              Currently leading frontend development for the{' '}
              <strong>Decision Management System (DMS)</strong>, automating bank-wide
              risk-eligibility workflows under Synechron at Emirates NBD, Dubai.
            </div>
          </div>

          <ul className={styles.infoList} role="list" aria-label="Personal info">
            {INFO.map(({ icon, label, value, href, external }) => (
              <li key={label} className={styles.infoItem}>
                <div className={styles.infoIcon} aria-hidden="true">
                  {icon}
                </div>
                <div>
                  <div className={styles.infoLabel}>{label}</div>
                  <div className={styles.infoValue}>
                    {href ? (
                      <a
                        href={href}
                        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      >
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>
    </section>
  );
}
