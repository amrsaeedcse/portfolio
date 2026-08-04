import { useEffect, useRef, memo } from 'react';

// ── Constants ─────────────────────────────────────────────────────────────────
const N           = 380;
const SCATTER_MS  = 280;
const ASSEMBLE_MS = 1100;
const MOUSE_R     = 72;
const MOUSE_STR   = 1100;
const easeOutExpo = t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);

// ── Distribute N points evenly around a rect perimeter ───────────────────────
function rectPts(rect, n) {
  const { left: x, top: y, width: w, height: h } = rect;
  const perim = 2 * (w + h);
  const pts = [];
  for (let i = 0; i < n; i++) {
    const d = (i / n) * perim;
    let px, py;
    if      (d < w)         { px = x + d;             py = y; }
    else if (d < w + h)     { px = x + w;              py = y + (d - w); }
    else if (d < 2*w + h)   { px = x + w - (d-w-h);   py = y + h; }
    else                    { px = x;                  py = y + h - (d-2*w-h); }
    pts.push({ x: px, y: py });
  }
  return pts;
}

// Distribute n pts across multiple rects proportionally by perimeter
function multiRectPts(rects, n) {
  if (!rects.length) return [];
  const perims = rects.map(r => 2 * (r.width + r.height));
  const total  = perims.reduce((a, b) => a + b, 0);
  const pts    = [];
  rects.forEach((r, i) => {
    const count = Math.max(4, Math.round((perims[i] / total) * n));
    pts.push(...rectPts(r, count));
  });
  return pts;
}

// ── Line: n evenly spaced points between two positions ───────────────────────
function linePts(x1, y1, x2, y2, n) {
  return Array.from({ length: n }, (_, i) => {
    const t = n === 1 ? 0 : i / (n - 1);
    return { x: x1 + (x2 - x1) * t, y: y1 + (y2 - y1) * t };
  });
}

// ── Sample "AMR" text from offscreen canvas via pixel grid ────────────────────
function sampleAMR(n, cx, cy) {
  const W = Math.min(window.innerWidth * 0.55, 480);
  const H = W * 0.45;
  const off = document.createElement('canvas');
  off.width = W; off.height = H;
  const ctx = off.getContext('2d');
  ctx.font  = `${H * 0.82}px "Bebas Neue", Impact, "Arial Black", sans-serif`;
  ctx.fillStyle     = '#fff';
  ctx.textAlign     = 'center';
  ctx.textBaseline  = 'middle';
  ctx.fillText('AMR', W / 2, H / 2);

  const { data } = ctx.getImageData(0, 0, W, H);
  let step = 2, gridPts = [];
  while (step < 20) {
    gridPts = [];
    for (let y = 0; y < H; y += step)
      for (let x = 0; x < W; x += step)
        if (data[(y * W + x) * 4 + 3] > 120) gridPts.push([x - W / 2, y - H / 2]);
    if (gridPts.length <= n) break;
    step++;
  }
  return gridPts.slice(0, n).map(([dx, dy]) => ({ x: cx + dx, y: cy + dy }));
}

// ── Build targets per section using real DOM bounding boxes ───────────────────
function buildTargets(section, isMobile) {
  const vw = window.innerWidth, vh = window.innerHeight;
  const cx = vw / 2, cy = vh / 2;

  // Ambient filler: random dots near center
  const ambient = (count) =>
    Array.from({ length: count }, () => ({
      x: cx + (Math.random() - 0.5) * vw * 0.6,
      y: cy + (Math.random() - 0.5) * vh * 0.6,
      ambient: true,
    }));

  const pad = (pts) => {
    while (pts.length < N) pts.push(ambient(1)[0]);
    return pts.slice(0, N);
  };

  // Projects: invisible
  if (section === 3) return null;

  // ── HERO: AMR text ──────────────────────────────────────────────────────────
  if (section === 0) {
    // Target the heading area — push text up slightly so it doesn't overlap CTA
    const heroContent = document.querySelector('#hero-content');
    const headingCY   = heroContent
      ? heroContent.getBoundingClientRect().top + vh * 0.1
      : cy * 0.55;
    return pad(sampleAMR(N, cx, headingCY));
  }

  // ── ABOUT: trace photo frame perimeter ────────────────────────────────────
  if (section === 1) {
    const photo = document.querySelector('#photo-frame-border');
    if (photo) return pad(rectPts(photo.getBoundingClientRect(), N));
    return pad(ambient(N));
  }

  // ── SKILLS: trace each skill card's border ────────────────────────────────
  if (section === 2) {
    const cards = [...document.querySelectorAll('.skill-card')];
    if (cards.length) return pad(multiRectPts(cards.map(c => c.getBoundingClientRect()), N));
    return pad(ambient(N));
  }

  // ── EXPERIENCE: flow along timeline vertical line ─────────────────────────
  const isExp = section === 4 || (isMobile && section === 5);
  if (isExp) {
    const timelineLine = document.querySelector('[data-exp-timeline]');
    if (timelineLine) {
      const r = timelineLine.getBoundingClientRect();
      return pad(linePts(r.left + r.width/2, r.top, r.left + r.width/2, r.bottom, N));
    }
    return pad(linePts(cx, vh * 0.18, cx, vh * 0.82, N));
  }

  // ── CONTACT: trace form inputs + button borders ────────────────────────────
  const fields = [...document.querySelectorAll(
    '.contact-panel input, .contact-panel textarea, .contact-panel button[type="submit"]'
  )];
  if (fields.length) return pad(multiRectPts(fields.map(f => f.getBoundingClientRect()), N));
  return pad(ambient(N));
}

