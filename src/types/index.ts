export type Theme = 'dark' | 'light';

export interface NavLink {
  label: string;
  href: string;
}

export interface ExperienceProject {
  name: string;
  teamSize: number;
  description: string;
  tech: string[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  duration: string;
  bullets: string[];
  project: ExperienceProject;
}

export interface SkillCategory {
  id: string;
  icon: string;
  title: string;
  skills: string[];
}

export interface EducationItem {
  id: string;
  icon: string;
  degree: string;
  school: string;
  year: string;
  score: string;
}

export interface ContactChannel {
  icon: string;
  label: string;
  value: string;
  href: string;
  external?: boolean;
  arrowLabel: string;
}

export interface StatItem {
  value: number | string;
  suffix?: string;
  label: string;
}

export interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}
