import { useEffect, useRef } from 'react';
import styles from './ScrollProgress.module.css';

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) {
        bar.style.transform = 'scaleX(0)';
        return;
      }
      const progress = window.scrollY / totalHeight;
      // Clamp progress between 0 and 1
      const clamped = Math.max(0, Math.min(1, progress));
      bar.style.transform = `scaleX(${clamped})`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return <div ref={barRef} className={styles.progressBar} aria-hidden="true" />;
}
