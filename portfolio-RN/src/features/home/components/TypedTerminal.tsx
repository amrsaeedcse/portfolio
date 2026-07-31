/// TypedTerminal — terminal-style typewriter with a blinking cursor.
/// Feature-scoped helper (Home only). Uses CustomText (rule 1) and i18next (rule 3).
/// GPU animate: only opacity of the cursor.

import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { CustomText } from '@/components/common/CustomText';
import { useAppTheme } from '@/core/theme/ThemeContext';
import { AppFonts } from '@/core/theme/appFonts';

interface TypedTerminalProps {
  /** Top full line before the typed text begins. */
  prompt?: string;
  /** key from i18next that will be typed character by character. */
  textKey: string;
  /** ms per character. */
  speed?: number;
}

export function TypedTerminal({
  prompt = 'amr@saeed:~$',
  textKey,
  speed = 28,
}: TypedTerminalProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const full = t(textKey);

  const cursorOpacity = useSharedValue(1);
  useEffect(() => {
    const degrade = Easing.inOut(Easing.sin);
    cursorOpacity.set(
      withRepeat(
        withSequence(
          withTiming(0, { duration: 480, easing: degrade }),
          withTiming(1, { duration: 480, easing: degrade })
        ),
        -1,
        false
      )
    );
  }, [cursorOpacity]);

  const cursorStyle = useAnimatedStyle(() => ({
    opacity: cursorOpacity.get(),
  }));

  const [shown, setShown] = useState('');

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setShown(full.slice(0, i));
      if (i >= full.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [full, speed]);

  return (
    <View style={styles.container}>
      <View style={styles.line}>
        <CustomText
          data={prompt}
          fontSize={13}
          fontFamily={AppFonts.mono}
          color={colors.accent}
          letterSpacing={1}
        />
        <View style={styles.dots}>
          <View style={[styles.dot, { backgroundColor: colors.pink }]} />
          <View style={[styles.dot, { backgroundColor: colors.amber }]} />
          <View style={[styles.dot, { backgroundColor: colors.green }]} />
        </View>
      </View>
      <View style={styles.typedRow}>
        <CustomText
          data={shown || ' '}
          fontSize={15}
          fontFamily={AppFonts.mono}
          color={colors.primary}
          letterSpacing={0.5}
          style={{ flexShrink: 1 }}
        />
        <Animated.View style={[styles.cursor, { backgroundColor: colors.accent }, cursorStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderWidth: 1,
    borderCurve: 'continuous',
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(10),
    gap: 6,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dots: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  typedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cursor: {
    width: 8,
    height: 14,
    marginTop: 2,
  },
});