// ── Bezier helpers ────────────────────────────────────────────────────────────
function ctrlPt(sx, sy, tx, ty) {
  const mx = (sx+tx)/2, my = (sy+ty)/2;
  const dx = tx-sx, dy = ty-sy;
  const len = Math.sqrt(dx*dx+dy*dy) || 1;
  const px = -dy/len, py = dx/len;
  const arc = len * (0.25 + Math.random() * 0.4);
  const sgn = Math.random() < 0.5 ? 1 : -1;
  return { qx: mx + px*arc*sgn, qy: my + py*arc*sgn };
}
function bezXY(sx, sy, qx, qy, tx, ty, t) {
  const u = 1-t;
  return { x: u*u*sx + 2*u*t*qx + t*t*tx, y: u*u*sy + 2*u*t*qy + t*t*ty };
}

// ── Component ─────────────────────────────────────────────────────────────────
const ParticleCanvas = memo(function ParticleCanvas({ section, visible, isMobile }) {
  const canvasRef = useRef(null);
  const stateRef  = useRef(null);
  const rafRef    = useRef(null);
  const timerRef  = useRef(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });

  // ── Full-viewport sizing + resize ──────────────────────────────────────────
  useEffect(() => {
    const resize = () => {
      const c = canvasRef.current; if (!c) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth, h = window.innerHeight;
      c.width = w * dpr; c.height = h * dpr;
      c.style.width = `${w}px`; c.style.height = `${h}px`;
      c.getContext('2d').scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // ── Global mouse tracking ─────────────────────────────────────────────────
  useEffect(() => {
    const onMove  = e => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseleave', onLeave); };
  }, []);

  // ── Main animation effect ──────────────────────────────────────────────────
  useEffect(() => {
    if (!visible) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    // Delay querying so GSAP panel transition finishes before we read BoundingClientRect
    const delay = section === 0 ? 80 : 480;
    timerRef.current = setTimeout(() => {
      const c = canvasRef.current; if (!c) return;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const vw  = window.innerWidth, vh = window.innerHeight;
      const ctx = c.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const targets = buildTargets(section, isMobile);

      // Projects: clear and hide
      if (!targets) {
        ctx.clearRect(0, 0, vw, vh);
        if (stateRef.current) {
          stateRef.current.particles.forEach(p => { p.tOpacity = 0; });
          stateRef.current.hidden = true;
        }
        return;
      }

      // Reduced motion: render static dots at target positions
      if (reduced) {
        ctx.clearRect(0, 0, vw, vh);
        ctx.fillStyle = '#00FFD1';
        targets.filter(t => !t.ambient).forEach(t => {
          ctx.globalAlpha = 0.85;
          ctx.beginPath(); ctx.arc(t.x, t.y, 1.5, 0, Math.PI*2); ctx.fill();
        });
        return;
      }

      const isFirst = !stateRef.current;

      if (isFirst) {
        const particles = Array.from({ length: N }, (_, i) => {
          const tg  = targets[i];
          const sx  = Math.random() * vw, sy = Math.random() * vh;
          const { qx, qy } = ctrlPt(sx, sy, tg.x, tg.y);
          return {
            cx: sx, cy: sy, prevCx: sx, prevCy: sy,
            sx, sy, qx, qy, tx: tg.x, ty: tg.y,
            delay: Math.random() * 440,
            dur:   ASSEMBLE_MS + Math.random() * 200,
            done: false, rx: 0, ry: 0,
            opacity: 0, tOpacity: tg.ambient ? 0.15 : 0.9,
            size: 2.0,
          };
        });
        stateRef.current = { particles, morphStart: performance.now(), phase: 'assemble', hidden: false };
      } else {
        const { particles } = stateRef.current;
        stateRef.current.hidden = false;

        // Scatter outward first
        particles.forEach(p => {
          const a   = Math.atan2(p.cy - vh/2, p.cx - vw/2) + (Math.random()-0.5)*1.6;
          const d   = 90 + Math.random() * 180;
          const tx2 = p.cx + Math.cos(a)*d, ty2 = p.cy + Math.sin(a)*d;
          const { qx, qy } = ctrlPt(p.cx, p.cy, tx2, ty2);
          p.sx=p.cx; p.sy=p.cy; p.qx=qx; p.qy=qy; p.tx=tx2; p.ty=ty2;
          p.delay = Math.random() * 80;
          p.dur   = SCATTER_MS;
          p.done  = false;
        });
        stateRef.current.morphStart  = performance.now();
        stateRef.current.phase       = 'scatter';
        stateRef.current.nextTargets = targets;
      }

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      function tick(now) {
        const st = stateRef.current; if (!st) return;
        if (st.hidden) {
          ctx.clearRect(0, 0, vw, vh);
          rafRef.current = requestAnimationFrame(tick);
          return;
        }

        const elapsed = now - st.morphStart;
        ctx.clearRect(0, 0, vw, vh);

        // Scatter → assemble transition
        if (st.phase === 'scatter' && elapsed >= SCATTER_MS) {
          const tgs = st.nextTargets;
          st.particles.forEach((p, i) => {
            const tg = tgs[i] || tgs[tgs.length - 1];
            const { qx, qy } = ctrlPt(p.cx, p.cy, tg.x, tg.y);
            p.sx=p.cx; p.sy=p.cy; p.qx=qx; p.qy=qy; p.tx=tg.x; p.ty=tg.y;
            p.delay     = Math.random() * 380;
            p.dur       = ASSEMBLE_MS + Math.random() * 180;
            p.done      = false;
            p.tOpacity  = tg.ambient ? 0.15 : 0.9;
          });
          st.morphStart = now;
          st.phase      = 'assemble';
        }

        const { x: mx, y: my } = mouseRef.current;
        let allDone = true;

        st.particles.forEach((p, i) => {
          // Move along bezier
          if (!p.done) {
            const lT = Math.max(0, (elapsed - p.delay) / p.dur);
            if (lT < 1) allDone = false;
            const e  = easeOutExpo(Math.min(1, lT));
            const b  = bezXY(p.sx, p.sy, p.qx, p.qy, p.tx, p.ty, e);
            p.prevCx = p.cx; p.prevCy = p.cy;
            p.cx = b.x;      p.cy = b.y;
            p.opacity += (p.tOpacity - p.opacity) * 0.10;
            if (lT >= 1) p.done = true;
          }

          // Mouse repulsion spring
          if (p.done && mx > -9000) {
            const mdx = p.cx + p.rx - mx, mdy = p.cy + p.ry - my;
            const md2 = mdx*mdx + mdy*mdy;
            if (md2 < MOUSE_R*MOUSE_R && md2 > 0) {
              const f = MOUSE_STR / md2;
              p.rx += mdx * f; p.ry += mdy * f;
            }
          }
          p.rx *= 0.86; p.ry *= 0.86;

          if (p.opacity < 0.01) return;

          const drawX = p.cx + p.rx, drawY = p.cy + p.ry;
          const vx    = drawX - p.prevCx, vy = drawY - p.prevCy;
          const speed = Math.sqrt(vx*vx + vy*vy);
          const angle = speed > 0.5 ? Math.atan2(vy, vx) : 0;
          const str   = Math.min(4.5, 1 + speed * 0.7);

          // Idle pulse
          const pulse = p.done
            ? (0.70 + 0.30 * Math.sin((now / 2600 + i / N) * Math.PI * 2))
            : 1;

          // Trail ghost while moving
          if (speed > 1.8) {
            ctx.save();
            ctx.globalAlpha = p.opacity * 0.11;
            ctx.fillStyle   = '#00FFD1';
            ctx.beginPath(); ctx.arc(p.prevCx, p.prevCy, p.size * 0.75, 0, Math.PI*2);
            ctx.fill(); ctx.restore();
          }

          // Main particle
          ctx.save();
          ctx.globalAlpha = Math.min(1, p.opacity * pulse);
          ctx.fillStyle   = '#00FFD1';
          ctx.translate(drawX, drawY);
          if (str > 1.15) { ctx.rotate(angle); ctx.scale(str, 1 / str); }
          ctx.beginPath(); ctx.arc(0, 0, Math.max(0.8, p.size), 0, Math.PI*2); ctx.fill();

          // Soft halo glow (no shadowBlur — too expensive)
          if (p.done) {
            ctx.globalAlpha = p.opacity * pulse * 0.10;
            ctx.beginPath(); ctx.arc(0, 0, p.size * 4.5, 0, Math.PI*2); ctx.fill();
          }
          ctx.restore();
        });

        if (allDone && st.phase === 'assemble') st.phase = 'idle';
        rafRef.current = requestAnimationFrame(tick);
      }

      rafRef.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (rafRef.current)   cancelAnimationFrame(rafRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, section, isMobile]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      'fixed',
        top:           0, left: 0,
        pointerEvents: 'none',
        zIndex:        200,
        opacity:       section === 3 ? 0 : 1,
        transition:    'opacity 0.5s ease',
      }}
    />
  );
});

export default ParticleCanvas;
