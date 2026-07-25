import { createElement, Fragment, type ElementType, type ComponentPropsWithoutRef } from 'react';

/* eslint-disable react-refresh/only-export-components -- small colocated split helpers, not components */

/** Manual text splitter — avoids the paid/CDN-gated GSAP SplitText Club plugin. */
export function splitWords(text: string): string[] {
  return text.split(/(\s+)/).filter(Boolean);
}

export function splitChars(text: string): string[] {
  return Array.from(text);
}

/* eslint-enable react-refresh/only-export-components */

type OwnProps<T extends ElementType> = {
  as?: T;
  text: string;
  mode?: 'words' | 'chars';
  /** Applied to each split `<span>` — target this from GSAP/Framer for stagger reveals. */
  partClassName?: string;
  className?: string;
};

type SplitTextProps<T extends ElementType = 'span'> = OwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof OwnProps<T>>;

/**
 * Wraps each word/char of `text` in its own `<span data-split-part>` for
 * scroll- or load-triggered stagger animation, while keeping the DOM
 * accessible: the wrapper carries the real string via `aria-label` and every
 * split fragment is `aria-hidden`, so screen readers read one clean sentence.
 */
export default function SplitText<T extends ElementType = 'span'>({
  as,
  text,
  mode = 'words',
  partClassName = '',
  className = '',
  ...rest
}: SplitTextProps<T>) {
  const Tag = as ?? 'span';
  const parts = mode === 'chars' ? splitChars(text) : splitWords(text);

  return createElement(
    Tag,
    { className, 'aria-label': text, ...rest },
    parts.map((part, i) =>
      part.trim() === '' ? (
        <Fragment key={i}>{part}</Fragment>
      ) : (
        <span
          key={i}
          data-split-part=""
          aria-hidden="true"
          className={partClassName}
          style={{ display: 'inline-block' }}
        >
          {part}
        </span>
      ),
    ),
  );
}
