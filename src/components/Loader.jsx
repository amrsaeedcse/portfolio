import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Loader({ onComplete, onExiting }) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const handleFinish = useCallback(() => {
    setIsDone(true);
    onExiting?.();
    setTimeout(() => {
      onComplete?.();
    }, 550);
  }, [onComplete, onExiting]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') handleFinish();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFinish]);

  useEffect(() => {
    const start = performance.now();
    const duration = 1100;
    let raf;

    const tick = (now) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(handleFinish, 120);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [handleFinish]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: [0.87, 0, 0.13, 1] }}
          onClick={handleFinish}
          className="fixed inset-0 z-[1000] flex flex-col items-center justify-between bg-[#F2EFE7] text-[#111318] px-6 py-12 select-none cursor-pointer border-8 border-[#111318]"
        >
          {/* Top Title Block */}
          <div className="w-full max-w-5xl flex items-center justify-between font-mono text-xs text-[#8A91A5] border-b border-[#111318]/20 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#FF4400] animate-ping" />
              <span className="text-[#FF4400] font-bold tracking-widest uppercase">DWG-000 // CAD BOOT SEQUENCE</span>
            </div>
            <span className="tracking-widest hidden sm:inline text-[0.68rem] text-[#4B5162]">SPACE / CLICK TO BYPASS ↗</span>
          </div>

          {/* Center Schematic Blueprint Emblem */}
          <div className="flex flex-col items-center text-center my-auto">
            {/* SVG Circuit Trace */}
            <div className="relative w-24 h-24 mb-6 flex items-center justify-center border-2 border-[#111318] bg-[#EAE6DC] shadow-md">
              <span className="font-display font-black text-5xl text-[#111318]">A</span>
              <span className="absolute -top-1.5 -left-1.5 text-xs text-[#FF4400] font-mono">+</span>
              <span className="absolute -top-1.5 -right-1.5 text-xs text-[#FF4400] font-mono">+</span>
              <span className="absolute -bottom-1.5 -left-1.5 text-xs text-[#FF4400] font-mono">+</span>
              <span className="absolute -bottom-1.5 -right-1.5 text-xs text-[#FF4400] font-mono">+</span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="font-display font-black text-3xl sm:text-5xl text-[#111318] tracking-tight uppercase"
            >
              AMR ABDELAZEEM
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="font-mono text-xs text-[#FF4400] tracking-[0.24em] uppercase mt-2 font-bold"
            >
              COMPUTER &amp; SYSTEMS ENGINEER // DRAWING SET
            </motion.p>
          </div>

          {/* Bottom Precision Progress Bar & Spec */}
          <div className="w-full max-w-md">
            <div className="flex items-baseline justify-between font-mono text-xs mb-2">
              <span className="text-[#4B5162] tracking-wider uppercase">CALIBRATING DATUM</span>
              <span className="text-2xl font-bold font-mono text-[#111318] tabular-nums">
                {String(progress).padStart(2, '0')}<span className="text-xs text-[#FF4400] font-bold">%</span>
              </span>
            </div>

            <div className="w-full h-2 bg-[#E1DCCE] border border-[#111318] overflow-hidden">
              <div
                className="h-full bg-[#FF4400] transition-all duration-75 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between font-mono text-[0.65rem] text-[#8A91A5] mt-3">
              <span>SCALE: 1:1 · ZAGAZIG, EG</span>
              <span className="text-[#0E8345] font-bold uppercase">APPROVED ✓</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
