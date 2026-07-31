/// AboutScreen — FULL REDESIGN with Particle field, GridMesh, MaskRevealText.
/// Rule 11: Feature UI decomposition.
/// Layers: GridMeshBackground → ParticleField → AmbientGlow → Content.

import React from 'react';
import { View, StyleSheet, ScrollView, Platform, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, FadeInLeft, FadeInRight } from 'react-native-reanimated';
import { MotiView } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';

import { AdaptiveContainer } from '@/components/common/AdaptiveContainer';
import { AmbientGlowBackground } from '@/components/common/AmbientGlowBackground';
import { GridMeshBackground } from '@/components/common/GridMeshBackground';
import { ParticleField } from '@/components/common/ParticleField';
import { GlitchText } from '@/components/common/GlitchText';
import { MaskRevealText } from '@/components/common/MaskRevealText';
import { CustomText } from '@/components/common/CustomText';
import { useAppTheme } from '@/core/theme/ThemeContext';
import { AppFonts } from '@/core/theme/appFonts';

import { AboutBioCard } from '../components/AboutBioCard';
import { AboutStatsGrid } from '../components/AboutStatsGrid';
import { SkillsSection } from '../components/SkillsSection';
import { ExperienceTimeline } from '../components/ExperienceTimeline';

export function AboutScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Background layers — deepest to top */}
      <AmbientGlowBackground intensity={1.0} />
      <GridMeshBackground columns={isDesktop ? 18 : 10} rows={20} lineOpacity={0.08} perspective={false} />
      <ParticleField count={isDesktop ? 18 : 10} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + verticalScale(20),
            paddingBottom: insets.bottom + verticalScale(120),
          },
        ]}
      >
        <AdaptiveContainer maxWidth={1140}>
          <View style={styles.contentWrapper}>

            {/* ── HEADER ── */}
            <View style={styles.headerSection}>
              {/* Eyebrow breadcrumb */}
              <Animated.View entering={FadeIn.delay(100).duration(600)} style={styles.eyebrow}>
                <View style={[styles.eyebrowLine, { backgroundColor: colors.accent }]} />
                <GlitchText
                  data={t('about.eyebrow')}
                  fontSize={10}
                  fontFamily={AppFonts.mono}
                  color={colors.accent}
                  chromatic={false}
                  letterSpacing={3}
                  loop={false}
                />
                <View style={[styles.eyebrowDot, { backgroundColor: colors.green }]} />
              </Animated.View>

              {/* Big mask-reveal title */}
              <View style={{ marginTop: verticalScale(12) }}>
                <MaskRevealText
                  data={t('about.titleLine1')}
                  fontSize={isDesktop ? 52 : 36}
                  fontFamily={AppFonts.heading}
                  color={colors.primary}
                  delay={200}
                  stagger={60}
                />
                <MaskRevealText
                  data={t('about.titleLine2')}
                  fontSize={isDesktop ? 52 : 36}
                  fontFamily={AppFonts.heading}
                  color={colors.accent}
                  delay={400}
                  stagger={70}
                />
              </View>

              {/* Subtitle fade */}
              <Animated.View entering={FadeIn.delay(800).duration(700)}>
                <CustomText
                  data={t('about.subtitle')}
                  fontSize={isDesktop ? 16 : 14}
                  color={colors.secondary}
                  style={{ marginTop: verticalScale(14), lineHeight: isDesktop ? 26 : 22, maxWidth: 680 }}
                />
              </Animated.View>
            </View>

            {/* ── BIO CARD ── */}
            <Animated.View entering={FadeInLeft.delay(400).duration(600).springify()}>
              <AboutBioCard />
            </Animated.View>

            {/* ── STATS GRID with AnimatedCounters ── */}
            <AboutStatsGrid />

            {/* ── SKILLS SECTION ── */}
            <Animated.View entering={FadeInRight.delay(300).duration(600).springify()}>
              <SkillsSection />
            </Animated.View>

            {/* ── EXPERIENCE TIMELINE ── */}
            <ExperienceTimeline />
          </View>
        </AdaptiveContainer>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentWrapper: {
    gap: verticalScale(20),
  },
  headerSection: {
    gap: verticalScale(4),
  },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
  },
  eyebrowLine: {
    width: scale(24),
    height: 1,
  },
  eyebrowDot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
  },
});
