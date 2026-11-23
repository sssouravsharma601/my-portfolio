import type { CaseStudy, Degree, Highlight, Role, SkillGroup } from '../types';

export const CAREER_START = { year: 2018, month: 2 };

export const profile = {
  name: 'Sourav Sharma',
  title: 'Senior Frontend Engineer',
  location: 'Dubai, UAE',
  timeZone: 'Asia/Dubai',
  email: 'sssouravsharma601@gmail.com',
  phone: { display: '+971 58 985 0644', href: 'tel:+971589850644' },
  linkedin: 'https://www.linkedin.com/in/sssouravsharma601/',
  github: 'https://github.com/sssouravsharma601',
  availability: 'Open to senior roles · 30 days’ notice',
} as const;

/** The questions a recruiter asks first, answered up front. */
export const hiring: { label: string; value: string }[] = [
  { label: 'Roles', value: 'Senior Frontend Engineer, Senior Software Engineer' },
  { label: 'Location', value: 'Dubai, UAE (UTC+4)' },
  { label: 'Work mode', value: 'On-site only' },
  { label: 'Notice period', value: '30 days' },
  {
    label: 'Visa',
    value:
      'Employer-sponsored UAE residence visa. A new employer would need to transfer it or sponsor a new one.',
  },
  { label: 'Relocation', value: 'Open to relocating abroad with visa sponsorship' },
];

