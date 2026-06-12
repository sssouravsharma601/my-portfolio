import type { ExperienceItem } from '../types';

/**
 * Derives a human "N.N yrs" / "N mos" label from a start date to today.
 * Keeps the current ("Present") role duration accurate on every build
 * instead of drifting out of date.
 */
function durationSince(year: number, monthIndex: number): string {
  const now = new Date();
  const months = (now.getFullYear() - year) * 12 + (now.getMonth() - monthIndex);
  if (months < 12) return `${months} mos`;
  return `${(months / 12).toFixed(1)} yrs`;
}

export const experience: ExperienceItem[] = [
  {
    id: 'synechron',
    role: 'Senior Associate (Frontend Lead)',
    company: 'Synechron Technologies · Emirates NBD, Dubai',
    period: 'May 2024 – Present',
    duration: durationSince(2024, 4), // May 2024 → today (auto-updates)
    bullets: [
      'Frontend Team Lead (4 engineers) designing the Decision Management System (DMS) configuration panel from scratch.',
      'Developed a dynamic flow-builder canvas using React and custom hooks for orchestrating nested risk-eligibility models.',
      'Implemented performance optimizations including virtualized UI modules, reducing memory footprint by 35% during heavy calculations.',
      'Standardized frontend security architectures, ensuring compliance with banking guidelines for public/private APIs.',
    ],
    project: {
      name: 'Decision Management System (DMS)',
      teamSize: 12,
      description:
        'A high-throughput rule engine evaluating risk profile eligibility for personal loans, credit cards, and overdraft accounts across Emirates NBD systems UAE-wide.',
      tech: ['React.js', 'TypeScript', 'Node.js', 'Python', 'Oracle DB', 'PostgreSQL'],
    },
  },
  {
    id: 'byjus',
    role: 'Senior Software Engineer',
    company: "Byju's",
    period: 'Oct 2021 – Apr 2024',
    duration: '2.6 yrs',
    bullets: [
      'Led 5 frontend engineers in developing interactive learning tools and real-time live-stream classroom widgets.',
      'Architected a high-frequency native message bridge enabling seamless telemetry between React.js modules and Flutter mobile wrappers.',
      'Refactored the student assessment framework to use optimistic updates, increasing classroom interaction rates by 42%.',
      'Orchestrated large-scale bundle optimizations, improving Lighthouse performance metrics from 52 to 91.',
    ],
    project: {
      name: 'Student Learn Portal',
      teamSize: 20,
      description:
        'Core learning and classroom portal delivering low-latency tests, class activities, and video streams to millions of daily active students.',
      tech: ['React.js', 'Ruby on Rails', 'MongoDB', 'PostgreSQL', 'Flutter Bridge API'],
    },
  },
  {
    id: 'robosoft',
    role: 'Software Engineer L2',
    company: 'Robosoft Solutions · Ola Electric client',
    period: 'May 2021 – Oct 2021',
    duration: '6 mos',
    bullets: [
      'Optimized booking flows and high-traffic transactional pathways for Ola Electric scooter launches.',
      'Resolved race conditions and bottleneck states within the MERN reservation pipeline, facilitating 100k+ simultaneous requests.',
      'Engineered secure serverless payment integrations, matching strict PCI-DSS checkout compliances.',
    ],
    project: {
      name: 'OlaElectric Purchase Portal',
      teamSize: 18,
      description:
        "Transactional platform handling reservations, configurations, and down-payments during one of India's largest EV product rollouts.",
      tech: ['React.js', 'Express.js', 'Node.js', 'MongoDB', 'Redis'],
    },
  },
  {
    id: 'social-frontier',
    role: 'Software Engineer',
    company: 'Social Frontier',
    period: 'Mar 2018 – May 2021',
    duration: '3.3 yrs',
    bullets: [
      'Created full-stack features for multi-channel advertising automation and real-time email verification services.',
      'Built a distributed job runner queue using Node.js and AWS SQS, handling millions of validation requests daily.',
      'Engineered customizable analytics dashboards with high-density data visualizations.',
    ],
    project: {
      name: 'Clearout & Kintegra SaaS',
      teamSize: 7,
      description:
        'SaaS portfolio spanning real-time email validation APIs, cross-platform ad schedulers, and search engine lead scraping products.',
      tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'AWS SQS/S3'],
    },
  },
];
