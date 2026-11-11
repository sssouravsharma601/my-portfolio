import { useEffect, useRef } from 'react';

const DURATION = 1100;

/**
 * Counts up to the last number in `value` the first time it scrolls into
 * view ("52→91" runs 52 to 91; "+42%" runs 0 to 42). The markup always holds
 * the final value, so it is correct without JavaScript and under reduced motion.
 */
export default function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const nums = Array.from(value.matchAll(/\d+/g));
    const last = nums[nums.length - 1];
    if (last?.index === undefined) return;
    const to = Number(last[0]);
    const from = nums.length > 1 ? Number(nums[0]?.[0]) : 0;
    const head = value.slice(0, last.index);
    const tail = value.slice(last.index + last[0].length);

    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION);
          const eased = 1 - (1 - t) ** 3;
          el.textContent = `${head}${Math.round(from + (to - from) * eased)}${tail}`;
          if (t < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = value;
    };
  }, [value]);

  return <span ref={ref}>{value}</span>;
}
