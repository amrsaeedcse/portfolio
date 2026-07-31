/// ParticleField — floating neon particles that drift and react to pointer position on web.
/// Rule 14: shared generic component in src/components/common/.
/// Vercel animation-gpu-properties: ONLY transform (translateX/Y, scale) + opacity.
/// React Compiler compatible: .get()/.set() API on shared values.

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { useAppTheme } from '@/core/theme/ThemeContext';

interface Particle {
  id: number;
  baseX: number;
  baseY: number;
  size: number;
  color: string;
  driftX: ReturnType<typeof useSharedValue<number>>;
  driftY: ReturnType<typeof useSharedValue<number>>;
  opacity: ReturnType<typeof useSharedValue<number>>;
  scaleVal: ReturnType<typeof useSharedValue<number>>;
  speed: number;
  phase: number;
}

interface ParticleFieldProps {
  count?: number;
  interactive?: boolean;
}

// We generate particles at module level with a fixed seed for SSR safety.
function generateParticleConfigs(count: number) {
  const configs: Array<{
    id: number;
    baseXFrac: number;
    baseYFrac: number;
    size: number;
    colorIndex: number;
    speed: number;
    phase: number;
  }> = [];
  for (let i = 0; i < count; i++) {
    // Deterministic pseudo-random based on index (no Math.random to keep SSR safe)
    const seed = (i * 137.508) % 1;
    const seed2 = (i * 73.491 + 0.5) % 1;
    const seed3 = (i * 53.233 + 0.3) % 1;
    const seed4 = (i * 31.711 + 0.7) % 1;
    configs.push({
      id: i,
      baseXFrac: seed,
      baseYFrac: seed2,
      size: 2 + seed3 * 4,
      colorIndex: Math.floor(seed4 * 5),
      speed: 3000 + seed * 5000,
      phase: seed2 * 2000,
    });
  }
  return configs;
}

const PARTICLE_COLORS = ['#00FFD1', '#0ea5e9', '#a855f7', '#ec4899', '#10b981'];

function SingleParticle({
  baseFracX,
  baseFracY,
  size,
  color,
  speed,
  phase,
  screenW,
  screenH,
}: {
  baseFracX: number;
  baseFracY: number;
  size: number;
  color: string;
  speed: number;
  phase: number;
  screenW: number;
  screenH: number;
}) {
  const driftX = useSharedValue(0);
  const driftY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scaleVal = useSharedValue(0.5);

  useEffect(() => {
    const range = 40 + size * 8;
    const easing = Easing.inOut(Easing.sin);

    driftX.set(
      withRepeat(
        withSequence(
          withTiming(range, { duration: speed, easing }),
          withTiming(-range * 0.6, { duration: speed * 0.8, easing }),
          withTiming(range * 0.3, { duration: speed * 0.6, easing }),
          withTiming(0, { duration: speed * 0.5, easing })
        ),
        -1,
        true
      )
    );
    driftY.set(
      withRepeat(
        withSequence(
          withTiming(-range * 1.2, { duration: speed * 1.1, easing }),
          withTiming(range * 0.5, { duration: speed * 0.9, easing }),
          withTiming(0, { duration: speed * 0.8, easing })
        ),
        -1,
        true
      )
    );
    opacity.set(
      withRepeat(
        withSequence(
          withTiming(0, { duration: phase }),
          withTiming(0.7, { duration: speed * 0.5, easing }),
          withTiming(0.2, { duration: speed * 0.5, easing })
        ),
        -1,
        false
      )
    );
    scaleVal.set(
      withRepeat(
        withSequence(
          withTiming(1.5, { duration: speed * 0.7, easing }),
          withTiming(0.5, { duration: speed * 0.8, easing })
        ),
        -1,
        true
      )
    );
  }, [driftX, driftY, opacity, scaleVal, speed, phase, size]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: driftX.get() },
      { translateY: driftY.get() },
      { scale: scaleVal.get() },
    ],
    opacity: opacity.get(),
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: baseFracX * screenW,
          top: baseFracY * screenH,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          ...(Platform.OS === 'web' && {
            boxShadow: `0 0 ${size * 3}px ${color}`,
            willChange: 'transform, opacity',
          } as any),
        },
        style,
      ]}
    />
  );
}

const PARTICLE_CONFIGS_24 = generateParticleConfigs(24);

export function ParticleField({ count = 24 }: ParticleFieldProps) {
  const { width, height } = useWindowDimensions();
  const configs = PARTICLE_CONFIGS_24.slice(0, count);

  return (
    <View style={styles.root} pointerEvents="none">
      {configs.map((cfg) => (
        <SingleParticle
          key={cfg.id}
          baseFracX={cfg.baseXFrac}
          baseFracY={cfg.baseYFrac}
          size={cfg.size}
          color={PARTICLE_COLORS[cfg.colorIndex]}
          speed={cfg.speed}
          phase={cfg.phase}
          screenW={width}
          screenH={height}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    overflow: 'hidden',
  },
});
