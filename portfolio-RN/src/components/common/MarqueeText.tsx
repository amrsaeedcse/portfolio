/// MarqueeText — infinite horizontal marquee using a single GPU translateX.
/// Rule 14: Shared generic component. Continuously scrolls left forever on the UI thread.
/// Two mirrored copies inside an overflow-hidden wrapper give a seamless loop.

import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { moderateScale } from 'react-native-size-matters';
import { CustomText } from './CustomText';
import { useAppTheme } from '@/core/theme/ThemeContext';
import { AppFonts } from '@/core/theme/appFonts';

interface MarqueeTextProps {
  data: string;
  /** Font size. */
  fontSize?: number;
  /** Repeat the text N times for a denser band. */
  repeat?: number;
  /** Forward (false) or reverse (true) direction. */
  reverse?: boolean;
  /** Pixels per second (drives duration). */
  speed?: number;
  /** Separator inserted between copies. */
  separator?: string;
  /** Outer style. */
  style?: StyleProp<ViewStyle>;
  /** Font family. */
  fontFamily?: string;
  /** Force a width measurement (default: full container width via onLayout). */
  fixedWidth?: number;
  color?: string;
}

export function MarqueeText({
  data,
  fontSize = 12,
  repeat = 6,
  reverse = false,
  speed = 60,
  separator = '·',
  style,
  fontFamily = AppFonts.mono,
  fixedWidth,
  color,
}: MarqueeTextProps) {
  const { colors } = useAppTheme();
  const measured = useSharedValue(fixedWidth ?? 0);
  const translate = useSharedValue(0);

  const tokens = useMemo(
    () => Array.from({ length: repeat }, () => `${data} ${separator}`).join(' '),
    [data, repeat, separator]
  );

  useEffect(() => {
    if (measured.get() === 0) return;
    const distance = measured.get();
    const duration = (distance / Math.max(1, speed)) * 1000;
    translate.set(0);
    translate.set(
      withRepeat(
        withTiming(reverse ? distance : -distance, {
          duration,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );
  }, [measured, translate, reverse, speed, fixedWidth]);

  const bandStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translate.get() }],
  }));

  const handleLayout = (e: { nativeEvent: { layout: { width: number } } }) => {
    measured.set(e.nativeEvent.layout.width);
  };

  return (
    <View style={[styles.container, style]} pointerEvents="none">
      {/* Hidden measurement band */}
      <View
        onLayout={handleLayout}
        style={styles.measure}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <CustomText
          data={tokens}
          fontSize={fontSize}
          fontFamily={fontFamily}
          color={colors.muted}
          letterSpacing={moderateScale(2)}
        />
      </View>
      <View style={styles.viewport}>
        <Animated.View style={[styles.band, bandStyle]}>
          <CustomText
            data={tokens}
            fontSize={fontSize}
            fontFamily={fontFamily}
            color={color ?? colors.muted}
            letterSpacing={moderateScale(2)}
          />
          <CustomText
            data={tokens}
            fontSize={fontSize}
            fontFamily={fontFamily}
            color={color ?? colors.muted}
            letterSpacing={moderateScale(2)}
            style={{ marginLeft: measured ? undefined : undefined }}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    flexDirection: 'row',
  },
  measure: {
    position: 'absolute',
    opacity: 0,
    zIndex: -1,
  },
  viewport: {
    flexDirection: 'row',
    width: '200%',
  },
  band: {
    flexDirection: 'row',
  },
});
