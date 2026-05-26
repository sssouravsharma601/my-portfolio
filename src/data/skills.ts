import type { SkillCategory } from '../types';

export const skills: SkillCategory[] = [
  {
    id: 'frontend',
    icon: 'frontend',
    title: 'Frontend Engineering',
    skills: ['React.js', 'TypeScript', 'Redux Toolkit', 'Zustand', 'HTML5 / CSS3', 'Webpack / Babel / Vite', 'CSS Modules / HSL Styling'],
  },
  {
    id: 'backend',
    icon: 'backend',
    title: 'Backend & System APIs',
    skills: ['Node.js', 'Express.js', 'Ruby on Rails', 'RESTful & GraphQL APIs', 'Python (Flask / FastAPI)', 'Event-Driven Architectures'],
  },
  {
    id: 'databases',
    icon: 'databases',
    title: 'Databases & Datastores',
    skills: ['PostgreSQL', 'MongoDB', 'Oracle DB', 'MySQL', 'Redis Caching'],
  },
  {
    id: 'languages',
    icon: 'languages',
    title: 'Core Languages',
    skills: ['JavaScript (ES6+)', 'TypeScript', 'Python', 'Ruby', 'Java'],
  },
  {
    id: 'devops',
    icon: 'tools',
    title: 'Build Tools & Infrastructure',
    skills: ['Git / GitLab CI', 'Docker Containerization', 'AWS (S3, EC2, CloudFront)', 'Webpack Bundler', 'Vite Bundler', 'Vitest / Jest Testing'],
  },
  {
    id: 'platforms',
    icon: 'platforms',
    title: 'Operating Systems & Bridges',
    skills: ['Linux (Ubuntu/Debian)', 'macOS Enterprise', 'Flutter Mobile Bridge', 'Node.js V8 Engine'],
  },
];
