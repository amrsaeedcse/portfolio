/// SkillsSection component.
/// Rule 11: Feature UI decomposition.
/// Displays categorized technical skills with custom domain colors.

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import { CustomText } from '@/components/common/CustomText';
import { useAppTheme } from '@/core/theme/ThemeContext';
import { AppFonts } from '@/core/theme/appFonts';
import { kSkillGroups } from '@/constants/data';

export function SkillsSection() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <CustomText
        data={t('about.skillsLbl')}
        fontSize={18}
        fontFamily={AppFonts.heading}
        color={colors.primary}
        style={{ marginBottom: verticalScale(12) }}
      />

      <View style={styles.groupsContainer}>
        {kSkillGroups.map((group, gIdx) => (
          <MotiView
            key={group.cat}
            from={{ opacity: 0, translateY: 15 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 300 + gIdx * 100, type: 'timing', duration: 400 }}
            style={[
              styles.groupCard,
              {
                backgroundColor: colors.surfaceCard,
                borderColor: `${group.color}25`,
              },
            ]}
          >
            <View style={styles.groupHeader}>
              <View style={[styles.colorDot, { backgroundColor: group.color }]} />
              <CustomText
                data={group.cat}
                fontSize={14}
                fontFamily={AppFonts.heading}
                color={colors.primary}
              />
            </View>

            <View style={styles.pillsRow}>
              {group.items.map((item) => (
                <View
                  key={item}
                  style={[
                    styles.skillPill,
                    {
                      backgroundColor: `${group.color}10`,
                      borderColor: `${group.color}35`,
                    },
                  ]}
                >
                  <CustomText
                    data={item}
                    fontSize={11}
                    fontFamily={AppFonts.mono}
                    color={group.color}
                  />
                </View>
              ))}
            </View>
          </MotiView>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(24),
  },
  groupsContainer: {
    gap: verticalScale(14),
  },
  groupCard: {
    padding: scale(16),
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderCurve: 'continuous',
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginBottom: verticalScale(12),
  },
  colorDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(8),
  },
  skillPill: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(8),
    borderWidth: 1,
  },
});
