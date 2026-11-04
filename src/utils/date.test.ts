import { describe, it, expect } from 'vitest';
import { formatDuration, formatYearMonth, monthsBetween, yearsSince } from './date';

describe('date utils', () => {
  it('formats year-month', () => {
    expect(formatYearMonth({ year: 2024, month: 4 })).toBe('May 2024');
  });

  it('counts months inclusively', () => {
    expect(monthsBetween({ year: 2021, month: 4 }, { year: 2021, month: 9 })).toBe(6);
  });

  it('formats closed ranges', () => {
    expect(formatDuration({ year: 2021, month: 9 }, { year: 2024, month: 3 })).toBe('2 yrs 7 mos');
    expect(formatDuration({ year: 2021, month: 4 }, { year: 2021, month: 9 })).toBe('6 mos');
    expect(formatDuration({ year: 2020, month: 0 }, { year: 2020, month: 11 })).toBe('1 yr');
  });

  it('formats open ranges against "now"', () => {
    const now = new Date(2026, 10, 4);
    expect(formatDuration({ year: 2024, month: 4 }, undefined, now)).toBe('2 yrs 7 mos');
  });

  it('computes whole years since a start month', () => {
    expect(yearsSince({ year: 2018, month: 2 }, new Date(2026, 10, 4))).toBe(8);
    expect(yearsSince({ year: 2018, month: 2 }, new Date(2026, 1, 1))).toBe(7);
  });
});
