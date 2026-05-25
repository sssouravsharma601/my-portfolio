import type { ReactNode, CSSProperties } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

type Direction = 'up' | 'left' | 'right';

interface Props {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  as?: keyof JSX.IntrinsicElements;
  role?: string;
  'aria-label'?: string;
}

const directionClass: Record<Direction, string> = {
  up:    'reveal-up',
  left:  'reveal-left',
  right: 'reveal-right',
};

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  className = '',
  style,
  as: Tag = 'div',
  role,
  'aria-label': ariaLabel,
}: Props) {
  const ref = useScrollReveal<HTMLDivElement>({ delay });
  const cls = `${directionClass[direction]} ${className}`.trim();

  return (
    // @ts-expect-error – generic intrinsic element ref
    <Tag ref={ref} className={cls} style={style} role={role} aria-label={ariaLabel}>
      {children}
    </Tag>
  );
}
