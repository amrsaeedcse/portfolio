/// StatsCard — holographic HUD stats grid wrapped in TiltCard.
/// Rule 11 + Rule 3 + Rule 1. Uses shared TiltCard for 3D parallax.

import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { verticalScale, moderateScale, scale } from 'react-native-size-matters';
import { CustomText } from '@/components/common/CustomText';
import { TiltCard } from '@/components/common/TiltCard';
import { useAppTheme } from '@/core/theme/ThemeContext';
import { AppFonts } from '@/core/theme/appFonts';
import { usePortfolioStore } from '@/stores/global/usePortfolioStore';

interface StatItemProps {
  val: string;
  lbl: string;
  color: string;
  isLast: boolean;
}

function StatItem({ val, lbl, color, isLast }: StatItemProps) {
  const { colors } = useAppTheme();
  return (
    <View
      style={[
        styles.statItem,
        !isLast && { borderRightWidth: 1, borderRightColor: colors.border },
      ]}
    >
      <View style={[styles.statDot, { backgroundColor: color }]} />
      <CustomText
        data={val}
        fontSize={22}
        fontFamily={AppFonts.heading}
        color={color}
        textAlign="center"
        lineHeight={32}
      />
      <CustomText
        data={lbl}
        fontSize={9}
        color={colors.muted}
        textAlign="center"
        letterSpacing={1.5}
        style={{ textTransform: 'uppercase', marginTop: 2 }}
      />
    </View>
  );
}

export function StatsCard() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const state = usePortfolioStore((s) => s.state);

  const rawStats: Array<[string, string, string]> = [
    [t('stats.yearsVal'), t('stats.yearsLbl'), colors.accent],
    [t('stats.projectsVal'), t('stats.projectsLbl'), colors.blue],
    [t('stats.trainingsVal'), t('stats.trainingsLbl'), colors.purple],
  ];

  const stats =
    state.status === 'success'
      ? ([
          [state.aboutStats[0][0], state.aboutStats[0][1], colors.accent],
          [state.aboutStats[1][0], state.aboutStats[1][1], colors.blue],
          [state.aboutStats[2][0], state.aboutStats[2][1], colors.purple],
        ] as Array<[string, string, string]>)
      : rawStats;

  return (
    <Animated.View entering={ZoomIn.delay(900).duration(600).springify()}>
      <View pointerEvents="none">
        <TiltCard maxTilt={6} blur={45}>
          <View style={[styles.inner, { borderColor: colors.border }]}>
            {/* Top label */}
            <View style={styles.header}>
              <View style={[styles.headerDot, { backgroundColor: colors.accent }]} />
              <CustomText
                data="// VITALS.SUMMARY"
                fontSize={9}
                fontFamily={AppFonts.mono}
                color={colors.accent}
                letterSpacing={2}
              />
              <View style={{ flex: 1 }} />
              <CustomText
                data="LIVE"
                fontSize={8}
                fontFamily={AppFonts.mono}
                color={colors.green}
                letterSpacing={1.5}
              />
            </View>
            <View style={[styles.row, { borderColor: colors.border }]}>
              {stats.map(([v, l, c], i) => (
                <StatItem key={l + i} val={v} lbl={l} color={c} isLast={i === stats.length - 1} />
              ))}
            </View>
          </View>
        </TiltCard>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  inner: {
    paddingHorizontal: scale(8),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(4),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    paddingHorizontal: scale(6),
    paddingBottom: verticalScale(8),
  },
  headerDot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    shadowRadius: 6,
    shadowOpacity: 0.7,
  },
  row: {
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  statItem: {
    flex: 1,
    paddingVertical: verticalScale(18),
    alignItems: 'center',
    gap: 4,
  },
  statDot: {
    width: scale(4),
    height: scale(4),
    borderRadius: scale(2),
    marginBottom: 4,
  },
});
