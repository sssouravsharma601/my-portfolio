import { useEffect, useRef } from 'react';
import { SCROLL_REVEAL_THRESHOLD, SCROLL_REVEAL_ROOT_MARGIN } from '../constants';

interface Options {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
}

export function useScrollReveal<T extends HTMLElement>(opts: Options = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setTimeout(() => {
            el.classList.add('revealed');
          }, opts.delay ?? 0);
          observer.unobserve(el);
        }
      },
      {
        threshold: opts.threshold ?? SCROLL_REVEAL_THRESHOLD,
        rootMargin: opts.rootMargin ?? SCROLL_REVEAL_ROOT_MARGIN,
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [opts.threshold, opts.rootMargin, opts.delay]);

  return ref;
}
