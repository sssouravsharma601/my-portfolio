import { useEffect, useRef } from 'react';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = `${mx}px`;
      dot.style.top  = `${my}px`;
    };

    const animateRing = () => {
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      ring.style.left = `${rx}px`;
      ring.style.top  = `${ry}px`;
      rafId = requestAnimationFrame(animateRing);
    };

    const onEnter = () => {
      ring.classList.add(styles.ringExpanded);
    };
    const onLeave = () => {
      ring.classList.remove(styles.ringExpanded);
    };

    const interactables = document.querySelectorAll<HTMLElement>(
      'a, button, input, textarea, [role="button"]',
    );
    interactables.forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    document.addEventListener('mousemove', onMove);
    rafId = requestAnimationFrame(animateRing);

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
      interactables.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className={styles.dot}  aria-hidden="true" />
      <div ref={ringRef} className={styles.ring} aria-hidden="true" />
    </>
  );
}
