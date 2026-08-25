import { useRef, useEffect, memo } from 'react';

const TiltCard = memo(function TiltCard({ children, className = '', maxTilt = 4 }) {
  const cardRef = useRef(null);
  const innerRef = useRef(null);
  const isTouchDevice = useRef(false);
  const rafId = useRef(null);

  useEffect(() => {
    // Disable 3D tilt calculations completely on touch devices and small viewports to guarantee 120 FPS
    isTouchDevice.current =
      typeof window !== 'undefined' &&
      (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (isTouchDevice.current) return;
    const card = cardRef.current;
    const inner = innerRef.current;
    if (!card || !inner) return;

    if (rafId.current) cancelAnimationFrame(rafId.current);

    rafId.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      const rx = ((y - cy) / cy) * -maxTilt;
      const ry = ((x - cx) / cx) * maxTilt;

      inner.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    });
  };

  const handleMouseLeave = () => {
    if (isTouchDevice.current) return;
    if (rafId.current) cancelAnimationFrame(rafId.current);

    const inner = innerRef.current;
    if (inner) {
      inner.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1000px' }}
      className={`transition-transform duration-200 will-change-transform ${className}`}
    >
      <div
        ref={innerRef}
        style={{
          transform: 'rotateX(0deg) rotateY(0deg)',
          transition: 'transform 0.12s ease-out',
        }}
        className="relative h-full w-full"
      >
        {children}
      </div>
    </div>
  );
});

export default TiltCard;
