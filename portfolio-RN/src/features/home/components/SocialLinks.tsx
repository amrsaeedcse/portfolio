/// SocialLinks — neon HUD social chips with chromatic-staggered reveal.
/// Rule 11 + Rule 3 + Rule 1.

import React from 'react';
import { StyleSheet, Pressable, Linking, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { MotiView } from 'moti';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { CustomText } from '@/components/common/CustomText';
import { useAppTheme } from '@/core/theme/ThemeContext';
import { AppFonts } from '@/core/theme/appFonts';
import { usePortfolioStore } from '@/stores/global/usePortfolioStore';
import { useTranslation } from 'react-i18next';

export function SocialLinks() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const state = usePortfolioStore((s) => s.state);
  const links = state.status === 'success' ? state.socialLinks : [];

  return (
    <Animated.View entering={FadeInUp.delay(700).duration(500)} style={styles.socialRow}>
      <CustomText
        data={`// ${t('hud.idLabel')} ~ LINKS.ACTIVE`}
        fontSize={9}
        fontFamily={AppFonts.mono}
        color={colors.muted}
        letterSpacing={2}
      />
      <View style={styles.chipRow}>
        {links.map((link, index) => (
          <MotiView
            key={link.label}
            from={{ opacity: 0, translateY: 12, rotateX: '-45deg' }}
            animate={{ opacity: 1, translateY: 0, rotateX: '0deg' }}
            transition={{ delay: 800 + index * 120, type: 'spring', damping: 12 }}
          >
            <Pressable
              onPress={() => Linking.openURL(link.url)}
              style={({ pressed }) => [
                styles.socialChip,
                {
                  borderColor: pressed ? link.color : colors.border,
                  backgroundColor: pressed ? `${link.color}22` : 'rgba(0,0,0,0.45)',
                  transform: [{ scale: pressed ? 0.94 : 1 }],
                },
              ]}
              accessibilityRole="link"
              accessibilityLabel={`Open ${link.label}`}
            >
              <View style={[styles.chipLed, { backgroundColor: link.color }]} />
              <CustomText
                data={link.label}
                fontSize={10}
                letterSpacing={1.5}
                fontFamily={AppFonts.mono}
                color={colors.primary}
              />
            </Pressable>
          </MotiView>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  socialRow: {
    gap: scale(8),
  },
  chipRow: {
    flexDirection: 'row',
    gap: scale(8),
    flexWrap: 'wrap',
  },
  socialChip: {
    paddingHorizontal: scale(11),
    paddingVertical: verticalScale(7),
    borderRadius: moderateScale(6),
    borderWidth: 1,
    borderCurve: 'continuous',
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  chipLed: {
    width: scale(5),
    height: scale(5),
    borderRadius: scale(2.5),
    shadowRadius: 4,
    shadowOpacity: 0.8,
  },
});
