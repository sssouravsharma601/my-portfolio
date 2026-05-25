import { useState, useEffect } from 'react';

export function useActiveSection(sectionIds: string[]): string {
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    const handler = () => {
      const scrollY = window.scrollY;
      let current = '';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && scrollY >= el.offsetTop - 130) {
          current = id;
        }
      }
      setActive(current);
    };

    window.addEventListener('scroll', handler, { passive: true });
    handler(); // run once on mount
    return () => window.removeEventListener('scroll', handler);
  }, [sectionIds]);

  return active;
}
