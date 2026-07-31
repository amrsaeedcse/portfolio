/// AnimatedCounter — GPU-only counting number animation with spring physics.
/// Rule 14: shared generic component.
/// Vercel animation-gpu-properties: only opacity + transform for the flip reveal.
/// Uses useDerivedValue to derive display string from shared progress value.

import React, { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { moderateScale } from 'react-native-size-matters';
import { useAppTheme } from '@/core/theme/ThemeContext';
import { AppFonts } from '@/core/theme/appFonts';

interface AnimatedCounterProps {
  /** Target numeric value (suffix like '+', 'k' etc.). */
  value: string;
  /** Font size for the number. */
  fontSize?: number;
  /** Accent color for the digit. */
  color?: string;
  /** Delay before counter starts (ms). */
  delay?: number;
  /** Duration of the count-up animation (ms). */
  duration?: number;
}

/** Parses a value string like "30+", "4.5k", "12" into prefix/suffix/number. */
function parseValue(val: string): { num: number; suffix: string } {
  const match = val.match(/^([\d.]+)(.*)$/);
  if (!match) return { num: 0, suffix: '' };
  return { num: parseFloat(match[1]), suffix: match[2] ?? '' };
}

export function AnimatedCounter({
  value,
  fontSize = 28,
  color,
  delay = 0,
  duration = 1800,
}: AnimatedCounterProps) {
  const { colors } = useAppTheme();
  const accentColor = color ?? colors.accent;

  const { num, suffix } = parseValue(value);

  const [displayNum, setDisplayNum] = useState(0);
  const progress = useSharedValue(0);
  const revealY = useSharedValue(20);
  const revealOpacity = useSharedValue(0);

  // Update JS-side display when progress changes (runs on JS thread).
  const updateDisplay = (v: number) => {
    const rounded = num < 10 ? Math.round(v * 10) / 10 : Math.round(v);
    setDisplayNum(rounded);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      progress.set(
        withTiming(num, {
          duration,
          easing: Easing.out(Easing.cubic),
        })
      );
      revealY.set(withSpring(0, { damping: 14, stiffness: 120 }));
      revealOpacity.set(withTiming(1, { duration: 400 }));
    }, delay);

    return () => clearTimeout(timeout);
  }, [num, delay, duration, progress, revealY, revealOpacity]);

  // Drive JS display from progress using runOnJS inside useAnimatedReaction alternative.
  // We use a polling approach via useEffect to keep it React Compiler friendly.
  const frameRef = useRef<number | null>(null);
  useEffect(() => {
    const startTime = performance?.now?.() ?? Date.now();
    const tick = () => {
      const elapsed = (performance?.now?.() ?? Date.now()) - startTime - delay;
      if (elapsed >= 0) {
        const t = Math.min(elapsed / duration, 1);
        const eased = t < 1 ? 1 - Math.pow(1 - t, 3) : 1;
        updateDisplay(eased * num);
      }
      if ((performance?.now?.() ?? Date.now()) - startTime < delay + duration + 200) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };
    if (Platform.OS === 'web' && typeof requestAnimationFrame !== 'undefined') {
      frameRef.current = requestAnimationFrame(tick);
    } else {
      // Native: update at intervals
      const interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) - delay;
        if (elapsed >= 0) {
          const t = Math.min(elapsed / duration, 1);
          const eased = t < 1 ? 1 - Math.pow(1 - t, 3) : 1;
          updateDisplay(eased * num);
        }
        if (elapsed >= duration) clearInterval(interval);
      }, 16);
      return () => clearInterval(interval);
    }
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [num, delay, duration]);

  const revealStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: revealY.get() }],
    opacity: revealOpacity.get(),
  }));

  const displayStr = num < 10
    ? displayNum.toFixed(1)
    : Math.round(displayNum).toString();

  return (
    <Animated.Text
      style={[
        revealStyle,
        {
          fontSize: moderateScale(fontSize),
          fontFamily: AppFonts.heading,
          color: accentColor,
          includeFontPadding: false,
          ...(Platform.OS === 'web' && { willChange: 'transform, opacity' } as any),
        },
      ]}
    >
      {displayStr}{suffix}
    </Animated.Text>
  );
}
