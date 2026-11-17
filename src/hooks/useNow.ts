import { useMemo, useSyncExternalStore } from 'react';

/** Midnight at the start of a calendar day, in the visitor's own time zone. */
const startOfDay = (year: number, month: number, day: number) =>
  new Date(year, month, day).getTime();

/**
 * The day the site was built. The date parts are read as a local date on
 * purpose: the build machine and the visitor then see the same year and month
 * whatever their time zones, so the prerendered text and the first client
 * render always agree.
 */
const [by = 1970, bm = 1, bd = 1] = __BUILD_DATE__.split('-').map(Number);
const BUILD_DAY = startOfDay(by, bm - 1, bd);

/** Today, as a number that stays the same for the whole day (a stable snapshot). */
function today(): number {
  const d = new Date();
  return startOfDay(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Re-check when the tab comes back: it may have been left open overnight. */
function subscribe(onChange: () => void): () => void {
  document.addEventListener('visibilitychange', onChange);
  window.addEventListener('focus', onChange);
  return () => {
    document.removeEventListener('visibilitychange', onChange);
    window.removeEventListener('focus', onChange);
  };
}

const buildDay = () => BUILD_DAY;

/**
 * The current date, safe to use while rendering.
 *
 * The page is prerendered at build time, so anything worked out from "now"
 * (years of experience, how long a role has lasted) is baked into the HTML
 * with the build date. This hook returns that same build date on the server
 * and for the first client render, so hydration matches, then switches to the
 * visitor's real date. Reading the clock directly during render would either
 * mismatch or leave the numbers stale.
 */
export function useNow(): Date {
  const day = useSyncExternalStore(subscribe, today, buildDay);
  return useMemo(() => new Date(day), [day]);
}
