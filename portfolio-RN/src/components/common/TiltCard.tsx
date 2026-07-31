/// TiltCard — 3D parallax tilt + spring press feedback HUD container.
/// Rule 14: Shared generic card container. Holographic vibe: gradient stroke that follows pointer (web).
/// Vercel animation-gpu-properties: only transform + opacity.
/// React-compiler compatible reads via .get() / .set().

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
  Platform,
  LayoutChangeEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  useDerivedValue,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { moderateScale } from 'react-native-size-matters';
import { useAppTheme } from '@/core/theme/ThemeContext';

interface TiltCardProps {
  children: React.ReactNode;
  /** Blur radius (web only) for the holographic sheen. */
  blur?: number;
  /** Max tilt in degrees when the pointer sits on a corner. */
  maxTilt?: number;
  /** Spring strength of press feedback. */
  style?: StyleProp<ViewStyle>;
  /** Outer border color; defaults to accent. */
  accentColor?: string;
  /** Tap callback (uses Gesture.Tap on UI thread). */
  onPress?: () => void;
  /** Disable tilt (for mobile narrow cards). */
  disableTilt?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function TiltCard({
  children,
  blur = 40,
  maxTilt = 8,
  style,
  accentColor,
  onPress,
  disableTilt = false,
}: TiltCardProps) {
  const { colors } = useAppTheme();
  const accent = accentColor ?? colors.accent;

  const touchX = useSharedValue(0.5);
  const touchY = useSharedValue(0.5);
  const pressed = useSharedValue(0);
  const [size, setSize] = useState({ width: 1, height: 1 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize((prev) =>
      prev.width === width && prev.height === height ? prev : { width, height }
    );
  };

  const rotateY = useDerivedValue(() =>
    disableTilt ? 0 : interpolate(touchX.get(), [0, 1], [maxTilt, -maxTilt])
  );
  const rotateX = useDerivedValue(() =>
    disableTilt ? 0 : interpolate(touchY.get(), [0, 1], [-maxTilt, maxTilt])
  );

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${rotateY.get()}deg` },
      { rotateX: `${rotateX.get()}deg` },
      { scale: interpolate(pressed.get(), [0, 1], [1, 0.97]) },
    ],
  }));

  // Holographic sheen position only via transform/opacity (GPU).
  const sheenStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: touchX.get() * size.width - size.width * 0.5 }],
    opacity: disableTilt ? 0 : interpolate(pressed.get(), [0, 1], [0.35, 0.7]),
  }));

  const tap = Gesture.Tap()
    .onBegin(() => {
      pressed.set(withSpring(1, { damping: 14, stiffness: 380 }));
    })
    .onFinalize(() => {
      pressed.set(withSpring(0, { damping: 14, stiffness: 320 }));
    })
    .onEnd(() => {
      if (onPress) runOnJS(onPress)();
    });

  return (
    <GestureDetector gesture={tap}>
      <AnimatedPressable
        onLayout={onLayout}
        onHoverIn={Platform.OS === 'web' && !disableTilt ? (e: any) => {
          const r = e.currentTarget.getBoundingClientRect();
          touchX.set(withTiming((e.nativeEvent.clientX - r.left) / r.width));
          touchY.set(withTiming((e.nativeEvent.clientY - r.top) / r.height));
        } : undefined}
        onHoverOut={Platform.OS === 'web' && !disableTilt ? () => {
          touchX.set(withTiming(0.5));
          touchY.set(withTiming(0.5));
        } : undefined}
        style={[
          styles.card,
          {
            borderColor: accent,
            ...(Platform.OS === 'web'
              ? {
                  boxShadow: `0 8px 32px rgba(0,0,0,0.45), inset 0 0 0 1px ${accent}22`,
                }
              : {
                  shadowColor: accent,
                  shadowOpacity: 0.35,
                  shadowRadius: 18,
                  shadowOffset: { width: 0, height: 10 },
                  elevation: 8,
                }),
          },
          cardStyle,
          style,
        ]}
      >
        {/* Holographic sheen band */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.sheen,
            {
              width: size.width * 1.4,
              height: size.height * 1.4,
              backgroundColor: accent,
              ...(Platform.OS === 'web'
                ? { filter: `blur(${blur}px)`, willChange: 'transform,opacity' }
                : {}),
            },
            sheenStyle,
          ]}
        />
        <View style={styles.content}>{children}</View>
      </AnimatedPressable>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(15,15,24,0.6)',
  },
  sheen: {
    position: 'absolute',
    left: 0,
    top: '50%',
    marginTop: -100,
    opacity: 0.35,
    zIndex: 0,
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
});
