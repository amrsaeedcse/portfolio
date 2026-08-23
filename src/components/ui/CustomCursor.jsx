import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [coords, setCoords] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only activate on pointer devices (mice, trackpads), not touchscreens
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) return;

    const handleMouseMove = (e) => {
      setCoords({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target;
      if (target && target.closest) {
        const isInteractive =
          target.closest('button') ||
          target.closest('a') ||
          target.closest('[role="button"]') ||
          target.closest('input') ||
          target.closest('textarea') ||
          target.closest('.bp-chip') ||
          target.closest('.sheet-frame');

        setIsHovered(!!isInteractive);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none" aria-hidden="true">
      {/* ── Single Unified Concentric Assembly (Never drifts or leaves mouse) ── */}
      <div
        className="fixed top-0 left-0 flex items-center justify-center pointer-events-none"
        style={{
          transform: `translate3d(${coords.x}px, ${coords.y}px, 0) translate(-50%, -50%)`,
          width: 0,
          height: 0,
        }}
      >
        {/* Outer Reticle Ring (Expands symmetrically in place without transform clash) */}
        <div
          className={`absolute rounded-full border transition-[width,height,background-color,border-color,opacity] duration-200 ease-out flex items-center justify-center ${
            isHovered
              ? 'w-11 h-11 border-[var(--bp-accent,#FF4400)] bg-[var(--bp-accent,#FF4400)]/15 opacity-100'
              : isClicking
              ? 'w-7 h-7 border-current opacity-80 bg-transparent'
              : 'w-8 h-8 border-current opacity-40 bg-transparent'
          }`}
        >
          {/* 4 Precision CAD Ticks */}
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-px h-1 bg-current opacity-60" />
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-px h-1 bg-current opacity-60" />
          <span className="absolute -left-1 top-1/2 -translate-y-1/2 h-px w-1 bg-current opacity-60" />
          <span className="absolute -right-1 top-1/2 -translate-y-1/2 h-px w-1 bg-current opacity-60" />
        </div>

        {/* Center Crosshair Dot (Locks 100% on mouse tip) */}
        <div
          className={`absolute rounded-full transition-[width,height,background-color] duration-150 ${
            isClicking
              ? 'w-1 h-1 bg-[var(--bp-accent,#FF4400)]'
              : isHovered
              ? 'w-2 h-2 bg-[var(--bp-accent,#FF4400)]'
              : 'w-1.5 h-1.5 bg-[var(--bp-accent,#FF4400)]'
          }`}
        />
      </div>
    </div>
  );
}
