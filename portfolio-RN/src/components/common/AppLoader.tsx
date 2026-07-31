/// AppLoader — MANDATORY generic loading indicator.
/// Rule 14 from 04_ui_theme_animations_widgets.md:
/// Loading Indicator -> AppLoader.tsx. Consistent spinner/shimmer across all screens.

import React from 'react';
import { StyleSheet, View, ActivityIndicator, ViewStyle } from 'react-native';
import { verticalScale } from 'react-native-size-matters';
import { CustomText } from './CustomText';
import { useAppTheme } from '@/core/theme/ThemeContext';
import { AppFonts } from '@/core/theme/appFonts';

interface AppLoaderProps {
  message?: string;
  size?: 'small' | 'large';
  style?: ViewStyle;
}

export function AppLoader({ message, size = 'large', style }: AppLoaderProps) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={colors.accent} />
      {message ? (
        <CustomText
          data={message}
          fontSize={13}
          fontFamily={AppFonts.bodyMedium}
          color={colors.secondary}
          style={styles.text}
          textAlign="center"
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: verticalScale(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: verticalScale(12),
  },
});
