import { useEffect, useRef, memo } from 'react';

// ── Constants ─────────────────────────────────────────────────────────────────
const N           = 400;
const SHAPE_N     = 320;  // exact count of points for unbroken closed perimeters
const AMBIENT_N   = 80;   // exact count of floating ambient stars
const SCATTER_MS  = 780;  // gentle, readable scatter burst
const ASSEMBLE_MS = 1650; // smooth, unobtrusive convergence
const MOUSE_R     = 72;
const MOUSE_STR   = 1100;
const easeOutExpo = t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
// Pre-calculate colors to prevent 22,000 string allocations per second
const SPEED_COLORS = Array.from({ length: 20 }, (_, i) => {
  const norm = i / 19;
  return `rgb(${Math.round(norm*255)},255,${Math.round(209+norm*46)})`;
});

// ── Distribute N points evenly around a rect perimeter ───────────────────────
function rectPts(rect, n, inflate = 0) {
  const x = rect.left - inflate, y = rect.top - inflate;
  const w = rect.width + inflate*2, h = rect.height + inflate*2;
  const perim = 2 * (w + h);
  const pts = [];
  for (let i = 0; i < n; i++) {
    const d = (i / n) * perim;
    let px, py;
    if      (d < w)         { px = x + d;           py = y; }
    else if (d < w + h)     { px = x + w;            py = y + (d - w); }
    else if (d < 2*w + h)   { px = x + w - (d-w-h); py = y + h; }
    else                    { px = x;                py = y + h - (d-2*w-h); }
    pts.push({ x: px, y: py });
  }
  return pts;
}

