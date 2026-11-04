import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../constants';
import type { Theme } from '../types';

const QUERY = '(prefers-color-scheme: dark)';

function readStored(): Theme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEYS.THEME);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

function systemTheme(): Theme {
  return typeof window !== 'undefined' && window.matchMedia?.(QUERY).matches ? 'dark' : 'light';
}

/**
 * Explicit choice (localStorage) wins; otherwise follow the OS and keep
 * following it live. index.html applies the same logic before first paint.
 */
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() => readStored() ?? systemTheme());

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#0f0f0e' : '#f6f5f1');
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia?.(QUERY);
    if (!mq) return;
    const onChange = (e: MediaQueryListEvent) => {
      if (!readStored()) setTheme(e.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(STORAGE_KEYS.THEME, next);
      } catch {
        // storage unavailable: the choice lasts for this page view only
      }
      return next;
    });
  }, []);

  return [theme, toggle];
}
