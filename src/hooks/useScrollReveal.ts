import { useEffect, useRef } from 'react';

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
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add('revealed');
          }, opts.delay ?? 0);
          observer.unobserve(el);
        }
      },
      {
        threshold: opts.threshold ?? 0.1,
        rootMargin: opts.rootMargin ?? '0px 0px -35px 0px',
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [opts.threshold, opts.rootMargin, opts.delay]);

  return ref;
}
