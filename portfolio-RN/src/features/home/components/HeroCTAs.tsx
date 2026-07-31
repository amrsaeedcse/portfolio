/// HeroCTAs — magnetic cyberpunk CTAs (primary magnet + ghost "let's talk").
/// Rule 11 + Rule 3 + Rule 14 (uses shared CustomButton-like component).
/// Replaces the previous flat CTA row with magnetic shader buttons.

import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { scale, verticalScale } from 'react-native-size-matters';
import { useAppTheme } from '@/core/theme/ThemeContext';
import { usePortfolioStore } from '@/stores/global/usePortfolioStore';
import { MagneticButton } from './MagneticButton';

export function HeroCTAs({ onSeeWork }: { onSeeWork: () => void }) {
  const { t } = useTranslation();
  const state = usePortfolioStore((s) => s.state);
  const whatsappUrl = state.status === 'success' ? state.contactInfo.whatsapp : '';

  return (
    <Animated.View entering={FadeInUp.delay(550).duration(500)} style={styles.ctaRow}>
      <MagneticButton
        label={t('common.seeMyWork')}
        onPress={onSeeWork}
        variant="primary"
        pull={20}
      />
      <MagneticButton
        label={t('common.letsTalk')}
        onPress={() => {}}
        href={whatsappUrl || undefined}
        variant="ghost"
        pull={14}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  ctaRow: {
    flexDirection: 'row',
    gap: scale(12),
    flexWrap: 'wrap',
    alignItems: 'center',
  },
});