export const roles: Role[] = [
  {
    id: 'synechron',
    title: 'Senior Associate, Team Lead',
    company: 'Synechron',
    context: 'for a UAE bank',
    start: { year: 2024, month: 4 },
    summary:
      'I lead four engineers across frontend and backend on the Decision Management System, the bank’s in-house platform for deciding who is eligible for a personal loan, credit card or overdraft. It is already live for multiple products.',
    highlights: [
      'Designed the configuration panel from scratch, including a flow-builder canvas for nested risk-eligibility models.',
      'Cut memory use by 35% during large calculations by virtualising the heaviest UI modules.',
      'Set the frontend security baseline for public and private APIs, to meet the bank’s compliance requirements.',
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
      'I led five frontend engineers on Learn Portal 2.0, the student portal for live classes, tests and learning videos, used by millions of students a day.',
    highlights: [
      'Took the Lighthouse performance score from 52 to 91 through package choices, lazy loading, a CDN and a service worker.',
      'Attendance in live classes rose 42% after the move from the legacy portal.',
      'Moved the assessment flow to optimistic updates, so the interface responds at once instead of waiting for the server.',
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
      'I worked on the reservation and purchase portal for Ola Electric’s scooter launch, one of India’s largest EV rollouts.',
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
    context: 'on Clearout and Kintegra',
    start: { year: 2018, month: 2 },
    end: { year: 2021, month: 4 },
    summary:
      'I worked across the stack on a small SaaS portfolio: real-time email verification, ad scheduling and lead generation.',
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
    client: 'A UAE bank, via Synechron',
    period: '2024 – Present',
    title: 'Decision Management System',
    lede: 'A bank’s in-house platform for deciding who is eligible for a personal loan, a credit card or an overdraft.',
    role: 'Team Lead',
    team: 'I lead four engineers, frontend and backend, in a team of 10–12',
    context: [
      'Every application for a personal loan, credit card or overdraft has to be checked against the bank’s eligibility rules. The Decision Management System is the platform that runs that check. The rules themselves are written and maintained in their own application, the Business Rule Management System (BRMS).',
      'This is a transformation project: the platform is being built in-house to replace the third-party tool the bank has used for these decisions. It is already live for multiple products, with more to follow.',
    ],
    mine: 'I lead four of the engineers and work on the BRMS myself. I also handle the non-functional requirements, such as memory use and security.',
    built: [
      'BRMS: I designed the configuration panel from scratch, including the flow-builder canvas where nested risk-eligibility models are composed.',
      'Memory: I virtualised the heaviest UI modules. Memory use during large calculations fell by 35%.',
      'Security: I set the frontend security baseline for public and private APIs, to meet the bank’s compliance requirements.',
    ],
    deep: {
      title: 'The hard part',
      intro:
        'One rule set holds several rules, and each rule is a chain of if, else if and else branches built from AND and OR conditions. The interface has to let someone write all of it without losing their place.',
      points: [
        'Rule sets: a single rule set can hold several rules.',
        'Rules: each rule is a chain of if, else if and else branches.',
        'Conditions: one to a row. The first row opens the branch, and each row after it joins with AND or OR.',
        'Actions: each branch closes with a then block, the action to take when its conditions hold. One block can assign several values.',
        'Drafts: work can be saved as a draft before it is finished.',
        'Screens: the same editor fits a phone, a tablet and a desktop.',
      ],
    },
    sketch: {
      caption: 'The shape of one rule set. An illustration, not the bank’s rules.',
      rules: [
        {
          name: 'Rule 1',
          branches: [
            {
              keyword: 'if',
              rows: [
                { text: 'Income meets the threshold' },
                { join: 'and', text: 'Age is within range' },
              ],
              then: ['eligible = Yes'],
            },
            { keyword: 'else', then: ['eligible = No', 'reason = Criteria not met'] },
          ],
        },
        {
          name: 'Rule 2',
          branches: [
            {
              keyword: 'if',
              rows: [
                { text: 'Employer is on the approved list' },
                { join: 'or', text: 'Salary is transferred' },
              ],
              then: ['limit band = Standard'],
            },
            {
              keyword: 'else if',
              rows: [{ text: 'Existing customer' }],
              then: ['limit band = Lower'],
            },
            { keyword: 'else', then: ['decision = Refer for review'] },
          ],
        },
      ],
    },
    figures: [{ value: '−35%', label: 'Memory use during large calculations' }],
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
    lede: 'The replacement for BYJU’S legacy student portal: live classes, tests and learning videos for millions of students a day.',
    role: 'Senior Software Engineer',
    team: 'I led five frontend engineers',
    context: [
      'Learn Portal 2.0 replaced the legacy portal. It was the web app where students joined live classes, caught up on past ones, took tests, watched learning videos and worked through topics from a very large content library.',
      'Students were grouped into different kinds of batches, and the portal showed each student their own class schedule.',
    ],
    mine: 'I led the frontend team through the move off the legacy portal. Attendance in live classes was 42% higher afterwards. The parts of the build I’d point to:',
    built: [
      'Performance: I took the Lighthouse performance score from 52 to 91. The four changes behind it are set out below.',
      'Assessments: I moved the assessment flow to optimistic updates, so the interface responds at once instead of waiting for the server.',
      'Mobile: I built the message bridge that lets the React modules run inside the Flutter mobile shell.',
    ],
    deep: {
      title: 'How 52 became 91',
      intro: 'There was no single fix. Four things moved the score:',
      points: [
        'Package choices: dependencies were picked with their bundle cost in mind.',
        'Lazy loading: a student downloaded only the part of the portal they opened.',
        'CDN: static assets were served from a CDN.',
        'Service worker: it made the portal a progressive web app. Offline, students could still see the list of videos, though not play them.',
      ],
    },
    figures: [
      { value: '52→91', label: 'Lighthouse performance score' },
      { value: '+42%', label: 'Live-class attendance vs the legacy portal' },
    ],
    flow: [
      { label: 'Student', note: 'In a browser or in the mobile app', next: 'opens' },
      {
        label: 'Learn Portal 2.0',
        note: 'React progressive web app',
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
  { value: '52→91', label: 'Lighthouse performance score', where: 'BYJU’S' },
  { value: '−35%', label: 'Memory use during large calculations', where: 'A UAE bank' },
  { value: '+42%', label: 'Live-class attendance vs the legacy portal', where: 'BYJU’S' },
  { value: '100k+', label: 'Concurrent requests on launch day', where: 'Ola Electric' },
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
