import { useEffect, useRef } from 'react';
import styles from './ParticleCanvas.module.css';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  phase: number;
}

const PARTICLE_COUNT = 65;
const CONNECTION_DISTANCE = 115;
const FPS_CAP = 34; // ms ≈ 30 fps

function makeParticle(w: number, h: number): Particle {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: Math.random() * 1.4 + 0.4,
    alpha: Math.random() * 0.45 + 0.08,
    phase: Math.random() * Math.PI * 2,
  };
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let rafId: number;
    let lastTime = 0;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      particles = Array.from({ length: PARTICLE_COUNT }, () =>
        makeParticle(canvas.width, canvas.height),
      );
    };

    const draw = (ts: number) => {
      rafId = requestAnimationFrame(draw);
      if (ts - lastTime < FPS_CAP) return;
      lastTime = ts;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += 0.018;

        if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
          Object.assign(p, makeParticle(canvas.width, canvas.height));
        }

        const a = p.alpha * (0.65 + 0.35 * Math.sin(p.phase));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${a})`;
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DISTANCE) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99,102,241,${0.11 * (1 - dist / CONNECTION_DISTANCE)})`;
            ctx.lineWidth = 0.75;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement as Element);

    resize();
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
