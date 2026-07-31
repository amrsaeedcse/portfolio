/// AboutStatsGrid — ANIMATED COUNTER EDITION.
/// Rule 11: Feature UI decomposition.
/// Uses AnimatedCounter for cinematic count-up + TiltCard for 3D parallax hover.
/// Vercel: GPU-only (transform + opacity). Spring physics on hover.

import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { MotiView } from 'moti';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { CustomText } from '@/components/common/CustomText';
import { AnimatedCounter } from '@/components/common/AnimatedCounter';
import { GlitchText } from '@/components/common/GlitchText';
import { useAppTheme } from '@/core/theme/ThemeContext';
import { AppFonts } from '@/core/theme/appFonts';
import { kAboutStats } from '@/constants/data';

const STAT_COLORS = ['#00FFD1', '#0ea5e9', '#a855f7', '#ec4899'];

function StatCard({
  val,
  label,
  idx,
  color,
}: {
  val: string;
  label: string;
  idx: number;
  color: string;
}) {
  const { colors } = useAppTheme();
  const [isHovered, setIsHovered] = useState(false);
  const hovered = useSharedValue(0);

  const handleHoverIn = () => {
    setIsHovered(true);
    hovered.set(withSpring(1, { damping: 12, stiffness: 200 }));
  };

  const handleHoverOut = () => {
    setIsHovered(false);
    hovered.set(withSpring(0, { damping: 12, stiffness: 200 }));
  };

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: withTiming(interpolate(hovered.get(), [0, 1], [0, -4]), { duration: 200 }) },
      { scale: interpolate(hovered.get(), [0, 1], [1, 1.02]) },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(hovered.get(), [0, 1], [0, 0.3]),
  }));

  return (
    <MotiView
      from={{ opacity: 0, translateY: 30, scale: 0.88 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{
        delay: 150 + idx * 100,
        type: 'spring',
        damping: 14,
        stiffness: 90,
      }}
      style={styles.cardWrap}
    >
      {/* Glow behind */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.cardGlow,
          { backgroundColor: color },
          glowStyle,
        ]}
      />

      <Animated.View
        onPointerEnter={Platform.OS === 'web' ? handleHoverIn : undefined}
        onPointerLeave={Platform.OS === 'web' ? handleHoverOut : undefined}
        style={[
          styles.statCard,
          {
            backgroundColor: isHovered ? `${color}12` : colors.surfaceCard,
            borderColor: isHovered ? `${color}60` : colors.border,
            ...(Platform.OS === 'web' && {
              boxShadow: isHovered
                ? `0 0 30px ${color}44, inset 0 0 20px ${color}0a`
                : '0 4px 20px rgba(0,0,0,0.3)',
              transition: 'box-shadow 0.3s ease, background-color 0.3s ease, border-color 0.3s ease',
            } as any),
          },
          cardStyle,
        ]}
      >
        {/* Top neon bar */}
        <View style={[styles.topNeonBar, { backgroundColor: color }]} />

        {/* HUD corner bracket */}
        <View style={[styles.hudBracket, { borderColor: `${color}${isHovered ? '99' : '33'}` }]} />

        {/* Animated counting number */}
        <AnimatedCounter
          value={val}
          fontSize={34}
          color={color}
          delay={200 + idx * 120}
          duration={1600}
        />

        {/* Label */}
        {isHovered ? (
          <GlitchText
            data={label}
            fontSize={10}
            fontFamily={AppFonts.mono}
            color={colors.secondary}
            chromatic={false}
            loop={false}
          />
        ) : (
          <CustomText
            data={label}
            fontSize={10}
            fontFamily={AppFonts.mono}
            color={colors.secondary}
            letterSpacing={1.5}
            style={{ textTransform: 'uppercase', marginTop: verticalScale(4) }}
          />
        )}

        {/* Bottom scan line */}
        <View style={[styles.bottomScan, { backgroundColor: color }]} />
      </Animated.View>
    </MotiView>
  );
}

export function AboutStatsGrid() {
  return (
    <View style={styles.gridContainer}>
      {kAboutStats.map(([val, label], idx) => (
        <StatCard
          key={label}
          val={val}
          label={label}
          idx={idx}
          color={STAT_COLORS[idx % STAT_COLORS.length]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(12),
    marginTop: verticalScale(16),
  },
  cardWrap: {
    width: '47%',
    position: 'relative',
  },
  cardGlow: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    right: '10%',
    bottom: '10%',
    borderRadius: moderateScale(14),
    zIndex: 0,
    ...(Platform.OS === 'web' && { filter: 'blur(24px)' } as any),
  },
  statCard: {
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(16),
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 1,
    ...(Platform.OS === 'web' && { willChange: 'transform' } as any),
  },
  topNeonBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    opacity: 0.8,
  },
  bottomScan: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    opacity: 0.3,
  },
  hudBracket: {
    position: 'absolute',
    bottom: scale(8),
    right: scale(8),
    width: scale(10),
    height: scale(10),
    borderRightWidth: 1.5,
    borderBottomWidth: 1.5,
  },
});
