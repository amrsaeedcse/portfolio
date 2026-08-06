import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';

// Hook to ensure animations only run ONCE per session.
export function useHasAnimated(isActive) {
  const [hasAnimated, setHasAnimated] = useState(false);
  
  useEffect(() => {
    if (isActive && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isActive, hasAnimated]);
  
  return hasAnimated;
}

// ── Global Reusable Variants ──────────────────────────────────────────────────

export const VARIANTS = {
  // Standard container with stagger
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  },
  fastContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.05 }
    }
  },
  fadeUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, y: 0, 
      transition: { type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.8 }
    }
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, scale: 1, 
      transition: { type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.8 }
    }
  },
  charReveal: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, y: 0, 
      transition: { type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.6 }
    }
  },

  // ── WORLD-CLASS CARD FLIP — 3D rotateX face-down → face-up ──────────────────
  // Parent container: staggers cards with 0.12s gap for a cascade domino effect
  cardFlipContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.15 }
    }
  },
  // Each card: flips from face-down (rotateX 90deg) to face-up (0deg)
  // Combined with a scale spring for extra physicality
  cardFlip: {
    hidden: {
      opacity: 0,
      rotateX: 88,
      scale: 0.75,
      y: 20,
    },
    visible: {
      opacity: 1,
      rotateX: 0,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 180,
        damping: 18,
        mass: 0.9,
      }
    }
  },

  // ── ABOUT PHOTO — card flip on the Y axis (like turning a photo over) ───────
  photoFlip: {
    hidden: { opacity: 0, rotateY: -70, scale: 0.88, x: -20 },
    visible: {
      opacity: 1,
      rotateY: 0,
      scale: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 140,
        damping: 20,
        mass: 1,
      }
    }
  },

  // ── STAT BOX — pops in with overshoot bounce ─────────────────────────────────
  statPop: {
    hidden: { opacity: 0, scale: 0.5, rotateZ: -8 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateZ: 0,
      transition: {
        type: 'spring',
        stiffness: 280,
        damping: 16,
        mass: 0.7,
      }
    }
  },

  // ── EXPERIENCE ITEM — grows from Y axis (timeline reveal) ──────────────────
  timelineItem: {
    hidden: { opacity: 0, x: -32, scaleX: 0.6 },
    visible: {
      opacity: 1,
      x: 0,
      scaleX: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 22,
      }
    }
  },

  // ── PILL WIPE — clips in from left (used for skill pills) ────────────────────
  pillWipe: {
    hidden: { opacity: 0, clipPath: 'inset(0 100% 0 0 round 9999px)', scale: 0.9 },
    visible: {
      opacity: 1,
      clipPath: 'inset(0 0% 0 0 round 9999px)',
      scale: 1,
      transition: {
        type: 'tween',
        ease: [0.16, 1, 0.3, 1],
        duration: 0.45,
      }
    }
  },

  // ── CONTACT FIELD SLIDE — fields wipe in from right ─────────────────────────
  fieldSlide: {
    hidden: { opacity: 0, x: 40, clipPath: 'inset(0 0 0 100%)' },
    visible: {
      opacity: 1,
      x: 0,
      clipPath: 'inset(0 0 0 0%)',
      transition: {
        type: 'tween',
        ease: [0.16, 1, 0.3, 1],
        duration: 0.6,
      }
    }
  },
};

// ── Character/Word Stagger Component ─────────────────────────────────────────
export const AnimatedText = ({ text, style, className }) => {
  return (
    <motion.div
      variants={VARIANTS.fastContainer}
      style={{ display: 'inline-block', ...style }}
      className={className}
    >
      {text.split(' ').map((word, wordIdx) => (
        <span key={wordIdx} style={{ display: 'inline-block', marginRight: '0.25em', whiteSpace: 'nowrap' }}>
          {word.split('').map((char, charIdx) => (
            <motion.span
              key={charIdx}
              variants={VARIANTS.charReveal}
              style={{ display: 'inline-block' }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.div>
  );
};

// ── Counter Component (0 to N) ────────────────────────────────────────────────
export const AnimatedCounter = ({ targetValue, isActive, format = (v) => Math.round(v) }) => {
  const nodeRef = useRef(null);
  const hasAnimated = useHasAnimated(isActive);
  const count = useMotionValue(0);

  useEffect(() => {
    if (hasAnimated) {
      const controls = animate(count, targetValue, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate: (value) => {
          if (nodeRef.current) {
            nodeRef.current.textContent = format(value);
          }
        }
      });
      return controls.stop;
    }
  }, [hasAnimated, targetValue, count, format]);

  return <span ref={nodeRef}>{hasAnimated ? format(targetValue) : 0}</span>;
};

// ── Hardware Hexadecimal Text Decoding Component ─────────────────────────────
const HEX_CHARS = '0123456789ABCDEF!<>_/#&*█▀▄[];=^$@0123456789ABCDEF';

export const HexDecodedText = ({ text, active = true, style, className, speed = 28, delay = 0 }) => {
  const [displayedText, setDisplayedText] = useState(() => text.replace(/[^\s]/g, '█'));
  const [isDecoding, setIsDecoding] = useState(true);

  useEffect(() => {
    if (!active) {
      setDisplayedText(text.replace(/[^\s]/g, '█'));
      setIsDecoding(true);
      return;
    }
    let timeoutId;
    let intervalId;
    let iterations = 0;
    
    timeoutId = setTimeout(() => {
      const maxIterations = text.length * 3 + 5;
      
      intervalId = setInterval(() => {
        setDisplayedText(() => 
          text
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' ';
              if (index < Math.floor(iterations / 3)) {
                return text[index];
              }
              return HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
            })
            .join('')
        );

        if (iterations >= maxIterations) {
          clearInterval(intervalId);
          setIsDecoding(false);
          setDisplayedText(text);
        }
        iterations += 1;
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [active, text, speed, delay]);

  return (
    <span 
      className={className} 
      style={{ 
        display: 'inline-block', 
        fontVariantNumeric: 'tabular-nums',
        transition: 'color 0.4s cubic-bezier(0.16, 1, 0.3, 1), text-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        ...style,
        color: isDecoding ? '#00FFD1' : style?.color,
        textShadow: isDecoding ? '0 0 20px rgba(0, 255, 209, 0.9), 0 0 40px rgba(0, 255, 209, 0.4)' : style?.textShadow,
      }}
    >
      {displayedText}
    </span>
  );
};

