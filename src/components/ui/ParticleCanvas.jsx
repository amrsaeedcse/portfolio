import { useEffect, useRef, memo } from 'react';

const PARTICLE_COUNT = 130;
const PROXIMITY_DIST = 85;
const PROXIMITY_DIST_SQ = PROXIMITY_DIST * PROXIMITY_DIST;
const MOUSE_RADIUS = 120;
const MOUSE_RADIUS_SQ = MOUSE_RADIUS * MOUSE_RADIUS;

// Blueprint colors with alpha
const COLOR_ORANGE = 'rgba(255, 68, 0, ';
const COLOR_BLUE   = 'rgba(58, 87, 196, ';

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

const ParticleCanvas = memo(function ParticleCanvas({ visible = true, isMobile = false }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef(null);
  const rafRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const scrollRef = useRef({ lastY: 0, velocity: 0 });
  const isIntersectingRef = useRef(true);

  // ── Initialize Particles Pool ───────────────────────────────────────────────
  useEffect(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const count = isMobile ? Math.floor(PARTICLE_COUNT * 0.45) : PARTICLE_COUNT;
    const particles = [];

    for (let i = 0; i < count; i++) {
      const isOrange = Math.random() > 0.5;
      particles.push({
        x: Math.random() * vw,
        y: Math.random() * vh,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: 1.0 + Math.random() * 1.3,
        color: isOrange ? 'orange' : 'blue',
        baseAlpha: 0.20 + Math.random() * 0.35,
        alpha: 0.3,
        pulseOffset: Math.random() * Math.PI * 2,
        pulseSpeed: 0.0012 + Math.random() * 0.002,
      });
    }

    particlesRef.current = particles;
  }, [isMobile]);

  // ── Intersection Observer: Stop Animation Loop when Scrolled Out of View ───
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersectingRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );

    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  // ── Global Event Listeners (Mouse & Scroll Velocity) ────────────────────────
  useEffect(() => {
    let lastScrollTime = performance.now();

    const handleScroll = () => {
      if (!isIntersectingRef.current) return;
      const now = performance.now();
      const dt = Math.max(1, now - lastScrollTime);
      const currentY = window.scrollY;
      const dy = currentY - scrollRef.current.lastY;

      // Scroll velocity mapped with dampening
      scrollRef.current.velocity = clamp(dy / dt * 12, -15, 15);
      scrollRef.current.lastY = currentY;
      lastScrollTime = now;
    };

    const handleMouseMove = (e) => {
      if (!isIntersectingRef.current) return;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    const handleResize = () => {
      const c = canvasRef.current;
      if (!c) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.25);

      c.width = vw * dpr;
      c.height = vh * dpr;
      c.style.width = `${vw}px`;
      c.style.height = `${vh}px`;

      const ctx = c.getContext('2d');
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  // ── 60FPS Fluid Render Loop (Auto-sleeps when offscreen) ───────────────────
  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let isRunning = true;

    const render = (time) => {
      if (!isRunning) return;

      // When canvas is scrolled out of viewport, skip expensive physics & render
      if (!isIntersectingRef.current) {
        rafRef.current = requestAnimationFrame(render);
        return;
      }

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      ctx.clearRect(0, 0, vw, vh);

      const m = mouseRef.current;
      const scroll = scrollRef.current;

      // Decay scroll velocity smoothly
      scroll.velocity *= 0.92;
      if (Math.abs(scroll.velocity) < 0.05) scroll.velocity = 0;

      const particles = particlesRef.current;
      if (!particles) {
        rafRef.current = requestAnimationFrame(render);
        return;
      }

      const len = particles.length;

      // ── Step 1: Draw Blueprint Proximity Circuit Web ────────────────────────
      ctx.lineWidth = 0.6;
      for (let i = 0; i < len; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < len; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < PROXIMITY_DIST_SQ) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / PROXIMITY_DIST) * 0.15;
            const strokeColor = p1.color === 'orange' ? `${COLOR_ORANGE}${lineAlpha})` : `${COLOR_BLUE}${lineAlpha})`;

            ctx.strokeStyle = strokeColor;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // ── Step 2: Update Positions with Physics & Mouse Forcefield ────────────
      for (let i = 0; i < len; i++) {
        const p = particles[i];

        // Base velocity + scroll inertia (drifts upwards when scrolling down)
        p.x += p.vx;
        p.y += p.vy - scroll.velocity * 0.35;

        // Wrap around edges smoothly
        if (p.x < -10) p.x = vw + 10;
        if (p.x > vw + 10) p.x = -10;
        if (p.y < -10) p.y = vh + 10;
        if (p.y > vh + 10) p.y = -10;

        // Interactive Mouse Gravity & Vortex
        if (m.active) {
          const dx = p.x - m.x;
          const dy = p.y - m.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < MOUSE_RADIUS_SQ && distSq > 1) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / MOUSE_RADIUS);
            const angle = Math.atan2(dy, dx);
            p.x += Math.cos(angle + 1.4) * force * 1.6 - (dx / dist) * force * 1.1;
            p.y += Math.sin(angle + 1.4) * force * 1.6 - (dy / dist) * force * 1.1;
          }
        }

        // Ambient pulsating luminosity
        const pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.12;
        p.alpha = clamp(p.baseAlpha + pulse, 0.15, 0.75);

        // ── Draw Particle Node ────────────────────────────────────────────────
        const nodeColor = p.color === 'orange' ? `${COLOR_ORANGE}${p.alpha})` : `${COLOR_BLUE}${p.alpha})`;
        ctx.fillStyle = nodeColor;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [visible]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none z-0 will-change-transform"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease' }}
    />
  );
});

export default ParticleCanvas;
