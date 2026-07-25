import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsapConfig';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const LenisContext = createContext<Lenis | null>(null);

/** Access the live Lenis instance, e.g. for `lenis.scrollTo('#contact')`. */
// eslint-disable-next-line react-refresh/only-export-components
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

/**
 * Drives smooth scrolling for GSAP ScrollTrigger pinning/scrubbing.
 * Skipped entirely under `prefers-reduced-motion` — native scroll is used instead
 * so no section ever traps a user who has asked for less motion.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reducedMotion = usePrefersReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const instance = new Lenis({ autoRaf: false, duration: 1.1, wheelMultiplier: 1 });
    setLenis(instance);

    const onScroll = () => ScrollTrigger.update();
    instance.on('scroll', onScroll);

    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);

    // Lenis owns scroll physics via its own tracked target — a raw native
    // anchor jump (`<a href="#id">`) sets scrollTop directly, which Lenis's
    // next animation frame then fights and snaps back from. Route in-page
    // hash links through `lenis.scrollTo()` instead so every "About" /
    // "Get In Touch" / back-to-top link keeps working.
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a[href^="#"]');
      const hash = anchor?.getAttribute('href');
      if (!hash || hash.length < 2) return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      instance.scrollTo(target as HTMLElement, { offset: -88 });
    };
    document.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('resize', onResize);
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(tick);
      instance.off('scroll', onScroll);
      instance.destroy();
      setLenis(null);
    };
  }, [reducedMotion]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
