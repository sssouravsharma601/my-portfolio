import { useLayoutEffect, useRef, type DependencyList, type RefObject } from 'react';
import { gsap } from './gsapConfig';

type Setup<T extends HTMLElement> = (scope: RefObject<T>, ctx: gsap.Context) => void;

/**
 * Standard shape for section-level GSAP work: runs `setup` inside a
 * `gsap.context()` scoped to the returned ref, so every tween/ScrollTrigger
 * created inside is auto-reverted on unmount (and on React StrictMode's
 * dev-only double-invoke, which just tears down and recreates cleanly).
 * For responsive/reduced-motion branches, call `gsap.matchMedia().add({...})`
 * *inside* `setup` (not stored outside it) — GSAP automatically nests a
 * matchMedia instance created during a context's execution, so `ctx.revert()`
 * tears down its listeners too.
 *
 * Selector strings passed to gsap inside `setup` resolve only within the
 * scoped element, which sidesteps CSS Modules' hashed class names as long as
 * you query via ref or `data-*` attributes rather than global class selectors.
 */
export function useGsapAnimation<T extends HTMLElement = HTMLDivElement>(
  setup: Setup<T>,
  deps: DependencyList = [],
): RefObject<T> {
  const scopeRef = useRef<T>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => setup(scopeRef, self), scopeRef);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scopeRef;
}
