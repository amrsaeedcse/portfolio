import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSwitchClick, playPulseChime } from '../lib/soundFx';

const DIAGNOSTIC_STEPS = [
  'INITIALIZING DART 3 & FLUTTER VM',
  'CALIBRATING FREERTOS TASK SCHEDULER',
  'MOUNTING ESP32 SENSOR TELEMETRY BUS',
  'SYNTHESIZING 32-BIT RISC FPGA BLUEPRINT',
  'DRAWING SET VERIFIED // SCALE 1:1',
];

export default function Loader({ onComplete, onExiting }) {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const audioPlayed = useRef(false);

  const handleFinish = useCallback(() => {
    if (isDone) return;
    setIsDone(true);
    if (!audioPlayed.current) {
      audioPlayed.current = true;
      playPulseChime();
    }
    onExiting?.();
    setTimeout(() => {
      onComplete?.();
    }, 650);
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

  useEffect(() => {
    const start = performance.now();
    const duration = 1400; // 1.4s smooth cinematic boot
    let raf;

    const tick = (now) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      const step = Math.min(DIAGNOSTIC_STEPS.length - 1, Math.floor((pct / 100) * DIAGNOSTIC_STEPS.length));
      setStepIndex(step);

      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(handleFinish, 160);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [handleFinish]);

  return (
    <AnimatePresence>
      {!isDone ? (
        <div
          onClick={handleFinish}
          className="fixed inset-0 z-[1000] overflow-hidden select-none cursor-pointer"
          aria-label="Loading engineering portfolio. Click anywhere or press space to skip."
        >
          {/* Top Half Curtain */}
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.65, ease: [0.87, 0, 0.13, 1] }}
            className="absolute inset-x-0 top-0 h-1/2 bg-[#0C1222] border-b-2 border-[#FF4400] flex flex-col justify-end p-6 sm:p-12"
          >
            {/* Ambient CAD Grid on Top Curtain */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(56,189,248,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.3) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Top Status Bar */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between font-mono text-xs text-[#8A91A5] border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#FF4400] animate-ping" />
                <span className="text-[#FF4400] font-bold tracking-widest uppercase">
                  DWG-000 // CAD CALIBRATION
                </span>
              </div>
              <span className="tracking-widest hidden sm:inline text-[0.68rem] text-white/60">
                CLICK / SPACE TO BYPASS ↗
              </span>
            </div>

            {/* Center Brand Title */}
            <div className="relative z-10 max-w-4xl mx-auto w-full text-center pb-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center justify-center w-14 h-14 border-2 border-[#FF4400] bg-[#141F3D] mb-4 shadow-lg"
              >
                <span className="font-display font-black text-2xl text-white">A</span>
              </motion.div>

              <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight uppercase">
                AMR ABDELAZEEM
              </h1>
              <p className="font-mono text-xs text-[#FF4400] font-bold tracking-[0.22em] uppercase mt-1">
                COMPUTER &amp; SYSTEMS ARCHITECT
              </p>
            </div>
          </motion.div>

          {/* Bottom Half Curtain */}
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.65, ease: [0.87, 0, 0.13, 1] }}
            className="absolute inset-x-0 bottom-0 h-1/2 bg-[#0C1222] border-t-2 border-[#FF4400] flex flex-col justify-start p-6 sm:p-12"
          >
            {/* Ambient CAD Grid on Bottom Curtain */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(56,189,248,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.3) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Live Telemetry Diagnostic Gauge */}
            <div className="relative z-10 max-w-4xl mx-auto w-full pt-4">
              {/* Live Step Text */}
              <div className="flex items-center justify-between font-mono text-xs mb-2">
                <span className="text-[#38BDF8] font-bold tracking-wider truncate mr-2">
                  &gt; {DIAGNOSTIC_STEPS[stepIndex]}
                </span>
                <span className="text-2xl sm:text-3xl font-black font-mono text-white tabular-nums flex-none">
                  {String(progress).padStart(2, '0')}<span className="text-xs text-[#FF4400] font-bold">%</span>
                </span>
              </div>

              {/* Progress Line */}
              <div className="w-full h-2 bg-[#141F3D] border border-white/20 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FF4400] via-[#38BDF8] to-[#10B981] transition-all duration-75 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Bottom Footer Info */}
              <div className="flex items-center justify-between font-mono text-[0.65rem] text-[#8A91A5] mt-4 border-t border-white/10 pt-3">
                <span>ZAGAZIG, EGYPT · 30.58° N, 31.50° E</span>
                <span className="text-[#10B981] font-bold uppercase">
                  {progress === 100 ? 'SYSTEM READY ✓' : 'CALIBRATING…'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
