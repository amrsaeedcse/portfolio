import { useEffect, useRef, memo } from 'react';

// ── Easing ────────────────────────────────────────────────────────────────────
const easeOutExpo  = (t) => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

// ── Build chip particle target + scatter start positions ──────────────────────
function buildParticles(cx, cy, mobile) {
  const pts = [];
  const R        = mobile ? 42 : 54;
  const pinLen   = mobile ? 24 : 32;
  const pinN     = mobile ? 3  : 5;
  const pinStep  = mobile ? 18 : 20;

  function add(tx, ty, size, color, cat) {
    pts.push({ tx, ty, size, color, cat, x: 0, y: 0, delay: 0 });
  }

  // Body corners
  [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([sx, sy]) =>
    add(cx + sx * R, cy + sy * R, 3.5, '#00FFD1', 'corner')
  );
  // Body edge midpoints
  [[0,-1],[0,1],[-1,0],[1,0]].forEach(([sx, sy]) =>
    add(cx + sx * R, cy + sy * R, 2.5, '#00FFD1BB', 'edge')
  );
  // Interior grid (desktop only)
  if (!mobile) {
    const g = 3, step = (R * 2 - 20) / (g - 1);
    for (let r = 0; r < g; r++)
      for (let c = 0; c < g; c++)
        add(cx - R + 10 + c * step, cy - R + 10 + r * step, 1.8, '#00FFD155', 'interior');
  }
  // Pin legs — 4 sides, connector + tip per pin
  const halfSpan = ((pinN - 1) / 2) * pinStep;
  for (let i = 0; i < pinN; i++) {
    const off = -halfSpan + i * pinStep;
    add(cx - R - pinLen * 0.42, cy + off, 2,   '#00FFD1', 'pin');
    add(cx - R - pinLen,        cy + off, 3,   '#00FFD1', 'pinTip');
    add(cx + R + pinLen * 0.42, cy + off, 2,   '#00FFD1', 'pin');
    add(cx + R + pinLen,        cy + off, 3,   '#00FFD1', 'pinTip');
    add(cx + off, cy - R - pinLen * 0.42, 2,   '#00FFD1', 'pin');
    add(cx + off, cy - R - pinLen,        3,   '#00FFD1', 'pinTip');
    add(cx + off, cy + R + pinLen * 0.42, 2,   '#00FFD1', 'pin');
    add(cx + off, cy + R + pinLen,        3,   '#00FFD1', 'pinTip');
  }
  // Outer orbit accent
  const outerR = R + pinLen + 16;
  const outerN = mobile ? 6 : 10;
  for (let i = 0; i < outerN; i++) {
    const angle = (i / outerN) * Math.PI * 2 + Math.PI / outerN;
    add(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR, 1.5, '#00FFD144', 'outer');
  }

  // Assign scattered start positions + staggered delays
  // Particles start FAR from their targets and fly inward
  pts.forEach((p) => {
    const dx   = p.tx - cx, dy = p.ty - cy;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    // Start 300-560px away from target in the same outward direction (+angle jitter)
    const scatter = 300 + Math.random() * 260;
    const angle   = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.6;
    p.x = p.tx + Math.cos(angle) * scatter;
    p.y = p.ty + Math.sin(angle) * scatter;
    // Inner particles arrive slightly earlier; jitter prevents synchronised waves
    p.delay = 40 + (dist / outerR) * 340 + Math.random() * 140;
  });

  return pts;
}

function drawBody(ctx, cx, cy, R, alpha) {
  ctx.save();
  ctx.strokeStyle = `rgba(0,255,209,${alpha * 0.22})`;
  ctx.lineWidth   = 1;
  ctx.strokeRect(cx - R, cy - R, R * 2, R * 2);
  ctx.restore();
}

