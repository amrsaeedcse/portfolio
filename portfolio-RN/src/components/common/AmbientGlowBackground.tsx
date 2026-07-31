/// AmbientGlowBackground — Vercel GPU-accelerated living background animation.
/// Rule 14: Generic shared component in src/components/common/.
/// Adheres strictly to vercel-react-native-skills / animation-gpu-properties:
/// Only animates transform (translateX, translateY, scale) and opacity on the GPU!

import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useAppTheme } from '@/core/theme/ThemeContext';

const { width: kScreenWidth, height: kScreenHeight } = Dimensions.get('window');

interface AmbientGlowBackgroundProps {
  intensity?: number;
}

export function AmbientGlowBackground({ intensity = 1 }: AmbientGlowBackgroundProps) {
  const { colors } = useAppTheme();

  // GPU-accelerated Shared Values for Blob 1 (Top Left Accent Glow)
  const blob1Y = useSharedValue(0);
  const blob1X = useSharedValue(0);
  const blob1Scale = useSharedValue(1);

  // GPU-accelerated Shared Values for Blob 2 (Bottom Right Blue Glow)
  const blob2Y = useSharedValue(0);
  const blob2X = useSharedValue(0);
  const blob2Scale = useSharedValue(1);

  // GPU-accelerated Shared Values for Blob 3 (Center Violet Glow)
  const blob3Y = useSharedValue(0);
  const blob3Scale = useSharedValue(0.8);

  useEffect(() => {
    const easing = Easing.inOut(Easing.sin);

    // Animate Blob 1
    blob1Y.set(
      withRepeat(
        withSequence(
          withTiming(40, { duration: 6000, easing }),
          withTiming(-30, { duration: 7000, easing }),
          withTiming(0, { duration: 5000, easing })
        ),
        -1,
        true
      )
    );
    blob1X.set(
      withRepeat(
        withSequence(
          withTiming(30, { duration: 8000, easing }),
          withTiming(-20, { duration: 6000, easing }),
          withTiming(0, { duration: 6000, easing })
        ),
        -1,
        true
      )
    );
    blob1Scale.set(
      withRepeat(
        withSequence(
          withTiming(1.15, { duration: 7000, easing }),
          withTiming(0.9, { duration: 7000, easing })
        ),
        -1,
        true
      )
    );

    // Animate Blob 2
    blob2Y.set(
      withRepeat(
        withSequence(
          withTiming(-50, { duration: 7000, easing }),
          withTiming(30, { duration: 6000, easing }),
          withTiming(0, { duration: 6000, easing })
        ),
        -1,
        true
      )
    );
    blob2X.set(
      withRepeat(
        withSequence(
          withTiming(-40, { duration: 6500, easing }),
          withTiming(25, { duration: 7500, easing }),
          withTiming(0, { duration: 5000, easing })
        ),
        -1,
        true
      )
    );
    blob2Scale.set(
      withRepeat(
        withSequence(
          withTiming(1.2, { duration: 8000, easing }),
          withTiming(0.85, { duration: 6000, easing })
        ),
        -1,
        true
      )
    );

    // Animate Blob 3
    blob3Y.set(
      withRepeat(
        withSequence(
          withTiming(60, { duration: 9000, easing }),
          withTiming(-40, { duration: 8000, easing })
        ),
        -1,
        true
      )
    );
    blob3Scale.set(
      withRepeat(
        withSequence(
          withTiming(1.25, { duration: 6500, easing }),
          withTiming(0.75, { duration: 7500, easing })
        ),
        -1,
        true
      )
    );
  }, [blob1X, blob1Y, blob1Scale, blob2X, blob2Y, blob2Scale, blob3Y, blob3Scale]);

  const style1 = useAnimatedStyle(() => ({
    transform: [
      { translateX: blob1X.get() },
      { translateY: blob1Y.get() },
      { scale: blob1Scale.get() },
    ],
  }));

  const style2 = useAnimatedStyle(() => ({
    transform: [
      { translateX: blob2X.get() },
      { translateY: blob2Y.get() },
      { scale: blob2Scale.get() },
    ],
  }));

  const style3 = useAnimatedStyle(() => ({
    transform: [
      { translateY: blob3Y.get() },
      { scale: blob3Scale.get() },
    ],
  }));

  const baseOpacity = Platform.OS === 'web' ? 0.12 * intensity : 0.08 * intensity;

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Blob 1: Top Left Accent Glow */}
      <Animated.View
        style={[
          styles.blob,
          {
            backgroundColor: colors.accent,
            opacity: baseOpacity,
            top: -kScreenWidth * 0.25,
            left: -kScreenWidth * 0.2,
            width: kScreenWidth * 0.8,
            height: kScreenWidth * 0.8,
            borderRadius: kScreenWidth * 0.4,
          },
          style1,
        ]}
      />

      {/* Blob 2: Bottom Right Cyan/Blue Glow */}
      <Animated.View
        style={[
          styles.blob,
          {
            backgroundColor: '#0ea5e9',
            opacity: baseOpacity * 0.9,
            bottom: -kScreenWidth * 0.1,
            right: -kScreenWidth * 0.2,
            width: kScreenWidth * 0.9,
            height: kScreenWidth * 0.9,
            borderRadius: kScreenWidth * 0.45,
          },
          style2,
        ]}
      />

      {/* Blob 3: Center Violet Glow (for depth on desktop/tablet) */}
      <Animated.View
        style={[
          styles.blob,
          {
            backgroundColor: '#8b5cf6',
            opacity: baseOpacity * 0.7,
            top: '30%',
            left: '25%',
            width: 500,
            height: 500,
            borderRadius: 250,
          },
          style3,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
    zIndex: 0,
  },
  blob: {
    position: 'absolute',
    ...(Platform.OS === 'web' && {
      filter: 'blur(90px)',
      willChange: 'transform',
    } as any),
  },
});
