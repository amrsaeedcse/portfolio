/// HeroHeading — per-character glitch reveal for the cyberpunk HUD hero.
/// Rule 11: feature decomposition. Rule 3: i18next. Rule 1: CustomText.
/// Vercel animation-gpu-properties: only transform + opacity (no layout props).

import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  FadeInDown,
  Easing,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { moderateScale, scale } from 'react-native-size-matters';
import { CustomText } from '@/components/common/CustomText';
import { GlitchText } from '@/components/common/GlitchText';
import { useAppTheme } from '@/core/theme/ThemeContext';
import { AppFonts } from '@/core/theme/appFonts';

const K_SPRING = { damping: 12, stiffness: 90, mass: 0.6 };

export function EyebrowLabel() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  return (
    <Animated.View entering={FadeInDown.duration(500)} style={styles.eyebrow}>
      <View style={[styles.eyebrowLine, { backgroundColor: colors.accent }]} />
      <GlitchText
        data={t('hero.eyebrow')}
        fontSize={10}
        fontFamily={AppFonts.mono}
        chromatic={false}
        color={colors.accent}
        letterSpacing={3}
        loop={false}
      />
      <View style={[styles.eyebrowLed, { backgroundColor: colors.green }]} />
    </Animated.View>
  );
}

export function HeroHeading() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const l1 = t('hero.titleLine1');
  const l2 = t('hero.titleLine2');

  // Per-character stagger reveal — split words, each char bounces in.
  const renderChar = (ch: string, i: number, baseColor: string, glitch: boolean) => (
    <Animated.View
      key={`${ch}-${i}`}
      entering={FadeInDown.delay(120 + i * 35)
        .duration(420)
        .springify()
        .damping(12)
        .stiffness(90)}
    >
      {glitch ? (
        <GlitchText
          data={ch === ' ' ? '_' : ch}
          fontSize={72}
          fontFamily={AppFonts.heading}
          color={baseColor}
          chromatic
          loop
          triggered={false}
        />
      ) : (
        <CustomText
          data={ch === ' ' ? ' ' : ch}
          fontSize={72}
          fontFamily={AppFonts.heading}
          color={baseColor}
          lineHeight={moderateScale(68)}
        />
      )}
    </Animated.View>
  );

  return (
    <View>
      <View style={styles.headingLine}>
        {l1.split('').map((ch, i) => renderChar(ch, i, colors.primary, false))}
      </View>
      <View style={styles.headingLine}>
        {l2.split('').map((ch, i) => renderChar(ch, i + 100, colors.accent, true))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
  },
  eyebrowLine: {
    width: scale(28),
    height: 1,
  },
  eyebrowLed: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    shadowRadius: 8,
    shadowOpacity: 0.9,
  },
  headingLine: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    lineHeight: moderateScale(70),
  },
});
