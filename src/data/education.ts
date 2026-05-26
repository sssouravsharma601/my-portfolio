import type { EducationItem, StatItem, ContactChannel } from '../types';

export const education: EducationItem[] = [
  {
    id: 'btech',
    icon: 'graduation',
    degree: 'B.Tech — Computer Science',
    school: 'Desh Bhagat University, Punjab',
    year: '2016',
    score: '79.5% Cumulative Grade',
  },
  {
    id: 'diploma',
    icon: 'ruler',
    degree: 'Diploma — Computer Engineering',
    school: 'Mehr Chand Polytechnic College, Punjab',
    year: '2013',
    score: '65.35% Cumulative Grade',
  },
  {
    id: 'sslc',
    icon: 'books',
    degree: 'SSLC — Secondary Education',
    school: 'AVM Senior Secondary School, Punjab',
    year: '2010',
    score: '55.08% Grade',
  },
];

export const heroStats: StatItem[] = [
  { value: 8, suffix: '+', label: 'Years Active' },
  { value: 4, suffix: '', label: 'Tech Scales' },
  { value: 12, suffix: '+', label: 'Systems Shipped' },
  { value: 'DXB', label: 'Dubai Based' },
];

export const contactChannels: ContactChannel[] = [
  {
    icon: 'email',
    label: 'Direct Email',
    value: 'sssouravsharma601@gmail.com',
    href: 'mailto:sssouravsharma601@gmail.com',
    arrowLabel: '→',
  },
  {
    icon: 'linkedin',
    label: 'LinkedIn Connection',
    value: 'sssouravsharma601',
    href: 'https://www.linkedin.com/in/sssouravsharma601/',
    external: true,
    arrowLabel: '↗',
  },
  {
    icon: 'phone',
    label: 'Mobile Hotline',
    value: '+971 589 850 644',
    href: 'tel:+971589850644',
    arrowLabel: '→',
  },
];
