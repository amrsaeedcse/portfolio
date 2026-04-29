import React, { useEffect, useState } from 'react';

const BOOT_LINES = [
  'FLUTTER SDK ............ OK',
  'IoT SYSTEMS ........... OK',
  'WebGL ENGINE .......... OK',
  'REACT CORE ............ OK',
  'ALL SYSTEMS NOMINAL',
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500&display=swap');

  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateX(-12px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes barGrow {
    from { width: 0%; }
    to   { width: 100%; }
  }
  @keyframes countUp {
    from { --pct: 0; }
    to   { --pct: 100; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.03; }
    50%       { opacity: 0.09; }
  }
  @keyframes wipeOut {
    from { transform: scaleX(1); }
    to   { transform: scaleX(0); }
  }
  @keyframes nameIn {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shutterTop {
    from { transform: translateY(0); }
    to   { transform: translateY(-100%); }
  }
  @keyframes shutterBottom {
    from { transform: translateY(0); }
    to   { transform: translateY(100%); }
  }
  @keyframes fadeOut {
    from { opacity: 1; }
    to   { opacity: 0; }
  }
  @keyframes badgeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .loader-root {
    position: fixed; inset: 0; z-index: 1000;
    font-family: 'DM Sans', sans-serif;
  }
  .loader-root.exiting .shutter-top {
    animation: shutterTop 0.8s cubic-bezier(0.85,0,0.15,1) 0.2s forwards;
    will-change: transform;
  }
  .loader-root.exiting .shutter-bottom {
    animation: shutterBottom 0.8s cubic-bezier(0.85,0,0.15,1) 0.2s forwards;
    will-change: transform;
  }
  .loader-root.exiting .content-wrapper {
    animation: fadeOut 0.4s ease-out forwards;
    will-change: opacity;
  }
  .loader-root.exiting .glow-pulse {
    display: none; /* Immediately hide heavy blur to prevent composite lag */
  }

  .shutter-top {
    position: absolute; top: 0; left: 0;
    width: 100vw; height: 50vh;
    background: #05050a;
    transform-origin: bottom center;
  }
  .shutter-bottom {
    position: absolute; top: 50vh; left: 0;
    width: 100vw; height: 50vh;
    background: #05050a;
    transform-origin: top center;
  }

  .content-wrapper {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    justify-content: center; align-items: flex-start;
    padding: 0 8vw; overflow: hidden;
  }

  .grid-bg {
    position: absolute; inset: 0;
    pointer-events: none; overflow: hidden; opacity: 0.04;
  }
  .grid-line {
    position: absolute; top: 0; bottom: 0;
    width: 1px; background: #00FFD1;
  }

  .badge {
    position: absolute; top: 2.5rem; left: 8vw;
    font-family: monospace; font-size: 0.65rem;
    letter-spacing: 0.3em; color: #00FFD166;
    text-transform: uppercase;
    opacity: 0;
    animation: badgeIn 0.4s ease 0.1s forwards;
  }

  .boot-block { margin-bottom: 3rem; }
  .boot-header {
    font-family: monospace; font-size: 0.7rem;
    color: #00FFD144; letter-spacing: 0.2em; margin-bottom: 1.5rem;
  }
  .boot-line {
    font-family: monospace;
    font-size: clamp(0.75rem, 1.4vw, 0.9rem);
    letter-spacing: 0.1em; margin-bottom: 0.5rem;
    display: flex; align-items: center; gap: 0.75rem;
    opacity: 0;
    animation: fadeSlideIn 0.2s ease forwards;
  }
  .boot-line-num { color: #00FFD133; }

  .name-block {
    margin-bottom: 3rem; position: relative; display: inline-block;
  }
  .wipe-overlay {
    position: absolute; inset: 0;
    background: #00FFD1; z-index: 2;
    transform-origin: left center;
    animation: wipeOut 0.7s cubic-bezier(0.87,0,0.13,1) 0s forwards;
  }
  .name-inner {
    opacity: 0;
    animation: nameIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s forwards;
  }
  .name-big {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(5rem, 22vw, 16rem);
    line-height: 0.88; color: #f4f4f5; letter-spacing: 0.01em;
  }
  .name-sub {
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(0.8rem, 1.6vw, 1rem);
    letter-spacing: 0.35em; text-transform: uppercase;
    color: #00FFD1; margin-top: 0.5rem;
  }

  .progress-wrapper { width: 100%; max-width: 500px; }
  .progress-header {
    display: flex; justify-content: space-between; margin-bottom: 0.6rem;
    font-family: monospace; font-size: 0.65rem; color: #44444f;
  }
  .progress-label { letter-spacing: 0.15em; }
  .progress-pct { color: #00FFD1; }
  .progress-track {
    height: 1px; background: #ffffff0d;
    border-radius: 999px; overflow: hidden;
  }
  .progress-bar {
    height: 100%; width: 0%; border-radius: 999px;
    background: linear-gradient(to right, #00FFD1, #00b8a9);
    box-shadow: 0 0 12px #00FFD166;
  }

  .copyright {
    position: absolute; bottom: 2rem; right: 8vw;
    font-family: monospace; font-size: 0.6rem;
    color: #22222a; letter-spacing: 0.15em;
  }
  .glow-pulse {
    position: absolute; top: 20%; right: -8%;
    width: 50vw; height: 50vh; border-radius: 50%;
    background: #00FFD1; filter: blur(90px);
    pointer-events: none;
    animation: pulse 2.2s ease-in-out infinite;
  }
`;

// Total boot animation duration: stagger * lines + line duration
// 5 lines × 0.15s stagger + 0.2s = 0.95s base; bar takes ~same
const BOOT_STAGGER = 150;   // ms per line
const BOOT_DURATION = BOOT_LINES.length * BOOT_STAGGER + 300; // a bit of buffer
const NAME_DURATION = 900;  // reduced to feel snappier (was 1200)
const EXIT_DURATION = 1100; // slightly increased to let shutter finish cleanly (0.2s delay + 0.8s anim = 1.0s)

export default function Loader({ onComplete, onExiting, readyToExit }) {
  const [phase, setPhase] = useState('boot'); // boot | name | exiting | done
  const [pct, setPct] = useState(0);

  // Progress counter tied to boot duration
  useEffect(() => {
    if (phase !== 'boot') return;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min(100, Math.round(((now - start) / BOOT_DURATION) * 100));
      setPct(p);
      if (p < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // Advance phases
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('name'), BOOT_DURATION);
    return () => clearTimeout(t1);
  }, []);

  const [minTimePassed, setMinTimePassed] = useState(false);

  // الشرط الأول: وقت العرض الأدنى
  useEffect(() => {
    if (phase !== 'name') return;
    const t = setTimeout(() => setMinTimePassed(true), NAME_DURATION);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'name' || !minTimePassed || !readyToExit) return;
    setPhase('exiting');
  }, [phase, minTimePassed, readyToExit]);

  useEffect(() => {
    if (phase !== 'exiting') return;
    onExiting?.();
    const t = setTimeout(() => {
      setPhase('done');
      onComplete?.();
    }, EXIT_DURATION);
    return () => clearTimeout(t);
  }, [phase, onComplete, onExiting]);

  if (phase === 'done') return null;

  const isExiting = phase === 'exiting';

  return (
    <>
      <style>{styles}</style>
      <div className={`loader-root${isExiting ? ' exiting' : ''}`}>
        <div className="shutter-top" />
        <div className="shutter-bottom" />

        <div className="content-wrapper">
          {/* Ambient grid */}
          <div className="grid-bg">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="grid-line" style={{ left: `${i * 8.5}%` }} />
            ))}
          </div>

          {/* Badge */}
          <div className="badge">PORTFOLIO_OS v3.0</div>

          {/* Boot phase */}
          {phase === 'boot' && (
            <div className="boot-block">
              <div className="boot-header">&gt; BOOT SEQUENCE INITIATED</div>
              {BOOT_LINES.map((line, i) => (
                <div
                  key={i}
                  className="boot-line"
                  style={{
                    animationDelay: `${i * BOOT_STAGGER}ms`,
                    color: i === BOOT_LINES.length - 1 ? '#00FFD1' : '#00FFD188',
                  }}
                >
                  <span className="boot-line-num">[{String(i + 1).padStart(2, '0')}]</span>
                  {line}
                </div>
              ))}
            </div>
          )}

          {/* Name phase */}
          {(phase === 'name' || isExiting) && (
            <div className="name-block">
              <div className="wipe-overlay" />
              <div className="name-inner">
                <div className="name-big">AMR</div>
                <div className="name-sub">Flutter Developer &amp; Hardware Engineer</div>
              </div>
            </div>
          )}

          {/* Progress bar */}
          <div className="progress-wrapper">
            <div className="progress-header">
              <span className="progress-label">LOADING EXPERIENCE</span>
              <span className="progress-pct">{phase === 'boot' ? pct : 100}%</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-bar"
                style={{
                  width: phase === 'boot' ? `${pct}%` : '100%',
                  transition: phase === 'boot' ? 'none' : 'width 0.3s ease',
                }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="copyright">AMRSAEEDCSE © 2025</div>

          {/* Glow */}
          <div className="glow-pulse" />
        </div>
      </div>
    </>
  );
}