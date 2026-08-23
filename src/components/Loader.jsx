import { useEffect, useState } from 'react';

const BOOT_LINES = [
  'PAPER STOCK .......... LOADED',
  'INK RESERVOIR ........ FILLED',
  'GRID CALIBRATION ..... 32PX / 160PX',
  'DIMENSION CHECK ...... NOMINAL',
  'TITLE BLOCK .......... SIGNED',
];

const styles = `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateX(-10px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes nameIn {
    from { opacity: 0; transform: translateY(26px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes wipeOut {
    from { transform: scaleX(1); }
    to   { transform: scaleX(0); }
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
  @keyframes seamFlash {
    0%   { transform: scaleX(0); opacity: 0; height: 2px; }
    30%  { transform: scaleX(1); opacity: 1; height: 3px; }
    100% { transform: scaleX(1); opacity: 0; height: 2px; }
  }
  @keyframes underlineDraw {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }

  .loader-root {
    position: fixed; inset: 0; z-index: 1000;
    background: #F2EFE7;
    font-family: 'Archivo', sans-serif;
    color: #1A1D23;
  }
  .loader-root::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(58,87,196,0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(58,87,196,0.07) 1px, transparent 1px);
    background-size: 32px 32px;
    pointer-events: none;
  }

  .loader-root.exiting .shutter-top { animation: shutterTop 0.8s cubic-bezier(0.85,0,0.15,1) 0.18s forwards; will-change: transform; }
  .loader-root.exiting .shutter-bottom { animation: shutterBottom 0.8s cubic-bezier(0.85,0,0.15,1) 0.18s forwards; will-change: transform; }
  .loader-root.exiting .content-wrapper { animation: fadeOut 0.22s ease-out forwards; }
  .loader-root.exiting .crosshair-spin { display: none; }

  .aperture-seam {
    position: absolute; top: calc(50vh - 1px); left: 0; right: 0;
    height: 2px; background: #FF4400; z-index: 1050;
    pointer-events: none; transform: scaleX(0); opacity: 0;
    transform-origin: center;
  }
  .loader-root.exiting .aperture-seam {
    animation: seamFlash 0.4s cubic-bezier(0.16,1,0.3,1) forwards;
  }

  .shutter-top {
    position: absolute; top: 0; left: 0;
    width: 100vw; height: 50vh;
    background: #F2EFE7;
    border-bottom: 1px solid rgba(26,29,35,0.25);
    overflow: hidden;
    z-index: 1010;
  }
  .shutter-bottom {
    position: absolute; top: 50vh; left: 0;
    width: 100vw; height: 50vh;
    background: #F2EFE7;
    border-top: 1px solid rgba(26,29,35,0.25);
    overflow: hidden;
    z-index: 1010;
  }
  .loader-telemetry {
    position: absolute;
    font-family: 'IBM Plex Mono', monospace; font-size: 0.6rem;
    letter-spacing: 0.28em; color: #82868F; text-transform: uppercase;
    opacity: 0; transition: opacity 0.2s ease 0.1s;
  }
  .telemetry-top { bottom: 0.6rem; right: 8vw; }
  .telemetry-bottom { top: 0.6rem; left: 8vw; }
  .loader-root.exiting .loader-telemetry { opacity: 1; }

  .content-wrapper {
    position: absolute; inset: 0; z-index: 1020;
    display: flex; flex-direction: column;
    justify-content: center; align-items: flex-start;
    padding: 0 8vw; overflow: hidden;
  }

  .badge {
    position: absolute; top: 2.4rem; left: 8vw;
    font-family: 'IBM Plex Mono', monospace; font-size: 0.62rem;
    letter-spacing: 0.3em; color: #FF4400; text-transform: uppercase;
    display: flex; align-items: center; gap: 0.7rem;
  }
  .badge::before {
    content: '';
    width: 8px; height: 8px;
    background: #FF4400;
    animation: blink 1.15s steps(1) infinite;
  }

  .boot-block { margin-bottom: 2.6rem; }
  .boot-header {
    font-family: 'IBM Plex Mono', monospace; font-size: 0.68rem;
    color: #82868F; letter-spacing: 0.22em; margin-bottom: 1.3rem;
  }
  .boot-line {
    font-family: 'IBM Plex Mono', monospace;
    font-size: clamp(0.72rem, 1.3vw, 0.85rem);
    letter-spacing: 0.08em; margin-bottom: 0.45rem;
    display: flex; align-items: center; gap: 0.75rem;
    opacity: 0;
    animation: fadeSlideIn 0.22s ease forwards;
    color: #454A54;
  }
  .boot-line-num { color: rgba(26,29,35,0.28); }
  .boot-ok { color: #FF4400; }

  .name-block { margin-bottom: 2.6rem; position: relative; display: inline-block; }
  .wipe-overlay {
    position: absolute; inset: 0;
    background: #FF4400; z-index: 2;
    transform-origin: left center;
    animation: wipeOut 0.65s cubic-bezier(0.87,0,0.13,1) forwards;
  }
  .name-inner {
    opacity: 0;
    animation: nameIn 0.55s cubic-bezier(0.16,1,0.3,1) 0.12s forwards;
  }
  .name-big {
    font-weight: 900; font-stretch: 112%;
    font-size: clamp(3.2rem, 11vw, 8rem);
    line-height: 0.92; color: #1A1D23; letter-spacing: -0.015em;
    text-transform: uppercase;
  }
  .name-outline {
    color: transparent;
    -webkit-text-stroke: 1.5px #1A1D23;
  }
  .name-underline {
    height: 3px; background: #FF4400; margin-top: 0.9rem;
    transform-origin: left center;
    animation: underlineDraw 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s both;
  }
  .name-sub {
    font-family: 'IBM Plex Mono', monospace;
    font-size: clamp(0.62rem, 1.4vw, 0.78rem);
    letter-spacing: 0.32em; text-transform: uppercase;
    color: #454A54; margin-top: 0.85rem;
  }

  .progress-wrapper { width: 100%; max-width: 520px; }
  .progress-header {
    display: flex; justify-content: space-between; margin-bottom: 0.55rem;
    font-family: 'IBM Plex Mono', monospace; font-size: 0.62rem;
    color: #82868F; letter-spacing: 0.16em;
  }
  .progress-pct { color: #FF4400; font-weight: 600; }
  .progress-track {
    position: relative;
    height: 6px;
    background:
      repeating-linear-gradient(to right,
        rgba(26,29,35,0.22) 0 1px, transparent 1px 10%);
  }
  .progress-bar {
    position: absolute; left: 0; top: 50%; margin-top: -1px;
    height: 2px; width: 100%;
    transform-origin: left center;
    background: #1A1D23;
    will-change: transform;
  }

  .copyright {
    position: absolute; bottom: 1.8rem; right: 8vw;
    font-family: 'IBM Plex Mono', monospace; font-size: 0.58rem;
    color: #B9B4A6; letter-spacing: 0.18em;
  }

  /* Rotating crosshair — surveyor mark */
  .crosshair-spin {
    position: absolute; top: 50%; right: 12vw;
    width: clamp(90px, 14vw, 170px); aspect-ratio: 1;
    transform: translateY(-50%);
    pointer-events: none; opacity: 0.85;
  }
  @media (max-width: 767px) { .crosshair-spin { display: none; } }
`;

