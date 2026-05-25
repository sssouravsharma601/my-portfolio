import type { ExperienceItem } from '../types';

export const experience: ExperienceItem[] = [
  {
    id: 'synechron',
    role: 'Senior Associate',
    company: 'Synechron Technologies · Emirates NBD, UAE',
    period: 'May 2024 – Present',
    duration: '1+ yr',
    bullets: [
      'Led a 4-member frontend team, building a complex decision UI from scratch.',
      'Designed dynamic decision-flow config UI integrated with Python backend services.',
      'Delivered standardised UX for frontline banking decision-making workflows.',
    ],
    project: {
      name: '📌 DMS Platform',
      teamSize: 12,
      description:
        'Decision Management System with a rule engine to assess user eligibility for personal loans, credit cards, and overdrafts at one of the UAE\'s largest banks.',
      tech: ['React.js', 'TypeScript', 'Python', 'PostgreSQL', 'Oracle'],
    },
  },
  {
    id: 'byjus',
    role: 'Senior Software Engineer',
    company: 'Byju\'s',
    period: 'Oct 2021 – Apr 2024',
    duration: '2.6 yrs',
    bullets: [
      'Led a 5-member team delivering and integrating core learning-platform features.',
      'Built real-time class participation features and a robust student-assessment workflow.',
      'Created a native bridge between the web platform and the mobile Flutter app.',
    ],
    project: {
      name: '📌 Byju\'s Student Learn Portal',
      teamSize: 20,
      description:
        'Learning portal giving enrolled students access to live classes, chapter tests, and video content — serving millions of students across India.',
      tech: ['React.js', 'Ruby on Rails', 'MongoDB', 'PostgreSQL', 'Flutter Bridge'],
    },
  },
  {
    id: 'robosoft',
    role: 'Software Engineer L2',
    company: 'Robosoft Solutions',
    period: 'May 2021 – Oct 2021',
    duration: '6 mos',
    bullets: [
      'Built RESTful APIs and responsive front-end UIs for a high-traffic e-commerce platform.',
      'Resolved critical bugs and performance bottlenecks across the full stack.',
    ],
    project: {
      name: '📌 OlaElectric.com',
      teamSize: 18,
      description:
        'MERN-stack web app for reserving and purchasing Ola Electric scooters — one of India\'s largest EV product launches.',
      tech: ['MongoDB', 'Express.js', 'React.js', 'Node.js'],
    },
  },
  {
    id: 'social-frontier',
    role: 'Software Engineer',
    company: 'Social Frontier',
    period: 'Mar 2018 – May 2021',
    duration: '3.3 yrs',
    bullets: [
      'Contributed to end-to-end product development across three distinct SaaS platforms.',
      'Handled API integrations, responsive UI design, debugging, and QA across all products.',
    ],
    project: {
      name: '📌 Clearout · Kintegra · Kintegra Labs',
      teamSize: 7,
      description:
        'Clearout: Real-time email verification. Kintegra: Cross-channel ad automation. Kintegra Labs: R&D tools for lead-gen, sentiment analysis & keyword planning.',
      tech: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'AWS'],
    },
  },
];
