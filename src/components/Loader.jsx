import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Lines typed in sequence during the boot loader
const BOOT_LINES = [
  { text: '> INITIALIZING PORTFOLIO_OS v2.0', delay: 0 },
  { text: '> LOADING: Flutter SDK .............. OK', delay: 300 },
  { text: '> LOADING: IoT Systems .............. OK', delay: 550 },
  { text: '> LOADING: 3D Engine ................ OK', delay: 800 },
  { text: '> LOADING: React .................... OK', delay: 1050 },
  { text: '> ALL SYSTEMS NOMINAL', delay: 1400 },
  { text: '> WELCOME, AMR.', delay: 1700 },
];

// Single typed line — framer-motion SKILL: staggerChildren for character reveal
function TypedLine({ text, startDelay }) {
  const [visible, setVisible] = useState(false);
  const [chars, setChars] = useState([]);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setVisible(true);
      let i = 0;
      const charTimer = setInterval(() => {
        setChars((prev) => [...prev, text[i]]);
        i++;
        if (i >= text.length) clearInterval(charTimer);
      }, 18);
      return () => clearInterval(charTimer);
    }, startDelay);
    return () => clearTimeout(showTimer);
  }, [text, startDelay]);

  if (!visible) return null;
  return (
    <div className="font-mono text-xs md:text-sm leading-relaxed" style={{ color: 'oklch(68% 0.15 200)' }}>
      {chars.join('')}
      <span className="blink">_</span>
    </div>
  );
}

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const barRef = useRef(null);

  useEffect(() => {
    // Animate progress bar from 0→100 over 2.4s
    const start = performance.now();
    const duration = 2400;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setProgress(Math.floor(p * 100));
      if (p < 1) requestAnimationFrame(tick);
      else {
        // Short pause then trigger exit
        setTimeout(() => setDone(true), 400);
        setTimeout(() => onComplete(), 1000);
      }
    };
    requestAnimationFrame(tick);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'oklch(10% 0.01 264)',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'flex-start',
            padding: '0 8vw',
          }}
        >
          {/* Big name reveal — frontend-design: Bebas Neue display */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ marginBottom: '3rem' }}
          >
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(5rem, 18vw, 14rem)',
              lineHeight: 1,
              color: 'oklch(96% 0.005 264)',
              letterSpacing: '0.02em',
            }}>
              AMR
            </div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'oklch(68% 0.15 200)',
              marginTop: '-0.5rem',
            }}>
              Flutter Developer & Hardware Engineer
            </div>
          </motion.div>

          {/* Terminal boot lines */}
          <div style={{ marginBottom: '2.5rem', minHeight: '11rem' }}>
            {BOOT_LINES.map((line, i) => (
              <TypedLine key={i} text={line.text} startDelay={line.delay} />
            ))}
          </div>

          {/* Progress bar */}
          <div style={{ width: '100%', maxWidth: '480px' }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem',
              fontFamily: 'monospace', fontSize: '0.7rem', color: 'oklch(52% 0.02 264)',
            }}>
              <span>LOADING EXPERIENCE</span>
              <span style={{ color: 'oklch(68% 0.15 200)' }}>{progress}%</span>
            </div>
            <div style={{
              height: '2px', background: 'oklch(20% 0.02 264)', borderRadius: '999px', overflow: 'hidden',
            }}>
              <motion.div
                style={{
                  height: '100%', borderRadius: '999px',
                  background: 'linear-gradient(to right, oklch(68% 0.15 200), oklch(75% 0.18 60))',
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>

          {/* Corner decoration */}
          <div style={{
            position: 'absolute', bottom: '2rem', right: '2rem',
            fontFamily: 'monospace', fontSize: '0.65rem',
            color: 'oklch(25% 0.02 264)', letterSpacing: '0.15em',
          }}>
            PORTFOLIO_OS © 2025
          </div>

          {/* Ambient glow that pulses */}
          <motion.div
            animate={{ opacity: [0.04, 0.12, 0.04] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', top: '10%', right: '-10%',
              width: '50vw', height: '50vh', borderRadius: '50%',
              background: 'oklch(68% 0.15 200)',
              filter: 'blur(100px)', pointerEvents: 'none',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
