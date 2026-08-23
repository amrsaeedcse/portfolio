import { useEffect, useRef, memo } from 'react';

// ── Particle Configuration ───────────────────────────────────────────────────
const AMBIENT_COUNT = 90;
const SHAPE_COUNT = 160;
const MOUSE_RADIUS = 110;
const MOUSE_RADIUS_SQ = MOUSE_RADIUS * MOUSE_RADIUS;

// Palette: Blueprint Blue and Signal Orange
const COLOR_SIGNAL = 'rgba(255, 68, 0, ';
const COLOR_BLUE   = 'rgba(58, 87, 196, ';
const COLOR_INK    = 'rgba(26, 29, 35, ';

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

// ── Geometry Generators for Section Reticles ──────────────────────────────────
function generateHeroTargets(vw, vh) {
  const cx = vw * 0.5;
  const cy = vh * 0.44;
  const w = Math.min(vw * 0.82, 920);
  const h = Math.min(vh * 0.46, 320);
  const x0 = cx - w / 2;
  const y0 = cy - h / 2;
  const perim = 2 * (w + h);
  const pts = [];

  // Frame perimeter
  for (let i = 0; i < 110; i++) {
    const d = (i / 110) * perim;
    let px, py;
    if (d < w) { px = x0 + d; py = y0; }
    else if (d < w + h) { px = x0 + w; py = y0 + (d - w); }
    else if (d < 2 * w + h) { px = x0 + w - (d - w - h); py = y0 + h; }
    else { px = x0; py = y0 + h - (d - 2 * w - h); }
    pts.push({ x: px, y: py, color: 'signal', size: 1.6, speed: 0.08 });
  }

  // Crosshair center reticles
  for (let i = 0; i < 25; i++) {
    const t = (i / 24) * 2 - 1;
    pts.push({ x: cx + t * (w * 0.42), y: cy, color: 'blue', size: 1.3, speed: 0.05 });
  }
  for (let i = 0; i < 25; i++) {
    const t = (i / 24) * 2 - 1;
    pts.push({ x: cx, y: cy + t * (h * 0.42), color: 'blue', size: 1.3, speed: 0.05 });
  }
  return pts;
}

function generateAboutTargets(vw, vh) {
  const isMobile = vw < 768;
  const cx = isMobile ? vw * 0.5 : vw * 0.28;
  const cy = isMobile ? vh * 0.35 : vh * 0.48;
  const size = isMobile ? Math.min(vw * 0.7, 240) : Math.min(vw * 0.22, 280);
  const pts = [];

  // Square figure frame around FIG.01
  const half = size / 2;
  for (let i = 0; i < 100; i++) {
    const perim = size * 4;
    const d = (i / 100) * perim;
    let px, py;
    if (d < size) { px = cx - half + d; py = cy - half; }
    else if (d < size * 2) { px = cx + half; py = cy - half + (d - size); }
    else if (d < size * 3) { px = cx + half - (d - size * 2); py = cy + half; }
    else { px = cx - half; py = cy + half - (d - size * 3); }
    pts.push({ x: px, y: py, color: 'signal', size: 1.5, speed: 0.07 });
  }

  // Measurement callout dimension line
  const dimX = isMobile ? cx : cx + half + 36;
  const dimYStart = cy - half;
  const dimYEnd = cy + half;
  for (let i = 0; i < 30; i++) {
    const t = i / 29;
    pts.push({ x: dimX, y: dimYStart + t * (dimYEnd - dimYStart), color: 'blue', size: 1.2, speed: 0.04 });
  }
  for (let i = 0; i < 30; i++) {
    const t = i / 29;
    pts.push({ x: dimX + (t - 0.5) * 24, y: (i < 15 ? dimYStart : dimYEnd), color: 'blue', size: 1.2, speed: 0.04 });
  }
  return pts;
}

