/// ContactSocialGrid component.
/// Rule 11: Feature UI decomposition.
/// Displays interactive social media profile buttons with custom branding colors.

import React from 'react';
import { View, StyleSheet, Pressable, Linking } from 'react-native';
import { MotiView } from 'moti';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import { CustomText } from '@/components/common/CustomText';
import { useAppTheme } from '@/core/theme/ThemeContext';
import { AppFonts } from '@/core/theme/appFonts';
import { kSocialLinks } from '@/constants/data';

export function ContactSocialGrid() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <CustomText
        data={t('contact.socialLbl')}
        fontSize={18}
        fontFamily={AppFonts.heading}
        color={colors.primary}
        style={{ marginBottom: verticalScale(12) }}
      />

      <View style={styles.grid}>
        {kSocialLinks.map((link, idx) => (
          <MotiView
            key={link.label}
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 300 + idx * 100, type: 'timing', duration: 400 }}
            style={styles.cardWrap}
          >
            <Pressable
              onPress={() => Linking.openURL(link.url)}
              style={({ pressed }) => [
                styles.socialCard,
                {
                  backgroundColor: pressed ? `${link.color}20` : colors.surfaceCard,
                  borderColor: pressed ? link.color : colors.border,
                },
              ]}
            >
              <View style={[styles.dot, { backgroundColor: link.color }]} />
              <CustomText
                data={link.label}
                fontSize={14}
                fontFamily={AppFonts.heading}
                color={colors.primary}
                style={{ flex: 1 }}
              />
              <CustomText data="↗" fontSize={16} color={link.color} />
            </Pressable>
          </MotiView>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(20),
  },
  grid: {
    gap: verticalScale(10),
  },
  cardWrap: {
    width: '100%',
  },
  socialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderCurve: 'continuous',
  },
  dot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
  },
});
