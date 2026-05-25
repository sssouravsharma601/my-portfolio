import type { EducationItem, StatItem, ContactChannel } from '../types';

export const education: EducationItem[] = [
  {
    id: 'btech',
    icon: '🎓',
    degree: 'B.Tech — Computer Science',
    school: 'Desh Bhagat University, Punjab',
    year: '2016',
    score: '79.5%',
  },
  {
    id: 'diploma',
    icon: '📐',
    degree: 'Diploma — Computer Engineering',
    school: 'Mehr Chand Polytechnic College, Punjab',
    year: '2013',
    score: '65.35%',
  },
  {
    id: 'sslc',
    icon: '📚',
    degree: 'SSLC — Secondary Education',
    school: 'AVM Senior Secondary School, Punjab',
    year: '2010',
    score: '55.08%',
  },
];

export const heroStats: StatItem[] = [
  { value: 8, suffix: '+', label: 'Years Experience' },
  { value: 4, suffix: '', label: 'Companies' },
  { value: 6, suffix: '+', label: 'Major Projects' },
  { value: 'UAE', label: 'Dubai Based' },
];

export const contactChannels: ContactChannel[] = [
  {
    icon: '✉️',
    label: 'Email',
    value: 'sssouravsharma601@gmail.com',
    href: 'mailto:sssouravsharma601@gmail.com',
    arrowLabel: '→',
  },
  {
    icon: '🔗',
    label: 'LinkedIn',
    value: 'sssouravsharma601',
    href: 'https://www.linkedin.com/in/sssouravsharma601/',
    external: true,
    arrowLabel: '↗',
  },
  {
    icon: '📱',
    label: 'Phone',
    value: '+971 589 850 644',
    href: 'tel:+971589850644',
    arrowLabel: '→',
  },
];
