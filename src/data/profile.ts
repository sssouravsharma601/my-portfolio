import type { CaseStudy, Degree, Highlight, Role, SkillGroup } from '../types';
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
  availability: 'Open to new roles · 30 days’ notice',
} as const;

/** The questions a recruiter asks first, answered up front. */
export const hiring: { label: string; value: string }[] = [
  { label: 'Notice period', value: '30 days' },
  { label: 'Visa', value: 'UAE residence visa, employer-sponsored' },
  { label: 'Based', value: 'Dubai, working on-site' },
  { label: 'Time zone', value: 'UAE time (UTC+4)' },
  {
    label: 'Roles',
    value:
      'Senior Frontend Engineer, Senior Software Engineer, Frontend Engineer, Software Engineer',
  },
];

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

/**
 * Longer write-ups of two roles. Keep these free of anything an employer
 * would treat as confidential: no vendor names, screenshots or internal figures.
 */
export const caseStudies: CaseStudy[] = [
  {
    id: 'synechron',
    client: 'Emirates NBD, via Synechron',
    period: '2024 – present',
    title: 'Decision Management System',
    lede: 'The in-house engine that decides who is eligible for a loan, a credit card or an overdraft.',
    role: 'Frontend lead: BRMS and non-functional requirements',
    team: '10–12 people',
    context: [
      'Every application for a personal loan, credit card or overdraft has to be checked against the bank’s eligibility rules. The Decision Management System runs that check, and it does so for several banking entities in the group, each with rules of its own.',
      'It is a transformation project. These decisions used to run on a third-party tool, and this platform is being built in-house to take over. The rules themselves live in the Business Rule Management System (BRMS), where they are written and maintained.',
    ],
    mine: 'I work on the BRMS, the application where the rules are defined, and I own the non-functional requirements for the frontend: performance, memory and security.',
    built: [
      'Designed the configuration panel from scratch, including a flow-builder canvas for composing nested risk-eligibility models.',
      'Virtualised the heaviest UI modules, which cut memory use by 35% during large calculations.',
      'Set the frontend security baseline for public and private APIs to meet the bank’s compliance requirements.',
    ],
    figures: [{ value: '−35%', label: 'Memory during large calculations' }],
    flow: [
      {
        label: 'Rule authors',
        note: 'Business teams who own the eligibility rules',
        next: 'write and maintain',
      },
      {
        label: 'BRMS',
        note: 'Flow-builder canvas for nested eligibility models',
        mine: true,
        next: 'rules',
      },
      {
        label: 'Decision engine',
        note: 'Checks each application against the rules',
        aside: 'Applications in: personal loans, credit cards, overdrafts',
        next: 'decision',
      },
      { label: 'Eligible, or not', note: 'The answer the bank acts on' },
    ],
  },
  {
    id: 'byjus',
    client: 'BYJU’S',
    period: '2021 – 2024',
    title: 'Learn Portal 2.0',
    lede: 'A rebuild of the student portal: live classes, tests and video for millions of daily students.',
    role: 'Senior software engineer',
    team: 'Led five frontend engineers',
    context: [
      'Learn Portal 2.0 replaced the legacy learn portal. It is the web app where students join live classes, catch up on past ones, take tests, watch learning videos and work through topics from a very large content library.',
      'Students belong to different kinds of batches, and the portal shows each of them their own class schedule.',
    ],
    mine: 'I led five frontend engineers on the portal through the move off the legacy version.',
    built: [
      'Took Lighthouse performance from 52 to 91 through a sustained round of bundle work.',
      'Moved the assessment flow to optimistic updates; in-class interaction went up 42%.',
      'Built the message bridge between the React modules and the Flutter mobile shell.',
    ],
    figures: [
      { value: '52→91', label: 'Lighthouse performance' },
      { value: '+42%', label: 'In-class interaction' },
    ],
    flow: [
      { label: 'Student', note: 'In a browser or in the mobile app', next: 'opens' },
      {
        label: 'Learn Portal 2.0',
        note: 'React web app',
        mine: true,
        parts: ['Live classes', 'Past classes', 'Tests', 'Videos', 'Schedule'],
        aside: 'Also runs inside the Flutter mobile app, through a message bridge',
        next: 'requests',
      },
      { label: 'Platform services', note: 'Ruby on Rails, MongoDB, PostgreSQL' },
    ],
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
