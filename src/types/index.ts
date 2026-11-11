export type Theme = 'dark' | 'light';

/** Year + zero-based month. Day precision is noise on a CV. */
export interface YearMonth {
  year: number;
  month: number;
}

export interface Role {
  id: string;
  title: string;
  company: string;
  /** Client or context, e.g. "for Emirates NBD". Rendered muted. */
  context?: string;
  start: YearMonth;
  /** Omitted = current role. */
  end?: YearMonth;
  summary: string;
  highlights: string[];
  stack: string[];
}

export interface Highlight {
  value: string;
  label: string;
  where: string;
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface Degree {
  title: string;
  school: string;
  year: string;
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
