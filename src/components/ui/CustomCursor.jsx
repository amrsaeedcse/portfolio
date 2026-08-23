import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [coords, setCoords] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Only activate on pointer devices (mice, trackpads), not touchscreens
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) return;

    const handleMouseMove = (e) => {
      setCoords({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

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
          target.closest('.sheet-frame');

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

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden" aria-hidden="true">
      {/* ── Precision Reticle Assembly (Perfect Concentric Alignment) ── */}
      <div
        className="fixed top-0 left-0 transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(${coords.x}px, ${coords.y}px, 0) translate(-50%, -50%)`,
        }}
      >
        {/* Center Crosshair Dot */}
        <div
          className={`w-2 h-2 rounded-full bg-[#FF4400] transition-transform duration-100 ${
            isClicking ? 'scale-75' : isHovered ? 'scale-125' : 'scale-100'
          }`}
        />

        {/* Outer Drafting Ring (Expands symmetrically in place) */}
        <div
          className={`absolute inset-0 -m-3.5 rounded-full border transition-all duration-200 ease-out flex items-center justify-center ${
            isHovered
              ? 'w-9 h-9 -m-4.5 border-[#FF4400] bg-[#FF4400]/15 scale-110'
              : 'w-7 h-7 -m-3.5 border-current opacity-40 bg-transparent scale-100'
          }`}
        >
          {/* Reticle Crosshair Ticks */}
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-px h-1 bg-current opacity-70" />
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-px h-1 bg-current opacity-70" />
          <span className="absolute -left-1 top-1/2 -translate-y-1/2 h-px w-1 bg-current opacity-70" />
          <span className="absolute -right-1 top-1/2 -translate-y-1/2 h-px w-1 bg-current opacity-70" />
        </div>

        {/* Real-time Coordinate HUD Badge below cursor */}
        {isHovered && (
          <div
            className="absolute top-6 left-1/2 -translate-x-1/2 font-mono text-[0.52rem] text-[#FF4400] font-bold tracking-widest px-1 py-0.5 border border-[#FF4400]/50 bg-white/95 dark:bg-black/95 shadow-sm whitespace-nowrap"
          >
            X:{Math.round(coords.x)}mm · Y:{Math.round(coords.y)}mm
          </div>
        )}
      </div>
    </div>
  );
}
