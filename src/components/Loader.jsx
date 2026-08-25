import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSwitchClick, initAudioContext } from '../lib/soundFx';

export default function Loader({ onComplete, onExiting }) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);

  // Ensure fonts are fully decoded before showing text
  useEffect(() => {
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready
        .then(() => setFontsReady(true))
        .catch(() => setFontsReady(true));
    } else {
      setFontsReady(true);
    }
  }, []);

  const handleFinish = useCallback(() => {
    if (isDone) return;
    setIsDone(true);
    initAudioContext();
    onExiting?.();
    setTimeout(() => {
      onComplete?.();
    }, 550);
  }, [isDone, onComplete, onExiting]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        playSwitchClick();
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFinish]);

  // Start progress ticker only once fonts are ready
  useEffect(() => {
    if (!fontsReady) return;

    const start = performance.now();
    const duration = 1100; // 1.1s sleek, fast, luxurious boot
    let raf;

    const tick = (now) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(handleFinish, 100);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [fontsReady, handleFinish]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="luxury-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: fontsReady ? 1 : 0 }}
          exit={{ y: '-100%' }}
          transition={{
            opacity: { duration: 0.2 },
            exit: { duration: 0.55, ease: [0.87, 0, 0.13, 1] }
          }}
          onClick={() => {
            initAudioContext();
            handleFinish();
          }}
          className="fixed inset-0 z-[1000] bg-[#0A0E1A] text-[#F1F5F9] flex flex-col justify-between p-8 sm:p-14 select-none cursor-pointer overflow-hidden"
        >
          {/* Subtle Blueprint Ambient Grid */}
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(56,189,248,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.4) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          {/* Top Bar */}
          <div className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between font-mono text-xs text-[#8A91A5] border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-[#FF4400] animate-pulse" />
              <span className="text-[#FF4400] font-bold tracking-widest text-[0.7rem] uppercase">
                DWG-000 // SYSTEM INITIALIZATION
              </span>
            </div>
            <span className="text-[0.65rem] tracking-widest uppercase text-white/50 hidden sm:inline font-mono">
              CLICK / SPACE TO SKIP ↗
            </span>
          </div>

          {/* Center Luxury Emblem & Title */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center">
            {/* Geometric Luxury CAD Monogram */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-20 h-20 mb-6 flex items-center justify-center border border-white/20 bg-[#12182B] shadow-2xl"
            >
              {/* Corner crosshairs */}
              <span className="absolute -top-1.5 -left-1.5 text-xs text-[#FF4400] font-mono">+</span>
              <span className="absolute -top-1.5 -right-1.5 text-xs text-[#FF4400] font-mono">+</span>
              <span className="absolute -bottom-1.5 -left-1.5 text-xs text-[#FF4400] font-mono">+</span>
              <span className="absolute -bottom-1.5 -right-1.5 text-xs text-[#FF4400] font-mono">+</span>

              <span className="font-display font-black text-4xl text-white">A</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight uppercase"
            >
              AMR ABDELAZEEM
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="font-mono text-xs text-[#FF4400] font-bold tracking-[0.26em] uppercase mt-2"
            >
              SYSTEMS ARCHITECT &amp; FLUTTER ENGINEER
            </motion.p>
          </div>

          {/* Bottom Precision Hairline Gauge */}
          <div className="relative z-10 w-full max-w-xl mx-auto">
            <div className="flex items-baseline justify-between font-mono text-xs mb-2">
              <span className="text-[#8A91A5] text-[0.68rem] tracking-wider uppercase">
                CALIBRATING ENVIRONMENT
              </span>
              <span className="font-mono font-bold text-xl text-white tabular-nums">
                {String(progress).padStart(2, '0')}<span className="text-xs text-[#FF4400] font-bold">%</span>
              </span>
            </div>

            <div className="w-full h-1 bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FF4400] to-[#38BDF8] transition-all duration-75 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between font-mono text-[0.62rem] text-[#8A91A5] mt-3">
              <span>ZAGAZIG, EG · 30.58° N, 31.50° E</span>
              <span className="text-[#10B981] font-bold uppercase">READY // SCALE 1:1</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
