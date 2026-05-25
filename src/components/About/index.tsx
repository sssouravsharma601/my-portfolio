import ScrollReveal from '../ui/ScrollReveal';
import styles from './About.module.css';

const INFO = [
  { icon: '📍', label: 'Location', value: 'Dubai, UAE', href: null },
  {
    icon: '✉️',
    label: 'Email',
    value: 'sssouravsharma601@gmail.com',
    href: 'mailto:sssouravsharma601@gmail.com',
  },
  { icon: '📱', label: 'Phone', value: '+971 589 850 644', href: 'tel:+971589850644' },
  {
    icon: '💼',
    label: 'LinkedIn',
    value: 'sssouravsharma601 ↗',
    href: 'https://www.linkedin.com/in/sssouravsharma601/',
    external: true,
  },
  { icon: '🎓', label: 'Education', value: 'B.Tech Computer Science, 2016', href: null },
];

export default function About() {
  return (
    <section id="about" className={`section alt-bg ${styles.about}`} aria-label="About">
      <ScrollReveal className="sec-hd">
        <span className="sec-label">02 — About</span>
        <h2 className="sec-title">Who I Am</h2>
        <p className="sec-desc">
          Bridging engineering depth with product thinking — building software that lasts.
        </p>
      </ScrollReveal>

      <div className={styles.grid}>
        <ScrollReveal direction="left">
          <div className={styles.text}>
            <p>
              I'm a <strong>Senior Associate at Synechron Technologies</strong>, embedded on-site at{' '}
              <strong>Emirates NBD</strong> in Dubai — building secure, scalable digital banking
              products used by millions of customers across the UAE.
            </p>
            <p>
              My core focus is the <strong>React.js ecosystem</strong> — Redux, TypeScript, Webpack,
              and Babel — with a strong emphasis on clean architecture, performance, and UX quality.
              I've led cross-functional teams of 4–5 engineers and shipped complex features on tight
              timelines.
            </p>
            <p>
              Before fintech, I built full-stack depth across EdTech (Byju's), e-commerce (Ola
              Electric), email infrastructure (Clearout), and ad-tech (Kintegra) — always on the{' '}
              <strong>MERN stack</strong>.
            </p>
          </div>
          <div className={styles.callout}>
            <span className={styles.calloutIcon} aria-hidden="true">
              🏦
            </span>
            <div>
              Currently delivering <strong>Decision Management Systems</strong> for real-time loan
              eligibility and credit-card assessment at one of the UAE's largest banks.
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right">
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
