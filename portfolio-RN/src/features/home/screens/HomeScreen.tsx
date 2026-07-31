/// Home / Hero Screen — CYBERPUNK HUD TERMINAL rebuild.
/// Layers: AmbientGlow → GridMeshBackground → ScanlineOverlay → CornerHUD → Content.
/// Rule 11: screen delegates to modular hero components. Triggers global portfolio load.

import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInLeft, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, verticalScale } from 'react-native-size-matters';

import { AdaptiveContainer } from '@/components/common/AdaptiveContainer';
import { AmbientGlowBackground } from '@/components/common/AmbientGlowBackground';
import { GridMeshBackground } from '@/components/common/GridMeshBackground';
import { ScanlineOverlay } from '@/components/common/ScanlineOverlay';
import { CornerHUD } from '@/components/common/CornerHUD';
import { GlitchText } from '@/components/common/GlitchText';
import { MarqueeText } from '@/components/common/MarqueeText';
import { CustomText } from '@/components/common/CustomText';
import { useAppTheme } from '@/core/theme/ThemeContext';
import { AppFonts } from '@/core/theme/appFonts';
import { useTranslation } from 'react-i18next';
import { usePortfolioStore } from '@/stores/global/usePortfolioStore';
import { AppRoutes } from '@/navigation/routes';

import { EyebrowLabel, HeroHeading } from '../components/HeroHeading';
import { HeroTagline } from '../components/HeroTagline';
import { HeroCTAs } from '../components/HeroCTAs';
import { SocialLinks } from '../components/SocialLinks';
import { StatsCard } from '../components/StatsCard';
import { ScrollHint } from '../components/ScrollHint';

export function HomeScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const { push } = useRouter();
  const insets = useSafeAreaInsets();
  const loadPortfolio = usePortfolioStore((s) => s.loadPortfolio);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  useEffect(() => {
    loadPortfolio();
  }, [loadPortfolio]);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Outermost color glow — sits behind the grid. */}
      <AmbientGlowBackground intensity={1.4} />
      {/* Cyberpunk HUD perspective floor grid */}
      <GridMeshBackground columns={isDesktop ? 22 : 12} rows={24} lineOpacity={0.16} />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + verticalScale(20) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <AdaptiveContainer maxWidth={1140}>
          {/* Brand logo — glitch */}
          <Animated.View entering={FadeInLeft.delay(100).duration(500)} style={styles.logoMark}>
            <GlitchText
              data="<AMR/>"
              fontSize={18}
              fontFamily={AppFonts.mono}
              color={colors.accent}
              chromatic
            />
          </Animated.View>

          {/* HUD top-right status badges */}
          <View style={styles.hudBadges}>
            <CornerHUD label={t('hud.sysLabel')} position="tr" ring />
            <CornerHUD label={t('hud.netLabel')} position="tr" ring style={{ marginTop: verticalScale(28) }} />
          </View>

          {/* Marquee band: skills */}
          <Animated.View entering={FadeIn.delay(300).duration(700)}>
            <View style={[styles.marqueeBand, { borderColor: colors.border }]}>
              <MarqueeText
                data={t('hud.marqueeSkills')}
                fontSize={10}
                repeat={3}
                speed={70}
                style={{ paddingVertical: verticalScale(4) }}
              />
            </View>
          </Animated.View>

          {/* Hero content */}
          <View style={[styles.heroContent, { gap: isDesktop ? 28 : verticalScale(22) }]}>
            <EyebrowLabel />
            <HeroHeading />
            <View style={{ maxWidth: isDesktop ? 720 : '100%' }}>
              <HeroTagline />
            </View>
            <HeroCTAs onSeeWork={() => push(AppRoutes.projects as any)} />
            <SocialLinks />
          </View>

          {/* Stats */}
          <View style={{ marginTop: verticalScale(20) }}>
            <StatsCard />
          </View>

          {/* Scroll hint */}
          <ScrollHint />
        </AdaptiveContainer>
      </ScrollView>

      {/* Scanline overlay sits ABOVE scroll but below nothing else */}
      <ScanlineOverlay intensity={0.18} vignette flicker />

      {/* Bottom HUD strip */}
      <Animated.View
        entering={FadeIn.delay(800).duration(800)}
        style={[styles.bottomStrip, { borderTopColor: colors.border }]}
        pointerEvents="none"
      >
        <CustomText
          data={t('hud.hudTitle')}
          fontSize={9}
          fontFamily={AppFonts.mono}
          color={colors.muted}
          letterSpacing={2}
        />
        <View style={{ flex: 1 }} />
        <View style={[styles.dot, { backgroundColor: colors.green }]} />
        <CustomText
          data={t('hud.version')}
          fontSize={9}
          fontFamily={AppFonts.mono}
          color={colors.muted}
          letterSpacing={2}
        />
      </Animated.View>

      {/* Gradient bottom fade */}
      <LinearGradient
        colors={[`${colors.surface}00`, colors.surface]}
        style={styles.bottomFade}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'web' ? verticalScale(120) : verticalScale(140),
  },
  logoMark: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(2),
    marginBottom: verticalScale(28),
  },
  hudBadges: {
    position: 'absolute',
    right: scale(2),
    top: verticalScale(0),
    alignItems: 'flex-end',
  },
  marqueeBand: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    marginBottom: verticalScale(18),
    overflow: 'hidden',
    borderCurve: 'continuous',
  },
  heroContent: { gap: verticalScale(20) },
  bottomStrip: {
    position: 'absolute',
    bottom: verticalScale(56),
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(6),
    borderTopWidth: 1,
    zIndex: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    shadowRadius: 6,
    shadowOpacity: 0.8,
  },
  bottomFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: verticalScale(80),
  },
});
