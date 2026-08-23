import { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [coords, setCoords] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const ringRef = useRef(null);
  const ringPos = useRef({ x: -100, y: -100 });
  const targetPos = useRef({ x: -100, y: -100 });
  const rafRef = useRef(null);

  useEffect(() => {
    // Only activate on pointer devices (mice, trackpads), not touchscreens
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) return;

    const handleMouseMove = (e) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      setCoords({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      // Check if hovering interactive target
      const target = e.target;
      if (target && target.closest) {
        const isInteractive =
          target.closest('button') ||
          target.closest('a') ||
          target.closest('[role="button"]') ||
          target.closest('input') ||
          target.closest('textarea') ||
          target.closest('.bp-chip') ||
          target.closest('.parts-row');

        setIsHovered(!!isInteractive);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Direct DOM manipulation in RAF loop for 60fps smoothness without React re-renders
    const loop = () => {
      ringPos.current.x += (targetPos.current.x - ringPos.current.x) * 0.22;
      ringPos.current.y += (targetPos.current.y - ringPos.current.y) * 0.22;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden" aria-hidden="true">
      {/* ── Center Reticle Dot ────────────────────────────────────────── */}
      <div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-signal transition-transform duration-75"
        style={{
          transform: `translate3d(${coords.x}px, ${coords.y}px, 0) translate(-50%, -50%) scale(${isClicking ? 0.7 : 1})`,
        }}
      />

      {/* ── Outer Drafting Reticle Ring ───────────────────────────────── */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 border transition-[width,height,border-color,background-color] duration-150 rounded-full ${
          isHovered
            ? 'w-10 h-10 border-signal bg-signal/10'
            : 'w-7 h-7 border-ink/40 bg-transparent'
        }`}
      >
        {/* Reticle Crosshair Ticks */}
        <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-px h-1 bg-current opacity-60" />
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-px h-1 bg-current opacity-60" />
        <span className="absolute -left-1 top-1/2 -translate-y-1/2 h-px w-1 bg-current opacity-60" />
        <span className="absolute -right-1 top-1/2 -translate-y-1/2 h-px w-1 bg-current opacity-60" />
      </div>

      {/* ── Real-time Coordinate HUD ──────────────────────────────────── */}
      {isHovered && (
        <div
          className="fixed top-0 left-0 font-mono text-[0.52rem] text-signal font-bold tracking-widest bg-paper/90 px-1 py-0.5 border border-signal/40 pointer-events-none"
          style={{
            transform: `translate3d(${coords.x}px, ${coords.y + 26}px, 0) translate(-50%, 0)`,
          }}
        >
          X:{Math.round(coords.x)} Y:{Math.round(coords.y)}
        </div>
      )}
    </div>
  );
}
