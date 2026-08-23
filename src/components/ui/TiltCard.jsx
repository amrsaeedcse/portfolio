import { useRef, useState, useEffect } from 'react';

export default function TiltCard({ children, className = '', maxTilt = 4 }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const isTouchDevice = useRef(false);

  useEffect(() => {
    // Disable 3D tilt calculations completely on touch devices and small viewports to guarantee 120 FPS
    isTouchDevice.current =
      window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
  }, []);

  const handleMouseMove = (e) => {
    if (isTouchDevice.current) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const rx = ((y - cy) / cy) * -maxTilt;
    const ry = ((x - cx) / cx) * maxTilt;

    setTilt({ rx, ry });
  };

  const handleMouseLeave = () => {
    if (isTouchDevice.current) return;
    setTilt({ rx: 0, ry: 0 });
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
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: 'transform 0.12s ease-out',
        }}
        className="relative h-full w-full"
      >
        {children}
      </div>
    </div>
  );
}
