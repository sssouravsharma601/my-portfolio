import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { STORAGE_KEYS } from '../constants';
import type { Theme } from '../types';

const QUERY = '(prefers-color-scheme: dark)';
const THEME_COLOR: Record<Theme, string> = { light: '#f6f7f9', dark: '#0a0c10' };

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function readStored(): Theme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEYS.THEME);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

function systemTheme(): Theme {
  return window.matchMedia?.(QUERY).matches ? 'dark' : 'light';
}

/** Explicit choice (localStorage) wins; otherwise follow the OS. */
function getSnapshot(): Theme {
  return readStored() ?? systemTheme();
}

/** The prerendered HTML has no visitor, so it is always the light markup. */
function getServerSnapshot(): Theme {
  return 'light';
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  const mq = window.matchMedia?.(QUERY);
  mq?.addEventListener('change', onChange);
  window.addEventListener('storage', onChange);
  return () => {
    listeners.delete(onChange);
    mq?.removeEventListener('change', onChange);
    window.removeEventListener('storage', onChange);
  };
}

/**
 * Theme as an external store, so hydrating the prerendered page never
 * mismatches: React renders "light" first, then re-renders with the real
 * value. index.html applies the same logic to <html> before first paint.
 */
export function useTheme(): [Theme, () => void] {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
  }, [theme]);

  const toggle = useCallback(() => {
    const next: Theme = getSnapshot() === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, next);
    } catch {
      // Storage unavailable: nothing to persist, so the OS preference stays in charge.
    }
    emit();
  }, []);

  return [theme, toggle];
}