// Timing mirrors the previous loader contract so App wiring stays identical
const BOOT_STAGGER = 140;
const BOOT_DURATION = BOOT_LINES.length * BOOT_STAGGER + 300;
const NAME_DURATION = 900;
const EXIT_DURATION = 1100;

export default function Loader({ onComplete, onExiting, readyToExit }) {
  const [phase, setPhase] = useState('boot'); // boot | name | exiting | done
  const [pct, setPct] = useState(0);

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

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('name'), BOOT_DURATION);
    return () => clearTimeout(t1);
  }, []);

  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    if (phase !== 'name') return;
    const t = setTimeout(() => setMinTimePassed(true), NAME_DURATION);
    return () => clearTimeout(t);
  }, [phase]);

  /* Derived: shutters only start once minimum showtime passed AND page is ready */
  const exiting = phase === 'name' && minTimePassed && readyToExit;

  useEffect(() => {
    if (!exiting) return;
    onExiting?.();
    const t = setTimeout(() => {
      setPhase('done');
      onComplete?.();
    }, EXIT_DURATION);
    return () => clearTimeout(t);
  }, [exiting, onComplete, onExiting]);

  if (phase === 'done') return null;

  const isExiting = exiting;

  return (
    <>
      <style>{styles}</style>
      <div className={`loader-root${isExiting ? ' exiting' : ''}`}>
        <div className="aperture-seam" />
        <div className="shutter-top">
          <div className="loader-telemetry telemetry-top">[ SHEET_01 // RELEASED ]</div>
        </div>
        <div className="shutter-bottom">
          <div className="loader-telemetry telemetry-bottom">[ DWG_NO: AA-2026-001 // CHECKED ✓ ]</div>
        </div>

        <div className="content-wrapper">
          <div className="badge">PORTFOLIO // DRAWING SET REV.2026</div>

          {/* Rotating surveyor crosshair */}
          <svg className="crosshair-spin spin-slow" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="46" fill="none" stroke="#1A1D23" strokeWidth="1" opacity="0.35" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="#3A57C4" strokeWidth="0.75" strokeDasharray="4 6" opacity="0.7" />
            <line x1="50" y1="2" x2="50" y2="24" stroke="#FF4400" strokeWidth="1.4" />
            <line x1="50" y1="76" x2="50" y2="98" stroke="#FF4400" strokeWidth="1.4" />
            <line x1="2" y1="50" x2="24" y2="50" stroke="#FF4400" strokeWidth="1.4" />
            <line x1="76" y1="50" x2="98" y2="50" stroke="#FF4400" strokeWidth="1.4" />
            <circle cx="50" cy="50" r="2.4" fill="#FF4400" />
          </svg>

          {phase === 'boot' && (
            <div className="boot-block">
              <div className="boot-header">&gt; PREPARING SCHEMATIC</div>
              {BOOT_LINES.map((line, i) => (
                <div key={i} className="boot-line" style={{ animationDelay: `${i * BOOT_STAGGER}ms` }}>
                  <span className="boot-line-num">[{String(i + 1).padStart(2, '0')}]</span>
                  <span>{line}</span>
                  <span className="boot-ok">✓</span>
                </div>
              ))}
            </div>
          )}

          {(phase === 'name' || isExiting) && (
            <div className="name-block">
              <div className="wipe-overlay" />
              <div className="name-inner">
                <div className="name-big">AMR<br /><span className="name-outline">ABDELAZEEM</span></div>
                <div className="name-underline" />
                <div className="name-sub">FLUTTER × HARDWARE ENGINEER</div>
              </div>
            </div>
          )}

          <div className="progress-wrapper">
            <div className="progress-header">
              <span>IMPORTING DRAWING SET</span>
              <span className="progress-pct">{phase === 'boot' ? pct : 100}%</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-bar"
                style={{
                  transform: `scaleX(${(phase === 'boot' ? pct : 100) / 100})`,
                }}
              />
            </div>
          </div>

          <div className="copyright">AMRSAEEDCSE © 2026</div>
        </div>
      </div>
    </>
  );
}