function generateSkillsTargets(vw, vh) {
  const isMobile = vw < 768;
  const cx = vw * 0.5;
  const cy = vh * 0.50;
  const w = Math.min(vw * 0.88, 980);
  const h = isMobile ? vh * 0.6 : 380;
  const pts = [];

  // Dual bus rails (Top = Signal Orange / SW, Bottom = Blueprint Blue / HW)
  const yTop = cy - h * 0.35;
  const yBot = cy + h * 0.35;

  for (let i = 0; i < 60; i++) {
    const t = i / 59;
    const px = cx - w / 2 + t * w;
    pts.push({ x: px, y: yTop, color: 'signal', size: 1.6, speed: 0.09 });
  }
  for (let i = 0; i < 60; i++) {
    const t = i / 59;
    const px = cx - w / 2 + t * w;
    pts.push({ x: px, y: yBot, color: 'blue', size: 1.6, speed: 0.09 });
  }

  // Interconnect vertical lines bridging SW and HW
  const cols = isMobile ? 3 : 5;
  const perCol = Math.floor(40 / cols);
  for (let c = 0; c < cols; c++) {
    const colX = cx - w * 0.4 + (c / (cols - 1)) * (w * 0.8);
    for (let k = 0; k < perCol; k++) {
      const t = k / (perCol - 1);
      pts.push({
        x: colX,
        y: yTop + t * (yBot - yTop),
        color: t < 0.5 ? 'signal' : 'blue',
        size: 1.3,
        speed: 0.06,
      });
    }
  }
  return pts;
}

function generateWorkTargets(vw, vh) {
  const cx = vw * 0.5;
  const cy = vh * 0.52;
  const w = Math.min(vw * 0.86, 1020);
  const h = Math.min(vh * 0.60, 480);
  const pts = [];

  // 4 Corner registration brackets
  const corners = [
    { x: cx - w / 2, y: cy - h / 2, dx: 1, dy: 1 },
    { x: cx + w / 2, y: cy - h / 2, dx: -1, dy: 1 },
    { x: cx - w / 2, y: cy + h / 2, dx: 1, dy: -1 },
    { x: cx + w / 2, y: cy + h / 2, dx: -1, dy: -1 },
  ];

  corners.forEach((c) => {
    for (let i = 0; i < 15; i++) {
      const len = 45 * (i / 14);
      pts.push({ x: c.x + c.dx * len, y: c.y, color: 'signal', size: 1.4, speed: 0.07 });
      pts.push({ x: c.x, y: c.y + c.dy * len, color: 'signal', size: 1.4, speed: 0.07 });
    }
  });

  // Center drafting cross
  for (let i = 0; i < 20; i++) {
    const t = (i / 19) * 2 - 1;
    pts.push({ x: cx + t * 90, y: cy, color: 'blue', size: 1.3, speed: 0.04 });
  }
  for (let i = 0; i < 20; i++) {
    const t = (i / 19) * 2 - 1;
    pts.push({ x: cx, y: cy + t * 70, color: 'blue', size: 1.3, speed: 0.04 });
  }
  return pts;
}

function generateExperienceTargets(vw, vh) {
  const isMobile = vw < 768;
  const railX = isMobile ? 35 : Math.max(vw * 0.22, 140);
  const yStart = vh * 0.16;
  const yEnd = vh * 0.84;
  const pts = [];

  // Main vertical bus line
  for (let i = 0; i < 90; i++) {
    const t = i / 89;
    pts.push({ x: railX, y: yStart + t * (yEnd - yStart), color: i % 2 === 0 ? 'signal' : 'blue', size: 1.5, speed: 0.09 });
  }

  // 3 Datum diamond nodes along the bus
  const nodes = [0.22, 0.50, 0.78];
  nodes.forEach((pos, ni) => {
    const nodeY = yStart + pos * (yEnd - yStart);
    const nodeColor = ni === 2 ? 'blue' : 'signal';
    for (let k = 0; k < 20; k++) {
      const angle = (k / 20) * Math.PI * 2;
      const r = 14;
      pts.push({
        x: railX + Math.cos(angle) * r,
        y: nodeY + Math.sin(angle) * r,
        color: nodeColor,
        size: 1.4,
        speed: 0.05,
      });
    }
  });
  return pts;
}

function generateContactTargets(vw, vh) {
  const isMobile = vw < 768;
  const cx = isMobile ? vw * 0.5 : vw * 0.72;
  const cy = isMobile ? vh * 0.60 : vh * 0.48;
  const pts = [];

  // Concentric radar rings centered on the work order form
  const radii = [45, 95, 155];
  radii.forEach((r, ri) => {
    const count = 40 + ri * 15;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      pts.push({
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        color: ri % 2 === 0 ? 'signal' : 'blue',
        size: 1.3,
        speed: 0.06 + ri * 0.02,
      });
    }
  });
  return pts;
}

