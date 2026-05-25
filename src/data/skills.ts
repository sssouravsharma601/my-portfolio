import type { SkillCategory } from '../types';

export const skills: SkillCategory[] = [
  {
    id: 'frontend',
    icon: '⚛️',
    title: 'Frontend',
    skills: ['React.js', 'TypeScript', 'Redux', 'HTML5', 'CSS3', 'Webpack', 'Babel', 'jQuery'],
  },
  {
    id: 'backend',
    icon: '⚙️',
    title: 'Backend & APIs',
    skills: ['Node.js', 'Express.js', 'Ruby on Rails', 'RESTful APIs', 'Python'],
  },
  {
    id: 'databases',
    icon: '🗄️',
    title: 'Databases',
    skills: ['MongoDB', 'PostgreSQL', 'MySQL', 'Oracle'],
  },
  {
    id: 'languages',
    icon: '💻',
    title: 'Languages',
    skills: ['JavaScript ES6+', 'TypeScript', 'Java'],
  },
  {
    id: 'devops',
    icon: '🛠️',
    title: 'Tools & DevOps',
    skills: ['Git / GitLab', 'SVN', 'AWS', 'WordPress'],
  },
  {
    id: 'platforms',
    icon: '🖥️',
    title: 'Platforms & OS',
    skills: ['macOS', 'Ubuntu', 'Windows', 'Flutter Bridge'],
  },
];
