import type { Degree, Highlight, Role, SkillGroup } from '../types';
import { yearsSince } from '../utils/date';

export const CAREER_START = { year: 2018, month: 2 };
export const YEARS = yearsSince(CAREER_START);

export const profile = {
  name: 'Sourav Sharma',
  title: 'Senior Frontend Engineer',
  location: 'Dubai, UAE',
  timeZone: 'Asia/Dubai',
  email: 'sssouravsharma601@gmail.com',
  phone: { display: '+971 58 985 0644', href: 'tel:+971589850644' },
  linkedin: 'https://www.linkedin.com/in/sssouravsharma601/',
  github: 'https://github.com/sssouravsharma601',
  availability: 'Open to senior and lead frontend roles',
} as const;

export const roles: Role[] = [
  {
    id: 'synechron',
    title: 'Senior Associate, Frontend Lead',
    company: 'Synechron',
    context: 'for Emirates NBD',
    start: { year: 2024, month: 4 },
    summary:
      'Lead a team of four on the Decision Management System, the rule engine that decides eligibility for personal loans, credit cards and overdrafts across the bank.',
    highlights: [
      'Designed the configuration panel from scratch, including a flow-builder canvas for composing nested risk-eligibility models.',
      'Virtualised the heaviest UI modules, cutting memory use by 35% during large calculations.',
      'Set the frontend security baseline for public and private APIs to meet the bank’s compliance requirements.',
    ],
    stack: ['React', 'TypeScript', 'Node.js', 'Python', 'Oracle', 'PostgreSQL'],
  },
  {
    id: 'byjus',
    title: 'Senior Software Engineer',
    company: 'BYJU’S',
    start: { year: 2021, month: 9 },
    end: { year: 2024, month: 3 },
    summary:
      'Led five frontend engineers on the Student Learn Portal: tests, live classes and video for millions of daily students.',
    highlights: [
      'Took Lighthouse performance from 52 to 91 through a sustained round of bundle work.',
      'Moved the assessment flow to optimistic updates; in-class interaction went up 42%.',
      'Built the message bridge between the React modules and the Flutter mobile shell.',
    ],
    stack: ['React', 'Ruby on Rails', 'MongoDB', 'PostgreSQL', 'Flutter'],
  },
  {
    id: 'robosoft',
    title: 'Software Engineer L2',
    company: 'Robosoft',
    context: 'for Ola Electric',
    start: { year: 2021, month: 4 },
    end: { year: 2021, month: 9 },
    summary:
      'Worked on the reservation and purchase portal for Ola Electric’s scooter launch, one of the largest EV rollouts in India.',
    highlights: [
      'Fixed race conditions in the reservation pipeline so it held up under 100k+ concurrent requests on launch day.',
      'Built the serverless payment integration to PCI-DSS requirements.',
    ],
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Redis'],
  },
  {
    id: 'social-frontier',
    title: 'Software Engineer',
    company: 'Social Frontier',
    context: 'Clearout, Kintegra',
    start: { year: 2018, month: 2 },
    end: { year: 2021, month: 4 },
    summary:
      'Full-stack work across a small SaaS portfolio: real-time email verification, ad scheduling and lead generation.',
    highlights: [
      'Built a job queue on Node.js and AWS SQS that processed millions of verification requests a day.',
      'Built the customer-facing analytics dashboards for dense, high-volume data.',
    ],
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'AWS'],
  },
];

export const highlights: Highlight[] = [
  { value: '52→91', label: 'Lighthouse performance', where: 'BYJU’S' },
  { value: '−35%', label: 'Memory during heavy calculations', where: 'Emirates NBD' },
  { value: '+42%', label: 'In-class interaction', where: 'BYJU’S' },
  { value: '100k+', label: 'Concurrent launch-day requests', where: 'Ola Electric' },
];

export const skills: SkillGroup[] = [
  {
    title: 'Frontend',
    items: ['React', 'TypeScript', 'Next.js', 'Redux Toolkit', 'Zustand', 'CSS', 'Vite / Webpack'],
  },
  {
    title: 'Backend',
    items: ['Node.js', 'Express', 'Ruby on Rails', 'Python / FastAPI', 'REST & GraphQL'],
  },
  {
    title: 'Data',
    items: ['PostgreSQL', 'MongoDB', 'Oracle', 'Redis', 'MySQL'],
  },
  {
    title: 'Delivery',
    items: ['Vitest / Jest', 'Docker', 'GitLab CI', 'AWS', 'Performance budgets'],
  },
];

export const education: Degree[] = [
  {
    title: 'B.Tech, Computer Science',
    school: 'Desh Bhagat University, Punjab',
    year: '2016',
  },
  {
    title: 'Diploma, Computer Engineering',
    school: 'Mehr Chand Polytechnic, Punjab',
    year: '2013',
  },
];
