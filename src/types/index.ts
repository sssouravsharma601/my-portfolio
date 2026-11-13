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

/** One box in a case study's system diagram. */
export interface FlowStep {
  label: string;
  note: string;
  /** Marks the part of the system the case study is about. */
  mine?: boolean;
  /** Label on the connector leading to the next step. */
  next?: string;
  /** Short items listed inside the box, e.g. modules. */
  parts?: string[];
  /** Something that feeds into or sits beside this step. */
  aside?: string;
}

/** One branch in an illustrative nested rule. */
export interface RuleBranch {
  keyword: 'if' | 'else if' | 'else';
  /** One condition per row; rows after the first say how they join. */
  rows?: { join?: 'and' | 'or'; text: string }[];
  /** The action block: values assigned when the branch ends here. */
  then?: string[];
  /** Branches nested inside this one. */
  branches?: RuleBranch[];
}

export interface CaseStudy {
  /** Matches the id of the role it belongs to. */
  id: string;
  client: string;
  period: string;
  title: string;
  lede: string;
  role: string;
  team: string;
  context: string[];
  mine: string;
  built: string[];
  /** The difficult part of the work, in more detail. */
  deep: { title: string; intro: string; points: string[] };
  /** A made-up rule that shows the shape of the problem. Never real client data. */
  sketch?: { caption: string; branches: RuleBranch[] };
  figures: { value: string; label: string }[];
  flow: FlowStep[];
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
