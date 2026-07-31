/// AboutBioCard component.
/// Rule 11: Feature UI decomposition.
/// Displays developer introduction and background summary with glassmorphism.

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import { CustomText } from '@/components/common/CustomText';
import { useAppTheme } from '@/core/theme/ThemeContext';
import { AppFonts } from '@/core/theme/appFonts';

export function AboutBioCard() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  return (
    <Animated.View
      entering={FadeInDown.delay(100).duration(500)}
      style={[
        styles.card,
        {
          backgroundColor: colors.surfaceCard,
          borderColor: `${colors.accent}30`,
        },
      ]}
    >
      <View style={[styles.topAccent, { backgroundColor: colors.accent }]} />

      <View style={styles.headerRow}>
        <View style={[styles.avatarCircle, { backgroundColor: `${colors.accent}15`, borderColor: `${colors.accent}40` }]}>
          <CustomText data="AS" fontSize={18} fontFamily={AppFonts.heading} color={colors.accent} />
        </View>
        <View style={styles.headerText}>
          <CustomText data="AMR SAEED" fontSize={18} fontFamily={AppFonts.heading} color={colors.primary} />
          <CustomText data="Computer & Systems Engineer" fontSize={12} fontFamily={AppFonts.mono} color={colors.accent} />
        </View>
      </View>

      <CustomText
        data={t('about.bio')}
        fontSize={14}
        color={colors.secondary}
        style={{ lineHeight: 22, marginTop: verticalScale(12) }}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: scale(20),
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderCurve: 'continuous',
    overflow: 'hidden',
    position: 'relative',
  },
  topAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    opacity: 0.7,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(14),
  },
  avatarCircle: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    gap: verticalScale(2),
  },
});
