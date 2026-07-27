import { useRef } from 'react';
import { motion, type Variants } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import {
  LocationIcon,
  MailIcon,
  PhoneIcon,
  LinkedInIcon,
  GraduationIcon,
  ServerIcon,
} from '../ui/Icons';
import { useGsapAnimation } from '../../animation/useGsapAnimation';
import { gsap } from '../../animation/gsapConfig';
import styles from './About.module.css';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const chipVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

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
  const photoRef = useRef<HTMLDivElement>(null);

  const photoColRef = useGsapAnimation<HTMLDivElement>((scope) => {
    if (!photoRef.current) return;

    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        photoRef.current,
        { clipPath: 'inset(0% 0% 0% 100% round 12px)', scale: 1.12 },
        {
          clipPath: 'inset(0% 0% 0% 0% round 12px)',
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: scope.current,
            start: 'top 85%',
            end: 'top 35%',
            scrub: 0.6,
          },
        },
      );
    });
  }, []);

  return (
    <section id="about" className={`section alt-bg ${styles.about}`} aria-label="About">
      <SectionHeading
        index="02"
        label="Profile Overview"
        title="The Engineer"
        description="Building durable frontend foundations and low-latency API wrappers to power enterprise web clients."
      />

      <div className={styles.grid}>
        {/* ── Left: photo card ─────────────────────────────── */}
        <div className={styles.photoCol} ref={photoColRef}>
          <div className={styles.photoWrap} ref={photoRef}>
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

          {/* Quick stats below photo — hairline-divided, not boxed chips */}
          <motion.div
            className={styles.stats}
            variants={chipVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
          >
            <motion.div className={styles.stat} variants={itemVariants}>
              <span className={styles.statNum}>8+</span>
              <span className={styles.statLabel}>Years Exp</span>
            </motion.div>
            <motion.div className={styles.stat} variants={itemVariants}>
              <span className={styles.statNum}>12+</span>
              <span className={styles.statLabel}>Systems</span>
            </motion.div>
            <motion.div className={styles.stat} variants={itemVariants}>
              <span className={styles.statNum}>4</span>
              <span className={styles.statLabel}>Scales</span>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Right: bio + info ─────────────────────────────── */}
        <motion.div
          className={styles.contentCol}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className={styles.text}>
            <motion.p variants={itemVariants}>
              I am a <strong>Senior Associate at Synechron Technologies</strong>, currently embedded
              as a frontend lead at <strong>Emirates NBD</strong> in Dubai. I architect
              risk-modelling eligibility UIs and credit configurations serving active retail
              operations across the UAE.
            </motion.p>
            <motion.p variants={itemVariants}>
              My stack revolves around the <strong>React.js ecosystem</strong> — with a specific
              focus on structural optimization, Redux state orchestration, performance budgeting,
              and custom native bridges. I design frontend architectures that are modular, strictly
              typed, and easily maintainable.
            </motion.p>
            <motion.p variants={itemVariants}>
              Over my career, I have worked across diverse industries including fintech (Emirates
              NBD), edtech (Byju's Learn Portal), and EV mobility retail (Ola Electric checkout
              pipeline)—consistently delivering scalable codebases and low-latency client apps.
            </motion.p>
          </div>

          <motion.div className={styles.callout} variants={itemVariants}>
            <div className={styles.calloutIcon} aria-hidden="true">
              <ServerIcon size={18} />
            </div>
            <div>
              Currently leading frontend development for the{' '}
              <strong>Decision Management System (DMS)</strong>, automating bank-wide
              risk-eligibility workflows under Synechron at Emirates NBD, Dubai.
            </div>
          </motion.div>

          <motion.ul
            className={styles.infoList}
            role="list"
            aria-label="Personal info"
            variants={chipVariants}
          >
            {INFO.map(({ icon, label, value, href, external }) => (
              <motion.li key={label} className={styles.infoItem} variants={itemVariants}>
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
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}