function getSectionTargets(section, vw, vh) {
  switch (section) {
    case 0: return generateHeroTargets(vw, vh);
    case 1: return generateAboutTargets(vw, vh);
    case 2: return generateSkillsTargets(vw, vh);
    case 3: return generateWorkTargets(vw, vh);
    case 4: return generateExperienceTargets(vw, vh);
    case 5: return generateContactTargets(vw, vh);
    default: return generateHeroTargets(vw, vh);
  }
}

// ── Particle System Component ─────────────────────────────────────────────────
const ParticleCanvas = memo(function ParticleCanvas({ section = 0, visible = true, isMobile = false }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef(null);
  const rafRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999, targetX: -9999, targetY: -9999, active: false });
  const sectionRef = useRef(section);
  sectionRef.current = section;

  // ── Initialize Particle Pool ────────────────────────────────────────────────
  useEffect(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const particles = [];

    // Ambient floating particles
    for (let i = 0; i < AMBIENT_COUNT; i++) {
      particles.push({
        type: 'ambient',
        x: Math.random() * vw,
        y: Math.random() * vh,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        targetX: Math.random() * vw,
        targetY: Math.random() * vh,
        size: 0.9 + Math.random() * 1.1,
        color: Math.random() > 0.4 ? 'blue' : 'signal',
        baseAlpha: 0.16 + Math.random() * 0.22,
        alpha: 0.18,
        pulseOffset: Math.random() * Math.PI * 2,
        pulseSpeed: 0.0015 + Math.random() * 0.002,
      });
    }

    // Geometry / Reticle particles
    const targets = getSectionTargets(sectionRef.current, vw, vh);
    for (let i = 0; i < SHAPE_COUNT; i++) {
      const tg = targets[i % targets.length];
      const sx = Math.random() * vw;
      const sy = Math.random() * vh;
      particles.push({
        type: 'shape',
        x: sx,
        y: sy,
        vx: 0,
        vy: 0,
        targetX: tg.x,
        targetY: tg.y,
        originX: sx,
        originY: sy,
        size: tg.size || 1.4,
        color: tg.color || 'signal',
        baseAlpha: 0.45 + Math.random() * 0.35,
        alpha: 0.5,
        speed: tg.speed || 0.07,
        morphStart: performance.now(),
        morphDelay: Math.random() * 200,
        pulseOffset: (i / SHAPE_COUNT) * Math.PI * 2,
        pulseSpeed: 0.002,
      });
    }

    particlesRef.current = particles;
  }, []);

  // ── Handle Section Change Transitions ───────────────────────────────────────
  useEffect(() => {
    if (!particlesRef.current) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const targets = getSectionTargets(section, vw, vh);
    const now = performance.now();

    const particles = particlesRef.current;
    let shapeIdx = 0;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.type === 'shape') {
        const tg = targets[shapeIdx % targets.length];
        p.originX = p.x;
        p.originY = p.y;
        p.targetX = tg.x;
        p.targetY = tg.y;
        p.color = tg.color;
        p.size = tg.size;
        p.speed = tg.speed || 0.07;
        p.morphStart = now;
        p.morphDelay = Math.random() * 220;
        shapeIdx++;
      } else {
        // Ambient particles softly drift toward new quadrants
        p.targetX = clamp(p.x + (Math.random() - 0.5) * 300, 20, vw - 20);
        p.targetY = clamp(p.y + (Math.random() - 0.5) * 300, 20, vh - 20);
      }
    }
  }, [section]);

  // ── Window Resize and Mouse Tracking ────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      const c = canvasRef.current;
      if (!c) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.5);

      c.width = vw * dpr;
      c.height = vh * dpr;
      c.style.width = `${vw}px`;
      c.style.height = `${vh}px`;

      const ctx = c.getContext('2d');
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Retarget shape particles on resize
      if (particlesRef.current) {
        const targets = getSectionTargets(sectionRef.current, vw, vh);
        let sIdx = 0;
        particlesRef.current.forEach((p) => {
          if (p.type === 'shape') {
            const tg = targets[sIdx % targets.length];
            p.targetX = tg.x;
            p.targetY = tg.y;
            sIdx++;
          }
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.targetX = -9999;
      mouseRef.current.targetY = -9999;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isMobile]);

  // ── 60FPS RAF Render Loop ───────────────────────────────────────────────────
  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = (time) => {
      if (!isRunning) return;

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      ctx.clearRect(0, 0, vw, vh);

      // Smooth mouse lerping
      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.14;
      m.y += (m.targetY - m.y) * 0.14;

      const particles = particlesRef.current;
      if (!particles) {
        rafRef.current = requestAnimationFrame(render);
        return;
      }

      // Draw subtle connecting hairlines between nearby ambient particles
      ctx.lineWidth = 0.5;
      const len = particles.length;
      for (let i = 0; i < AMBIENT_COUNT; i += 2) {
        const p1 = particles[i];
        for (let j = i + 1; j < Math.min(i + 8, AMBIENT_COUNT); j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 4900) { // 70px
            const lineAlpha = (1 - Math.sqrt(distSq) / 70) * 0.10;
            ctx.strokeStyle = p1.color === 'signal' ? `${COLOR_SIGNAL}${lineAlpha})` : `${COLOR_BLUE}${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Update & Render all particles
      for (let i = 0; i < len; i++) {
        const p = particles[i];

        if (p.type === 'ambient') {
          // Floating Brownian drift
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 10) { p.x = 10; p.vx = Math.abs(p.vx); }
          if (p.x > vw - 10) { p.x = vw - 10; p.vx = -Math.abs(p.vx); }
          if (p.y < 10) { p.y = 10; p.vy = Math.abs(p.vy); }
          if (p.y > vh - 10) { p.y = vh - 10; p.vy = -Math.abs(p.vy); }

          // Gentle mouse repulsion
          if (m.active) {
            const dx = p.x - m.x;
            const dy = p.y - m.y;
            const dSq = dx * dx + dy * dy;
            if (dSq < MOUSE_RADIUS_SQ && dSq > 1) {
              const d = Math.sqrt(dSq);
              const force = (1 - d / MOUSE_RADIUS) * 1.8;
              p.x += (dx / d) * force;
              p.y += (dy / d) * force;
            }
          }

          const pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.08;
          p.alpha = clamp(p.baseAlpha + pulse, 0.08, 0.45);

        } else {
          // Shape / Geometry reticle particle: smooth convergence to target
          const elapsed = Math.max(0, time - p.morphStart - p.morphDelay);
          const t = Math.min(1, elapsed / 1100);
          const ease = easeOutCubic(t);

          const idealX = p.originX + (p.targetX - p.originX) * ease;
          const idealY = p.originY + (p.targetY - p.originY) * ease;

          p.x += (idealX - p.x) * 0.12;
          p.y += (idealY - p.y) * 0.12;

          // Interactive magnetic hover effect on shapes
          if (m.active) {
            const dx = p.x - m.x;
            const dy = p.y - m.y;
            const dSq = dx * dx + dy * dy;
            if (dSq < MOUSE_RADIUS_SQ && dSq > 1) {
              const d = Math.sqrt(dSq);
              // Subtle magnetic vortex
              const angle = Math.atan2(dy, dx);
              const force = (1 - d / MOUSE_RADIUS) * 3.2;
              p.x += Math.cos(angle + 1.2) * force * 0.6 + (dx / d) * force * 0.4;
              p.y += Math.sin(angle + 1.2) * force * 0.6 + (dy / d) * force * 0.4;
            }
          }

          const pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.12;
          p.alpha = clamp(p.baseAlpha + pulse, 0.25, 0.85);
        }

        // Draw the particle point
        const colorPrefix = p.color === 'signal' ? COLOR_SIGNAL : (p.color === 'blue' ? COLOR_BLUE : COLOR_INK);
        ctx.fillStyle = `${colorPrefix}${p.alpha})`;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.75, p.size), 0, Math.PI * 2);
        ctx.fill();

        // Subtle glow halo on active shape nodes
        if (p.type === 'shape' && p.alpha > 0.45) {
          ctx.fillStyle = `${colorPrefix}${p.alpha * 0.15})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [visible, isMobile]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
        willChange: 'transform',
        transform: 'translateZ(0)',
      }}
    />
  );
});

export default ParticleCanvas;
