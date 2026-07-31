/// GridMeshBackground — cyberpunk animated perspective grid HUD layer.
/// Rule 14: Shared generic component.
/// Vercel animation-gpu-properties: only transform + opacity (NO layout props).
/// Static grid via SVG/View lines + slow GPU drift via translateY + perspective.

import React, { useEffect } from 'react';
import { View, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  withSequence,
} from 'react-native-reanimated';
import { useAppTheme } from '@/core/theme/ThemeContext';
import { scale } from 'react-native-size-matters';

interface GridMeshBackgroundProps {
  /** Cells per row (mobile vs desktop tuning handled by caller). */
  columns?: number;
  /** Cells per column. */
  rows?: number;
  /** Opacity 0..1 of the grid lines. */
  lineOpacity?: number;
  /** Apply a perspective skew so the grid looks like a HUD floor. */
  perspective?: boolean;
}

export function GridMeshBackground({
  columns = 14,
  rows = 22,
  lineOpacity = 0.18,
  perspective = true,
}: GridMeshBackgroundProps) {
  const { colors } = useAppTheme();
  const { width, height } = useWindowDimensions();

  // Two stacked layers drifting in opposite directions produce continuous motion.
  const driftA = useSharedValue(0);
  const driftB = useSharedValue(0);

  useEffect(() => {
    const cell = height / rows;
    driftA.set(
      withRepeat(withTiming(cell, { duration: 4000, easing: Easing.linear }), -1, true)
    );
    driftB.set(
      withRepeat(
        withSequence(
          withTiming(-cell, { duration: 6000, easing: Easing.linear }),
          withTiming(0, { duration: 6000, easing: Easing.linear })
        ),
        -1,
        true
      )
    );
  }, [driftA, driftB, height, rows]);

  const layerAStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: driftA.get() }],
  }));
  const layerBStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: driftB.get() }],
    opacity: 0.5,
  }));

  const cellW = width / columns;
  const cellH = height / rows;
  const lineColor = colors.accent;

  const renderLayer = (style: any, offsetX: number) => {
    const verticals: React.ReactNode[] = [];
    for (let i = -1; i <= columns + 1; i++) {
      verticals.push(
        <View
          key={`v-${offsetX}-${i}`}
          style={[
            styles.line,
            {
              left: i * cellW + offsetX,
              width: 1,
              top: -cellH,
              height: height + cellH * 2,
              backgroundColor: lineColor,
            },
          ]}
        />
      );
    }
    const horizontals: React.ReactNode[] = [];
    for (let j = -1; j <= rows + 1; j++) {
      horizontals.push(
        <View
          key={`h-${offsetX}-${j}`}
          style={[
            styles.line,
            {
              top: j * cellH,
              left: -cellW,
              width: width + cellW * 2,
              height: 1,
              backgroundColor: lineColor,
            },
          ]}
        />
      );
    }
    return (
      <Animated.View style={[styles.layer, style]}>
        {[...verticals, ...horizontals]}
      </Animated.View>
    );
  };

  const perspectiveStyle = perspective
    ? {
        transform: [
          { perspective: 900 },
          { rotateX: '62deg' },
          { translateY: height * 0.42 },
          { scale: 1.7 },
        ] as any,
      }
    : null;

  return (
    <View
      pointerEvents="none"
      style={[styles.root, { opacity: lineOpacity }, perspectiveStyle]}
    >
      {Platform.OS === 'web' && (
        <View style={[styles.webMask, { WebkitMaskImage: 'none' }]} />
      )}
      {renderLayer(layerAStyle, 0)}
      {renderLayer(layerBStyle, cellW * 0.5)}
      {/* Horizon glow */}
      <View
        style={[
          styles.horizon,
          {
            top: perspective ? height * 0.42 : height * 0.5,
            backgroundColor: lineColor,
            opacity: perspective ? 0.7 : 0,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
    zIndex: 0,
  },
  layer: {
    ...StyleSheet.absoluteFill,
  },
  line: {
    position: 'absolute',
  },
  horizon: {
    position: 'absolute',
    left: '-10%',
    right: '-10%',
    height: scale(2),
    shadowRadius: 24,
    shadowOpacity: 0.9,
    ...(Platform.OS === 'web' && {
      filter: 'blur(8px)',
    } as any),
  },
  webMask: {
    ...StyleSheet.absoluteFillObject,
  },
});
