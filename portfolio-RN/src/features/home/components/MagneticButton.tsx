/// MagneticButton — feature-scoped magnet CTA for the hero.
/// Pointer pulls the button toward it on web; springs back on leave.
/// Mobile fallback: spring scale press (Gesture.Tap) on the UI thread.
/// Vercel animation-gesture-detector-press: store STATE then derive visuals.

import React from 'react';
import { Pressable, StyleSheet, Platform, Linking } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { CustomText } from '@/components/common/CustomText';
import { useAppTheme } from '@/core/theme/ThemeContext';
import { AppFonts } from '@/core/theme/appFonts';

interface MagneticButtonProps {
  /** i18next label. */
  label: string;
  /** Tap action. */
  onPress: () => void;
  /** Optional href to open (when set, the press navigates out). */
  href?: string;
  /** Magnetic pull in px (web). */
  pull?: number;
  variant?: 'primary' | 'ghost';
}

export function MagneticButton({
  label,
  onPress,
  href,
  pull = 18,
  variant = 'primary',
}: MagneticButtonProps) {
  const { colors } = useAppTheme();
  const originX = useSharedValue(0);
  const originY = useSharedValue(0);
  const targetX = useSharedValue(0);
  const targetY = useSharedValue(0);
  const pressed = useSharedValue(0);
  const hovered = useSharedValue(0);

  const handlePress = () => {
    if (href) {
      Linking.openURL(href);
      return;
    }
    onPress();
  };

  const tap = Gesture.Tap()
    .onBegin(() => pressed.set(withSpring(1, { damping: 14, stiffness: 380 })))
    .onFinalize(() => pressed.set(withSpring(0, { damping: 14, stiffness: 320 })))
    .onEnd(() => {
      runOnJS(handlePress)();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: withSpring(targetX.get() * 0.35) },
      { translateY: withSpring(targetY.get() * 0.35) },
      { scale: interpolate(pressed.get(), [0, 1], [1, 0.95]) },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: withTiming(interpolate(hovered.get(), [0, 1], [0.18, 0.55]), {
      duration: 200,
    }),
  }));

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={[styles.shell]}>
        <Animated.View
          style={[
            styles.glow,
            {
              backgroundColor: variant === 'primary' ? colors.accent : colors.purple,
            },
            glowStyle,
          ]}
          pointerEvents="none"
        />
        <Pressable
          ref={containerRef as any}
          onHoverIn={Platform.OS === 'web' ? (e: any) => {
            hovered.set(withTiming(1));
            const r = e.currentTarget.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            targetX.set((e.nativeEvent.clientX - cx) / (r.width / 2) * pull);
            targetY.set((e.nativeEvent.clientY - cy) / (r.height / 2) * pull);
          } : undefined}
          onHoverOut={Platform.OS === 'web' ? () => {
            hovered.set(withTiming(0));
            targetX.set(0);
            targetY.set(0);
          } : undefined}
          onMouseMove={Platform.OS === 'web' ? (e: any) => {
            const r = e.currentTarget.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            targetX.set((e.nativeEvent.clientX - cx) / (r.width / 2) * pull);
            targetY.set((e.nativeEvent.clientY - cy) / (r.height / 2) * pull);
          } : undefined}
          style={[
            styles.button,
            {
              backgroundColor:
                variant === 'primary' ? colors.accent : 'rgba(0,0,0,0.4)',
              borderColor: variant === 'primary' ? colors.accent : colors.border,
              ...(Platform.OS === 'web'
                ? {
                    boxShadow:
                      variant === 'primary'
                        ? '0 0 24px #00FFD1aa'
                        : '0 0 14px rgba(168,85,247,0.4)',
                    cursor: 'pointer',
                  }
                : {
                    shadowColor: colors.accent,
                    shadowOpacity: 0.4,
                    shadowRadius: 16,
                    elevation: 8,
                  }),
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={label}
        >
          <Animated.View style={animatedStyle}>
            <CustomText
              data={label}
              fontSize={13}
              fontFamily={AppFonts.bodyBold}
              color={variant === 'primary' ? colors.textOnAccent : colors.primary}
              letterSpacing={1.5}
              style={{ textTransform: 'uppercase' }}
            />
          </Animated.View>
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  shell: {
    position: 'relative',
    borderRadius: moderateScale(9999),
    padding: moderateScale(4),
  },
  glow: {
    position: 'absolute',
    ...StyleSheet.absoluteFillObject,
    borderRadius: moderateScale(9999),
    opacity: 0.18,
    ...(Platform.OS === 'web' && { filter: 'blur(18px)' } as any),
  },
  button: {
    paddingHorizontal: scale(26),
    paddingVertical: verticalScale(13),
    borderRadius: moderateScale(9999),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderCurve: 'continuous',
    position: 'relative',
    zIndex: 1,
  },
});
