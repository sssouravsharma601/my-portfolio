import { createElement, type ComponentPropsWithoutRef, type ElementType } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

type Direction = 'up' | 'left' | 'right';

const directionClass: Record<Direction, string> = {
  up: 'reveal-up',
  left: 'reveal-left',
  right: 'reveal-right',
};

type OwnProps<T extends ElementType> = {
  /** HTML tag or React component to render as. Defaults to `"div"`. */
  as?: T;
  direction?: Direction;
  delay?: number;
  className?: string;
};

/**
 * Polymorphic scroll-reveal wrapper.
 *
 * Merges its own props with the native props of whatever element `as` resolves
 * to — no `@ts-expect-error` hacks, full autocomplete on `role`, `aria-*`, etc.
 *
 * @example
 * <ScrollReveal as="li" role="listitem" direction="left" delay={100}>
 *   …
 * </ScrollReveal>
 */
type ScrollRevealProps<T extends ElementType = 'div'> = OwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof OwnProps<T>>;

export default function ScrollReveal<T extends ElementType = 'div'>({
  as,
  direction = 'up',
  delay = 0,
  className = '',
  ...rest
}: ScrollRevealProps<T>) {
  const Tag = as ?? 'div';
  const ref = useScrollReveal<HTMLElement>({ delay });
  const cls = `${directionClass[direction]} ${className}`.trim();

  return createElement(Tag, { ref, className: cls, ...rest });
}
