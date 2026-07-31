/// ContactScreen — FULL REDESIGN with particle field, mesh grid, reveal animations.
/// Rule 11: Feature UI decomposition.
/// Layers: GridMesh(non-perspective) → ParticleField → AmbientGlow → Content.

import React from 'react';
import { View, StyleSheet, ScrollView, Platform, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, FadeInLeft, FadeInRight, FadeInUp } from 'react-native-reanimated';
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

import { ContactInfoCard } from '../components/ContactInfoCard';
import { ContactFormWidget } from '../components/ContactFormWidget';
import { ContactSocialGrid } from '../components/ContactSocialGrid';

export function ContactScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Background layer stack */}
      <AmbientGlowBackground intensity={1.2} />
      <GridMeshBackground columns={isDesktop ? 16 : 8} rows={18} lineOpacity={0.07} perspective={false} />
      <ParticleField count={isDesktop ? 14 : 8} />

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
              {/* Eyebrow */}
              <Animated.View entering={FadeIn.delay(100).duration(600)} style={styles.eyebrow}>
                <View style={[styles.eyebrowLine, { backgroundColor: colors.pink }]} />
                <GlitchText
                  data={t('contact.eyebrow')}
                  fontSize={10}
                  fontFamily={AppFonts.mono}
                  color={colors.pink}
                  chromatic={false}
                  letterSpacing={3}
                  loop={false}
                />
                <View style={[styles.eyebrowDot, { backgroundColor: colors.green }]} />
              </Animated.View>

              {/* Mask reveal title */}
              <View style={{ marginTop: verticalScale(12) }}>
                <MaskRevealText
                  data={t('contact.titleLine1')}
                  fontSize={isDesktop ? 52 : 36}
                  fontFamily={AppFonts.heading}
                  color={colors.primary}
                  delay={200}
                  stagger={55}
                />
                <MaskRevealText
                  data={t('contact.titleLine2')}
                  fontSize={isDesktop ? 52 : 36}
                  fontFamily={AppFonts.heading}
                  color={colors.pink}
                  delay={380}
                  stagger={65}
                />
              </View>

              <Animated.View entering={FadeIn.delay(750).duration(700)}>
                <CustomText
                  data={t('contact.subtitle')}
                  fontSize={isDesktop ? 16 : 14}
                  color={colors.secondary}
                  style={{ marginTop: verticalScale(14), lineHeight: isDesktop ? 26 : 22, maxWidth: 680 }}
                />
              </Animated.View>
            </View>

            {/* ── AVAILABILITY BADGE ── */}
            <MotiView
              from={{ opacity: 0, scale: 0.8, translateX: -20 }}
              animate={{ opacity: 1, scale: 1, translateX: 0 }}
              transition={{ delay: 600, type: 'spring', damping: 14 }}
              style={[styles.availBadge, { borderColor: `${colors.green}50`, backgroundColor: `${colors.green}10` }]}
            >
              <View style={[styles.availDot, { backgroundColor: colors.green }]} />
              <CustomText
                data={t('contact.available')}
                fontSize={11}
                fontFamily={AppFonts.mono}
                color={colors.green}
                letterSpacing={1.5}
                style={{ textTransform: 'uppercase' }}
              />
            </MotiView>

            {/* ── BODY LAYOUT ── */}
            <View style={[
              styles.bodyLayout,
              { flexDirection: isDesktop ? 'row' : 'column', gap: isDesktop ? 32 : verticalScale(16) },
            ]}>
              {/* Left: channels + socials */}
              <Animated.View
                entering={FadeInLeft.delay(400).duration(600).springify()}
                style={{ flex: isDesktop ? 4 : 1, gap: verticalScale(12) }}
              >
                <ContactInfoCard />
                <ContactSocialGrid />
              </Animated.View>

              {/* Right: form */}
              <Animated.View
                entering={FadeInRight.delay(450).duration(600).springify()}
                style={{ flex: isDesktop ? 6 : 1 }}
              >
                <ContactFormWidget />
              </Animated.View>
            </View>
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
    gap: verticalScale(18),
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
  availBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(9999),
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  availDot: {
    width: scale(7),
    height: scale(7),
    borderRadius: scale(3.5),
    ...(Platform.OS === 'web' && {
      boxShadow: '0 0 8px #10b981',
      animation: 'pulse 2s infinite',
    } as any),
  },
  bodyLayout: {
    width: '100%',
  },
});
