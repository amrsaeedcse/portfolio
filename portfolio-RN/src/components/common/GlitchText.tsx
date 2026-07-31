/// GlitchText — terminal glitch effect with chromatic offset + vibration.
/// Rule 14: Shared generic component. Never raw <Text> on its own — wraps CustomText.
/// Only animates transform + opacity (GPU).
/// Effect: random horizontal jitter + R/B channel ghost duplicates. Web uses CSS layering
/// while native runs drift loops on the UI thread.

import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Platform, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { moderateScale } from 'react-native-size-matters';
import { useAppTheme } from '@/core/theme/ThemeContext';
import { AppFonts } from '@/core/theme/appFonts';
import { CustomText } from './CustomText';

interface GlitchTextProps {
  /** The visible text to glitch. */
  data: string;
  /** Font size passed to CustomText. */
  fontSize: number;
  /** Optional fontFamily from AppFonts. */
  fontFamily?: string;
  /** Show chromatic ghost duplicates (R/B offsets). */
  chromatic?: boolean;
  /** Loop the drift forever (auto). */
  loop?: boolean;
  /** Style of the wrapping View. */
  style?: StyleProp<ViewStyle>;
  /** Color override (defaults to colors.primary). */
  color?: string;
  /** Trigger a one-shot hard glitch. When true, intensifies the shake. */
  triggered?: boolean;
  /** Extra letter spacing. */
  letterSpacing?: number;
}

export function GlitchText({
  data,
  fontSize,
  fontFamily = AppFonts.heading,
  chromatic = true,
  loop = true,
  style,
  color,
  triggered = false,
  letterSpacing,
}: GlitchTextProps) {
  const { colors } = useAppTheme();
  const driftX = useSharedValue(0);
  const driftY = useSharedValue(0);
  const opacityA = useSharedValue(1);

  useEffect(() => {
    if (!loop) return;
    const jitter = (max: number, dur: number) =>
      withRepeat(
        withSequence(
          withTiming(max, { duration: dur, easing: Easing.linear }),
          withTiming(-max, { duration: dur, easing: Easing.linear }),
          withTiming(max * 0.4, { duration: dur * 0.6, easing: Easing.linear }),
          withTiming(0, { duration: dur * 0.4, easing: Easing.linear })
        ),
        -1,
        false
      );
    driftX.set(jitter(triggered ? 4 : 1.5, 280));
    driftY.set(jitter(triggered ? 3 : 1, 320));
    opacityA.set(
      withRepeat(
        withSequence(
          withTiming(0.5, { duration: 120, easing: Easing.linear }),
          withTiming(1, { duration: 220, easing: Easing.linear })
        ),
        -1,
        true
      )
    );
  }, [loop, triggered, driftX, driftY, opacityA]);

  const baseStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: driftX.get() }, { translateY: driftY.get() }],
    opacity: opacityA.get(),
  }));

  const ghostRStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: driftX.get() * -2.5 }, { translateY: driftY.get() }],
    opacity: chromatic ? 0.55 : 0,
  }));

  const ghostBStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: driftX.get() * 2.5 }, { translateY: driftY.get() * -0.4 }],
    opacity: chromatic ? 0.55 : 0,
  }));

  const share = useMemo(
    () => ({
      data,
      fontSize,
      fontFamily,
      color: color ?? colors.primary,
      letterSpacing,
    }),
    [data, fontSize, fontFamily, color, colors.primary, letterSpacing]
  );

  const isWeb = Platform.OS === 'web';

  return (
    <View style={[styles.wrap, style]} pointerEvents="none">
      {isWeb ? (
        // Web path: layer via absolute for crisp CSS filtering.
        <>
          <Animated.View style={[styles.layer, baseStyle]}>
            <CustomText {...share} />
          </Animated.View>
          {chromatic ? (
            <>
              <Animated.View style={[styles.layer, ghostRStyle]}>
                <CustomText {...share} color={colors.pink} />
              </Animated.View>
              <Animated.View style={[styles.layer, ghostBStyle]}>
                <CustomText {...share} color={colors.blue} />
              </Animated.View>
            </>
          ) : null}
        </>
      ) : (
        // Native path: same layering; keep ghosts light to avoid overdraw.
        <>
          <Animated.View style={[styles.layer, baseStyle]}>
            <CustomText {...share} />
          </Animated.View>
          {chromatic ? (
            <>
              <Animated.View style={[styles.layer, ghostRStyle]}>
                <CustomText {...share} color={colors.pink} />
              </Animated.View>
              <Animated.View style={[styles.layer, ghostBStyle]}>
                <CustomText {...share} color={colors.blue} />
              </Animated.View>
            </>
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  layer: {
    ...StyleSheet.absoluteFill,
    ...(Platform.OS === 'web' && {
      willChange: 'transform',
      filter: 'blur(0.3px)',
    } as any),
  },
});
