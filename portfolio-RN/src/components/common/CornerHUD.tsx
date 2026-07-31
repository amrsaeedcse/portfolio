/// CornerHUD — small rotating HUD bracket badge with timestamp/label.
/// Pure-decorative cyberpunk accent. GPU transform only.
/// Useful for tucking "SYS::ACTIVE" indicators near screens corners.

import React, { useEffect } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { scale, moderateScale } from 'react-native-size-matters';
import { CustomText } from './CustomText';
import { useAppTheme } from '@/core/theme/ThemeContext';
import { AppFonts } from '@/core/theme/appFonts';

interface CornerHUDProps {
  /** i18next-translated label, e.g. "SYS:ONLINE". */
  label: string;
  /** Position. Default top-right. */
  position?: 'tl' | 'tr' | 'bl' | 'br';
  /** Outer style override (e.g. margins). */
  style?: StyleProp<ViewStyle>;
  /** Show a rotating ring around the dot (best on web). */
  ring?: boolean;
}

export function CornerHUD({
  label,
  position = 'tr',
  style,
  ring = true,
}: CornerHUDProps) {
  const { colors } = useAppTheme();
  const spin = useSharedValue(0);

  useEffect(() => {
    spin.set(
      withRepeat(withTiming(360, { duration: 8000, easing: Easing.linear }), -1, false)
    );
  }, [spin]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.get()}deg` }],
  }));

  const pos: StyleProp<ViewStyle> = (() => {
    switch (position) {
      case 'tl':
        return { top: scale(12), left: scale(12) };
      case 'bl':
        return { bottom: scale(12), left: scale(12) };
      case 'br':
        return { bottom: scale(12), right: scale(12) };
      case 'tr':
      default:
        return { top: scale(12), right: scale(12) };
    }
  })();

  return (
    <View
      style={[styles.wrap, pos, style]}
      pointerEvents="none"
      accessibilityRole="header"
    >
      {ring ? (
        <Animated.View
          style={[
            styles.ring,
            { borderColor: colors.accent },
            spinStyle,
          ]}
        />
      ) : null}
      <View style={[styles.dot, { backgroundColor: colors.accent }]} />
      <CustomText
        data={label}
        fontSize={9}
        fontFamily={AppFonts.mono}
        color={colors.accent}
        letterSpacing={2}
        style={{ textTransform: 'uppercase' }}
      />
    </View>
  );
}

const kDot = scale(6);
const kRing = scale(18);

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    zIndex: 6,
  },
  dot: {
    width: kDot,
    height: kDot,
    borderRadius: kDot / 2,
    shadowRadius: 8,
    shadowOpacity: 0.7,
  },
  ring: {
    position: 'absolute',
    width: kRing,
    height: kRing,
    borderRadius: kRing / 2,
    borderWidth: moderateScale(1),
    borderTopColor: 'transparent',
    borderStyle: 'dashed',
    left: -(kRing - kDot) / 2,
    top: -(kRing - kDot) / 2,
  },
});
