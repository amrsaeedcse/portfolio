/// CustomButton — MANDATORY generic primary button CTA with Vercel GPU-accelerated micro-animations.
/// Rule 14 from 04_ui_theme_animations_widgets.md:
/// Primary Button -> CustomButton.tsx. Styled app-wide CTA button.

import React, { useState } from 'react';
import { StyleSheet, Pressable, ViewStyle, ActivityIndicator, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { CustomText } from './CustomText';
import { useAppTheme } from '@/core/theme/ThemeContext';
import { AppFonts } from '@/core/theme/appFonts';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CustomButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  style,
}: CustomButtonProps) {
  const { colors } = useAppTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Vercel GPU-accelerated animation properties (scale & opacity)
  const scaleVal = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  const handleHoverIn = () => {
    if (disabled || loading || Platform.OS !== 'web') return;
    setIsHovered(true);
    scaleVal.set(withSpring(1.04, { damping: 15, stiffness: 300 }));
    glowOpacity.set(withTiming(1, { duration: 250 }));
  };

  const handleHoverOut = () => {
    if (disabled || loading || Platform.OS !== 'web') return;
    setIsHovered(false);
    scaleVal.set(withSpring(1, { damping: 15, stiffness: 300 }));
    glowOpacity.set(withTiming(0, { duration: 250 }));
  };

  const handlePressIn = () => {
    if (disabled || loading) return;
    setIsPressed(true);
    scaleVal.set(withSpring(0.96, { damping: 15, stiffness: 400 }));
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    setIsPressed(false);
    scaleVal.set(withSpring(isHovered ? 1.04 : 1, { damping: 15, stiffness: 300 }));
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleVal.get() }],
  }));

  const getBackgroundColor = () => {
    if (disabled) return colors.border;
    if (variant === 'primary') return isPressed ? `${colors.accent}cc` : colors.accent;
    if (variant === 'secondary') return isPressed ? `${colors.surfaceCard}cc` : colors.surfaceCard;
    return 'transparent';
  };

  const getBorderColor = () => {
    if (variant === 'outline') return isHovered ? colors.accent : colors.border;
    return 'transparent';
  };

  const getTextColor = () => {
    if (disabled) return colors.muted;
    if (variant === 'primary') return colors.textOnAccent;
    return colors.primary;
  };

  return (
    <AnimatedPressable
      onPress={disabled || loading ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1.5 : 0,
          opacity: disabled ? 0.6 : 1,
          shadowColor: variant === 'primary' ? colors.accent : 'transparent',
          shadowOffset: { width: 0, height: isHovered || isPressed ? 8 : 4 },
          shadowOpacity: isHovered ? 0.6 : isPressed ? 0.3 : 0.2,
          shadowRadius: isHovered ? 16 : 8,
          elevation: isHovered ? 8 : 4,
          ...(Platform.OS === 'web' && {
            cursor: disabled || loading ? 'not-allowed' : 'pointer',
            transition: 'box-shadow 0.25s ease, background-color 0.25s ease',
          } as any),
        },
        animatedStyle,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <CustomText
          data={title}
          fontSize={14}
          fontFamily={AppFonts.bodyBold}
          color={getTextColor()}
          letterSpacing={0.8}
          textAlign="center"
        />
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: scale(26),
    paddingVertical: verticalScale(15),
    borderRadius: moderateScale(9999),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderCurve: 'continuous',
  },
});
