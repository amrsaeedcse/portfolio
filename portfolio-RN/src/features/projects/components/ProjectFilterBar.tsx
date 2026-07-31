/// ProjectFilterBar component.
/// Rule 11: Feature UI decomposition.
/// Allows filtering portfolio projects by domain (all, mobile, iot, web).

import React from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import { CustomText } from '@/components/common/CustomText';
import { useAppTheme } from '@/core/theme/ThemeContext';
import { AppFonts } from '@/core/theme/appFonts';
import { useProjectsFilterStore, ProjectFilterType } from '../store/useProjectsFilterStore';

export function ProjectFilterBar() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const { activeFilter, setFilter } = useProjectsFilterStore();

  const kFilters: Array<{ id: ProjectFilterType; label: string }> = [
    { id: 'all', label: t('projects.filterAll') },
    { id: 'mobile', label: t('projects.filterMobile') },
    { id: 'iot', label: t('projects.filterIoT') },
    { id: 'web', label: t('projects.filterWeb') },
  ];

  return (
    <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {kFilters.map((item) => {
          const isActive = activeFilter === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => setFilter(item.id)}
              style={({ pressed }) => [
                styles.tabChip,
                {
                  backgroundColor: isActive ? colors.accent : pressed ? `${colors.accent}15` : colors.surfaceCard,
                  borderColor: isActive ? colors.accent : colors.border,
                },
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <CustomText
                data={item.label}
                fontSize={12}
                fontFamily={isActive ? AppFonts.heading : AppFonts.body}
                color={isActive ? '#09090b' : colors.secondary}
                letterSpacing={0.5}
              />
            </Pressable>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: verticalScale(16),
  },
  scrollContent: {
    gap: scale(10),
    paddingHorizontal: scale(4),
  },
  tabChip: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
