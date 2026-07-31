/// ExperienceTimeline component.
/// Rule 11: Feature UI decomposition.
/// Displays chronological career training and education history with vertical glowing timeline line.

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import { CustomText } from '@/components/common/CustomText';
import { useAppTheme } from '@/core/theme/ThemeContext';
import { AppFonts } from '@/core/theme/appFonts';
import { kExperience } from '@/constants/data';

export function ExperienceTimeline() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <CustomText
        data={t('about.experienceLbl')}
        fontSize={18}
        fontFamily={AppFonts.heading}
        color={colors.primary}
        style={{ marginBottom: verticalScale(16) }}
      />

      <View style={styles.timelineWrapper}>
        {/* Vertical line */}
        <View style={[styles.verticalLine, { backgroundColor: colors.border }]} />

        {kExperience.map((item, index) => (
          <MotiView
            key={`${item.org}-${item.date}`}
            from={{ opacity: 0, translateX: 15 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 500 + index * 120, type: 'timing', duration: 450 }}
            style={styles.timelineItem}
          >
            {/* Dot on timeline */}
            <View style={[styles.dotWrapper, { backgroundColor: colors.surface }]}>
              <View style={[styles.dot, { backgroundColor: item.color }]} />
            </View>

            {/* Content card */}
            <View
              style={[
                styles.itemCard,
                {
                  backgroundColor: colors.surfaceCard,
                  borderColor: `${item.color}25`,
                },
              ]}
            >
              <View style={styles.dateRow}>
                <CustomText
                  data={item.date}
                  fontSize={11}
                  fontFamily={AppFonts.mono}
                  color={item.color}
                />
              </View>

              <CustomText
                data={item.title}
                fontSize={16}
                fontFamily={AppFonts.heading}
                color={colors.primary}
              />

              <CustomText
                data={item.org}
                fontSize={13}
                fontFamily={AppFonts.body}
                color={colors.accent}
                style={{ marginBottom: verticalScale(4) }}
              />

              <CustomText
                data={item.desc}
                fontSize={13}
                color={colors.secondary}
                style={{ lineHeight: 19 }}
              />
            </View>
          </MotiView>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(28),
  },
  timelineWrapper: {
    position: 'relative',
    paddingLeft: scale(20),
  },
  verticalLine: {
    position: 'absolute',
    left: scale(7),
    top: verticalScale(10),
    bottom: verticalScale(20),
    width: 2,
    borderRadius: 1,
  },
  timelineItem: {
    position: 'relative',
    marginBottom: verticalScale(20),
  },
  dotWrapper: {
    position: 'absolute',
    left: -scale(20) - 2,
    top: verticalScale(16),
    width: scale(18),
    height: scale(18),
    borderRadius: scale(9),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  dot: {
    width: scale(10),
    height: scale(10),
    borderRadius: scale(5),
  },
  itemCard: {
    padding: scale(16),
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderCurve: 'continuous',
    gap: verticalScale(4),
  },
  dateRow: {
    marginBottom: verticalScale(2),
  },
});