// ── Component ─────────────────────────────────────────────────────────────────
// startAnimation: boolean — set to true by parent once hero is visible (loader done).
// This prevents the animation from running while the hero is still hidden.
const ParticleAssembler = memo(function ParticleAssembler({ isMobile, startAnimation }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);

  // Setup canvas dimensions on mount (does NOT start animation)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr  = Math.min(window.devicePixelRatio || 1, 2);
    const size = isMobile ? 260 : 380;
    canvas.width        = size * dpr;
    canvas.height       = size * dpr;
    canvas.style.width  = `${size}px`;
    canvas.style.height = `${size}px`;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
  }, [isMobile]);

  // Start animation only when parent signals hero is visible
  useEffect(() => {
    if (!startAnimation) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr  = Math.min(window.devicePixelRatio || 1, 2);
    const size = isMobile ? 260 : 380;
    // Re-apply scale (context may have been reset)
    const ctx  = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = size / 2, cy = size / 2;
    const R  = isMobile ? 42 : 54;
    const particles = buildParticles(cx, cy, isMobile);
    const TRAVEL    = 1200; // ms — each particle's travel duration
    const reduced   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── Reduced-motion: skip to final state immediately ──────────────────────
    if (reduced) {
      ctx.clearRect(0, 0, size, size);
      drawBody(ctx, cx, cy, R, 1);
      particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.tx, p.ty, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      return;
    }

    // Cancel any previously running loop
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const t0   = performance.now();
    let phase  = 'assemble';
    let idleStart = 0;

    function tick(now) {
      const elapsed = now - t0;
      ctx.clearRect(0, 0, size, size);

      if (phase === 'assemble') {
        // Body outline fades in at ~35% through
        const bodyA = easeOutCubic(Math.min(1, Math.max(0, (elapsed - 300) / 500)));
        if (bodyA > 0) drawBody(ctx, cx, cy, R, bodyA);

        let allDone = true;

        particles.forEach((p) => {
          const localT = (elapsed - p.delay) / TRAVEL;
          const prog   = Math.max(0, Math.min(1, localT));

          // Not started yet — counts as incomplete
          if (prog === 0) { allDone = false; return; }
          // Still travelling
          if (prog < 1)   allDone = false;

          const e  = easeOutExpo(prog);
          const px = p.x + (p.tx - p.x) * e;
          const py = p.y + (p.ty - p.y) * e;

          // Motion trail — ghosted copy slightly behind
          if (prog < 0.92) {
            const et = easeOutExpo(Math.max(0, prog - 0.07));
            ctx.save();
            ctx.globalAlpha = 0.12;
            ctx.fillStyle   = p.color;
            ctx.beginPath();
            ctx.arc(p.x + (p.tx - p.x) * et, p.y + (p.ty - p.y) * et, p.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          ctx.save();
          ctx.globalAlpha = Math.min(1, prog * 3.5);
          if (p.cat === 'pinTip' || p.cat === 'corner') {
            ctx.shadowColor = '#00FFD1';
            ctx.shadowBlur  = prog > 0.75 ? 10 : 3;
          }
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        if (allDone) { phase = 'idle'; idleStart = now; }

      } else {
        // ── Idle: organic breathing pulse ────────────────────────────────────
        const idleT = now - idleStart;
        drawBody(ctx, cx, cy, R, 1);
        particles.forEach((p, i) => {
          const phi   = (idleT / 3200 + i / particles.length) % 1;
          const pulse = 0.70 + 0.30 * Math.sin(phi * Math.PI * 2);
          ctx.save();
          if (p.cat === 'pinTip' || p.cat === 'corner') {
            ctx.shadowColor = '#00FFD1';
            ctx.shadowBlur  = 3 + pulse * 12;
          }
          ctx.globalAlpha = p.cat === 'outer'
            ? pulse * 0.55
            : 0.62 + pulse * 0.38;
          ctx.fillStyle   = p.color;
          ctx.beginPath();
          ctx.arc(p.tx, p.ty, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [startAnimation, isMobile]); // Restart if these change

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ display: 'block' }}
    />
  );
});

export default ParticleAssembler;
