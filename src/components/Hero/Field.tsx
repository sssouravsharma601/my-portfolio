import { useEffect, useRef, type RefObject } from 'react';
import styles from './Hero.module.css';

/** Must match the CSS grid drawn behind the hero. */
const CELL = 48;
const RADIUS = 230;

/**
 * The hero's drafting grid, made reactive: grid lines and intersections near
 * the pointer light up and trail behind it. Also publishes the pointer
 * position to CSS (--gx/--gy in px, --px/--py in -1..1) for the glow and the
 * portrait tilt. Draws only while something is changing.
 */
export default function Field({ host }: { host: RefObject<HTMLElement> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = host.current;
    const canvas = canvasRef.current;
    if (!el || !canvas || typeof ResizeObserver === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let frame = 0;
    let on = false;
    let energy = 0;
    let color = '';
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      frame = 0;
      cur.x += (target.x - cur.x) * 0.16;
      cur.y += (target.y - cur.y) * 0.16;
      energy += ((on ? 1 : 0) - energy) * 0.09;

      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1;

      const x0 = Math.max(0, Math.floor((cur.x - RADIUS) / CELL) * CELL);
      const y0 = Math.max(0, Math.floor((cur.y - RADIUS) / CELL) * CELL);
      for (let x = x0; x <= Math.min(w, cur.x + RADIUS); x += CELL) {
        for (let y = y0; y <= Math.min(h, cur.y + RADIUS); y += CELL) {
          const f = Math.max(0, 1 - Math.hypot(x - cur.x, y - cur.y) / RADIUS) ** 2 * energy;
          if (f < 0.01) continue;
          ctx.globalAlpha = f * 0.55;
          ctx.beginPath();
          ctx.moveTo(x + 0.5, y + 0.5);
          ctx.lineTo(x + CELL + 0.5, y + 0.5);
          ctx.moveTo(x + 0.5, y + 0.5);
          ctx.lineTo(x + 0.5, y + CELL + 0.5);
          ctx.stroke();
          ctx.globalAlpha = Math.min(1, f * 1.4);
          ctx.beginPath();
          ctx.arc(x + 0.5, y + 0.5, 1 + f * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      el.style.setProperty('--gx', `${cur.x.toFixed(1)}px`);
      el.style.setProperty('--gy', `${cur.y.toFixed(1)}px`);

      const moving = Math.abs(target.x - cur.x) + Math.abs(target.y - cur.y) > 0.5;
      const fading = Math.abs((on ? 1 : 0) - energy) > 0.01;
      if (moving || fading) frame = requestAnimationFrame(draw);
      else if (!on) ctx.clearRect(0, 0, w, h);
    };

    const kick = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.x = e.clientX - r.left;
      target.y = e.clientY - r.top;
      if (!on) {
        on = true;
        color = getComputedStyle(canvas).color;
        if (energy < 0.05) {
          cur.x = target.x;
          cur.y = target.y;
        }
      }
      el.style.setProperty('--px', ((target.x / r.width) * 2 - 1).toFixed(3));
      el.style.setProperty('--py', ((target.y / r.height) * 2 - 1).toFixed(3));
      kick();
    };
    const onLeave = () => {
      on = false;
      el.style.setProperty('--px', '0');
      el.style.setProperty('--py', '0');
      kick();
    };

    const ro = new ResizeObserver(() => {
      resize();
      kick();
    });
    ro.observe(canvas);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerdown', onMove);
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('pointercancel', onLeave);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(frame);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerdown', onMove);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('pointercancel', onLeave);
    };
  }, [host]);

  return <canvas ref={canvasRef} className={styles.field} aria-hidden="true" />;
}
