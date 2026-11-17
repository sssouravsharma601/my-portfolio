import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, renderHook, screen, within } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import About from '../components/About';
import Experience from '../components/Experience';
import { CAREER_START, roles } from '../data/profile';
import { formatDuration, yearsSince } from '../utils/date';
import { useNow } from './useNow';

/** The build date the test config injects (vitest.config.ts). */
const BUILD = new Date(2026, 0, 15);
/** "Today" for these tests: well after the build. */
const TODAY = new Date(2027, 5, 20, 14, 30);

function Probe() {
  const d = useNow();
  return <p>{`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`}</p>;
}

describe('useNow', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(TODAY);
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('gives the build date on the server, whatever the clock says', () => {
    expect(renderToString(<Probe />)).toContain('2026-1-15');
  });

  it('gives today in the browser, as the start of the day', () => {
    const { result } = renderHook(() => useNow());
    expect(result.current.getTime()).toBe(new Date(2027, 5, 20).getTime());
  });

  it('returns the same Date object while the day has not changed', () => {
    const { result, rerender } = renderHook(() => useNow());
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });

  it('hydrates the build-date markup without a mismatch, then moves to today', async () => {
    const container = document.createElement('div');
    container.innerHTML = renderToString(<Probe />);
    document.body.appendChild(container);
    const errors: unknown[] = [];

    await act(async () => {
      hydrateRoot(container, <Probe />, { onRecoverableError: (e) => errors.push(e) });
      await Promise.resolve();
    });

    expect(errors).toEqual([]);
    expect(container.textContent).toBe('2027-6-20');
    container.remove();
  });

  it('picks up a new day when the tab comes back', () => {
    const { result } = renderHook(() => useNow());
    vi.setSystemTime(new Date(2027, 5, 21, 9));
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(result.current.getTime()).toBe(new Date(2027, 5, 21).getTime());
  });

  it('drives the years of experience and the current role’s duration', () => {
    render(
      <>
        <About />
        <Experience />
      </>,
    );
    const years = yearsSince(CAREER_START, TODAY);
    expect(years).not.toBe(yearsSince(CAREER_START, BUILD));
    expect(screen.getByText(new RegExp(`^${years} years where`))).toBeInTheDocument();

    const current = roles.find((r) => !r.end);
    const work = document.getElementById('work');
    expect(current && work).toBeTruthy();
    if (!current || !work) return;
    expect(
      within(work).getByText(formatDuration(current.start, undefined, TODAY)),
    ).toBeInTheDocument();
  });
});
