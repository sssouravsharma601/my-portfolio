import { useEffect, useRef } from 'react';
import { gsap } from '../animation/gsapConfig';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

interface Options {
  /** Fraction of the pointer offset the element follows (0–1). */
  strength?: number;
}

/**
 * Pointer-follow + elastic-return hook for CTAs/nav links. Attach the
 * returned ref to the element that should move; pair with
 * `data-cursor="magnetic"` so `CustomCursor` can react to the same hover.
 * No-ops under `prefers-reduced-motion`.
 */
export function useMagneticHover<T extends HTMLElement>({ strength = 0.35 }: Options = {}) {
  const ref = useRef<T>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      xTo((e.clientX - (rect.left + rect.width / 2)) * strength);
      yTo((e.clientY - (rect.top + rect.height / 2)) * strength);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [strength, reducedMotion]);

  return ref;
}