// Distribute n pts across multiple rects proportionally by perimeter
function multiRectPts(rects, n, inflate = 0) {
  if (!rects.length) return [];
  const perims = rects.map(r => 2 * (r.width + r.height));
  const total  = perims.reduce((a, b) => a + b, 0);
  const pts    = [];
  rects.forEach((r, i) => {
    const count = Math.max(4, Math.round((perims[i] / total) * n));
    pts.push(...rectPts(r, count, inflate));
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

// Generic pixel-sampler: renders word to offscreen canvas → grid scan → N points
const WORD_CACHE = {};
function sampleWord(word, n, cx, cy, scale = 1.0) {
  const cacheKey = `${word}_${n}_${cx}_${cy}_${scale}`;
  if (WORD_CACHE[cacheKey]) return WORD_CACHE[cacheKey];

  const W = Math.round(Math.min(window.innerWidth * 0.48 * scale, 460 * scale));
  const H = Math.round(W * 0.38);
  const off = document.createElement('canvas');
  off.width = W; off.height = H;
  const ctx = off.getContext('2d');
  const fs  = Math.min(W * 0.20, H * 0.74);
  ctx.font         = `${fs}px "Bebas Neue", Impact, "Arial Black", sans-serif`;
  ctx.fillStyle    = '#fff';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(word, W / 2, H / 2);
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
  const result = gridPts.slice(0, n).map(([dx, dy]) => ({ x: cx + dx, y: cy + dy }));
  WORD_CACHE[cacheKey] = result;
  return result;
}

// ── Build targets per section using real DOM bounding boxes ───────────────────
function buildTargets(section, isMobile) {
  const vw = window.innerWidth, vh = window.innerHeight;
  const cx = vw / 2, cy = vh / 2;

  // Ambient filler: random dots across FULL viewport (background stars)
  const ambient = (count) =>
    Array.from({ length: count }, () => ({
      x: 20 + Math.random() * (vw - 40),
      y: 20 + Math.random() * (vh - 40),
      ambient: true,
    }));

  // Guarantee exactly AMBIENT_N stars floating while preserving 100% of shape points!
  const pad = (pts) => {
    const bg = ambient(AMBIENT_N);
    const combined = [...pts, ...bg];
    while (combined.length < N) combined.push(ambient(1)[0]);
    // Randomize which particles stay behind vs move into shape without leaving any gaps
    return combined.slice(0, N).sort(() => Math.random() - 0.5);
  };

  // Projects: invisible
  if (section === 3) return null;

  // ── HERO: "SCROLL" hint near bottom of viewport ─────────────────────────────
  if (section === 0) {
    const pts = sampleWord('SCROLL', SHAPE_N, cx, vh * 0.94, 0.55);
    return pad(pts.map(p => ({ ...p, dim: true })));
  }

  // ── ABOUT: trace photo frame perimeter ────────────────────────────────────
  if (section === 1) {
    const photo = document.querySelector('#photo-frame-border');
    if (photo) return pad(rectPts(photo.getBoundingClientRect(), SHAPE_N));
    return pad(ambient(SHAPE_N));
  }

  // ── SKILLS: trace each skill card's border ────────────────────────────────
  if (section === 2) {
    // One big rect around the whole grid — clean single perimeter
    const grid = document.querySelector('.skills-panel [style*="grid-template"], .skills-panel .grid');
    if (grid) return pad(rectPts(grid.getBoundingClientRect(), SHAPE_N, 14));
    return pad(ambient(SHAPE_N));
  }

  // ── EXPERIENCE ────────────────────────────────────────────────────────────
  if (section === 4) {
    if (isMobile) {
      // Mobile Experience: assemble into a sharp, professional glowing laser underline directly beneath the main heading!
      const heading = document.querySelector('#exp-mobile-heading');
      if (heading) {
        const r = heading.getBoundingClientRect();
        return pad(linePts(r.left + 4, r.bottom + 10, r.right - 4, r.bottom + 10, SHAPE_N));
      }
      return pad(linePts(vw * 0.15, vh * 0.25, vw * 0.85, vh * 0.25, SHAPE_N));
    }
    // Desktop Experience: flow along timeline vertical line
    const timelineLine = document.querySelector('[data-exp-timeline]');
    if (timelineLine) {
      const r = timelineLine.getBoundingClientRect();
      return pad(linePts(r.left + r.width/2, r.top, r.left + r.width/2, r.bottom, SHAPE_N));
    }
    return pad(linePts(cx, vh * 0.18, cx, vh * 0.82, SHAPE_N));
  }

  // ── MOBILE CONTACT INTRO (Section 5 on mobile) ─────────────────────────────
  if (isMobile && section === 5) {
    // Form a compact, sleek downward-pointing arrow near bottom of viewport to prompt scrolling!
    const tipX = cx, tipY = vh * 0.88;
    const shaft = linePts(cx, vh * 0.81, tipX, tipY, 130);
    const leftWing = linePts(cx - 26, vh * 0.845, tipX, tipY, 95);
    const rightWing = linePts(cx + 26, vh * 0.845, tipX, tipY, 95);
    return pad([...shaft, ...leftWing, ...rightWing]);
  }

  // ── CONTACT FORM: trace form inputs + button borders ───────────────────────
  const fields = [...document.querySelectorAll(
    '.contact-panel input, .contact-panel textarea, .contact-panel button[type="submit"]'
  )];
  if (fields.length) return pad(multiRectPts(fields.map(f => f.getBoundingClientRect()), SHAPE_N));
  return pad(ambient(SHAPE_N));
}

// Bezier control point — bigger arc (40-70% of path length) for visible curve
function ctrlPt(sx, sy, tx, ty) {
  const mx  = (sx + tx) / 2, my = (sy + ty) / 2;
  const dx  = tx - sx,       dy = ty - sy;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const px  = -dy / len,     py = dx / len;
  const arc = len * (0.40 + Math.random() * 0.30);   // 40–70% arc
  const sgn = Math.random() < 0.5 ? 1 : -1;
  return { qx: mx + px * arc * sgn, qy: my + py * arc * sgn };
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

    const c = canvasRef.current; if (!c) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const vw  = window.innerWidth, vh = window.innerHeight;
    const ctx = c.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const isFirst = !stateRef.current;

    // ── FIRST MOUNT: create particles scattered randomly, then assemble to Hero ──
    if (isFirst) {
      const targets = buildTargets(section, isMobile);
      if (!targets) return;
      const particles = Array.from({ length: N }, (_, i) => {
        const tg  = targets[i];
        const sx  = Math.random() * vw, sy = Math.random() * vh;
        const { qx, qy } = ctrlPt(sx, sy, tg.x, tg.y);
        return {
          cx: sx, cy: sy, prevCx: sx, prevCy: sy,
          sx, sy, qx, qy, tx: tg.x, ty: tg.y,
          delay: Math.random() * 320,
          dur:   ASSEMBLE_MS + Math.random() * 260,
          done: false, rx: 0, ry: 0,
          opacity: 0.18, tOpacity: (tg.ambient || tg.dim) ? (tg.dim ? 0.35 : 0.18) : 0.70,
          size: 1.2 + Math.random() * 0.8, // thin, elegant, unobtrusive embers (1.2 to 2.0px)
        };
      });
      stateRef.current = { section, particles, morphStart: performance.now(), phase: 'assemble', hidden: false };
    } else {
      // ── SUBSEQUENT SECTION CHANGE ──────────────────────────────────────────
      stateRef.current.section = section;
      const { particles } = stateRef.current;

      // Projects — no scatter, just fade out smoothly
      if (section === 3) {
        particles.forEach(p => {
          p.tOpacity = 0;
          p.finalOpacity = 0;
          p.done = true; // stop all movement immediately
        });
        return;
      }

      stateRef.current.hidden = false;

      // 100% scatter out on section scroll! No particle stays frozen in its old shape.
      particles.forEach((p) => {
        const tx2 = 40 + Math.random() * (vw - 80);
        const ty2 = 40 + Math.random() * (vh - 80);
        const { qx, qy } = ctrlPt(p.cx, p.cy, tx2, ty2);
        p.sx=p.cx; p.sy=p.cy; p.qx=qx; p.qy=qy; p.tx=tx2; p.ty=ty2;
        p.delay        = Math.random() * 160;
        p.dur          = 650 + Math.random() * 250;
        p.done         = false;
        p.tOpacity     = 0.18; // Subtle, non-intrusive visibility while moving
        p.finalOpacity = 0.18;
      });
      stateRef.current.morphStart = performance.now();
      stateRef.current.phase      = 'scatter';

      // ── DELAYED: query DOM and assemble (graceful timing) ─────────────────
      const delay = section === 0 ? 100 : 850;
      timerRef.current = setTimeout(() => {
        const targets = buildTargets(section, isMobile);
        if (!targets) {
          if (stateRef.current) {
            stateRef.current.particles.forEach(p => { p.tOpacity = 0; p.finalOpacity = 0; });
            stateRef.current.hidden = true;
          }
          return;
        }
        const st = stateRef.current; if (!st) return;
        const dists = st.particles.map((p, i) => {
          const tg = targets[i] || targets[targets.length-1];
          return Math.sqrt((tg.x-p.cx)**2 + (tg.y-p.cy)**2);
        });
        const maxD = Math.max(...dists, 1);
        st.particles.forEach((p, i) => {
          const tg = targets[i] || targets[targets.length-1];
          const { qx, qy } = ctrlPt(p.cx, p.cy, tg.x, tg.y);
          const fo = (tg.ambient || tg.dim) ? (tg.dim ? 0.35 : 0.18) : 0.70;
          p.sx=p.cx; p.sy=p.cy; p.qx=qx; p.qy=qy; p.tx=tg.x; p.ty=tg.y;
          p.delay        = (1 - dists[i]/maxD) * 260 + Math.random() * 120;
          p.dur          = ASSEMBLE_MS + Math.random() * 200;
          p.done         = false;
          p.tOpacity     = 0.18;  // soft visibility while gliding
          p.finalOpacity = fo;    // intensifies slightly upon arrival
        });
        st.morphStart = performance.now();
        st.phase      = 'assemble';
      }, delay);
    }

    // ── Start tick loop (only if not already running) ─────────────────────────
    if (!rafRef.current) {
      function tick(now) {
        const st = stateRef.current; if (!st) return;
        if (st.hidden) {
          ctx.clearRect(0, 0, vw, vh);
          rafRef.current = requestAnimationFrame(tick);
          return;
        }

        const elapsed = now - st.morphStart;
        ctx.clearRect(0, 0, vw, vh);

        const { x: mx, y: my } = mouseRef.current;
        let allDone = true;
        const parts = st.particles;
        const plen = parts.length;

        for (let i = 0; i < plen; i++) {
          const p = parts[i];
          // ── Bezier progress ────────────────────────────────────────────────
          if (!p.done) {
            const lT = Math.max(0, (elapsed - p.delay) / p.dur);
            if (lT < 1) allDone = false;
            const e = easeOutExpo(Math.min(1, lT));
            
            p.prevCx = p.cx; 
            p.prevCy = p.cy;
            // Inlined bezier (prevents 22,000 object allocations/sec)
            const u = 1 - e;
            p.cx = u * u * p.sx + 2 * u * e * p.qx + e * e * p.tx;
            p.cy = u * u * p.sy + 2 * u * e * p.qy + e * e * p.ty;

            if (lT >= 1) {
              p.done = true;
            }
            // Snap brightness to full intensity upon arriving near goal (60%)
            if (st.phase === 'assemble' && lT > 0.60 && p.finalOpacity !== undefined) {
              p.tOpacity = p.finalOpacity;
              p.opacity  = p.finalOpacity;
            }
          }
          // Opacity lerp — ALWAYS runs. 0.25 = ultra-fast brightening if not snapped
          p.opacity += (p.tOpacity - p.opacity) * 0.25;

          // ── Mouse Physics (Unique per section!) ────────────────────────────
          if (p.done && mx > -9000) {
            const mdx = p.cx + p.rx - mx, mdy = p.cy + p.ry - my;
            const md2 = mdx*mdx + mdy*mdy;
            
            if (md2 < MOUSE_R*MOUSE_R && md2 > 0) {
              const sec = st.section;
              const f = MOUSE_STR / md2;

              if (sec === 0) {
                // 1. HERO: Magnetic Pull (particles attract to mouse)
                p.rx -= mdx * f * 0.03;
                p.ry -= mdy * f * 0.03;
              } 
              else if (sec === 2 || sec === 5) {
                // 2. SKILLS & CONTACT: Vortex Spin (repel + orbit)
                const angle = Math.atan2(mdy, mdx);
                const force = Math.min(15, f * 2);
                p.rx += mdx * f * 0.4 + Math.cos(angle + 1.57) * force;
                p.ry += mdy * f * 0.4 + Math.sin(angle + 1.57) * force;
              } 
              else {
                // 3. ABOUT & EXP: Standard Forcefield Repulsion
                p.rx += mdx * f; 
                p.ry += mdy * f;
              }
            }
          }
          p.rx *= 0.86; p.ry *= 0.86;

          if (p.opacity < 0.01) continue;

          const drawX = p.cx + p.rx, drawY = p.cy + p.ry;
          const vx    = drawX - p.prevCx, vy = drawY - p.prevCy;
          const speed = Math.sqrt(vx*vx + vy*vy);
          const angle = speed > 0.5 ? Math.atan2(vy, vx) : 0;
          const str   = Math.min(4.5, 1 + speed * 0.7);

          // Idle pulse
          const pulse = p.done ? (0.70 + 0.30 * Math.sin((now / 2600 + i / N) * Math.PI * 2)) : 1;

          // ── Speed-based color (No string allocations!) ─────────────────────
          const speedNorm = Math.min(1, speed / 18);
          const colorIdx  = (speedNorm * 19) | 0; // fast floor
          const dotColor  = speedNorm > 0.15 ? SPEED_COLORS[colorIdx] : '#00FFD1';

          // ── Trail ghosts ───────────────────────────────────────────────────
          if (speed > 1.6) {
            ctx.fillStyle = dotColor;
            
            ctx.globalAlpha = p.opacity * 0.14;
            ctx.beginPath(); ctx.arc(p.prevCx, p.prevCy, p.size * 0.9, 0, Math.PI*2); ctx.fill();
            
            ctx.globalAlpha = p.opacity * 0.07;
            ctx.beginPath(); ctx.arc((p.prevCx+drawX)/2, (p.prevCy+drawY)/2, p.size*0.55, 0, Math.PI*2); ctx.fill();
          }

          // ── Main particle ──────────────────────────────────────────────────
          ctx.globalAlpha = Math.min(1, p.opacity * pulse);
          ctx.fillStyle   = dotColor;

          if (str > 1.15) { 
            // Only use expensive save/restore when actually rotating (fast moving)
            ctx.save();
            ctx.translate(drawX, drawY);
            ctx.rotate(angle); 
            ctx.scale(str, 1/str); 
            ctx.beginPath(); ctx.arc(0, 0, Math.max(0.8, p.size), 0, Math.PI*2); ctx.fill();
            ctx.restore();
          } else {
            // Draw normally directly at coordinate
            ctx.beginPath(); ctx.arc(drawX, drawY, Math.max(0.8, p.size), 0, Math.PI*2); ctx.fill();
          }
          
          if (p.done || speedNorm > 0.2) {
            ctx.globalAlpha = p.opacity * (p.done ? pulse*0.10 : speedNorm*0.25);
            ctx.beginPath(); ctx.arc(drawX, drawY, p.size*(p.done ? 4.5 : 6), 0, Math.PI*2); ctx.fill();
          }
        }

        if (allDone && st.phase === 'assemble') st.phase = 'idle';
        rafRef.current = requestAnimationFrame(tick);
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      // Don't cancel RAF here — let it keep running across section changes
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
        zIndex:        5, // Always underneath the content elements and cards (zIndex 10+)
        willChange:    'transform, opacity',
        transform:     'translateZ(0)',
      }}
    />
  );
});

export default ParticleCanvas;
