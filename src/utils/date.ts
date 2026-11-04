import type { YearMonth } from '../types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatYearMonth({ year, month }: YearMonth): string {
  return `${MONTHS[month] ?? ''} ${year}`;
}

function toYearMonth(d: Date): YearMonth {
  return { year: d.getFullYear(), month: d.getMonth() };
}

/** Inclusive month count, so May→Oct of the same year is 6 months, as on a CV. */
export function monthsBetween(start: YearMonth, end: YearMonth): number {
  return (end.year - start.year) * 12 + (end.month - start.month) + 1;
}

/** "2 yrs 6 mos", "6 mos", "1 yr". Computed so a current role never goes stale. */
export function formatDuration(start: YearMonth, end?: YearMonth, now: Date = new Date()): string {
  const total = Math.max(1, monthsBetween(start, end ?? toYearMonth(now)));
  const y = Math.floor(total / 12);
  const m = total % 12;
  const parts: string[] = [];
  if (y) parts.push(`${y} yr${y > 1 ? 's' : ''}`);
  if (m) parts.push(`${m} mo${m > 1 ? 's' : ''}`);
  return parts.join(' ');
}

/** Whole years elapsed since a start month. */
export function yearsSince(start: YearMonth, now: Date = new Date()): number {
  return Math.floor((monthsBetween(start, toYearMonth(now)) - 1) / 12);
}
