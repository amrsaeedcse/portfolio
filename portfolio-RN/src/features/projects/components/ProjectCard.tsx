/// ProjectCard component — HOLOGRAPHIC NEON EDITION.
/// Rule 11: Feature UI decomposition.
/// Full 3D tilt via TiltCard, animated neon border trace on hover, MotiView stagger reveal.
/// Vercel: only transform + opacity on GPU. Spring physics for all interactions.

import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Platform, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { MotiView } from 'moti';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';

import { CustomText } from '@/components/common/CustomText';
import { CachedImage } from '@/components/common/CachedImage';
import { TiltCard } from '@/components/common/TiltCard';
import { GlitchText } from '@/components/common/GlitchText';
import { useAppTheme } from '@/core/theme/ThemeContext';
import { AppFonts } from '@/core/theme/appFonts';
import { Project } from '@/constants/data';
import { useProjectsFilterStore } from '../store/useProjectsFilterStore';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ProjectCard({ project, index }: ProjectCardProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const openProjectDetail = useProjectsFilterStore((s) => s.openProjectDetail);

  const [isHovered, setIsHovered] = useState(false);
  const hovered = useSharedValue(0);
  const pressed = useSharedValue(0);

  // Animated neon border trace (web only — CSS animation via opacity pulse)
  const borderPulse = useSharedValue(0);
  const scanline = useSharedValue(-1);

  const handleHoverIn = () => {
    setIsHovered(true);
    hovered.set(withSpring(1, { damping: 12, stiffness: 200 }));
    borderPulse.set(withRepeat(
      withSequence(
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.4, { duration: 900, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    ));
    scanline.set(withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.linear }),
      -1,
      false
    ));
  };

  const handleHoverOut = () => {
    setIsHovered(false);
    hovered.set(withSpring(0, { damping: 12, stiffness: 200 }));
    borderPulse.set(withTiming(0, { duration: 300 }));
    scanline.set(withTiming(-1, { duration: 200 }));
  };

  const handlePressIn = () => {
    pressed.set(withSpring(1, { damping: 15, stiffness: 380 }));
  };

  const handlePressOut = () => {
    pressed.set(withSpring(0, { damping: 15, stiffness: 300 }));
  };

  // Scanline sweep across card
  const scanlineStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(scanline.get(), [-1, 1], [-300, 300]),
      },
    ],
    opacity: interpolate(scanline.get(), [-1, -0.5, 0.5, 1], [0, 0.4, 0.4, 0]),
  }));

  // Glow behind card
  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(hovered.get(), [0, 1], [0, 0.5]),
    transform: [{ scale: interpolate(hovered.get(), [0, 1], [0.8, 1.1]) }],
  }));

  // Hover lift
  const liftStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: withTiming(interpolate(hovered.get(), [0, 1], [0, -6]), { duration: 250 }) },
      { scale: interpolate(pressed.get(), [0, 1], [1, 0.97]) },
    ],
  }));

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'Shipped': return colors.blue;
      case 'Live': return colors.green;
      case 'Academic': return colors.amber;
      default: return colors.accent;
    }
  };

  const statusColor = getStatusColor(project.status);

  return (
    <MotiView
      from={{ opacity: 0, translateY: 40, scale: 0.92 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{
        delay: 80 + index * 70,
        type: 'spring',
        damping: 16,
        stiffness: 100,
      }}
      style={styles.cardContainer}
    >
      {/* Background glow blob — GPU layer only */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.glowBehind,
          { backgroundColor: project.color },
          glowStyle,
        ]}
      />

      <Animated.View style={liftStyle}>
        <TiltCard
          maxTilt={isDesktop ? 7 : 0}
          blur={50}
          accentColor={project.color}
          onPress={() => openProjectDetail(project)}
          disableTilt={!isDesktop}
        >
          {/* Neon scanline sweep effect */}
          <Animated.View
            pointerEvents="none"
            style={[styles.scanline, { backgroundColor: project.color }, scanlineStyle]}
          />

          {/* Top neon accent bar */}
          <View style={styles.topBarWrap} pointerEvents="none">
            <Animated.View
              style={[
                styles.topBar,
                { backgroundColor: project.color },
                {
                  opacity: isHovered ? 1 : 0.6,
                  ...(Platform.OS === 'web' && {
                    boxShadow: `0 0 12px ${project.color}, 0 0 24px ${project.color}66`,
                  } as any),
                },
              ]}
            />
          </View>

          {/* HUD corner brackets */}
          <View style={styles.cornerBL} pointerEvents="none">
            <View style={[styles.cornerH, { backgroundColor: project.color, opacity: isHovered ? 0.9 : 0.3 }]} />
            <View style={[styles.cornerV, { backgroundColor: project.color, opacity: isHovered ? 0.9 : 0.3 }]} />
          </View>
          <View style={styles.cornerTR} pointerEvents="none">
            <View style={[styles.cornerH, { backgroundColor: project.color, opacity: isHovered ? 0.9 : 0.3 }]} />
            <View style={[styles.cornerV, { backgroundColor: project.color, opacity: isHovered ? 0.9 : 0.3 }]} />
          </View>

          {/* Thumbnail area */}
          <AnimatedPressable
            onHoverIn={Platform.OS === 'web' ? handleHoverIn : undefined}
            onHoverOut={Platform.OS === 'web' ? handleHoverOut : undefined}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={() => openProjectDetail(project)}
            accessibilityRole="button"
            accessibilityLabel={`View ${project.title} details`}
            style={styles.pressableInner}
          >
            <View style={styles.imageWrapper}>
              <CachedImage
                uri={project.img}
                style={styles.thumbnail}
                contentFit="cover"
                recyclingKey={project.id}
              />

              {/* Dark overlay on hover */}
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.imageOverlay,
                  {
                    opacity: interpolate(hovered.get(), [0, 1], [0, 0.35]),
                    backgroundColor: project.color,
                  },
                ]}
              />

              {/* Status badge */}
              <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20`, borderColor: `${statusColor}55` }]}>
                <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                <CustomText
                  data={project.status}
                  fontSize={10}
                  fontFamily={AppFonts.mono}
                  color={statusColor}
                  letterSpacing={0.5}
                />
              </View>

              {/* Year badge */}
              <View style={[styles.yearBadge, { backgroundColor: 'rgba(0,0,0,0.75)', borderColor: colors.border }]}>
                <CustomText data={project.year} fontSize={10} fontFamily={AppFonts.mono} color="#e2e8f0" />
              </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
              {/* Tag label */}
              <View style={styles.tagRow}>
                <View style={[styles.tagDot, { backgroundColor: project.color }]} />
                <CustomText
                  data={project.tag}
                  fontSize={10}
                  fontFamily={AppFonts.mono}
                  color={project.color}
                  letterSpacing={2}
                  style={{ textTransform: 'uppercase' }}
                />
              </View>

              {/* Title — glitch on hover */}
              {isHovered ? (
                <GlitchText
                  data={project.title}
                  fontSize={20}
                  fontFamily={AppFonts.heading}
                  color={colors.primary}
                  chromatic={false}
                  loop
                />
              ) : (
                <CustomText
                  data={project.title}
                  fontSize={20}
                  fontFamily={AppFonts.heading}
                  color={colors.primary}
                  maxLines={2}
                />
              )}

              <CustomText
                data={project.subtitle}
                fontSize={13}
                color={colors.secondary}
                maxLines={2}
                style={{ lineHeight: 20, marginTop: 2 }}
              />

              {/* Tech pills */}
              <View style={styles.techRow}>
                {project.tech.slice(0, 4).map((techItem) => (
                  <View
                    key={techItem}
                    style={[
                      styles.techPill,
                      {
                        borderColor: isHovered ? `${project.color}60` : colors.border,
                        backgroundColor: isHovered ? `${project.color}10` : 'rgba(255,255,255,0.03)',
                      },
                    ]}
                  >
                    <CustomText data={techItem} fontSize={9} fontFamily={AppFonts.mono} color={isHovered ? project.color : colors.muted} />
                  </View>
                ))}
                {project.tech.length > 4 && (
                  <View style={[styles.techPill, { borderColor: project.color }]}>
                    <CustomText data={`+${project.tech.length - 4}`} fontSize={9} fontFamily={AppFonts.mono} color={project.color} />
                  </View>
                )}
              </View>

              {/* CTA strip */}
              <View style={[styles.ctaStrip, { borderTopColor: `${project.color}22` }]}>
                <CustomText
                  data={t('projects.viewProject')}
                  fontSize={11}
                  fontFamily={AppFonts.mono}
                  color={project.color}
                  letterSpacing={1.5}
                  style={{ textTransform: 'uppercase' }}
                />
                <Animated.View
                  style={[
                    styles.ctaArrow,
                    {
                      transform: [
                        { translateX: withTiming(isHovered ? 6 : 0, { duration: 200 }) },
                      ],
                    },
                  ]}
                >
                  <CustomText data="→" fontSize={13} color={project.color} />
                </Animated.View>
              </View>
            </View>
          </AnimatedPressable>
        </TiltCard>
      </Animated.View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    marginHorizontal: scale(8),
    marginBottom: verticalScale(28),
    position: 'relative',
  },
  glowBehind: {
    position: 'absolute',
    top: '10%',
    left: '5%',
    right: '5%',
    bottom: '10%',
    borderRadius: moderateScale(20),
    opacity: 0,
    zIndex: 0,
    ...(Platform.OS === 'web' && { filter: 'blur(40px)' } as any),
  },
  pressableInner: {
    flex: 1,
    ...(Platform.OS === 'web' && { cursor: 'pointer' } as any),
  },
  imageWrapper: {
    width: '100%',
    height: verticalScale(195),
    position: 'relative',
    backgroundColor: '#08080e',
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  scanline: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    zIndex: 10,
    opacity: 0,
    ...(Platform.OS === 'web' && { filter: 'blur(1px)' } as any),
  },
  topBarWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  topBar: {
    height: 2.5,
    width: '100%',
  },
  // HUD corner brackets
  cornerBL: {
    position: 'absolute',
    bottom: scale(12),
    left: scale(12),
    zIndex: 10,
  },
  cornerTR: {
    position: 'absolute',
    top: scale(12),
    right: scale(12),
    zIndex: 10,
  },
  cornerH: {
    width: scale(12),
    height: 1.5,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  cornerV: {
    width: 1.5,
    height: scale(12),
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  statusBadge: {
    position: 'absolute',
    top: scale(14),
    left: scale(14),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    zIndex: 2,
  },
  statusDot: {
    width: scale(5),
    height: scale(5),
    borderRadius: scale(2.5),
  },
  yearBadge: {
    position: 'absolute',
    top: scale(14),
    right: scale(14),
    paddingHorizontal: scale(9),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(6),
    borderWidth: 1,
    zIndex: 2,
  },
  content: {
    padding: scale(18),
    gap: verticalScale(8),
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  tagDot: {
    width: scale(4),
    height: scale(4),
    borderRadius: scale(2),
  },
  techRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(5),
    marginTop: verticalScale(4),
  },
  techPill: {
    paddingHorizontal: scale(9),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(6),
    borderWidth: 1,
  },
  ctaStrip: {
    marginTop: verticalScale(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: verticalScale(10),
  },
  ctaArrow: {
    marginLeft: scale(4),
  },
});
